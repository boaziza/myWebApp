let totalVente,pms1,pms2,pms3,pms4,ago1,ago2,ago3,ago4;
let venteLitresPms, totalPms, venteLitresAgo, totalAgo;
let pmsPrice, agoPrice, logDate, shift;

async function calculateIndex(event) {
    const client = new Appwrite.Client()
        .setEndpoint("https://cloud.appwrite.io/v1") 
        .setProject("68c3ec870024955539b0");

    const account = new Appwrite.Account(client);
    const databases = new Appwrite.Databases(client);

    const databaseId = "68c3f10d002b0dfc0b2d";
    const indexId = "68cd1987002bae34ea4b";

    const btn = event.currentTarget;   
    const originalText = btn.textContent;

    btn.disabled = true;
    btn.textContent = "Loading...";


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
    totalPms = parseInt(venteLitresPms*pmsPrice, 10);

    venteLitresAgo = (ago2 - ago1) + (ago4 - ago3);
    totalAgo = parseInt(venteLitresAgo*agoPrice, 10);

    totalVente = totalAgo + totalPms;

    document.getElementById("resultpms").textContent = totalPms;
    document.getElementById("resultago").textContent = totalAgo;
    document.getElementById("result").textContent = totalVente;

    try {
        
        async function getDayBefore(logDate) {

            if (!logDate) return alert("Select a date!");

            const selectedDate = new Date(logDate);
            selectedDate.setDate(selectedDate.getDate() - 1);
            
            const mm = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const dd = String(selectedDate.getDate()).padStart(2, '0');
            const yyyy = selectedDate.getFullYear();

            return `${mm}/${dd}/${yyyy}`;

        }

        const dateBefore = await getDayBefore(logDate);

        let match = false;

        
        const response = await databases.listDocuments(databaseId, indexId, [Appwrite.Query.equal("logDate", logDate)]);

        for (let i = 0; i < response.documents.length; i++) {

            const doc = response.documents[i];

            if ( pms1 === doc.pms2 && pms3 === doc.pms4 || ago1 === doc.ago2 && ago3 === doc.ago4) {
                match = true;
            } 
            
        }

        if (match === false) {
            
            const beforeResponse = await databases.listDocuments(databaseId, indexId, [Appwrite.Query.equal("logDate", dateBefore)]);

            for (let i = 0; i < beforeResponse.documents.length; i++) {

                const doc = beforeResponse.documents[i];

                if ( pms1 === doc.pms2 && pms3 === doc.pms4 && doc.shift === "Evening" || ago1 === doc.ago2 && ago3 === doc.ago4 && doc.shift === "Evening") {
                    match = true;
                } 
                
            } 

        } 

        if (match) {
            alert("All index match")
        } else {
            alert("Check Index they do not match")
        }

    } catch (error) {
        console.log("The error is ", error);
        
    } finally {

        btn.disabled = false;
        btn.textContent = originalText;
        
    }

}

let momo, momoLoss, fiche, bon, spFuelCard, bankCard;
let cash5000, cash2000, cash1000, cash500, totalBC, totalSFC;
let totalCash, totalPayments, gainPayments, listBC, listSFC, totalLoans;

async function payments(event) {
    
    const btn = event.currentTarget;   
    const originalText = btn.textContent;

    btn.disabled = true;
    btn.textContent = "Loading..."; 

    try {
        
    
        momo = Number(document.getElementById("momo").value);
        momoLoss = Number(document.getElementById("momoLoss").value);
        fiche = Number(document.getElementById("fiche").value);
        bon = Number(document.getElementById("bon").value);
        spFuelCard = document.getElementById("spFuelCard").value;
        bankCard = document.getElementById("bankCard").value;
        cash5000 = Number(document.getElementById("5000").value);
        cash2000 = Number(document.getElementById("2000").value);
        cash1000 = Number(document.getElementById("1000").value);
        cash500 = Number(document.getElementById("500").value);
        logDate= document.getElementById("logDate").value;
        shift = document.getElementById("shift").value;

        listSFC = spFuelCard.split(",").map(v => parseInt(v.trim())).filter(v => !isNaN(v));
        listBC =  bankCard.split(",").map(v => parseInt(v.trim())).filter(v => !isNaN(v));

        totalSFC = listSFC.reduce((sum,n) => sum + n, 0);
        totalBC = listBC.reduce((sum,n) => sum + n, 0);

        totalLoans = loans.reduce((sum, loan) => sum + loan.amount, 0);

        totalCash = (cash5000*5000) + (cash2000*2000) + (cash1000*1000) + (cash500*500);
        totalPayments = momo+ momoLoss + fiche + bon + totalSFC + totalBC + totalCash + totalLoans ;
        gainPayments = totalPayments - totalVente;

        
        document.getElementById("totalLoans").textContent = totalLoans;
        document.getElementById("totalPayments").textContent = totalPayments;  
        document.getElementById("gainPayments").textContent = gainPayments;
        document.getElementById("totalCash").textContent = totalCash;
    } catch (error) {
        console.log(error)  
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }

}

let dataSituation; 
async function situation(event) {
    const client = new Appwrite.Client()
        .setEndpoint("https://cloud.appwrite.io/v1") 
        .setProject("68c3ec870024955539b0");

    const account = new Appwrite.Account(client);
    const databases = new Appwrite.Databases(client);

    const databaseId = "68c3f10d002b0dfc0b2d";
    const indexId = "68cd1987002bae34ea4b";
    const paymentsId = "68cd19990006cbb33843";
    const situationId = "68cd6b7f00330a840d96";
    const btn = event.currentTarget;   
    const originalText = btn.textContent;

    btn.disabled = true;
    btn.textContent = "Loading..."; 

    try {
        
        const user = await account.get();
        console.log("Logged in as:", user.email);
        const email = await user.email;
        console.log("Email", email);           
        const username = user.name;

        function generateShiftId(username, logDate) {
            return `${username}_${logDate}_${crypto.randomUUID()}`;
        }

        const id = generateShiftId(username,logDate);

        const selectedDate = new Date(logDate);
        selectedDate.setDate(selectedDate.getDate() - 1);
        
        const mm = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const yyyy = selectedDate.getFullYear();

        const monthYear = `${yyyy}-${mm}`;


        const gainPompisteId = "68dbbb760034fb10a518"
        const gainDocs = await databases.listDocuments(databaseId, gainPompisteId, [Appwrite.Query.equal("email", email)], [Appwrite.Query.equal("monthYear", monthYear)]);
        const doc = gainDocs.documents;     


        if ( doc.length === 0) {

            const newData = {
               username,
               email,
               gainPayments,
               logDate,
               monthYear
            };
            
            await databases.createDocument(
                databaseId,
                gainPompisteId,
                "unique()",
                newData
            );

        } else {

            const docId = doc[0].$id;
            const newGain = gainPayments + doc[0].gainPayments;
            
            console.log("Code",docId);
            
            
            const oldData = {
               username,
               email,
               gainPayments: newGain,
               logDate,
               monthYear
            };

            await databases.updateDocument(
                databaseId,
                gainPompisteId,
                docId,
                oldData
            );
            
        }
        

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
            email,
            logDate,
            shift,
            username,
            id,
        };

        const dataPayments = {
            momo, 
            momoLoss, 
            fiche,
            bon, 
            listBC,
            listSFC,
            totalBC,
            totalSFC,
            cash5000, 
            cash2000, 
            cash1000, 
            cash500,
            totalCash, 
            totalPayments, 
            gainPayments,
            email,
            logDate,
            shift,
            username,
            id,
            loans : JSON.stringify(loans),
            totalLoans
        };

        const response = await databases.listDocuments(databaseId, situationId, [Appwrite.Query.equal("logDate", logDate)]);

        if (shift === "Morning" && response.documents.length === 0 ) {
            dataSituation = {
                momo, 
                momoLoss, 
                fiche, 
                bon,
                totalSFC,
                totalBC,
                totalCash, 
                totalLoans,
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

        } else if ( (shift === "Afternoon" || shift === "Morning") && response.documents.length !== 0) {
            const doc = response.documents[0];

            const docId = doc.$id;

            momo += doc.momo;
            momoLoss += doc.momoLoss;
            fiche += doc.fiche;
            bon += doc.bon;
            totalSFC += doc.totalSFC;
            totalBC += doc.totalBC;
            totalCash += doc.totalCash;
            totalLoans += doc.totalLoans;
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
                fiche,
                bon,
                totalSFC,
                totalBC,
                totalCash, 
                totalLoans,
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
            
        } else if(shift === "Evening" && response.documents.length !== 0 ){
            const doc = response.documents[0];

            const docId = doc.$id;
            const done = true;

            momo += doc.momo;
            momoLoss += doc.momoLoss;
            fiche += doc.fiche;
            bon += doc.bon;
            totalSFC += doc.totalSFC;
            totalBC += doc.totalBC;
            totalCash += doc.totalCash;
            totalLoans += doc.totalLoans;
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
                fiche,
                bon, 
                totalSFC,
                totalBC,
                totalCash, 
                totalLoans,
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

        console.log("monthYear",monthYear);
        

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
    } finally {

        btn.disabled = false;
        btn.textContent = originalText;
        
    }
    
}

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

let loans = [];
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


    loans.push({company,amount});
    
    

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