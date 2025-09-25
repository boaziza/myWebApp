async function loadFuelPrices() {
    try {
        // Use AllOrigins "raw" endpoint
        const proxy = "https://api.allorigins.win/raw?url=";
        const url = "https://www.globalpetrolprices.com/Rwanda/";
        const response = await fetch(proxy + encodeURIComponent(url));

        if (!response.ok) {
            throw new Error("Network response was not ok: " + response.status);
        }

        // Get the HTML directly
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Select the table rows
        const rows = doc.querySelectorAll("table tbody tr");

        if (rows.length >= 2) {
            const pmsPrice = rows[0].querySelectorAll("td")[1].textContent.trim() + " RWF";
            const agoPrice = rows[1].querySelectorAll("td")[1].textContent.trim() + " RWF";

            document.getElementById("pmsPrice").textContent = pmsPrice;
            document.getElementById("agoPrice").textContent = agoPrice;
        } else {
            console.error("❌ Table rows not found");
        }
    } catch (err) {
        console.error("⚠️ Error fetching fuel prices:", err);
        document.getElementById("pmsPrice").textContent = "Error";
        document.getElementById("agoPrice").textContent = "Error";
    }
}


loadFuelPrices();





// async function checkIndex() {
//     const client = new Appwrite.Client()
//         .setEndpoint("https://cloud.appwrite.io/v1") 
//         .setProject("68c3ec870024955539b0");

//     const account = new Appwrite.Account(client);
//     const databases = new Appwrite.Databases(client);

//     const databaseId = "68c3f10d002b0dfc0b2d";
//     const indexId = "68cd1987002bae34ea4b";

//     try {
//         const user = await account.get();

//         let match = false;

//         const logDate = document.getElementById("logDate").value;

//         const response = await databases.listDocuments(databaseId, indexId, [Appwrite.Query.equal("logDate", logDate)]);

//         for (let i = 0; i < response.documents.length; i++) {
            
//             const doc = response.documents[i];

//             if ( pms1 === doc.pms2 && pms3 === doc.pms4 && ago1 === doc.ago2 && ago3 === doc.ago4) {
//                 match = true;
//             } 
//         }            

//         if (match === true) {
//             document.getElementById("status").textContent = "All index match."

//             alert("All index match")
//         } else {
//             document.getElementById("status").textContent = "Check index, they do not match." ;

//             alert("Check index, they do not match.")
//         }
            
                      

//     } catch (error) {
//         console.error("Error:", error.message);
//     }

// };

// function getDayBefore() {
//   const dateInput = document.getElementById("logDate").value; // "YYYY-MM-DD"
//   if (!dateInput) return alert("Select a date!");

//   const selectedDate = new Date(dateInput);
//   selectedDate.setDate(selectedDate.getDate() - 1); // subtract 1 day

//   // Format to MM/DD/YYYY
//   const mm = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//   const dd = String(selectedDate.getDate()).padStart(2, '0');
//   const yyyy = selectedDate.getFullYear();

//   const formattedDate = `${mm}/${dd}/${yyyy}`;

//   document.getElementById("output").textContent = "Day before: " + formattedDate;
// }

// function getDayBefore() {
//   const dateInput = document.getElementById("logDate").value; // "YYYY-MM-DD"
//   if (!dateInput) return alert("Select a date!");

//   const selectedDate = new Date(dateInput);
//   selectedDate.setDate(selectedDate.getDate() - 1); // subtract 1 day

//   // Format to MM/DD/YYYY
//   const mm = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//   const dd = String(selectedDate.getDate()).padStart(2, '0');
//   const yyyy = selectedDate.getFullYear();

//   const formattedDate = `${mm}/${dd}/${yyyy}`;

// // }