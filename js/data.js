// data.js
const DataManager = {
    db: null,

    async loadData() {
        try {
            this.db = window.DB_DATA;
            if (!this.db) throw new Error('DB_DATA not found in window object');
            console.log('Database loaded successfully:', this.db.metadata.category);
            return true;
        } catch (error) {
            console.error('Error loading database:', error);
            alert("Erreur de chargement de la base de données. L'application ne peut pas fonctionner.");
            return false;
        }
    },

    getDisciplines() {
        if (!this.db) return [];
        return Object.keys(this.db.scoring_tables);
    },

    parsePerformance(perfValue) {
        let strValue = String(perfValue).trim().toUpperCase();
        if (["AB", "NM", "DQ", "DNF"].includes(strValue)) {
            return { isSpecial: true, value: 1 }; // 1 point for participation failures
        }

        strValue = strValue.replace(',', '.');

        // Match MM:SS.ms or MM'SS"ms format
        const minSecMatch = strValue.match(/^(\d+)[:'](\d{1,2})[."]??(\d*)$/);
        if (minSecMatch) {
            const minutes = parseInt(minSecMatch[1], 10);
            const seconds = parseInt(minSecMatch[2], 10);
            const fraction = minSecMatch[3] ? parseFloat('0.' + minSecMatch[3]) : 0;
            return { isSpecial: false, value: (minutes * 60) + seconds + fraction };
        }

        const perfNum = parseFloat(strValue);
        if (isNaN(perfNum)) return null;

        return { isSpecial: false, value: perfNum };
    },

    // Returns the points for a given performance, discipline, and gender.
    // Handles specific codes: AB (Abandon), NM (No Mark), DQ (Disqualified) -> 1pt
    getPoints(discipline, gender, perfValue) {
        if (!this.db || !this.db.scoring_tables[discipline]) return 0;

        const parsedPerf = this.parsePerformance(perfValue);
        if (!parsedPerf) return 0;

        if (parsedPerf.isSpecial) return parsedPerf.value;

        const perfNum = parsedPerf.value;
        const table = this.db.scoring_tables[discipline][gender];
        if (!table || table.length === 0) return 0;

        // Is it a running event (lower is better) or a jumping/throwing event (higher is better)?
        // Wait, different events have different ordering. The db array is ordered from 50 pts to 1 pt.
        // Usually, the first element (index 0) is 50 points. The last element is 1 point.
        // Let's check the first and last element of the array to determine if lower is better or higher is better.
        const isLowerBetter = table[0].perf < table[table.length - 1].perf;

        // Find the matching performance threshold
        // Note: For running, if you do 13.05, and points are 13.04 (50), 13.10 (49)
        // You get 49. So for running (lower is better), we need the first threshold where perf <= table[i].perf
        // For jumps/throws (higher is better), e.g. 5.50m (50), 5.40m (49)
        // If you do 5.45, you get 49. So we need the first threshold where perf >= table[i].perf

        for (let i = 0; i < table.length; i++) {
            if (isLowerBetter) {
                if (perfNum <= table[i].perf) return table[i].pts;
            } else {
                if (perfNum >= table[i].perf) return table[i].pts;
            }
        }

        return 0; // Performance not good enough for 1 point, or invalid
    }
};
