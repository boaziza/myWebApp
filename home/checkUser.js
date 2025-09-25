async function checkAccess() {
  try {
    const res = await fetch("https://api64.ipify.org?format=json");
    const data = await res.json();
    const ip = data.ip;

    // List of allowed IPs/networks
    const allowed = ["41.216.105.56"];

    if (!allowed.includes(ip)) {
      document.body.innerHTML = "<h1>🚫 Access Denied</h1>";
    }
  } catch (err) {
    console.error("Failed to check access", err);
  }
}

checkAccess();