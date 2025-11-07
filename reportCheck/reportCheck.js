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

let totalVente;
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

          const loans = JSON.parse(tempDoc.loans || "[]");
          const fiche = JSON.parse(tempDoc.fiche || "[]");                    

          if (loans.every(loan => loan.company === "Versement")) {
            document.getElementById(`versement${i}`).textContent = loans.map(loan => `${loan.amount}`);
            continue;
          }
          

             

          document.getElementById(`username${i}`).textContent = tempDoc.username;
          document.getElementById(`totalVente${i}`).textContent = tempDoc.totalVente;
          document.getElementById(`totalPayments${i}`).textContent = tempDoc.totalPayments;
          document.getElementById(`totalCash${i}`).textContent = tempDoc.totalCash;
          document.getElementById(`momo${i}`).textContent = tempDoc.momo;
          document.getElementById(`momoLoss${i}`).textContent = tempDoc.momoLoss;
          document.getElementById(`totalSFC${i}`).textContent = tempDoc.totalSFC;
          document.getElementById(`totalBC${i}`).textContent = tempDoc.totalBC;
          document.getElementById(`fiche${i}`).textContent = fiche.map(item => `${item.company}: ${item.amount}`).join(", ") || "0";
          document.getElementById(`totalFiche${i}`).textContent = tempDoc.totalFiche;
          document.getElementById(`loans${i}`).textContent = loans.map(loan => `${loan.company}: ${loan.amount}`).join(", ") || "0";
          document.getElementById(`totalLoans${i}`).textContent = tempDoc.totalLoans || "0";
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

function download(event) {
    const btn = event.currentTarget;   
    const originalText = btn.textContent;

    btn.disabled = true;
    btn.textContent = "Loading..."; 
   
    try {
        // Ensure data is up to date
        // If your displayDetails() fetches/fills data, call it here or make sure it's already run
        // displayDetails();

        // Choose the section to export: body, main, or a wrapper

        const logDate = document.getElementById("logDate").value;
        // const email = document.getElementById("email").value;

        const element = document.body;

        const opt = {
        margin:       0.4,
        filename:     "Daily Report "+logDate + ".pdf",
        image:        { type: "jpeg", quality: 0.98 },
        html2canvas:  { scale: 4, useCORS: true, scrollY: 0 },        
        jsPDF:        { unit: "px", format: [element.scrollWidth, element.scrollHeight], orientation: "portrait" },
        pagebreak:    { mode: ['css', 'legacy'] } 
        };

        html2pdf().set(opt).from(element).save();

    } catch (error) {
        console.log("This is the error ", error);
        
    } finally {

        btn.disabled = false;
        btn.textContent = originalText;
        
    }
}

window.download = download;