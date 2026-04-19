// rules.js
window.RulesEngine = {
    // Defines families based on user specs inside dashboard
    eventFamilies: {
        sprint: ['50m', '80m', '120m'],
        haies: ['80/100m haies', '50mh', '80mh', '100mh', '80mhaies', '200mh', '200m haies', '200mhaies'],
        demiFond: ['1000m', '2000m', '3000m', '3000m marche', '3000mmarche', 'marche'],
        saut: ['hauteur', 'perche', 'longueur', 'triple'],
        lancer: ['poids', 'disque', 'marteau', 'javelot']
    },

    getFamily(discipline) {
        if (!discipline || typeof discipline !== 'string') return 'unknown';
        const dLower = discipline.toLowerCase().trim();
        
        // Exact matching logic for robustness
        for (const [fam, events] of Object.entries(this.eventFamilies)) {
            if (events.some(e => dLower === e)) {
                if (fam === 'sprint' || fam === 'haies' || fam === 'demiFond') return 'course';
                return fam;
            }
        }
        
        // Fallback for partial match if exact fails, but bounded
        for (const [fam, events] of Object.entries(this.eventFamilies)) {
            if (events.some(e => dLower.includes(e) && !dLower.includes('relais'))) {
                if (fam === 'sprint' || fam === 'haies' || fam === 'demiFond') return 'course';
                return fam;
            }
        }
        
        return 'unknown';
    },

    getCourseSubFamily(discipline) {
        if (!discipline || typeof discipline !== 'string') return null;
        const dLower = discipline.toLowerCase().trim();
        
        for (const [fam, events] of Object.entries(this.eventFamilies)) {
            if (fam === 'sprint' || fam === 'haies' || fam === 'demiFond') {
                if (events.some(e => dLower === e)) return fam;
            }
        }
        
        for (const [fam, events] of Object.entries(this.eventFamilies)) {
            if (fam === 'sprint' || fam === 'haies' || fam === 'demiFond') {
                if (events.some(e => dLower.includes(e) && !dLower.includes('relais'))) return fam;
            }
        }
        return null;
    },

    validateTeam(appState) {
        const athletes = appState.getAthletes() || [];

        // 1. Mixité (Minimum 2F et 2G, avec perfs)
        let countF = 0;
        let countG = 0;
        athletes.forEach(a => {
            // Count athlete if they have at least one performance (score > 0 OR participation marks AB/NM)
            const hasScore = a.events.some(e => e.pts > 0 || String(e.perf).toUpperCase().includes('AB') || String(e.perf).toUpperCase().includes('NM'));
            if (hasScore || a.events.length > 0) {
                if (a.gender === 'F') countF++;
                if (a.gender === 'G') countG++;
            }
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
        if (!athlete || !athlete.events) return { valid: false, message: "Erreur structure" };
        
        // Max 3 individual events
        if (athlete.events.length > 3) {
            return { valid: false, message: "Trop d'épreuves (Max 3)" };
        }

        // Triathlons des clones (Check unicité des événements)
        const uniqueDisciplines = new Set(athlete.events.map(e => e.discipline.toLowerCase().trim()));
        if (uniqueDisciplines.size < athlete.events.length) {
            return { valid: false, message: "Une épreuve est saisie en double" };
        }

        // Check Course constraint
        const courses = [];
        let sauts = 0;
        let lancers = 0;

        athlete.events.forEach(e => {
            const fam = this.getFamily(e.discipline);
            if (fam === 'course') {
                const subFam = this.getCourseSubFamily(e.discipline);
                if (subFam) courses.push(subFam);
            }
            if (fam === 'saut') sauts++;
            if (fam === 'lancer') lancers++;
        });

        // Duplicate course family check
        const uniqueCourses = new Set(courses);
        if (uniqueCourses.size < courses.length) {
            return { valid: false, message: "2 courses de la même famille" };
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
