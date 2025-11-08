async function display() {
    
    try {
        const check = document.getElementById("check").value;   
        
        document.getElementById("title").textContent = `${(check).toUpperCase()} Report`

        const res = await fetch(`https://mywebapp-backend.onrender.com/api/attributes/${check}`);
        const data = await res.json();
        const attributes = data.attributes;

        const resDocs = await fetch(`https://mywebapp-backend.onrender.com/api/documents/${check}`);
        const docData = await resDocs.json();
        const rows = docData.documents;

        const headers = document.getElementById("headers");
        const body = document.getElementById("body");

        headers.innerHTML = "";
        body.innerHTML = "";

        for (let i = 0; i < attributes.length; i++) {

            const theader = document.createElement("th");
            theader.textContent = `${attributes[i].key.toUpperCase()}`;
            headers.appendChild(theader);   
                
        }

        const totals = Array(attributes.length).fill(0);

        for (let i = 0; i < rows.length; i++) {
          const tr = document.createElement("tr");

          for (let j = 0; j < attributes.length; j++) {
            const key = attributes[j].key;
            const td = document.createElement("td");
            td.textContent = rows[i][key] || ""; 
            tr.appendChild(td);

            const numValue = Number(rows[i][key]);
            if (!isNaN(numValue)) {
              totals[j] += numValue;
            }
          }

          body.appendChild(tr);
        }
        const totalRow = document.createElement("tr");

        for (let j = 0; j < attributes.length; j++) {
          const td = document.createElement("td");
          // Only show total if it’s numeric (not 0)
          td.textContent = totals[j] !== 0 ? totals[j].toLocaleString() : "";
          totalRow.appendChild(td);
        }

        body.appendChild(totalRow);
                    
        const div = document.getElementById("search")

        div.innerHTML = "";

        const searchWith = document.createElement("h2");
        searchWith.textContent = `Search With`;

        div.appendChild(searchWith);

        const select = document.createElement("select");
        select.id = "searchWith";

        const optionStart = document.createElement("option");        
        optionStart.textContent = `Search With`
        select.appendChild(optionStart)

        for (let i = 0; i < attributes.length; i++) {
            const option = document.createElement("option")
            option.textContent = `${attributes[i].key}`
            select.appendChild(option);            
        }

        div.appendChild(select);

        div.appendChild(document.createElement("br"));

        const input = document.createElement("input"); 
        input.type = "text"; 
        input.id = "searchValue"   
        input.textContent = ``
        div.appendChild(input);

        div.appendChild(document.createElement("br"));
        
        const submit = document.createElement("button");
        submit.type = "button"; 
        submit.className = "action-btn";
        submit.textContent = "Search";
        submit.onclick = search;
        div.appendChild(submit);

        div.appendChild(document.createElement("br"));
        div.appendChild(document.createElement("br"));
        
    } catch (error) {
        console.log("Error at the display gain:",error);        
    }
}

async function search() {
    try {

        const check = document.getElementById("check").value;        

        const res = await fetch(`https://mywebapp-backend.onrender.com/api/attributes/${check}`);
        const data = await res.json();
        const attributes = data.attributes;

        const resDocs = await fetch(`https://mywebapp-backend.onrender.com/api/documents/${check}`);
        const docData = await resDocs.json();
        const rows = docData.documents;

        let filteredRows = [];

        const searchWith = document.getElementById("searchWith").value;
        const searchValue = document.getElementById("searchValue").value;

        for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

            if (row[searchWith] == searchValue) {
                filteredRows.push(row);
            }
        }

        console.log("filteredrows",filteredRows);
        

        const headers = document.getElementById("headers");
        const body = document.getElementById("body");

        headers.innerHTML = "";
        body.innerHTML = "";

        for (let i = 0; i < attributes.length; i++) {

            const theader = document.createElement("th");
            theader.textContent = `${attributes[i].key.toUpperCase()}`;
            headers.appendChild(theader);   
                
        }

        for (let i = 0; i < filteredRows.length; i++) {
            
            const tr = document.createElement("tr");

            for (let j = 0; j < attributes.length; j++) {
                const key = attributes[j].key;
                const td = document.createElement("td");
                td.textContent = filteredRows[i][key] || ""; 
                tr.appendChild(td);
            }

            body.appendChild(tr);
        }

        
    } catch (error) {
        console.log(error);
        
    }
}

// function generateReportHeader(year, month) {
//   const headerRow = document.getElementById("headerRow");
//   headerRow.innerHTML = ""; // Clear any existing headers

//   // Example: month = 10 for November (JS months are 0-based)
//   const date = new Date(year, month, 1);

//   const monthName = date.toLocaleString("en", { month: "short" }).toUpperCase(); // e.g., "NOV"
//   const yearStr = year;

//   // Add the month+year header
//   const monthHeader = document.createElement("th");
//   monthHeader.textContent = `${monthName} ${yearStr}`;
//   monthHeader.style.background = "#f1f3f4";
//   headerRow.appendChild(monthHeader);

//   // Get number of days in that month
//   const daysInMonth = new Date(year, month + 1, 0).getDate();

//   // Add day headers (e.g., 01.11, 02.11, ...)
//   for (let day = 1; day <= 12; day++) {
//     const th = document.createElement("th");
//     th.textContent = `${String(day).padStart(2, "0")}.${String(month + 1).padStart(2, "0")}`;
//     th.style.cursor = "pointer";
//     th.onclick = () => showReportForDay(day, month + 1, year); // Example click function
//     headerRow.appendChild(th);
//   }
// }

// function showReportForDay(day, month, year) {
//   alert(`Showing report for ${day}/${month}/${year}`);
// }


// function generateMonthBlocks(year, month) {
//   const daysContainer = document.getElementById("daysContainer");
//   const monthTitle = document.getElementById("monthTitle");

//   daysContainer.innerHTML = ""; // Clear any existing days
//   const date = new Date(year, month, 1);

//   const monthName = date.toLocaleString("en", { month: "long" }).toUpperCase(); // "NOVEMBER"
//   monthTitle.textContent = `${monthName} ${year}`;

//   const daysInMonth = new Date(year, month + 1, 0).getDate();

//   for (let day = 1; day <= daysInMonth; day++) {
//     const block = document.createElement("div");
//     block.classList.add("day-block");
//     block.textContent = `${String(day).padStart(2, "0")}.${String(month + 1).padStart(2, "0")}`;

//     block.onclick = () => {
//       // Clear old active blocks
//       document.querySelectorAll(".day-block").forEach(b => b.classList.remove("active"));
//       block.classList.add("active");

//       // Call your custom logic here
//       showDailyReport(day, month + 1, year);
//     };

//     daysContainer.appendChild(block);
//   }
// }

// function showDailyReport(day, month, year) {
//   alert(`Showing report for ${day}/${month}/${year}`);
// }


let reportChart; // store current chart to update later

function renderChart(type, labels, data, title) {
  const ctx = document.getElementById("reportChart").getContext("2d");

  // Destroy old chart if it exists (important when switching)
  if (reportChart) {
    reportChart.destroy();
  }

  reportChart = new Chart(ctx, {
    type: type, // 'bar', 'line', 'pie', etc.
    data: {
      labels: labels,
      datasets: [{
        label: title,
        data: data,
        borderWidth: 2,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: title,
          color: "#333",
          font: { size: 16 }
        }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

async function loadReport() {
    
  const check = document.getElementById("check").value;

    const res = await fetch(`https://mywebapp-backend.onrender.com/api/documents/${check}`);
    const data = await res.json();

    const rows = data.documents;

    const labels = rows.map(r => r.monthYear); // or r.logDate
    const values = rows.map(r => r.gainPayments || r.amount || r.company);

    renderChart("pie", labels, values, "Daily Gain Over Time");
}
