async function downloadGain(event) {
  const btn = event.currentTarget;   
  const originalText = btn.textContent;

  btn.disabled = true;
  btn.textContent = "Loading..."; 
 
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

    let output = [];
    let totalGain = 0;

    for (let i = 0; i < doc.length; i++) {
      let tempDoc = doc[i];

      totalGain += tempDoc.gainPayments

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
    
  } finally {

    btn.disabled = false;
    btn.textContent = originalText;
      
  }

}


window.downloadGain = downloadGain;

async function displayReport(event) {const btn = event.currentTarget;   
    const originalText = btn.textContent;

    btn.disabled = true;
    btn.textContent = "Loading..."; 
   
    try {
        const client = new Appwrite.Client()
        .setEndpoint("https://cloud.appwrite.io/v1") 
        .setProject("68c3ec870024955539b0");

        const account = new Appwrite.Account(client);
        const databases = new Appwrite.Databases(client);

        const databaseId = "68c3f10d002b0dfc0b2d";
        const paymentsId = "68cd19990006cbb33843";
        const gainPompisteId = "68dbbb760034fb10a518";

        const logDate = document.getElementById("logDate").value;

        const paymentsDocuments = await databases.listDocuments(databaseId, paymentsId, [Appwrite.Query.equal("logDate", logDate)]);

        const doc = paymentsDocuments.documents;

        let totalGainPayments = 0;

        if (doc.length === 0 ) {
            alert("No documents found in that month")
            return
        }

        for (let i = 0; i < doc.length; i++) {

            const tempDoc = doc[i];

            totalGainPayments += tempDoc.gainPayments;

            document.getElementById(`username${i}`).textContent = tempDoc.username;
            document.getElementById(`totalPayments${i}`).textContent = tempDoc.totalPayments;
            document.getElementById(`totalCash${i}`).textContent = tempDoc.totalCash;
            document.getElementById(`momo${i}`).textContent = tempDoc.momo;
            document.getElementById(`momoLoss${i}`).textContent = tempDoc.momoLoss;
            document.getElementById(`totalSFC${i}`).textContent = tempDoc.totalSFC;
            document.getElementById(`totalBC${i}`).textContent = tempDoc.totalBC;
            document.getElementById(`gainPayments${i}`).textContent = tempDoc.gainPayments;
            
        }

        document.getElementById(`totalGainPayments`).textContent = totalGainPayments;

        
    } catch (error) {
        console.log("Error at the display gain:",error);
        
    } finally {

      btn.disabled = false;
      btn.textContent = originalText;
      
    }
}

window.displayReport = displayReport;