async function display() {
    
    try {
        const check = document.getElementById("check").value;        

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

        for (let i = 0; i < rows.length; i++) {
            const tr = document.createElement("tr");

            for (let j = 0; j < attributes.length; j++) {
                const key = attributes[j].key;
                const td = document.createElement("td");
                td.textContent = rows[i][key] || ""; 
                tr.appendChild(td);
            }

            body.appendChild(tr);
        }
                    
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