async function excelGain() {
    const client = new Appwrite.Client()
        .setEndpoint("https://cloud.appwrite.io/v1") 
        .setProject("68c3ec870024955539b0");

    const account = new Appwrite.Account(client);
    const databases = new Appwrite.Databases(client);

    const databaseId = "68c3f10d002b0dfc0b2d";
    const gainPompisteId = "68dbbb760034fb10a518"

    const monthYear = document.getElementById("monthYear").value;
    const output = [];

    const gainDocs = await databases.listDocuments(databaseId, gainPompisteId, [Appwrite.Query.equal("monthYear", monthYear)]);
    const doc = gainDocs.documents;

    for (let i = 0; i < doc.length; i++) {
        
    }

}

async function displayGain() {
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
}