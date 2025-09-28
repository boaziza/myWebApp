async function userAccess() {
  try {
    const client = new Appwrite.Client()
        .setEndpoint("https://cloud.appwrite.io/v1") 
        .setProject("68c3ec870024955539b0");

    const account = new Appwrite.Account(client);
    const databases = new Appwrite.Databases(client);

    const databaseId = "68c3f10d002b0dfc0b2d";
    const adminId = "68d95af4003245ef87a7";
    
    const user = await account.get();
    const email = user.email; 
    

    const admin = await databases.listDocuments(databaseId, adminId, [Appwrite.Query.equal("email", email)])    

    if ( admin.documents.length === 0 ) {
        window.location.replace("../index.html");    
    } else {        
        console.log("access granted");    
    }
  } catch (error) {
    console.log("error for page access",error);
    }
    
}

userAccess();