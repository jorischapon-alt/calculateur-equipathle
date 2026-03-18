// rules.js
window.RulesEngine = {
    // Defines families for throwing, jumping, running
    // Adjust these based on the exact DB keys
    eventFamilies: {
        sprint: ['50m', '80m', '100m', '120m', '200m'],
        haies: ['50h', '80h', '100h', '200h', '80/100m haies'],
        demiFond: ['1000m', '2000m', '3000m', 'Marche', '3000 marche'],
        saut: ['hauteur', 'perche', 'longueur', 'triple'],
        lancer: ['poids', 'disque', 'marteau', 'javelot']
    },

    getFamily(discipline) {
        for (const [fam, events] of Object.entries(this.eventFamilies)) {
            // Case insensitive match or exact match depending on db keys
            if (events.some(e => discipline.toLowerCase().includes(e.toLowerCase()))) {
                if (fam === 'sprint' || fam === 'haies' || fam === 'demiFond') return 'course';
                return fam;
            }
        }
        return 'unknown';
    },

    getCourseSubFamily(discipline) {
        for (const [fam, events] of Object.entries(this.eventFamilies)) {
            if (fam === 'sprint' || fam === 'haies' || fam === 'demiFond') {
                if (events.some(e => discipline.toLowerCase().includes(e.toLowerCase()))) {
                    return fam;
                }
            }
        }
        return null;
    },

    validateTeam(appState) {
        const athletes = appState.getAthletes();

        // 1. Mixité (Minimum 2F et 2G)
        let countF = 0;
        let countG = 0;
        athletes.forEach(a => {
            if (a.gender === 'F') countF++;
            if (a.gender === 'G') countG++;
        });
        const isMixiteValid = countF >= 2 && countG >= 2;

        // 2. Relais
        const isRelaisValid = appState.equipe.relais4x60;

        // 3. Triathlons validator
        let allTriathlonsValid = true;
        const athleteValidations = {};

        athletes.forEach(athlete => {
            const validation = this.validateAthleteTriathlon(athlete);
            athleteValidations[athlete.name] = validation;
            if (!validation.valid) allTriathlonsValid = false;
        });

        return {
            mixite: { valid: isMixiteValid, f: countF, g: countG },
            relais: isRelaisValid,
            triathlons: { valid: allTriathlonsValid, details: athleteValidations }
        };
    },

    validateAthleteTriathlon(athlete) {
        // Max 3 individual events
        if (athlete.events.length > 3) {
            return { valid: false, message: "Trop d'épreuves (Max 3)" };
        }

        // Check Course constraint (No 2 courses of the same sub-family)
        const courses = [];
        let sauts = 0;
        let lancers = 0;

        athlete.events.forEach(e => {
            const fam = this.getFamily(e.discipline);
            if (fam === 'course') courses.push(this.getCourseSubFamily(e.discipline));
            if (fam === 'saut') sauts++;
            if (fam === 'lancer') lancers++;
        });

        // Duplicate course family check
        const uniqueCourses = new Set(courses);
        if (uniqueCourses.size < courses.length) {
            return { valid: false, message: "2 courses de la même famille (Sprint/Haies/Demi-fond)" };
        }

        // If exactly 3, it must fit a triathlon structure
        if (athlete.events.length === 3) {
            // General: 1 course, 1 saut, 1 lancer
            const isGeneral = courses.length === 1 && sauts === 1 && lancers === 1;
            // Oriente 1: 2 sauts, 1 course
            const isOriente1 = sauts === 2 && courses.length === 1;
            // Oriente 2: 2 lancers, 1 course
            const isOriente2 = lancers === 2 && courses.length === 1;
            // Oriente 3: 2 courses (diff), 1 concours
            const isOriente3 = courses.length === 2 && (sauts === 1 || lancers === 1);

            if (!isGeneral && !isOriente1 && !isOriente2 && !isOriente3) {
                return { valid: false, message: "Structure de triathlon invalide" };
            }
        }

        return { valid: true, message: "OK" };
    }
};
