// ui.js
const UI = {
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.renderGrid();
        this.updateDashboard();
    },

    cacheDOM() {
        this.gridBody = document.getElementById('grid-body');
        this.athletesList = document.getElementById('athletes-list');
        this.totalScore = document.getElementById('total-score');

        this.jugeCheckbox = document.getElementById('juge-checkbox');
        this.jugeLevel = document.getElementById('juge-level');

        this.flagMixite = document.getElementById('flag-mixite');
        this.flagRelais = document.getElementById('flag-relais');
        this.flagTriathlons = document.getElementById('flag-triathlons');

        this.btnExport = document.getElementById('btn-export');
        this.btnReset = document.getElementById('btn-reset');
        this.relaisPerfInput = document.getElementById('relais-perf-input');
        this.relaisPointsDisplay = document.getElementById('relais-points');
    },

    bindEvents() {
        this.relaisPerfInput.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            if (val) {
                // The db key for relay points is likely "4x60m" or "relais" 
                // Using 4x60m-Mixte as requested for the mixed relay scoring
                const pts = DataManager.getPoints('4x60m-Mixte', 'G', val) || DataManager.getPoints('4x60m', 'G', val) || DataManager.getPoints('4x60m', 'F', val) || DataManager.getPoints('relais', 'G', val) || 0;
                AppState.equipe.relais4x60 = true;
                AppState.equipe.pointsRelais = pts;
                this.relaisPointsDisplay.textContent = `+${pts} pts`;
            } else {
                AppState.equipe.relais4x60 = false;
                AppState.equipe.pointsRelais = 0;
                this.relaisPointsDisplay.textContent = `+0 pts`;
            }
            this.updateAll();
        });

        this.jugeCheckbox.addEventListener('change', (e) => {
            AppState.equipe.jeuneJuge = e.target.checked;
            if (e.target.checked) {
                AppState.equipe.pointsJuge = parseInt(this.jugeLevel.value);
            } else {
                AppState.equipe.pointsJuge = 0;
            }
            this.updateAll();
        });

        this.jugeLevel.addEventListener('change', (e) => {
            if (this.jugeCheckbox.checked) {
                AppState.equipe.pointsJuge = parseInt(e.target.value);
                this.updateAll();
            }
        });

        this.btnReset.addEventListener('click', () => {
            if (confirm("Voulez-vous réinitialiser toute l'équipe ?")) {
                AppState.performances = [];
                this.relaisPerfInput.value = '';
                this.jugeCheckbox.checked = false;
                this.renderGrid();
                this.updateAll();
            }
        });

        this.btnExport.addEventListener('click', () => {
            ExportEngine.generatePDF();
        });
    },

    renderGrid() {
        if (!DataManager.db) return;

        this.gridBody.innerHTML = '';
        let disciplines = DataManager.getDisciplines().filter(d =>
            !d.toLowerCase().includes('4x60') && !d.toLowerCase().includes('relais') &&
            d.toLowerCase() !== '50m' && d.toLowerCase() !== '50mh' &&
            d.toLowerCase() !== '80mh' && d.toLowerCase() !== '100mh'
        );

        // Add the combined Hurdles (Haies) row
        disciplines.push('80/100m Haies');

        const familyOrder = {
            'sprint': 1,
            'haies': 2,
            'demiFond': 3,
            'saut': 4,
            'lancer': 5
        };

        disciplines.sort((a, b) => {
            const getFam = (d) => {
                let f = RulesEngine.getFamily(d);
                if (f === 'course') f = RulesEngine.getCourseSubFamily(d);
                return f;
            };

            const famA = getFam(a);
            const famB = getFam(b);

            if (familyOrder[famA] !== familyOrder[famB]) {
                return (familyOrder[famA] || 99) - (familyOrder[famB] || 99);
            }

            // Further sorting within family (e.g. 50m before 100m, Hauteur before Perche)
            return a.localeCompare(b, undefined, { numeric: true });
        });

        disciplines.forEach((disc, index) => {
            const dbDiscG = disc === '80/100m Haies' ? '100mH' : disc;
            const dbDiscF = disc === '80/100m Haies' ? '80mH' : disc;

            let hasG = DataManager.db.scoring_tables[dbDiscG] && DataManager.db.scoring_tables[dbDiscG]['G'] && DataManager.db.scoring_tables[dbDiscG]['G'].length > 0;
            let hasF = DataManager.db.scoring_tables[dbDiscF] && DataManager.db.scoring_tables[dbDiscF]['F'] && DataManager.db.scoring_tables[dbDiscF]['F'].length > 0;

            const tr = document.createElement('tr');
            tr.dataset.discipline = disc;

            // Name G
            const tdNameG = document.createElement('td');
            if (hasG) {
                const inputNameG = document.createElement('input');
                inputNameG.type = 'text';
                inputNameG.placeholder = 'Nom G';
                inputNameG.className = 'input-name';
                inputNameG.dataset.gender = 'G';
                inputNameG.dataset.rowId = `G_${disc}`;
                tdNameG.appendChild(inputNameG);
            }

            // Perf G
            const tdPerfG = document.createElement('td');
            if (hasG) {
                const div = document.createElement('div');
                div.className = 'perf-input-group';
                const inputPerfG = document.createElement('input');
                inputPerfG.type = 'text';
                inputPerfG.placeholder = 'Perf';
                inputPerfG.className = 'input-perf';
                inputPerfG.dataset.gender = 'G';
                inputPerfG.dataset.rowId = `G_${disc}`;

                const spanPtsG = document.createElement('span');
                spanPtsG.className = 'pts-display';
                spanPtsG.id = `pts_G_${disc.replace(/[^a-zA-Z0-9]/g, "_")}`;
                spanPtsG.textContent = '0 pt';

                div.appendChild(inputPerfG);
                div.appendChild(spanPtsG);
                tdPerfG.appendChild(div);

                // Add Event Listeners
                inputPerfG.addEventListener('input', (e) => this.handleInput(e, disc, 'G', tdNameG.querySelector('input'), dbDiscG));
                tdNameG.querySelector('input').addEventListener('input', (e) => this.handleInput(e, disc, 'G', inputPerfG, dbDiscG));
            } else {
                tdPerfG.innerHTML = '<span class="text-muted">N/A</span>';
            }

            // Discipline Center
            const tdDisc = document.createElement('td');
            tdDisc.className = 'discipline-name';
            tdDisc.textContent = disc;

            // Perf F
            const tdPerfF = document.createElement('td');
            if (hasF) {
                const div = document.createElement('div');
                div.className = 'perf-input-group';
                const inputPerfF = document.createElement('input');
                inputPerfF.type = 'text';
                inputPerfF.placeholder = 'Perf';
                inputPerfF.className = 'input-perf';
                inputPerfF.dataset.gender = 'F';
                inputPerfF.dataset.rowId = `F_${disc}`;

                const spanPtsF = document.createElement('span');
                spanPtsF.className = 'pts-display';
                spanPtsF.id = `pts_F_${disc.replace(/[^a-zA-Z0-9]/g, "_")}`;
                spanPtsF.textContent = '0 pt';

                div.appendChild(inputPerfF);
                div.appendChild(spanPtsF);
                tdPerfF.appendChild(div);
            } else {
                tdPerfF.innerHTML = '<span class="text-muted">N/A</span>';
            }

            // Name F
            const tdNameF = document.createElement('td');
            if (hasF) {
                const inputNameF = document.createElement('input');
                inputNameF.type = 'text';
                inputNameF.placeholder = 'Nom F';
                inputNameF.className = 'input-name';
                inputNameF.dataset.gender = 'F';
                inputNameF.dataset.rowId = `F_${disc}`;
                tdNameF.appendChild(inputNameF);

                // Setup listeners securely
                const inputPerfF = tdPerfF.querySelector('input');
                inputPerfF.addEventListener('input', (e) => this.handleInput(e, disc, 'F', inputNameF, dbDiscF));
                inputNameF.addEventListener('input', (e) => this.handleInput(e, disc, 'F', inputPerfF, dbDiscF));
            }

            // Correct Append Order (screenshot matches)
            // performanc(e) | G | Discipline | F | performanc(e)
            tr.appendChild(tdPerfG);
            tr.appendChild(tdNameG);
            tr.appendChild(tdDisc);
            tr.appendChild(tdNameF);
            tr.appendChild(tdPerfF);

            this.gridBody.appendChild(tr);
        });
    },

    handleInput(event, discipline, gender, siblingInput, dbDiscipline = discipline) {
        const rowId = event.target.dataset.rowId;
        const isNameInput = event.target.classList.contains('input-name');

        let nameVal = isNameInput ? event.target.value : siblingInput.value;
        let perfVal = isNameInput ? siblingInput.value : event.target.value;

        // If Relais 4x60m is typed (we handle relais globally)
        // Wait, for relais, UI might be disabled and handled via checkbox.
        // Let's allow manual input or checkbox.

        AppState.updatePerformance(rowId, discipline, gender, nameVal, perfVal, dbDiscipline);

        // Update local points display
        const match = AppState.performances.find(p => p.id === rowId);
        const ptsEl = document.getElementById(`pts_${gender}_${discipline.replace(/[^a-zA-Z0-9]/g, "_")}`);
        if (ptsEl) {
            ptsEl.textContent = match ? `${match.pts} ${match.pts > 1 ? 'pts' : 'pt'}` : '0 pt';
        }

        this.updateAll();
    },

    updateAll() {
        const result = AppState.recalculate();
        const validation = RulesEngine.validateTeam(AppState);

        this.updateDashboard(result, validation);
        this.updateGridHighlights(result.countingEvents);
        this.updateSidebar(validation.triathlons.details);
    },

    updateDashboard(result = { total: 0 }, validation = { mixite: { valid: false }, relais: false, triathlons: { valid: true } }) {
        this.totalScore.textContent = result.total;

        // Update Flags
        if (validation.mixite.valid) {
            this.flagMixite.classList.add('valid');
            this.flagMixite.innerHTML = `<span class="icon">🟢</span> Mixité Validée`;
        } else {
            this.flagMixite.classList.remove('valid');
            this.flagMixite.innerHTML = `<span class="icon">🔴</span> Mixité (${validation.mixite.f}F/${validation.mixite.g}G)`;
        }

        if (AppState.equipe.relais4x60) {
            this.flagRelais.classList.add('valid');
            this.flagRelais.innerHTML = `<span class="icon">🟢</span> Relais Inclus`;
        } else {
            this.flagRelais.classList.remove('valid');
            this.flagRelais.innerHTML = `<span class="icon">🔴</span> Relais Manquant`;
        }

        if (validation.triathlons.valid) {
            this.flagTriathlons.classList.add('valid');
            this.flagTriathlons.innerHTML = `<span class="icon">🟢</span> Tous Triathlons Valides`;
        } else {
            this.flagTriathlons.classList.remove('valid');
            this.flagTriathlons.innerHTML = `<span class="icon">🔴</span> Erreur Triathlons`;
        }
    },

    updateGridHighlights(countingEvents) {
        // Remove old highlights
        document.querySelectorAll('.counting-perf').forEach(el => el.classList.remove('counting-perf'));

        // Add new highlights
        countingEvents.forEach(evt => {
            const inputPerf = document.querySelector(`input.input-perf[data-row-id="${evt.id}"]`);
            if (inputPerf) {
                inputPerf.parentElement.classList.add('counting-perf');
            }
        });
    },

    updateSidebar(athleteDetails) {
        const athletes = AppState.getAthletes();

        if (athletes.length === 0) {
            this.athletesList.innerHTML = '<div class="empty-state">Aucun athlète saisi.</div>';
            return;
        }

        this.athletesList.innerHTML = '';

        athletes.sort((a, b) => a.name.localeCompare(b.name)).forEach(athlete => {
            const card = document.createElement('div');
            card.className = 'athlete-card';

            const detail = athleteDetails[athlete.name] || { valid: true, message: "OK" };
            if (!detail.valid) {
                card.classList.add('invalid');
            }

            // Events tags
            let eventsHtml = '';
            athlete.events.forEach(e => {
                eventsHtml += `<span class="event-tag">${e.discipline} (${e.pts}pt)</span>`;
            });

            card.innerHTML = `
                <h4>
                    ${athlete.name} (${athlete.gender})
                    <span>${detail.valid ? '🟢' : '🔴'}</span>
                </h4>
                <div class="events-container">${eventsHtml}</div>
                ${!detail.valid ? `<div class="error-text" style="color:var(--danger-color);font-size:0.8rem;margin-top:5px;">${detail.message}</div>` : ''}
            `;

            this.athletesList.appendChild(card);
        });
    }
};
