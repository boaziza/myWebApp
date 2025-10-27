let initialPms, initialAgo;
let receivedPms, receivedAgo, physicalStockPms;
let physicalStockAgo, theoryStockPms, theoryStockAgo;
let gainFuelPms, gainFuelAgo;

async function stock(event) {
    const btn = event.currentTarget;   
    const originalText = btn.textContent;

    btn.disabled = true;
    btn.textContent = "Loading..."; 
   
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
     
    if (!logDate) {
        alert("Enter a date to continue");
        return;
    }

    const user = await account.get();    
    const response = await databases.listDocuments(databaseId, situationId,[ Appwrite.Query.equal("logDate", logDate) ]);

    if (response.documents.length > 0) {
      const doc = response.documents[0]; 

      venteLitresAgo = parseInt(doc.venteLitresAgo, 10);
      venteLitresPms = parseInt(doc.venteLitresPms, 10);
    }
  } catch (err) {
    console.error("Error fetching:", err);
  } finally {

        btn.disabled = false;
        btn.textContent = originalText;
        
    }

    initialPms = parseInt(document.getElementById("initialPms").value);
    initialAgo = parseInt(document.getElementById("initialAgo").value);
    receivedPms = parseInt(document.getElementById("receivedPms").value) || 0;
    receivedAgo = parseInt(document.getElementById("receivedAgo").value) || 0;
    physicalStockPms = parseInt(document.getElementById("physicalStockPms").value);
    physicalStockAgo = parseInt(document.getElementById("physicalStockAgo").value);

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

async function storeStock(event) {
    const client = new Appwrite.Client()
        .setEndpoint("https://cloud.appwrite.io/v1") 
        .setProject("68c3ec870024955539b0");

    const account = new Appwrite.Account(client);
    const databases = new Appwrite.Databases(client);

    const databaseId = "68c3f10d002b0dfc0b2d";
    const stockAgoId = "68cbf2bb0017a7b210b1";
    const stockPmsId = "68cd197e002096e31ed8";
    const situationId = "68cd6b7f00330a840d96";

    const btn = event.currentTarget;   
    const originalText = btn.textContent;

    btn.disabled = true;
    btn.textContent = "Loading..."; 
   
    
    try {
        
        const user = await account.get();
        console.log("Logged in as:", user.email);
        const email = user.email;

        const dataAgo = {
            initialAgo,
            receivedAgo,
            venteLitresAgo,
            physicalStockAgo,
            theoryStockAgo,
            gainFuelAgo,
            email,
            logDate, 
        };

        const dataPms = {
            initialPms,
            receivedPms,
            venteLitresPms,
            physicalStockPms,
            theoryStockPms,
            gainFuelPms,
            email,
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
    } finally {

        btn.disabled = false;
        btn.textContent = originalText;
        
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
        alert("Error updating:", error);
    } finally {

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
        filename:     "Stock "+logDate + ".pdf",
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
