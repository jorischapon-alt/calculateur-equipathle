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

    parsePerformance(perfValue, discipline = '') {
        let strValue = String(perfValue).trim().toUpperCase();
        if (["AB", "NM", "DQ", "DNF"].includes(strValue)) {
            return { isSpecial: true, value: 1 }; // 1 point for participation failures
        }

        // Convertit "3M10" ou "3m10" en "3.10"
        strValue = strValue.replace(/(\d+)M(\d*)/g, '$1.$2');
        strValue = strValue.replace(/,/g, '.');

        const isDemiFond = discipline.includes('1000') || discipline.includes('2000') || discipline.includes('3000') || discipline.toLowerCase().includes('marche');

        // Regex for exactly 3 parts separated by dots, colons, or quotes: MM.SS.cc or MM:SS:cc
        const tripleMatch = strValue.match(/^(\d+)[:\.'"](\d{2})[:\.'"](\d+)$/);
        if (tripleMatch) {
            const minutes = parseInt(tripleMatch[1], 10);
            const seconds = parseInt(tripleMatch[2], 10);
            const fraction = parseFloat('0.' + tripleMatch[3]);
            return { isSpecial: false, value: (minutes * 60) + seconds + fraction };
        }

        // Regex for 2 parts separated by dots, colons, or quotes: MM.SS or MM:SS
        const doubleMatch = strValue.match(/^(\d+)[:\.'"](\d{1,2})$/);
        if (doubleMatch) {
            const hasTimeSeparator = strValue.includes(':') || strValue.includes("'");
            // If explicit time separator OR it's a DemiFond logic
            if (hasTimeSeparator || isDemiFond) {
                const minutes = parseInt(doubleMatch[1], 10);
                const seconds = parseInt(doubleMatch[2], 10);
                return { isSpecial: false, value: (minutes * 60) + seconds };
            }
        }

        const perfNum = parseFloat(strValue);
        if (isNaN(perfNum)) return null;

        return { isSpecial: false, value: perfNum };
    },

    // Returns the points for a given performance, discipline, and gender.
    // Handles specific codes: AB (Abandon), NM (No Mark), DQ (Disqualified) -> 1pt
    getPoints(discipline, gender, perfValue) {
        if (!this.db || !this.db.scoring_tables[discipline]) return 0;

        const parsedPerf = this.parsePerformance(perfValue, discipline);
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
