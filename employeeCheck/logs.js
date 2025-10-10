import { setField } from "../utils/utils.js";

let logDate, email;


export async function displayDetails() {
    const client = new Appwrite.Client()
        .setEndpoint("https://cloud.appwrite.io/v1") 
        .setProject("68c3ec870024955539b0");

    const account = new Appwrite.Account(client);
    const databases = new Appwrite.Databases(client);

    const databaseId = "68c3f10d002b0dfc0b2d";
    const indexId = "68cd1987002bae34ea4b";
    const paymentsId = "68cd19990006cbb33843";    

    logDate = document.getElementById("logDate").value;
    email = document.getElementById("email").value;

    if (!logDate && !email) {
        return alert("Choose a date and an employee")
    }

    

    try {
        const responseIndex = await databases.listDocuments(databaseId, indexId, [Appwrite.Query.equal("logDate", logDate)]);
        console.log("Here are the dates", responseIndex);

        for (let i = 0; i < responseIndex.documents.length; i++) {
            const doc = responseIndex.documents[i];

            if ( doc.email === email ) {
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
                document.getElementById("totalVente").textContent = doc.totalVente || "0";
                document.getElementById("venteLitresAgo").textContent = (doc.venteLitresAgo).toFixed(2) || "0";
                document.getElementById("venteLitresPms").textContent = (doc.venteLitresPms).toFixed(2) || "0";

                document.getElementById("p1_essence").textContent = (doc.pms2 - doc.pms1).toFixed(2) || "0";
                document.getElementById("p2_essence").textContent = (doc.pms4 - doc.pms3).toFixed(2) || "0";
                document.getElementById("p3_gasoil").textContent = (doc.pms2 - doc.pms1).toFixed(2) || "0";
                document.getElementById("p4_gasoil").textContent = (doc.pms4 - doc.pms3).toFixed(2) || "0";

                
                document.getElementById("pmsPrices").textContent = doc.pmsPrice || "0";
                document.getElementById("agoPrices").textContent = doc.agoPrice || "0";

            } 
            
        }



        const responsePayments = await databases.listDocuments(databaseId, paymentsId, [Appwrite.Query.equal("logDate", logDate)]);

        for (let i = 0; i < responsePayments.documents.length; i++) {
            const doc = responsePayments.documents[i];

            if ( doc.email === email ) {
                const fields = [
                    "momo","momoLoss","fiche","totalSFC","totalBC","listSFC","listBC",
                    "totalCash","totalPayments","gainPayments"
                ];

                fields.forEach(f => setField(f, doc[f]));
            } 
            
        }

    } catch (error) {
        console.log("Error is this", error);        
    }

}

window.displayDetails = displayDetails;