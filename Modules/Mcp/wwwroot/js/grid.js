// Grid controller — Bootstrap table, no Tabulator.
// Scans for [data-grid]:not([data-grid-initialized]), fetches JSON, populates tbody.

function mountGrids() {
    document.querySelectorAll('[data-grid]:not([data-grid-initialized])').forEach(el => {
        el.setAttribute('data-grid-initialized', 'true');

        const dataUrl = el.dataset.dataUrl;
        const columns = JSON.parse(el.dataset.columns);
        const tbody = el.querySelector('tbody');

        fetch(dataUrl)
            .then(r => r.json())
            .then(data => {
                data.forEach(row => {
                    const tr = document.createElement('tr');
                    columns.forEach(col => {
                        const td = document.createElement('td');
                        td.textContent = row[col.field] ?? '';
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });
            });
    });
}

document.addEventListener('DOMContentLoaded', () => { mountGrids(); });
document.body.addEventListener('grid-render', () => { mountGrids(); });
