let el;

function getElementValue(el) {
    if (!el) return "";
    if (el.tagName === "SELECT") {
        return el.value; // current selected option value
    }
    if ("value" in el && el.value !== undefined) {
        return el.value;
    }
    return el.textContent.trim();
}

async function display() {
    
    try {
        
        el = document.getElementById("check"); 
        const check = getElementValue(el)
        
        document.getElementById("title").textContent = `${check.toUpperCase()} Report`;
        
        const hidden = ["cash5000","cash2000","cash1000","cash500","id","shift","email","fiche","listSFC","listBC","bon"]

        const res = await fetch(`https://mywebapp-backend.onrender.com/api/attributes/${check}`);
        const data = await res.json();
        const rawAtributes = data.attributes;

        const attributes = rawAtributes.filter(attr => !hidden.includes(attr.key))

        const resDocs = await fetch(`https://mywebapp-backend.onrender.com/api/documents/${check}`);
        const docData = await resDocs.json();
        const rows = docData.documents;

        const headers = document.getElementById("headers");
        const body = document.getElementById("body");

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
                
            }

            body.appendChild(tr);
        }
                    
        const div = document.getElementById("search");
        const inputSection = document.getElementById("inputSection");
        inputSection.innerHTML = ``;

        div.innerHTML = "";

        const searchWith = document.createElement("h2");
        searchWith.textContent = `Search With`;

        div.appendChild(searchWith);

        const select = document.createElement("select");
        select.onchange = changeType;
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

        const searchButton = document.getElementById("searchButton");
        searchButton.innerHTML = ``;
        
        const submit = document.createElement("button");
        submit.type = "button"; 
        submit.className = "action-btn";
        submit.textContent = "Search";
        submit.onclick = search;
        searchButton.appendChild(submit);
        
    } catch (error) {
        console.log("Error ",error);        
    }
}

async function search() {
    try {       
        el = document.getElementById("check"); 
        const check = getElementValue(el);        

        const res = await fetch(`https://mywebapp-backend.onrender.com/api/attributes/${check}`);
        const data = await res.json();
        const attributes = data.attributes;

        const resDocs = await fetch(`https://mywebapp-backend.onrender.com/api/documents/${check}`);
        const docData = await resDocs.json();
        const rows = docData.documents;

        let filteredRows = [];

        const searchWith = document.getElementById("searchWith").value;
        let searchValue = document.getElementById("searchValue").value;

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
            }

            body.appendChild(tr);
        }

        
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

async function changeType() {

    try {        
        el = document.getElementById("check"); 
        const check = getElementValue(el);        

        const res = await fetch(`https://mywebapp-backend.onrender.com/api/attributes/${check}`);
        const data = await res.json();
        const attributes = data.attributes;
        
        const inputSection = document.getElementById("inputSection");
        inputSection.innerHTML = ``;

        const selectedKey = document.getElementById("searchWith").value;
        const selectedAttr = attributes.find(attr => attr.key === selectedKey);

        const input = document.createElement("input");
        input.innerHTML = ``
        input.id = "searchValue"   
        input.textContent = `` 

        if (selectedKey === "monthYear") {
            input.type = "month"
        } else if (selectedKey === "logDate"){
            input.type = "date"
        } else if (selectedAttr) {
            input.type = mapTypeToInput(selectedAttr.type);
        }else {
            input.type = "text"; 
        }
        inputSection.appendChild(input);
    } catch (error) {
        console.log("Error:",error);        
    }
}

async function recent() {
    
}