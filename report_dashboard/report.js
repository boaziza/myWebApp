async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

async function tables() {
  try {
    const data = await fetchJSON(`https://mywebapp-backend.onrender.com/api/tables`);
    const tables = Object.keys(data.availableTables);
    const reportsList = document.getElementById("reportsList");

    reportsList.innerHTML = ""; // clear old

    tables.forEach(table => {
      const div = document.createElement("div");
      div.textContent = table.toUpperCase();
      div.className = "report-item";
      div.onclick = () => display(table);
      reportsList.appendChild(div);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
tables();

// --- Utilities ---
const hiddenKeys = ["cash5000","cash2000","cash1000","cash500","id","shift","email","fiche","listSFC","listBC","bon"];
const preferredOrder = ["company","plate","amount","employee","totalVente","totalPayments","totalCash","gainPayments"];
const renameMap = {
  email: "User Email",
  name: "Full Name",
  age: "User Age",
  createdAt: "Date Created"
};

function rearrangeAndRename(attrs) {
  const ordered = [
    ...preferredOrder.map(k => attrs.find(a => a.key === k)).filter(Boolean),
    ...attrs.filter(a => !preferredOrder.includes(a.key))
  ];

  return ordered
    .filter(a => !hiddenKeys.includes(a.key))
    .map(a => ({ ...a, displayName: renameMap[a.key] || a.key }));
}

function formatValue(key, value) {
  if (key === "logDate" && value) {
    return new Date(value).toISOString().split("T")[0];
  }
  return value || "";
}

function mapTypeToInput(type) {
  const typeMap = {
    integer: "number",
    float: "number",
    boolean: "checkbox",
    email: "email",
    url: "url",
    datetime: "datetime-local"
  };
  return typeMap[type] || "text";
}

// --- Main display ---
async function display(check) {
  try {
    const [attrData, docData] = await Promise.all([
      fetchJSON(`https://mywebapp-backend.onrender.com/api/attributes/${check}`),
      fetchJSON(`https://mywebapp-backend.onrender.com/api/documents/${check}`)
    ]);

    const attributes = rearrangeAndRename(attrData.attributes);
    const rows = docData.documents;
    const headers = document.getElementById("headers");
    const body = document.getElementById("body");
    const searchWith = document.getElementById("searchWith");
    const searchInput = document.getElementById("search");
    const searchButton = document.getElementById("searchButton");

    // Clear old
    [headers, body, searchWith, searchInput, searchButton].forEach(el => (el.innerHTML = ""));

    // Build headers
    headers.innerHTML = attributes
      .map(a => `<th>${a.key === "loans" ? "VERSEMENT" : a.displayName.toUpperCase()}</th>`)
      .join("");

    // Build rows
    const totals = Array(attributes.length).fill(0);

    rows.forEach(row => {
      const tr = document.createElement("tr");

      attributes.forEach((attr, j) => {
        const td = document.createElement("td");
        const key = attr.key;
        const value = row[key];

        if (key === "loans" && value) {
          const loans = JSON.parse(value);
          const versements = loans.filter(l => l.company === "Versement").map(l => l.amount);
          td.textContent = versements.join(", ") || "0";
        } else {
          td.textContent = formatValue(key, value);
        }

        tr.appendChild(td);

        const num = Number(value);
        if (!isNaN(num)) totals[j] += num;
      });

      body.appendChild(tr);
    });

    // Add total row
    const totalRow = document.createElement("tr");
    totalRow.innerHTML = totals
      .map(t => `<td>${t ? t.toLocaleString() : ""}</td>`)
      .join("");
    body.appendChild(totalRow);

    // Search selector
    attributes.forEach(a => {
      const opt = document.createElement("option");
      opt.value = a.key;
      opt.textContent = a.displayName;
      searchWith.appendChild(opt);
    });

    searchWith.onchange = async () => {
      const selected = attributes.find(a => a.key === searchWith.value);
      if (selected) searchInput.type = mapTypeToInput(selected.type);
    };

    // Search button
    const btn = document.createElement("button");
    btn.className = "action-btn";
    btn.textContent = "Search";
    btn.onclick = () => search(check);
    searchButton.appendChild(btn);

  } catch (error) {
    console.error("Error:", error);
  }
}

function filterRows(rows, searchKey, searchValue) {
  if (!searchKey || !searchValue) return rows;

  // Handle date type fields
  if (searchKey === "logDate") {
    searchValue = `${searchValue}T00:00:00.000+00:00`;
  }

  return rows.filter(row => String(row[searchKey]) === String(searchValue));
}

function renderTable(attributes, rows, tableBody, totalsRow) {
  tableBody.innerHTML = "";
  totalsRow.innerHTML = "";

  const totals = Array(attributes.length).fill(0);

  rows.forEach(row => {
    const tr = document.createElement("tr");

    attributes.forEach((attr, j) => {
      const td = document.createElement("td");
      const key = attr.key;
      const value = row[key];

      if (key === "loans" && value) {
        const loans = JSON.parse(value);
        const versements = loans.filter(l => l.company === "Versement").map(l => l.amount);
        td.textContent = versements.join(", ") || "0";
      } else {
        td.textContent = formatValue(key, value);
      }

      tr.appendChild(td);

      const num = Number(value);
      if (!isNaN(num)) totals[j] += num;
    });

    tableBody.appendChild(tr);
  });

  totalsRow.innerHTML = totals.map(t => `<td>${t ? t.toLocaleString() : ""}</td>`).join("");
  tableBody.appendChild(totalsRow);
}

async function search(check) {
  try {
    // Fetch data
    const [attrData, docData] = await Promise.all([
      fetchJSON(`https://mywebapp-backend.onrender.com/api/attributes/${check}`),
      fetchJSON(`https://mywebapp-backend.onrender.com/api/documents/${check}`)
    ]);

    const attributes = rearrangeAndRename(attrData.attributes);
    const rows = docData.documents;

    const searchKey = document.getElementById("searchWith").value;
    let searchValue = document.getElementById("search").value;

    // Filter
    const filtered = filterRows(rows, searchKey, searchValue);

    // Render filtered results
    const body = document.getElementById("body");
    const totalRow = document.createElement("tr");
    renderTable(attributes, filtered, body, totalRow);

  } catch (error) {
    console.error("Search error:", error);
  }
}
