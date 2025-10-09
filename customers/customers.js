async function downloadGain() {
  try {
    const client = new Appwrite.Client()
      .setEndpoint("https://cloud.appwrite.io/v1") 
      .setProject("68c3ec870024955539b0");

    const account = new Appwrite.Account(client);
    const databases = new Appwrite.Databases(client);

    const databaseId = "68c3f10d002b0dfc0b2d";
    const customersId = "68dbbb760034fb10a518"

    const monthYear = document.getElementById("monthYear").value;
    const plate = document.getElementById("plate").value;
    const company = document.getElementById("company").value;

    let customersDocs;

    if (!plate && !company) {

      alert("Enter a company or a plate number")
      return;
    
    } else if ( plate && !company ) {

      customersDocs = await databases.listDocuments(databaseId, customersId, [Appwrite.Query.equal("plate", plate)]);
    
    } else if ( !plate && company ) {

      customersDocs = await databases.listDocuments(databaseId, customersId, [Appwrite.Query.equal("company", company)]);
    
    } else {

      customersDocs = await databases.listDocuments(databaseId, customersId, [Appwrite.Query.equal("plate", plate), Appwrite.Query.equal("company", company)]);

    }

    
    const doc = customersDocs.documents;

    let output = [];
    let totalCustomerAmount = 0;

    for (let i = 0; i < doc.length; i++) {
      let tempDoc = doc[i];

      totalCustomerAmount += tempDoc.totalAmount;

      output.push({ "N°":  `${i+1}`, "Name": tempDoc.username, "Email": tempDoc.email, "Month/Year": tempDoc.monthYear, "Gain/Loss": tempDoc.gainPayments });
    }

    output.push({ "N°": "", "Name": "", "Email": "", "Month/Year": "Total Gain/Loss:", "Gain/Loss": totalGain });

    const newSheet = XLSX.utils.json_to_sheet(output);
    const newBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newBook, newSheet, "Report");

    XLSX.writeFile(newBook, `Gain/Loss Report ${monthYear}.xlsx`);
    
  } catch (error) {
    alert("Error:",error)
    console.log("error:",error);
    
  }

}


window.downloadGain = downloadGain;

async function displayGain() {
    try {
        const client = new Appwrite.Client()
        .setEndpoint("https://cloud.appwrite.io/v1") 
        .setProject("68c3ec870024955539b0");

        const account = new Appwrite.Account(client);
        const databases = new Appwrite.Databases(client);

        const databaseId = "68c3f10d002b0dfc0b2d";
        const gainPompisteId = "68dbbb760034fb10a518"

        const monthYear = document.getElementById("monthYear").value;

        const gainDocs = await databases.listDocuments(databaseId, gainPompisteId, [Appwrite.Query.equal("monthYear", monthYear)]);
        const doc = gainDocs.documents;
        let totalGain = 0;

        if (doc.length === 0) {
            alert("No documents found in that month")
            return
        }

        for (let i = 0; i < doc.length; i++) {

            const tempDoc = doc[i];

            totalGain += tempDoc.gainPayments;
            
            document.getElementById(`email${i}`).textContent = tempDoc.email;
            document.getElementById(`gainPayments${i}`).textContent = tempDoc.gainPayments;
            document.getElementById(`monthYear${i}`).textContent = tempDoc.monthYear;
            document.getElementById(`username${i}`).textContent = tempDoc.username;
            
        }

        document.getElementById(`totalGain`).textContent = totalGain;

        
    } catch (error) {
        console.log("Error at the display gain:",error);
        
    }
}


window.displayGain = displayGain;