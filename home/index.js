async function addLoan(event) {
  const btn = event.currentTarget;   
  const originalText = btn.textContent;

  btn.disabled = true;
  btn.textContent = "Loading..."; 

    try {
    
    
        const container = document.getElementById("loanContainer");
        container.innerHTML = "";

        const res = await fetch("https://mywebapp-backend.onrender.com/api/attributes/loans");
        const data = await res.json();
        const attributes = data.attributes;

        for (let i = 0; i < attributes.length; i++) {

        const div = document.createElement("div");
        
        if (attributes[i].key === "employee" || attributes[i].key === "logDate" ) {
            continue;
        }

        div.innerHTML = `
            <label for="${attributes[i].key}"> ${(attributes[i].key).toUpperCase()}: &nbsp;</label>
            <input class="loan" type="${mapTypeToInput(attributes[i].type)}" id="${attributes[i].key}" placeholder="Enter the ${attributes[i].key}">
        `;

        container.appendChild(div);    
        }

        const submit = document.createElement("button");
        submit.type = "button"; 
        submit.className = "action-btn";
        submit.textContent = "Save Loan";
        submit.onclick = (e) => storeLoan(e);
        container.appendChild(submit);


    } catch (error) {
        console.log(error);    
    } finally {      

        btn.disabled = false;
        btn.textContent = originalText;
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
      return "date";
    default:
      return "text"; // for string, enum, etc.
  }
}

async function storeLoan(event) {
    const client = new Appwrite.Client()
    .setEndpoint("https://cloud.appwrite.io/v1") 
    .setProject("68c3ec870024955539b0");
    
    const account = new Appwrite.Account(client);
    const databases = new Appwrite.Databases(client);

    const databaseId = "68c3f10d002b0dfc0b2d";
    const loansId = "68fbe6f80019b53fb32f";
    const paymentsId = "68cd19990006cbb33843";

    const btn = event.currentTarget;   
    const originalText = btn.textContent;

    btn.disabled = true;
    btn.textContent = "Loading..."; 

    const user = await account.get();        
    const employee = user.name;  
    
    const today = new Date();

    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-11
    const day = String(today.getDate()).padStart(2, '0');        // Days 1-31
    const year = today.getFullYear();

    const logDate = `${month}/${day}/${year}`;

    const plate = document.getElementById("plate").value;
    const amount = parseInt(document.getElementById("amount").value);
    const company = document.getElementById("company").value;
    
    try {

        const loanData = {
            plate,
            company,
            logDate, 
            employee,
            amount
 
        };

        await databases.createDocument(
        databaseId,
        loansId,
        "unique()", // Appwrite generates an ID
        loanData
        );

        alert("Data saved successfully");        
        
    } catch (err) {
      console.error("Error:", err.message);
      alert("Error: " + err.message);
    } finally {

        btn.disabled = false;
        btn.textContent = originalText;
        
    }
    const container = document.getElementById("loanContainer");
    container.innerHTML = "";


    // try {
    //     // 1. Find the document by attribute
    //     const docs = await databases.listDocuments(
    //         databaseId,
    //         paymentsId,
    //         [ Appwrite.Query.equal("logDate", logDate) ] // filter by your known attribute
    //     );

    //     if (docs.total === 0) {
    //         console.log("No document found!");
    //         return;
    //     }

    //     const docId = docs.documents[0].$id; // get the first match

    //     // 2. Update the null fields
    //     const updated = await databases.updateDocument(
    //         databaseId,
    //         situationId,
    //         docId,
    //         {
    //             initialAgo: initialAgo,
    //             receivedAgo: receivedAgo,
    //             physicalStockAgo: physicalStockAgo,
    //             theoryStockAgo: theoryStockAgo,
    //             gainFuelAgo: gainFuelAgo,
    //             initialPms: initialPms,
    //             receivedPms: receivedPms,
    //             physicalStockPms: physicalStockPms,
    //             theoryStockPms: theoryStockPms,
    //             gainFuelPms: gainFuelPms,
    //         }
    //     );

    //     console.log("Updated document:", updated);

    //     alert("Data saved successfully");

    // } catch (error) {
    //     alert("Error updating:", error);
    // } finally {

    //     btn.disabled = false;
    //     btn.textContent = originalText;
        
    // }


}