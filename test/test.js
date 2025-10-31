async function display() {
    
    try {
        const check = document.getElementById("check").value;
        console.log("check",check);
        

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

        for (let i = 0; i < combinedDoc.length; i++) {
            const tr = document.createElement("tr");

            for (let j = 0; j < attributes.length; j++) {
                const key = attributes[j].key;
                const td = document.createElement("td");
                td.textContent = rows[i][key] || ""; 
                tr.appendChild(td);
            }

            body.appendChild(tr);            

        }
        
    } catch (error) {
        console.log("Error at the display gain:",error);        
    }
}

display();