


let totalVente,pms1,pms2,pms3,pms4,ago1,ago2,ago3,ago4;
let venteLitresPms, totalPms, venteLitresAgo, totalAgo;
let pmsPrice, agoPrice, logDate, shift, dateBefore;

async function calculateIndex() {
    const client = new Appwrite.Client()
        .setEndpoint("https://cloud.appwrite.io/v1") 
        .setProject("68c3ec870024955539b0");

    const account = new Appwrite.Account(client);
    const databases = new Appwrite.Databases(client);

    const databaseId = "68c3f10d002b0dfc0b2d";
    const indexId = "68cd1987002bae34ea4b";


    pmsPrice = parseInt(document.getElementById("pmsPrice").textContent.replace(/[^\d]/g, ''), 10) || 1862;
    agoPrice = parseInt(document.getElementById("agoPrice").textContent.replace(/[^\d]/g, ''), 10) || 1808;

    pms1 =Number(document.getElementById("pms1").value);
    pms2 =Number(document.getElementById("pms2").value);
    pms3 =Number(document.getElementById("pms3").value);
    pms4 =Number(document.getElementById("pms4").value);
    ago1 =Number(document.getElementById("ago1").value);
    ago2 =Number(document.getElementById("ago2").value);
    ago3 =Number(document.getElementById("ago3").value);
    ago4 =Number(document.getElementById("ago4").value);
    logDate= document.getElementById("logDate").value;
    shift = document.getElementById("shift").value;

    venteLitresPms = (pms2 - pms1) + (pms4 - pms3);
    totalPms = venteLitresPms*pmsPrice;

    venteLitresAgo = (ago2 - ago1) + (ago4 - ago3);
    totalAgo = venteLitresAgo*agoPrice;

    totalVente = totalAgo + totalPms;

    document.getElementById("resultpms").textContent = totalPms;
    document.getElementById("resultago").textContent = totalAgo;
    document.getElementById("result").textContent = totalVente;

    try {
        
        function getDayBefore() {

            if (!logDate) return alert("Select a date!");

            const selectedDate = new Date(logDate);
            selectedDate.setDate(selectedDate.getDate() - 1);
            
            const mm = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const dd = String(selectedDate.getDate()).padStart(2, '0');
            const yyyy = selectedDate.getFullYear();

            dateBefore = `${mm}/${dd}/${yyyy}`;

        }

        getDayBefore();

        let match = false;

        
        const response = await databases.listDocuments(databaseId, indexId, [Appwrite.Query.equal("logDate", logDate)]);

        for (let i = 0; i < response.documents.length; i++) {

            const doc = response.documents[i];

            if ( pms1 === doc.pms2 && pms3 === doc.pms4 && ago1 === doc.ago2 && ago3 === doc.ago4) {
                match = true;
            } 
            
        }

        if (match === false) {
            
            const beforeResponse = await databases.listDocuments(databaseId, indexId, [Appwrite.Query.equal("logDate", dateBefore)]);

            for (let i = 0; i < beforeResponse.documents.length; i++) {

                const doc = beforeResponse.documents[i];

                if ( pms1 === doc.pms2 && pms3 === doc.pms4 && ago1 === doc.ago2 && ago3 === doc.ago4) {
                    match = true;
                } 
                
            } 

        } else {
            alert("All index match") 
            }

        if (match === false) {

            alert("Check index, they do not match.")
        }

    } catch (error) {
        console.log("The error is ", error);
        
    }

}

let momo, momoLoss, terminal, fiche,spFuelCard, bankCard;
let cash5000, cash2000, cash1000, cash500;
let totalCash, totalPayments, gainPayments;

function payments() {

    momo = Number(document.getElementById("momo").value);
    momoLoss = Number(document.getElementById("momoLoss").value);
    terminal = Number(document.getElementById("terminal").value);
    fiche = Number(document.getElementById("fiche").value);
    spFuelCard = Number(document.getElementById("spFuelCard").value);
    bankCard = Number(document.getElementById("bankCard").value);
    cash5000 = Number(document.getElementById("5000").value);
    cash2000 = Number(document.getElementById("2000").value);
    cash1000 = Number(document.getElementById("1000").value);
    cash500 = Number(document.getElementById("500").value);
    logDate= document.getElementById("logDate").value;
    shift = document.getElementById("shift").value;


    totalCash = (cash5000*5000) + (cash2000*2000) + (cash1000*1000) + (cash500*500);
    totalPayments = momo+ momoLoss + terminal + fiche + spFuelCard + bankCard + totalCash ;
    gainPayments = totalPayments - totalVente;

    document.getElementById("totalPayments").textContent = totalPayments;  
    document.getElementById("gainPayments").textContent = gainPayments;
    document.getElementById("totalCash").textContent = totalCash;
}

let dataSituation; 
async function situation() {
    const client = new Appwrite.Client()
        .setEndpoint("https://cloud.appwrite.io/v1") 
        .setProject("68c3ec870024955539b0");

    const account = new Appwrite.Account(client);
    const databases = new Appwrite.Databases(client);

    const databaseId = "68c3f10d002b0dfc0b2d";
    const indexId = "68cd1987002bae34ea4b";
    const paymentsId = "68cd19990006cbb33843";
    const situationId = "68cd6b7f00330a840d96";
    const employeeLogsId = "68c82cf90024f35d491a";

    try {
        
        const user = await account.get();
        console.log("Logged in as:", user.email);
        // const responsei = await databases.listDocuments(databaseId, employeeLogsId, [Appwrite.Query.equal("emailAddress", user.email)]);

        const dataIndex = {
            venteLitresPms, 
            totalPms, 
            venteLitresAgo, 
            totalAgo,
            totalVente,
            pms1,
            pms2,
            pms3,
            pms4,
            ago1,
            ago2,
            ago3,
            ago4,
            pmsPrice,
            agoPrice,
            logDate,
            shift,
        };

        const dataPayments = {
            momo, 
            momoLoss, 
            terminal, 
            fiche, 
            spFuelCard,
            bankCard,
            cash5000, 
            cash2000, 
            cash1000, 
            cash500,
            totalCash, 
            totalPayments, 
            gainPayments,
            logDate,
            shift,
        };

        const response = await databases.listDocuments(databaseId, situationId, [Appwrite.Query.equal("logDate", logDate)]);

        if (shift === "Morning" ) {
            dataSituation = {
                momo, 
                momoLoss, 
                terminal, 
                fiche, 
                spFuelCard,
                bankCard,
                totalCash, 
                totalPayments, 
                gainPayments,
                venteLitresPms, 
                totalPms, 
                venteLitresAgo, 
                totalAgo,
                totalVente,
                pms1,
                pms3,
                ago1,
                ago3,
                pmsPrice,
                agoPrice,
                logDate,
            };

            await databases.createDocument(
                databaseId,
                situationId,
                "unique()", // Appwrite generates an ID
                dataSituation
            )

        } else if (shift === "Afternoon") {
            const doc = response.documents[0];

            const docId = doc.$id;

            momo += doc.momo;
            momoLoss += doc.momoLoss;
            terminal += doc.terminal;
            fiche += doc.fiche;
            spFuelCard += doc.spFuelCard;
            bankCard += doc.bankCard;
            totalCash += doc.totalCash;
            totalPayments += doc.totalPayments;
            gainPayments += doc.gainPayments;
            venteLitresPms += doc.venteLitresPms;
            totalPms += doc.totalPms;
            venteLitresAgo += doc.venteLitresAgo;
            totalAgo += doc.totalAgo;
            totalVente += doc.totalVente;
            
            dataSituation = {
                momo, 
                momoLoss, 
                terminal, 
                fiche,
                spFuelCard, 
                bankCard,
                totalCash, 
                totalPayments, 
                gainPayments,
                venteLitresPms, 
                totalPms, 
                venteLitresAgo, 
                totalAgo,
                totalVente,
            }

            const updated = await databases.updateDocument(
            databaseId,
            situationId,
            docId,
            dataSituation)
            
        } else if(shift === "Evening"){
            const doc = response.documents[0];

            const docId = doc.$id;
            const done = true;

            momo += doc.momo;
            momoLoss += doc.momoLoss;
            terminal += doc.terminal;
            fiche += doc.fiche;
            spFuelCard += doc.spFuelCard;
            bankCard += doc.bankCard;
            totalCash += doc.totalCash;
            totalPayments += doc.totalPayments;
            gainPayments += doc.gainPayments;
            venteLitresPms += doc.venteLitresPms;
            totalPms += doc.totalPms;
            venteLitresAgo += doc.venteLitresAgo;
            totalAgo += doc.totalAgo;
            totalVente += doc.totalVente;
            
            dataSituation = {
                momo, 
                momoLoss, 
                terminal, 
                fiche, 
                spFuelCard,
                bankCard,
                totalCash, 
                totalPayments, 
                gainPayments,
                venteLitresPms, 
                totalPms, 
                venteLitresAgo, 
                totalAgo,
                totalVente,
                pms2,
                pms4,
                ago2,
                ago4,
                done,
            }

            const updated = await databases.updateDocument(
            databaseId,
            situationId,
            docId,
            dataSituation)
            
        }
        
        
        

        await databases.createDocument(
            databaseId,
            indexId,
            "unique()", // Appwrite generates an ID
            dataIndex
        );

        await databases.createDocument(
            databaseId,
            paymentsId,
            "unique()", // Appwrite generates an ID
            dataPayments
        );

        alert("Data saved successfully"); 

        function clearOutputs() {

            const outputs = document.querySelectorAll(".output");
            outputs.forEach(el => {
                el.textContent = "0";
            });
        }

        clearOutputs();
        
        document.getElementById("rapportForm").reset();
        document.getElementById("paymentsForm").reset();

    } catch (err) {
        console.error("Error:", err.message);

        // If user is not logged in, redirect them to login
        if (err.message.includes("Unauthorized")) {
            alert("You must log in first!");
            // window.location.href = "/sign-in/sign-in.html";
        } else {
            alert("Error: " + err.message);
        }
    }
    
}

let initialPms, initialAgo;
let receivedPms, receivedAgo, physicalStockPms;
let physicalStockAgo, theoryStockPms, theoryStockAgo;
let gainFuelPms, gainFuelAgo;

async function stock() {
    const client = new Appwrite.Client()
        .setEndpoint("https://cloud.appwrite.io/v1") 
        .setProject("68c3ec870024955539b0");

    const account = new Appwrite.Account(client);
    const databases = new Appwrite.Databases(client);

    const databaseId = "68c3f10d002b0dfc0b2d";
    const indexId = "68cd1987002bae34ea4b";
    const situationId = "68cd6b7f00330a840d96";

  try {

    
    logDate = document.getElementById("logDate").value;
        
    const user = await account.get();    
    const response = await databases.listDocuments(databaseId, situationId,[ Appwrite.Query.equal("logDate", logDate) ]);

    if (response.documents.length > 0) {
      const doc = response.documents[0]; 

      venteLitresAgo = doc.venteLitresAgo;
      venteLitresPms = doc.venteLitresPms;
    }
  } catch (err) {
    console.error("Error fetching:", err);
  }

    initialPms = Number(document.getElementById("initialPms").value);
    initialAgo = Number(document.getElementById("initialAgo").value);
    receivedPms = Number(document.getElementById("receivedPms").value);
    receivedAgo = Number(document.getElementById("receivedAgo").value);
    physicalStockPms = Number(document.getElementById("physicalStockPms").value);
    physicalStockAgo = Number(document.getElementById("physicalStockAgo").value);

    theoryStockPms = initialPms + receivedPms - venteLitresPms ;
    theoryStockAgo = initialAgo + receivedAgo - venteLitresAgo ;

    gainFuelPms = physicalStockPms - theoryStockPms ;
    gainFuelAgo = physicalStockAgo - theoryStockAgo ;

    document.getElementById("theoryStockPms").textContent = theoryStockPms;
    document.getElementById("theoryStockAgo").textContent = theoryStockAgo;
    document.getElementById("gainFuelPms").textContent = gainFuelPms;
    document.getElementById("gainFuelAgo").textContent = gainFuelAgo;
    document.getElementById("venteLitresPms").textContent = venteLitresPms;
    document.getElementById("venteLitresAgo").textContent = venteLitresAgo;
    
}

async function storeStock() {
    const client = new Appwrite.Client()
        .setEndpoint("https://cloud.appwrite.io/v1") 
        .setProject("68c3ec870024955539b0");

    const account = new Appwrite.Account(client);
    const databases = new Appwrite.Databases(client);

    const databaseId = "68c3f10d002b0dfc0b2d";
    const stockAgoId = "68cbf2bb0017a7b210b1";
    const stockPmsId = "68cd197e002096e31ed8";
    const situationId = "68cd6b7f00330a840d96";

    
    try {
        
        const user = await account.get();
        console.log("Logged in as:", user.email);

        const dataAgo = {
            initialAgo,
            receivedAgo,
            venteLitresAgo,
            physicalStockAgo,
            theoryStockAgo,
            gainFuelAgo,
            logDate, 
        };

        const dataPms = {
            initialPms,
            receivedPms,
            venteLitresPms,
            physicalStockPms,
            theoryStockPms,
            gainFuelPms,
            logDate,  
        };

        const res = await databases.listDocuments(databaseId,stockAgoId);
        console.log(res);
        

        await databases.createDocument(
        databaseId,
        stockAgoId,
        "unique()", // Appwrite generates an ID
        dataAgo
        );

        await databases.createDocument(
        databaseId,
        stockPmsId,
        "unique()", // Appwrite generates an ID
        dataPms
        );

        alert("Data saved successfully");

        function clearOutputs() {

            const outputs = document.querySelectorAll(".output");
            outputs.forEach(el => {
                el.textContent = "0";
            });
        }

        clearOutputs();
        
        document.getElementById("stockForm").reset();

    } catch (err) {
      console.error("Error:", err.message);
      alert("Error: " + err.message);
    }

    try {
        // 1. Find the document by attribute
        const docs = await databases.listDocuments(
            databaseId,
            situationId,
            [ Appwrite.Query.equal("logDate", logDate) ] // filter by your known attribute
        );

        if (docs.total === 0) {
            console.log("No document found!");
            return;
        }

        const docId = docs.documents[0].$id; // get the first match

        // 2. Update the null fields
        const updated = await databases.updateDocument(
            databaseId,
            situationId,
            docId,
            {
                initialAgo: initialAgo,
                receivedAgo: receivedAgo,
                physicalStockAgo: physicalStockAgo,
                theoryStockAgo: theoryStockAgo,
                gainFuelAgo: gainFuelAgo,
                initialPms: initialPms,
                receivedPms: receivedPms,
                physicalStockPms: physicalStockPms,
                theoryStockPms: theoryStockPms,
                gainFuelPms: gainFuelPms,
            }
        );

        console.log("Updated document:", updated);

        alert("Data saved successfully");

    } catch (error) {
        console.error("Error updating:", error);
    }

}

function welcomeMessage() {
    const client = new Appwrite.Client()
        .setEndpoint("https://cloud.appwrite.io/v1") 
        .setProject("68c3ec870024955539b0");

    const account = new Appwrite.Account(client);

    // ✅ Check if user is logged in
    account.get()
    .then(user => {
        console.log("User is logged in:", user);
    })
    .catch(err => {
        console.warn("Not logged in, redirecting...");
        window.location.replace("../myWebApp/sign-in/sign-in.html"); // 👈 change to your login page path
    });

    async function showUser() {
        try {
            const user = await account.get();
            const username = user.name || user.email;

            // Insert into the HTML
            document.getElementById("welcomeMessage").textContent = "Welcome back, " + username;
        } catch {
            // If not logged in, send back to sign in
            window.location.replace("../myWebApp/sign-in/sign-in.html");
        }
    }
    showUser();
}

async function fetchSituation() {
  const client = new Appwrite.Client()
        .setEndpoint("https://cloud.appwrite.io/v1") 
        .setProject("68c3ec870024955539b0");

    const account = new Appwrite.Account(client);
    const databases = new Appwrite.Databases(client);

    const databaseId = "68c3f10d002b0dfc0b2d";
    const situationId = "68cd6b7f00330a840d96";

  try {

    const logDate = document.getElementById("logDate").value;     
    const user = await account.get();    
    const response = await databases.listDocuments(databaseId, situationId, [Appwrite.Query.equal("logDate", logDate)]);

    if (response.documents.length > 0) {
      const doc = response.documents[0]; 

      document.getElementById("receivedAgo").textContent = doc.receivedAgo || "N/A";
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
      document.getElementById("terminal").textContent = doc.terminal || "0";
      document.getElementById("fiche").textContent = doc.fiche || "0";
      document.getElementById("spFuelCard").textContent = doc.spFuelCard || "0";
      document.getElementById("bankCard").textContent = doc.bankCard || "0";
      document.getElementById("totalCash").textContent = doc.totalCash || "0";
      document.getElementById("totalPayments").textContent = doc.totalPayments || "0";
      document.getElementById("gainPayments").textContent = doc.gainPayments || "0";
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
      document.getElementById("venteLitresAgo").textContent = doc.venteLitresAgo || "0";
      document.getElementById("venteLitresPms").textContent = doc.venteLitresPms || "0";
      document.getElementById("done").textContent = doc.done || false;
    } else {
      console.log("No documents found for date:", logDate);
    }

    alert("Data fetched successfully");

  } catch (err) {
    console.error("Error fetching:", err);
  }
}

