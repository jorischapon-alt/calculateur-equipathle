// export.js
const ExportEngine = {
    generatePDF() {
        const state = AppState;
        const result = state.recalculate();
        const athletes = state.getAthletes();
        const validation = RulesEngine.validateTeam(state);

        const container = document.createElement('div');
        container.style.padding = '20px';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.color = '#333';
        container.style.backgroundColor = '#fff';

        const dateStr = new Date().toLocaleDateString('fr-FR');

        const header = `
            <div style="border-bottom: 2px solid #2563eb; padding-bottom: 15px; margin-bottom: 20px; text-align: center;">
                <h1 style="color: #2563eb; margin: 0 0 10px 0;">Rapport d'Équipe - Equip'Athlé Minimes</h1>
                <p style="margin: 0; color: #64748b; font-size: 14px;">Généré le ${dateStr}</p>
                <h2 style="margin: 15px 0 0 0; color: #1e293b; font-size: 28px;">Total : <span style="color: #2563eb;">${result.total} pts</span></h2>
            </div>
        `;

        const bilan = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 30px; background: #f8fafc; padding: 15px; border-radius: 8px;">
                <div style="width: 100%;">
                    <h3 style="margin-top:0; color:#475569; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px;">Composition & Bonus</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 20px; font-size: 14px;">
                        <div><strong>Mixité :</strong> ${validation.mixite.valid ? '<span style="color:green">✔ Validée</span>' : '<span style="color:red">✘ Invalide</span>'} (${validation.mixite.f}F / ${validation.mixite.g}G)</div>
                        <div><strong>Relais Mixte :</strong> ${state.equipe.relais4x60 ? state.equipe.pointsRelais + ' pts' : '<span style="color:red">Non renseigné</span>'}</div>
                        <div><strong>Jeune Juge :</strong> ${state.equipe.jeuneJuge ? state.equipe.pointsJuge + ' pts' : '0 pt'}</div>
                        <div><strong>Triathlons :</strong> ${validation.triathlons.valid ? '<span style="color:green">✔ Tous Valides</span>' : '<span style="color:red">✘ Erreurs détectées</span>'}</div>
                    </div>
                </div>
            </div>
        `;

        let perfsHtml = `
            <h3 style="color:#2563eb; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px;">Performances Retenues (Score d'Équipe)</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
                <thead>
                    <tr style="background-color: #f1f5f9; text-align: left;">
                        <th style="padding: 8px; border-bottom: 2px solid #cbd5e1;">Discipline</th>
                        <th style="padding: 8px; border-bottom: 2px solid #cbd5e1;">Athlète</th>
                        <th style="padding: 8px; border-bottom: 2px solid #cbd5e1;">Sexe</th>
                        <th style="padding: 8px; border-bottom: 2px solid #cbd5e1;">Perf.</th>
                        <th style="padding: 8px; border-bottom: 2px solid #cbd5e1; text-align: right;">Points</th>
                    </tr>
                </thead>
                <tbody>
        `;

        result.countingEvents.sort((a, b) => b.pts - a.pts).forEach(evt => {
            perfsHtml += `
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${evt.discipline}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${evt.athleteName}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${evt.gender}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${evt.perf}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #2563eb;">${evt.pts}</td>
                </tr>
            `;
        });
        perfsHtml += `</tbody></table>`;

        let athHtml = `<h3 style="color:#2563eb; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px;">Bilan Individuel</h3>`;
        athHtml += `<div style="display: flex; flex-wrap: wrap; gap: 15px;">`;

        athletes.sort((a, b) => a.name.localeCompare(b.name)).forEach(ath => {
            const detail = validation.triathlons.details[ath.name] || { valid: true, message: "OK" };
            const statusColor = detail.valid ? 'green' : 'red';
            const statusIcon = detail.valid ? '✔' : '✘';

            let evList = ath.events.map(e => `<li>${e.discipline}: <strong>${e.perf}</strong> (${e.pts} pts)</li>`).join('');

            athHtml += `
                <div style="flex: 1 1 45%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 13px;">
                    <div style="font-weight: bold; font-size: 15px; margin-bottom: 8px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">
                        ${ath.name} (${ath.gender}) 
                        <span style="float:right; color: ${statusColor};">${statusIcon}</span>
                    </div>
                    <ul style="margin: 0; padding-left: 15px; margin-bottom: 8px; line-height: 1.4;">
                        ${evList}
                    </ul>
                    ${!detail.valid ? `<div style="color: red; font-size: 11px; margin-top:5px;">⚠️ ${detail.message}</div>` : ''}
                </div>
            `;
        });
        athHtml += `</div>`;

        container.innerHTML = header + bilan + perfsHtml + athHtml;

        const opt = {
            margin: 10,
            filename: 'Rapport_EquipAthle.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        if (typeof html2pdf !== 'undefined') {
            const btn = document.getElementById('btn-export');
            const originalText = btn.textContent;
            btn.textContent = "Génération...";
            btn.disabled = true;

            html2pdf().set(opt).from(container).save().then(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            });
        } else {
            alert("Erreur: Librairie html2pdf non chargée. Vérifiez votre connexion internet.");
        }
    }
};
