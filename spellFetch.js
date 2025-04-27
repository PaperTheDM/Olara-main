const headers = ["ID", "Name", "Level", "School", "Casting Time", "Range", "Components", "Duration", "Description"];
const spellsData = [];

document.getElementById('csvFile').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    loadSpellsFromCSV(text);
    displayCSV(text);
  };
  reader.readAsText(file);
});

function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      currentCell += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell);
      currentCell = '';
    } else if ((char === '\n' || char === '\r') && !insideQuotes) {
      if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell);
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
      }
      if (char === '\r' && nextChar === '\n') i++;
    } else {
      currentCell += char;
    }
  }
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  return rows;
}

function loadSpellsFromCSV(csv) {
  const rows = parseCSV(csv);

  spellsData.length = 0; // Clear existing spells
  let startIndex = 0;
  if (rows.length > 0 && rows[0][0].trim().toLowerCase() === "id") {
    startIndex = 1;
  }

  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i];
    if (row.length >= 2) { // Make sure it has Name and Description
        spellsData.push({
            id: row[0]?.trim() || '',
            name: row[1]?.trim() || '',
            level: row[2]?.trim() || '',
            school: row[3]?.trim() || '',
            castingTime: row[4]?.trim() || '',
            range: row[5]?.trim() || '',
            components: row[6]?.trim() || '',
            duration: row[7]?.trim() || '',
            description: row[8]?.trim() || ''
        });
    }
  }
  console.log("Loaded spells:", spellsData.length);
}

function displayCSV(csv) {
  const rows = parseCSV(csv);
  const table = document.getElementById('csvTable');
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');

  thead.innerHTML = '';
  tbody.innerHTML = '';

  const headerRow = document.createElement('tr');
  headers.forEach((header, index) => {
    const th = document.createElement('th');
    th.textContent = header;
    th.addEventListener('click', () => sortTable(index));
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  let startIndex = 0;
  if (rows.length > 0 && rows[0][0].trim().toLowerCase() === "id") {
    startIndex = 1;
  }

  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i];
    if (row.length === 0 || (row.length === 1 && row[0].trim() === "")) continue;

    const tr = document.createElement('tr');
    headers.forEach((_, colIndex) => {
      const td = document.createElement('td');
      td.textContent = row[colIndex]?.trim() || '';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  }
}

function sortTable(columnIndex) {
  const table = document.getElementById('csvTable');
  const tbody = table.querySelector('tbody');
  const rowsArray = Array.from(tbody.querySelectorAll('tr'));

  const ascending = table.getAttribute('data-sort-asc') !== 'true';
  table.setAttribute('data-sort-asc', ascending);

  rowsArray.sort((a, b) => {
    const aText = a.children[columnIndex]?.textContent.trim() ?? '';
    const bText = b.children[columnIndex]?.textContent.trim() ?? '';

    if (columnIndex === 0) {
      return ascending
        ? Number(aText) - Number(bText)
        : Number(bText) - Number(aText);
    }

    return ascending
      ? aText.localeCompare(bText, undefined, { numeric: true })
      : bText.localeCompare(aText, undefined, { numeric: true });
  });

  tbody.innerHTML = '';
  rowsArray.forEach(row => tbody.appendChild(row));
}

function searchSpellByName(query) {
    const resultsContainer = document.getElementById('results');
    if (!resultsContainer) return;
  
    // If the search field is empty, clear results immediately
    if (query === '') {
      resultsContainer.innerHTML = '';
      return;
    }
  
    const results = spellsData.filter(spell =>
      spell.name.toLowerCase().includes(query.toLowerCase())
    );
  
    results.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  
    resultsContainer.innerHTML = '';
  
    if (results.length === 0) {
      resultsContainer.innerHTML = `<p>No spells found matching '${query}'.</p>`;
    } else {
      results.forEach(spell => {
        const spellDiv = document.createElement('div');
        spellDiv.innerHTML = `
          <h3>${spell.name}</h3>
          <p><strong>Level:</strong> ${spell.level}</p>
          <p><strong>School:</strong> ${spell.school}</p>
          <p><strong>Casting Time:</strong> ${spell.castingTime}</p>
          <p><strong>Range:</strong> ${spell.range}</p>
          <p><strong>Components:</strong> ${spell.components}</p>
          <p><strong>Duration:</strong> ${spell.duration}</p>
          <p><strong>Description:</strong> ${spell.description}</p>
          <hr>
        `;
        resultsContainer.appendChild(spellDiv);
      });
    }
  }
  

// When user types, instantly search
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function(event) {
      const query = event.target.value.trim();
      searchSpellByName(query);
    });
  }
});
