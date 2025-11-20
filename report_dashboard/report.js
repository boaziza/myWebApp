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

    for (let i = 0; i < tables.length; i++) {
      const div = document.createElement("div");
      div.textContent = tables[i].toUpperCase();
      div.className = "report-item";
      div.onclick = () => display(tables[i]);
      reportsList.appendChild(div);
    }
    
  } catch (error) {
    console.error("Error:", error);
  }
}
tables();

// --- Utilities ---
const hiddenKeys = ["cash5000","cash2000","cash1000","cash500","id","shift","email","fiche","listSFC","listBC","bon"];
const preferredOrder = ["company","plate","amount","employee","totalVente","totalPayments","totalCash","gainPayments","monthYear"];
const renameMap = {
  "monthYear": "Month",
  "logDate": "Date",
  "gainPayments": "Gain",
  "totalVente": "Total Vente",
  "totalPayments": "Total Payments",
  "totalCash": "Total Cash",
  "totalVente": "Total Vente",
  "momo": "MOMO",
  "momoLoss": "MOMO Loss",
  "bankCard": "Bank Card",
  "totalFiche": "Fiche",
  "spFuelCard": "SP Fuel Card",
  "totalLoans": "Loans",
  "totalGainFuelPms": "Total Gain (PMS)",
  "totalGainFuelAgo": "Total Gain (AGO)",
  "totalReceivedPms": "Total Received (PMS)",
  "totalReceivedAgo": "Total Received (AGO)",
  "totalVenteLitresAgo": "Total Litres Sold (AGO)",
  "totalVenteLitresPms": "Total Litres Sold (PMS)"

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
    datetime: "date"
  };
  return typeMap[type] || "text";
}

// --- Main display ---
async function display(check) {
  try {
    document.getElementById("tableTitle").textContent = `${(check).toUpperCase()} Table`;

    const [attrData, docData] = await Promise.all([
      fetchJSON(`https://mywebapp-backend.onrender.com/api/attributes/${check}`),
      fetchJSON(`https://mywebapp-backend.onrender.com/api/documents/${check}`)
    ]);

    const attributes = rearrangeAndRename(attrData.attributes);
    console.log(attributes);
    
    const rows = docData.documents;
    const headers = document.getElementById("headers");
    const body = document.getElementById("body");
    const searchWith = document.getElementById("searchWith");
    const searchInput = document.getElementById("search");
    const searchButton = document.getElementById("searchButton");
    const totalsRow = document.createElement("tr");

    // Clear old
    [headers, body, searchWith, searchInput, searchButton].forEach(el => (el.innerHTML = ""));

    // Build headers
    for (let i = 0; i < attributes.length; i++) {
      const theader = document.createElement("th");
      if (attributes[i].key === "loans") {
        theader.textContent = `Versement`;
        headers.appendChild(theader);
      } else {
        theader.textContent = `${attributes[i].displayName}`;
        headers.appendChild(theader); 
      }                
    }
    // Build rows
    const totals = Array(attributes.length).fill(0);

    renderTable(attributes, rows, body, totalsRow);
    
    for (let i = 0; i < attributes.length; i++) {
      const option = document.createElement("option");
      option.value = `${attributes[i].key}`
      option.textContent = `${attributes[i].displayName}`
      searchWith.appendChild(option);            
    }

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
      const value = row[key] || "0";

      if (key === "loans" && value) {
        const loans = JSON.parse(value);
        const versements = loans.filter(l => l.company === "Versement").map(l => l.amount);
        td.textContent = versements.join(", ") || "0";
      } else {
        td.textContent = formatValue(key, value);
      }

      tr.appendChild(td);

      const num = Number(value);
      if (!isNaN(num)) {
        totals[j] += num;
      } else if( j === 0 ){
        totals[j] = "TOTALS"
      }
       
    });

    tableBody.appendChild(tr);
  });

  totalsRow.innerHTML = totals.map(t => `<td style="font-weight: bold;">${t ? t.toLocaleString() : ""}</td>`).join("");
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

async function blocks() {
  try{
    const divs = document.querySelectorAll(".metric");
    for (let r = 0; r < divs.length; r++) { 

      const div = divs[r];
      const p = div.querySelector("p");
      let check = p.id;      

      if (check === "gainPms" || check === "gainAgo") {
        check = "stock"
      }

      // Fetch data
      const [attrData, docData] = await Promise.all([
        fetchJSON(`https://mywebapp-backend.onrender.com/api/attributes/${check}`),
        fetchJSON(`https://mywebapp-backend.onrender.com/api/documents/${check}`)
      ]);

      const attributes = rearrangeAndRename(attrData.attributes);
      const rows = docData.documents;

      let totalGain = 0;

      for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < attributes.length; j++) {        
          const key = attributes[j].key
          if (key === "gainPayments") {
            totalGain += rows[i][key];
          } else if (key === "totalGainFuelAgo") {
            document.getElementById("gainAgo").textContent = `${rows[i][key]} L`;
          } else if (key === "totalGainFuelPms") {
            document.getElementById("gainPms").textContent = `${rows[i][key]} L`;
          }
        }
        document.getElementById("gain").textContent = `${totalGain} RWF`;
      }
    }
  } catch(error) {
    console.log("Error", error);    
  }
}
blocks();
