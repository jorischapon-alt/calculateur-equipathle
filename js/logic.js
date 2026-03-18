// logic.js
window.AppState = {
    // Array of objects { discipline, gender, athleteName, perf, pts, id }
    performances: [],

    equipe: {
        relais4x60: false,
        pointsRelais: 0,
        jeuneJuge: false,
        pointsJuge: 0
    },

    totalScore: 0,

    // Helper to get all athletes
    getAthletes() {
        const athletesMap = {};
        this.performances.forEach(p => {
            if (!athletesMap[p.athleteName]) {
                athletesMap[p.athleteName] = { name: p.athleteName, gender: p.gender, events: [] };
            }
            athletesMap[p.athleteName].events.push(p);
        });
        return Object.values(athletesMap);
    },

    // Recalculates the total score based on the current state
    recalculate() {
        // Rule: Only the BEST performance of the team for a specific discipline counts.
        const disciplineBests = {};

        this.performances.forEach(p => {
            if (!disciplineBests[p.discipline] || p.pts > disciplineBests[p.discipline].pts) {
                disciplineBests[p.discipline] = p; // Keep the best performance for this discipline
            }
        });

        // Sum the best points
        let sum = 0;
        Object.values(disciplineBests).forEach(bestp => sum += bestp.pts);

        // Add Relais and Jeune Juge
        if (this.equipe.relais4x60) {
            sum += parseInt(this.equipe.pointsRelais) || 0;
        }

        if (this.equipe.jeuneJuge) {
            sum += parseInt(this.equipe.pointsJuge) || 0;
        }

        this.totalScore = sum;

        // Return the items that actually count for highlighting
        return {
            total: sum,
            countingEvents: Object.values(disciplineBests)
        };
    },

    // Add or update an entry from the grid
    updatePerformance(rowId, discipline, gender, athleteName, perfValue, dbDiscipline = discipline) {
        // remove existing entry for this cell
        this.performances = this.performances.filter(p => p.id !== rowId);

        if (perfValue.trim() !== "") {
            const pts = DataManager.getPoints(dbDiscipline, gender, perfValue);
            this.performances.push({
                id: rowId,
                discipline,
                gender,
                athleteName: athleteName.trim() || `Inconnu (${gender})`,
                perf: perfValue,
                pts: pts
            });
        }
    }
};
