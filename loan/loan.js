async function displayLoan(event) {
    const btn = event.currentTarget;   
    const originalText = btn.textContent;

    btn.disabled = true;
    btn.textContent = "Loading..."; 
    
    try {
        const client = new Appwrite.Client()
        .setEndpoint("https://cloud.appwrite.io/v1") 
        .setProject("68c3ec870024955539b0");

        const databases = new Appwrite.Databases(client);

        const databaseId = "68c3f10d002b0dfc0b2d";
        const loansId = "68fbe6f80019b53fb32f"

        const monthYear = document.getElementById("monthYear").value;
        const company = document.getElementById("company").value;

        const monthDocs = await databases.listDocuments(databaseId, loansId, [Appwrite.Query.equal("monthYear", monthYear)]);
        const companyDocs = await databases.listDocuments(databaseId, loansId, [Appwrite.Query.equal("company", company)]);

        const combinedDocs = await databases.listDocuments(databaseId, loansId, [Appwrite.Query.equal("company", company), Appwrite.Query.equal("monthYear", monthYear)]);

        const monthDoc = monthDocs.documents;
        const companyDoc = companyDocs.documents;
        const combinedDoc = combinedDocs.documents;

        if (monthDoc.length === 0 && companyDoc.length === 0) {
            alert("No documents found in that month")
            return 
        } else if (!monthYear && company) {

            const res = await fetch("https://mywebapp-backend.onrender.com/api/attributes/loans");
            const data = await res.json();
            const attributes = data.attributes;

            const headers = document.getElementById("headers");
            const body = document.getElementById("body");

            headers.innerHTML = "";
            body.innerHTML = "";

            for (let i = 0; i < attributes.length; i++) {

                const theader = document.createElement("th");
                theader.textContent = `${attributes[i].key.toUpperCase()}`;
                headers.appendChild(theader);   
                 
            }

            for (let i = 0; i < companyDoc.length; i++) {
                const tr = document.createElement("tr");

                tr.innerHTML =`<td>${companyDoc[i].plate}</td>
                                <td>${companyDoc[i].company}</td>
                                <td>${companyDoc[i].logDate}</td>
                                <td>${companyDoc[i].employee}</td>
                                <td>${companyDoc[i].amount}</td>
                                <td>${companyDoc[i].monthYear}</td>`;

                body.appendChild(tr);            

            }

        } else if (monthYear && !company) {

            const res = await fetch("https://mywebapp-backend.onrender.com/api/attributes/loans");
            const data = await res.json();
            const attributes = data.attributes;

            const headers = document.getElementById("headers");
            const body = document.getElementById("body");

            headers.innerHTML = "";
            body.innerHTML = "";

            for (let i = 0; i < attributes.length; i++) {

                const theader = document.createElement("th");
                theader.textContent = `${attributes[i].key.toUpperCase()}`;
                headers.appendChild(theader);   
                 
            }

            for (let i = 0; i < monthDoc.length; i++) {
                const tr = document.createElement("tr");

                tr.innerHTML =`<td>${monthDoc[i].plate}</td>
                                <td>${monthDoc[i].company}</td>
                                <td>${monthDoc[i].logDate}</td>
                                <td>${monthDoc[i].employee}</td>
                                <td>${monthDoc[i].amount}</td>
                                <td>${monthDoc[i].monthYear}</td>`;

                body.appendChild(tr);            

            }

        } else if ( monthYear && company ) {

            const res = await fetch("https://mywebapp-backend.onrender.com/api/attributes/loans");
            const data = await res.json();
            const attributes = data.attributes;

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

                tr.innerHTML =`<td>${combinedDoc[i].plate}</td>
                                <td>${combinedDoc[i].company}</td>
                                <td>${combinedDoc[i].logDate}</td>
                                <td>${combinedDoc[i].employee}</td>
                                <td>${combinedDoc[i].amount}</td>
                                <td>${combinedDoc[i].monthYear}</td>`;

                body.appendChild(tr);            

            }

        }
        
    } catch (error) {
        console.log("Error at the display gain:",error);
        
    } finally {

        btn.disabled = false;
        btn.textContent = originalText;
        
    }
}