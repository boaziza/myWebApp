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
        window.location.replace("sign-in/sign-in.html"); // 👈 change to your login page path
    });

    async function showUser() {
        try {
            const user = await account.get();
            const username = user.name || user.email;

            if (document.getElementById("welcomeMessage")) {
                // Insert into the HTML
                document.getElementById("welcomeMessage").textContent = "Welcome back, " + username;
            }
            
        } catch {
            // If not logged in, send back to sign in
            window.location.replace("sign-in/sign-in.html");
        }
    }
    showUser();
}

welcomeMessage();