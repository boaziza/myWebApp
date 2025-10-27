async function fetchSituation(event) {
  const client = new Appwrite.Client()
        .setEndpoint("https://cloud.appwrite.io/v1") 
        .setProject("68c3ec870024955539b0");

    const account = new Appwrite.Account(client);
    const databases = new Appwrite.Databases(client);

    const databaseId = "68c3f10d002b0dfc0b2d";
    const situationId = "68cd6b7f00330a840d96";
    const btn = event.currentTarget;   
    const originalText = btn.textContent;

    btn.disabled = true;
    btn.textContent = "Loading..."; 
  
    try {

        const logDate = document.getElementById("logDate").value;
        const response = await databases.listDocuments(databaseId, situationId, [Appwrite.Query.equal("logDate", logDate)]);

        if (response.documents.length > 0) {
            const doc = response.documents[0]; 

            document.getElementById("receivedAgo").textContent = doc.receivedAgo || "0";
            document.getElementById("receivedPms").textContent = doc.receivedPms || "0";
            document.getElementById("initialPms").textContent = doc.initialPms || "0";
            document.getElementById("initialAgo").textContent = doc.initialAgo || "0";
            document.getElementById("physicalStockAgo").textContent = doc.physicalStockAgo || "0";
            document.getElementById("physicalStockPms").textContent = doc.physicalStockPms || "0";
            document.getElementById("theoryStockAgo").textContent = doc.theoryStockAgo || "0";
            document.getElementById("theoryStockPms").textContent = doc.theoryStockPms || "0";
            document.getElementById("gainFuelAgo").textContent = doc.gainFuelAgo || "0";
            document.getElementById("gainFuelPms").textContent = doc.gainFuelPms || "0";
            document.getElementById("momo").textContent = doc.momo || "0";
            document.getElementById("momoLoss").textContent = doc.momoLoss || "0";
            document.getElementById("fiche").textContent = doc.fiche || "0";
            document.getElementById("bon").textContent = doc.bon || "0";
            document.getElementById("totalSFC").textContent = doc.totalSFC || "0";
            document.getElementById("totalBC").textContent = doc.totalBC || "0";
            document.getElementById("totalCash").textContent = doc.totalCash || "0";
            document.getElementById("totalPayments").textContent = doc.totalPayments || "0";
            document.getElementById("gainPayments").textContent = -Number(doc.gainPayments) || "0";
            document.getElementById("pms1").textContent = doc.pms1 || "0";
            document.getElementById("pms2").textContent = doc.pms2 || "0";
            document.getElementById("pms3").textContent = doc.pms3 || "0";
            document.getElementById("pms4").textContent = doc.pms4 || "0";
            document.getElementById("ago1").textContent = doc.ago1 || "0";
            document.getElementById("ago2").textContent = doc.ago2 || "0";
            document.getElementById("ago3").textContent = doc.ago3 || "0";
            document.getElementById("ago4").textContent = doc.ago4 || "0";
            document.getElementById("pmsPrice").textContent = doc.pmsPrice || "0";
            document.getElementById("agoPrice").textContent = doc.agoPrice || "0";
            document.getElementById("totalAgo").textContent = doc.totalAgo || "0";
            document.getElementById("totalPms").textContent = doc.totalPms || "0";
            document.getElementById("totalVente").textContent = -Number(doc.totalVente) || "0";
            document.getElementById("venteLitresAgo").textContent = (doc.venteLitresAgo).toFixed(2) || "0";
            document.getElementById("venteLitresPms").textContent = (doc.venteLitresPms).toFixed(2) || "0";
            document.getElementById("done").textContent = doc.done || false;

            if (doc.done === true) {            
                document.getElementById("p1_essence").textContent = (doc.pms2 - doc.pms1).toFixed(2) || "0";
                document.getElementById("p2_essence").textContent = (doc.pms4 - doc.pms3).toFixed(2) || "0";
                document.getElementById("p3_gasoil").textContent = (doc.pms2 - doc.pms1).toFixed(2) || "0";
                document.getElementById("p4_gasoil").textContent = (doc.pms4 - doc.pms3).toFixed(2) || "0";
            }
            
            document.getElementById("pmsPrices").textContent = doc.pmsPrice || "0";
            document.getElementById("agoPrices").textContent = doc.agoPrice || "0";
        } else {
        console.log("No documents found for date:", logDate);
        }

        alert("Data fetched successfully");

    } catch (err) {
        console.error("Error fetching:", err);
    }  finally {

        btn.disabled = false;
        btn.textContent = originalText;

    }
}

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
        filename:     "Situation "+logDate + ".pdf",
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
