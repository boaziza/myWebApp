async function logout() {
  try {
    const client = new Appwrite.Client()
        .setEndpoint("https://cloud.appwrite.io/v1") 
        .setProject("68c3ec870024955539b0");

    const account = new Appwrite.Account(client);
    
    await account.deleteSession("current");
    alert("User logged out successfully ✅");
    window.location.replace("../sign-in/sign-in.html")
    
  } catch (error) {
    console.log("error for page access",error);
    }
}