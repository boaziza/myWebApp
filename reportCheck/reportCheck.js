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

      output.push({ "N°":  `${i+1}`, "Name": tempDoc.employee, "Email": tempDoc.email, "Month/Year": tempDoc.monthYear, "Gain/Loss": tempDoc.gainPayments });
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
async function displayReport(event) {
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
        const paymentsId = "68cd19990006cbb33843";
        const gainPompisteId = "68dbbb760034fb10a518";

        const logDate = document.getElementById("logDate").value;

        const paymentsDocuments = await databases.listDocuments(databaseId, paymentsId, [Appwrite.Query.equal("logDate", logDate)]);
        
        const doc = paymentsDocuments.documents;

        let totalGainPayments = 0;

        function clearSheetTable() {
            // Select the main container
            const sheet = document.querySelector("main.sheet");
            if (!sheet) return;

            // Select all span elements inside tables in the sheet
            const spans = sheet.querySelectorAll("table span");
            
            // Clear each span's content
            spans.forEach(span => span.textContent = "");
        }

        // Call the function
        clearSheetTable();

        if (doc.length === 0 ) {
            alert("No documents found in that month")
            return
        }

        for (let i = 0; i < doc.length; i++) {

          let versement = 0;

          const tempDoc = doc[i];

          totalGainPayments += tempDoc.gainPayments;

          const loans = JSON.parse(tempDoc.loans || "[]");
          const fiche = JSON.parse(tempDoc.fiche || "[]");  

          document.getElementById(`employee${i}`).textContent = tempDoc.employee;
          document.getElementById(`totalVente${i}`).textContent = tempDoc.totalVente;
          document.getElementById(`totalPayments${i}`).textContent = tempDoc.totalPayments;
          document.getElementById(`totalCash${i}`).textContent = tempDoc.totalCash;
          document.getElementById(`momo${i}`).textContent = tempDoc.momo;
          document.getElementById(`momoLoss${i}`).textContent = tempDoc.momoLoss;
          document.getElementById(`spFuelCard${i}`).textContent = tempDoc.spFuelCard;
          document.getElementById(`bankCard${i}`).textContent = tempDoc.bankCard;
          document.getElementById(`fiche${i}`).textContent = fiche.reduce((sum, item) => sum + Number(item.amount || 0), 0);
          document.getElementById(`gainPayments${i}`).textContent = tempDoc.gainPayments;                    

          if (loans.some(loan => loan.company === "Versement")) {
            versement = loans
            .filter(loan => loan.company === "Versement")
            .reduce((sum, item) => sum + Number(item.amount || 0), 0);
            document.getElementById(`versement${i}`).textContent = versement
            document.getElementById(`loans${i}`).textContent = "0";
          } else { 
            document.getElementById(`versement${i}`).textContent = "0"
          }

          document.getElementById(`loans${i}`).textContent = (loans.reduce((sum, item) => sum + Number(item.amount || 0), 0)) - versement;
          
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