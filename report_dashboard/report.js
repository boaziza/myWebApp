async function tables() {

  try{
    const res = await fetch(`https://mywebapp-backend.onrender.com/api/tables`);
    const data = await res.json();

    const tables = Object.keys(data.availableTables);

    const reportslist = document.getElementById("reportsList");

    for (let i = 0; i < tables.length; i++) {
      const div = document.createElement("div");
      div.textContent = tables[i].toUpperCase();
      div.className = "report-item"
      div.onclick = () => display(tables[i]);
      
      reportslist.appendChild(div);
    }
  } catch(error) {
    console.log("Error",error);    
  }
}

tables();

async function display(check) {
    
    try {
        
        const hidden = ["cash5000","cash2000","cash1000","cash500","id","shift","email","fiche","listSFC","listBC","bon"];
        const preferredOrder = ["company","plate",  "amount", "employee","totalVente","totalPayments","totalCash","gainPayments", ];
        const renameMap = {
          email: "User Email",
          name: "Full Name",
          age: "User Age",
          createdAt: "Date Created"
        };

        const res = await fetch(`https://mywebapp-backend.onrender.com/api/attributes/${check}`);
        const data = await res.json();
        const rawAtributes = data.attributes;

        const rearranged = [
          ...preferredOrder
            .map(key => rawAtributes.find(attr => attr.key === key))
            .filter(Boolean),
          ...rawAtributes.filter(attr => !preferredOrder.includes(attr.key))
        ];

        const renamed = rearranged.map(attr => ({
          ...attr,
          displayName: renameMap[attr.key] || attr.key // fallback to original name
        }));

        const attributes = rearranged.filter(attr => !hidden.includes(attr.key))

        const resDocs = await fetch(`https://mywebapp-backend.onrender.com/api/documents/${check}`);
        const docData = await resDocs.json();
        const rows = docData.documents;

        const headers = document.getElementById("headers");
        const body = document.getElementById("body");
        const div = document.getElementById("search");
        // div.onchange = () => display(check);
        
        div.innerHTML = ``;
        headers.innerHTML = "";
        body.innerHTML = "";

        for (let i = 0; i < attributes.length; i++) {

            const theader = document.createElement("th");

            if (attributes[i].key === "loans") {

                theader.textContent = `VERSEMENT`;
                headers.appendChild(theader);
                continue;

            }

            theader.textContent = `${attributes[i].key.toUpperCase()}`;
            headers.appendChild(theader);   
                
        }

        const totals = Array(attributes.length).fill(0);

        for (let i = 0; i < rows.length; i++) {
            const tr = document.createElement("tr");

            for (let j = 0; j < attributes.length; j++) {

                const key = attributes[j].key;
                const td = document.createElement("td");

                if (key === "loans") {                    

                    const loans = JSON.parse(rows[i][key]);
                    if (loans.every(loan => loan.company === "Versement")) {
                        td.textContent = loans.map(loan => `${loan.amount}`);
                    }
                    
                    tr.appendChild(td);
                    continue;

                }

                if (key === "logDate") {

                    const formattedDate = new Date(rows[i][key]).toISOString().split("T")[0];

                    td.textContent = formattedDate;
                    
                    tr.appendChild(td);
                    continue;

                }
                
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
                  
        const searchWith = document.getElementById("searchWith");
        searchWith.innerHTML = ``;
        searchWith.onchange = () => changeType(check);

        for (let i = 0; i < attributes.length; i++) {
          const option = document.createElement("option")
          option.textContent = `${attributes[i].key}`
          searchWith.appendChild(option);            
        }

        div.appendChild(document.createElement("br"));

        const searchButton = document.getElementById("searchButton");
        searchButton.innerHTML = ``;
        
        const submit = document.createElement("button");
        submit.type = "button"; 
        submit.className = "action-btn";
        submit.textContent = "Search";
        submit.onclick = () => search(check);
        searchButton.appendChild(submit);
        
    } catch (error) {
        console.log("Error ",error);        
    }
}

async function search(check) {
    try {      

        const res = await fetch(`https://mywebapp-backend.onrender.com/api/attributes/${check}`);
        const data = await res.json();
        const attributes = data.attributes;

        const resDocs = await fetch(`https://mywebapp-backend.onrender.com/api/documents/${check}`);
        const docData = await resDocs.json();
        const rows = docData.documents;

        let filteredRows = [];

        const searchWith = document.getElementById("searchWith").value;
        let searchValue = document.getElementById("search").value;

        if (searchWith === "logDate") {
           searchValue = `${searchValue}T00:00:00.000+00:00`
        }

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

        const totals = Array(attributes.length).fill(0);

        for (let i = 0; i < filteredRows.length; i++) {
            
            const tr = document.createElement("tr");

            for (let j = 0; j < attributes.length; j++) {
                const key = attributes[j].key;
                const td = document.createElement("td");

                if (key === "logDate") {

                    const formattedDate = new Date(filteredRows[i][key]).toISOString().split("T")[0];

                    td.textContent = formattedDate;
                    
                    tr.appendChild(td);
                    continue;

                };

                td.textContent = filteredRows[i][key] || ""; 
                tr.appendChild(td);

                const numValue = Number(filteredRows[i][key]);
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

        
    } catch (error) {
        console.log(error);
        display();        
    }
}
function mapTypeToInput(appwriteType) {
  switch (appwriteType) {
    case "integer":
      return "number";
    case "float":
      return "number";
    case "boolean":
      return "checkbox";
    case "email":
      return "email";
    case "url":
      return "url";
    case "datetime":
      return "datetime-local";
    default:
      return "text"; // for string, enum, etc.
  }
}

async function changeType(check) {

    try {       

        const res = await fetch(`https://mywebapp-backend.onrender.com/api/attributes/${check}`);
        const data = await res.json();
        const attributes = data.attributes;

        const selectedKey = document.getElementById("searchWith").value;
        const selectedAttr = attributes.find(attr => attr.key === selectedKey);

        const input = document.getElementById("search");
        input.textContent = ``;
        

        if (selectedKey === "monthYear") {
            input.type = "month"
        } else if (selectedKey === "logDate"){
            input.type = "date"
        } else if (selectedAttr) {
            input.type = mapTypeToInput(selectedAttr.type);
        }else {
            input.type = "text"; 
        }
    } catch (error) {
        console.log("Error:",error);        
    }
}

async function blocks() {

  try{

    const divs = document.querySelectorAll(".metric");

    for (let r = 0; r < divs.length; r++) {        
      
      const div = divs[r];

      const p = div.querySelector("p");

      let check = p.id;

      console.log("check", check);
      

      if (check === "gainPms" || check === "gainAgo") {
        check = "stock"
      }

      const res = await fetch(`https://mywebapp-backend.onrender.com/api/attributes/${check}`);
      const data = await res.json();
      const attributes = data.attributes;

      const resDocs = await fetch(`https://mywebapp-backend.onrender.com/api/documents/${check}`);
      const docData = await resDocs.json();
      const rows = docData.documents;

      let totalGain = 0;

      for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < attributes.length; j++) {       
        
          const key = attributes[j].key

          if (key === "gainPayments") {
            totalGain += rows[i][key];
          } else if (key === "totalGainFuelAgo") {
            document.getElementById("gainAgo").textContent = `${rows[i][key]} L`;
            // continue;
          } else if (key === "totalGainFuelPms") {
            document.getElementById("gainPms").textContent = `${rows[i][key]} L`;
            // break;
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