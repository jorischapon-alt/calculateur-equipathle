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
            const rPts = parseInt(this.equipe.pointsRelais, 10);
            if (!isNaN(rPts)) sum += rPts;
        }

        if (this.equipe.jeuneJuge) {
            const jPts = parseInt(this.equipe.pointsJuge, 10);
            if (!isNaN(jPts)) sum += jPts;
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
        if (typeof athleteName !== 'string') athleteName = '';
        if (typeof perfValue !== 'string') perfValue = '';

        const safePerfValue = perfValue.trim();
        const safeAthleteName = athleteName.trim();
        
        const idx = this.performances.findIndex(p => p.id === rowId);

        if (safePerfValue !== "") {
            let pts = 0;
            try {
                if (typeof DataManager !== 'undefined' && typeof DataManager.getPoints === 'function') {
                    pts = DataManager.getPoints(dbDiscipline, gender, safePerfValue);
                }
            } catch (e) {
                console.error("DataManager Error on getPoints:", e);
            }

            const newPerf = {
                id: rowId,
                discipline,
                gender,
                athleteName: safeAthleteName || `Inconnu (${gender})`,
                perf: safePerfValue,
                pts: pts
            };

            if (idx !== -1) {
                // Update existing object exactly
                this.performances[idx] = newPerf;
            } else {
                // Append new element 
                this.performances.push(newPerf);
            }
        } else {
            // Remove safely if empty
            if (idx !== -1) {
                this.performances.splice(idx, 1);
            }
        }
    }
};
