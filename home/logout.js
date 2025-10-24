async function logout(event) {
  const btn = event.currentTarget;   
  const originalText = btn.textContent;

  btn.disabled = true;
  btn.textContent = "Loading..."; 

  try {
    const client = new Appwrite.Client()
        .setEndpoint("https://cloud.appwrite.io/v1") 
        .setProject("68c3ec870024955539b0");

    const account = new Appwrite.Account(client);
    
    await account.deleteSession("current");
    alert("Logged out successfully");
    window.location.href= "/myWebApp/sign-in/sign-in.html";
    
  } catch (error) {
    console.log("error for page access",error);
  } finally {

    btn.disabled = false;
    btn.textContent = originalText;
        
  }
}

function logoutBlock() {  
  try {
    document.getElementById("logoutBtn").addEventListener("click", function() {
    document.getElementById("logoutPopup").style.display = "block";
    });

    document.getElementById("cancelLogout").addEventListener("click", function() {
    document.getElementById("logoutPopup").style.display = "none";
    window.location.reload();
    });

    document.getElementById("confirmLogout").addEventListener("click", function() {
    logout();
    alert("Logged out successfully!");
    document.getElementById("logoutPopup").style.display = "none";
    });
  } catch (error) {
    console.log("This is the error :",error);
    
  }
}