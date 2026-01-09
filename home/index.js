let totalVente, pms1, pms2, pms3, pms4, ago1, ago2, ago3, ago4;
let venteLitresPms, totalPms, venteLitresAgo, totalAgo;
let pmsPrice, agoPrice, logDate, shift;
let userEmail, userName;

const API_BASE = "https://mywebapp-backend.onrender.com/api";

// Helper function to save data
async function saveData(collection, data) {
    const response = await fetch(`${API_BASE}/create/${collection}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.details || `Failed to save to ${collection}`);
    }
    
    return response.json();
}

// Helper function to get documents
async function getDocuments(collection) {
    const response = await fetch(`${API_BASE}/documents/${collection}`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to fetch ${collection}`);
    }
    return response.json();
}

// Helper function to update document by field
async function updateDocumentByField(collection, searchField, searchValue, updateData) {
    return fetch(`${API_BASE}/update-by-field/${collection}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchField, searchValue, updateData }),
    }).then(r => r.json());
}

// Initialize user session (you'll need to implement authentication separately)
async function initUser() {
    // You'll need to implement your own auth system
    // For now, storing in localStorage as placeholder
    userEmail = localStorage.getItem('userEmail');
    userName = localStorage.getItem('userName');
    
    if (!userEmail || !userName) {
        alert("Please log in first!");
        // Redirect to login page
        return false;
    }
    return true;
}

async function calculateIndex() {
    pmsPrice = 1989;
    agoPrice = 1900;

    pms1 = Number(document.getElementById("pms1").value);
    pms2 = Number(document.getElementById("pms2").value);
    pms3 = Number(document.getElementById("pms3").value);
    pms4 = Number(document.getElementById("pms4").value);
    ago1 = Number(document.getElementById("ago1").value);
    ago2 = Number(document.getElementById("ago2").value);
    ago3 = Number(document.getElementById("ago3").value);
    ago4 = Number(document.getElementById("ago4").value);
    logDate = document.getElementById("logDate").value;
    shift = document.getElementById("shift").value;

    venteLitresPms = (pms2 - pms1) + (pms4 - pms3);
    totalPms = parseInt(venteLitresPms * pmsPrice, 10);

    venteLitresAgo = (ago2 - ago1) + (ago4 - ago3);
    totalAgo = parseInt(venteLitresAgo * agoPrice, 10);

    totalVente = totalAgo + totalPms;

    document.getElementById("resultpms").textContent = `${totalPms.toLocaleString()} RWF`;
    document.getElementById("resultago").textContent = `${totalAgo.toLocaleString()} RWF`;
    document.getElementById("result").textContent = `${totalVente.toLocaleString()} RWF`;

    try {
        async function getDayBefore(logDate) {
            if (!logDate) return alert("Select a date!");

            const selectedDate = new Date(logDate);
            selectedDate.setDate(selectedDate.getDate() - 1);
            
            const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const dd = String(selectedDate.getDate()).padStart(2, '0');
            const yyyy = selectedDate.getFullYear();

            return `${mm}/${dd}/${yyyy}`;
        }

        const dateBefore = await getDayBefore(logDate);
        let pmsMatch = false;
        let agoMatch = false;

        // Get documents for today
        const response = await getDocuments('index');
        const todayDocs = response.documents ? response.documents.filter(doc => doc.logDate === logDate) : [];

        for (const doc of todayDocs) {
            if (pms1 && pms3) {
                if (pms1 === doc.pms2 && pms3 === doc.pms4) {
                    pmsMatch = true;
                }
            } else {
                pmsMatch = true;
            }
            
            if (ago1 && ago3) {
                if (ago1 === doc.ago2 && ago3 === doc.ago4) {
                    agoMatch = true;
                }
            } else {
                agoMatch = true;
            }
            
            if (pmsMatch && agoMatch) {
                break;
            }
        }

        let match = pmsMatch && agoMatch;

        if (!match) {
            pmsMatch = false;
            agoMatch = false;
            
            const beforeDocs = response.documents ? response.documents.filter(doc => doc.logDate === dateBefore) : [];

            for (const doc of beforeDocs) {
                if (pms1 && pms3) {
                    if (pms1 === doc.pms2 && pms3 === doc.pms4 && doc.shift === "Night") {
                        pmsMatch = true;
                    }
                } else {
                    pmsMatch = true;
                }
                
                if (ago1 && ago3) {
                    if (ago1 === doc.ago2 && ago3 === doc.ago4 && doc.shift === "Night") {
                        agoMatch = true;
                    }
                } else {
                    agoMatch = true;
                }
                
                if (pmsMatch && agoMatch) {
                    break;
                }
            }
            
            match = pmsMatch && agoMatch;
        }

        if (match) {
            alert("All index match");
        } else {
            alert("Check Index they do not match");
        }

    } catch (error) {
        console.log("The error is ", error);
    }
}

let momo, momoLoss, totalFiche, bon, spFuelCard, bankCard;
let cash5000, cash2000, cash1000, cash500;
let totalCash, totalPayments, gainPayments, listBC, listSFC, totalLoans;

async function payments() {
    try {
        momo = Number(document.getElementById("momo").value);
        momoLoss = Number(document.getElementById("momoLoss").value);
        bon = Number(document.getElementById("bon").value);
        spFuelCard = document.getElementById("spFuelCard").value;
        bankCard = document.getElementById("bankCard").value;
        cash5000 = Number(document.getElementById("5000").value);
        cash2000 = Number(document.getElementById("2000").value);
        cash1000 = Number(document.getElementById("1000").value);
        cash500 = Number(document.getElementById("500").value);
        logDate = document.getElementById("logDate").value;
        shift = document.getElementById("shift").value;

        listSFC = spFuelCard.split(",").map(v => parseInt(v.trim())).filter(v => !isNaN(v));
        listBC = bankCard.split(",").map(v => parseInt(v.trim())).filter(v => !isNaN(v));

        spFuelCard = listSFC.reduce((sum, n) => sum + n, 0);
        bankCard = listBC.reduce((sum, n) => sum + n, 0);

        totalLoans = loans.reduce((sum, loan) => sum + loan.amount, 0);
        totalFiche = fiche.reduce((sum, item) => sum + item.amount, 0);

        totalCash = (cash5000 * 5000) + (cash2000 * 2000) + (cash1000 * 1000) + (cash500 * 500);
        totalPayments = momo + momoLoss + totalFiche + bon + spFuelCard + bankCard + totalCash + totalLoans;
        gainPayments = totalPayments - totalVente;

        document.getElementById("totalLoans").textContent = `${totalLoans.toLocaleString()} RWF`;
        document.getElementById("totalFiche").textContent = `${totalFiche.toLocaleString()} RWF`;
        document.getElementById("totalPayments").textContent = `${totalPayments.toLocaleString()} RWF`;
        document.getElementById("gainPayments").textContent = `${gainPayments.toLocaleString()} RWF`;
        document.getElementById("totalCash").textContent = `${totalCash.toLocaleString()} RWF`;
    } catch (error) {
        console.log(error);
    }
}

async function situation() {
    if (!await initUser()) return;

    try {
        const employee = userName;
        const email = userEmail;

        function generateShiftId(employee, logDate) {
            return `${employee}_${logDate}_${crypto.randomUUID()}`;
        }

        const id = generateShiftId(employee, logDate);

        const selectedDate = new Date(logDate);
        const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const yyyy = selectedDate.getFullYear();
        const monthYear = `${yyyy}-${mm}`;

        // Get gain documents
        const gainDocs = await getDocuments('gain');
        const matchingGain = gainDocs.documents ? gainDocs.documents.filter(
            doc => doc.email === email && doc.monthYear === monthYear
        ) : [];

        if (matchingGain.length === 0) {
            const newData = {
                employee,
                email,
                gainPayments,
                logDate,
                monthYear
            };
            
            await saveData('gain', newData);
        } else {
            const doc = matchingGain[0];
            const newGain = gainPayments + doc.gainPayments;
            
            await updateDocumentByField(
                'gain',
                'email',
                email,
                { gainPayments: newGain, logDate, monthYear }
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
            employee,
            id,
        };

        const dataPayments = {
            momo,
            momoLoss,
            totalFiche,
            bon,
            listBC,
            listSFC,
            bankCard,
            spFuelCard,
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
            employee,
            id,
            loans: JSON.stringify(loans),
            fiche: JSON.stringify(fiche),
            totalLoans,
            totalVente
        };

        // Get situation documents
        const situationDocs = await getDocuments('situation');
        const todaySituation = situationDocs.documents ? situationDocs.documents.filter(doc => doc.logDate === logDate) : [];

        let dataSituation;

        if (shift === "Morning" && todaySituation.length <= 1) {
            dataSituation = {
                momo,
                momoLoss,
                totalFiche,
                bon,
                spFuelCard,
                bankCard,
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

            await saveData('situation', dataSituation);

        } else if ((shift === "Afternoon" || shift === "Morning" || shift === "Evening") && todaySituation.length !== 0) {
            const doc = todaySituation[0];

            dataSituation = {
                momo: momo + doc.momo,
                momoLoss: momoLoss + doc.momoLoss,
                totalFiche: totalFiche + doc.totalFiche,
                bon: bon + doc.bon,
                spFuelCard: spFuelCard + doc.spFuelCard,
                bankCard: bankCard + doc.bankCard,
                totalCash: totalCash + doc.totalCash,
                totalLoans: totalLoans + doc.totalLoans,
                totalPayments: totalPayments + doc.totalPayments,
                gainPayments: gainPayments + doc.gainPayments,
                venteLitresPms: venteLitresPms + doc.venteLitresPms,
                totalPms: totalPms + doc.totalPms,
                venteLitresAgo: venteLitresAgo + doc.venteLitresAgo,
                totalAgo: totalAgo + doc.totalAgo,
                totalVente: totalVente + doc.totalVente,
            };

            await updateDocumentByField('situation', 'logDate', logDate, dataSituation);

        } else if (shift === "Night" && todaySituation.length !== 0) {
            const doc = todaySituation[0];

            dataSituation = {
                momo: momo + doc.momo,
                momoLoss: momoLoss + doc.momoLoss,
                totalFiche: totalFiche + doc.totalFiche,
                bon: bon + doc.bon,
                spFuelCard: spFuelCard + doc.spFuelCard,
                bankCard: bankCard + doc.bankCard,
                totalCash: totalCash + doc.totalCash,
                totalLoans: totalLoans + doc.totalLoans,
                totalPayments: totalPayments + doc.totalPayments,
                gainPayments: gainPayments + doc.gainPayments,
                venteLitresPms: venteLitresPms + doc.venteLitresPms,
                totalPms: totalPms + doc.totalPms,
                venteLitresAgo: venteLitresAgo + doc.venteLitresAgo,
                totalAgo: totalAgo + doc.totalAgo,
                totalVente: totalVente + doc.totalVente,
                pms2,
                pms4,
                ago2,
                ago4,
                done: true,
            };

            await updateDocumentByField('situation', 'logDate', logDate, dataSituation);
        }

        await saveData('index', dataIndex);
        await saveData('payments', dataPayments);

        alert("Data saved successfully");

        function clearOutputs() {
            const outputs = document.querySelectorAll(".output");
            outputs.forEach(el => {
                el.textContent = "0";
            });
            document.getElementById("momo").value = "";
        }

        clearOutputs();
        
        document.getElementById("rapportForm").reset();
        document.getElementById("paymentsForm").reset();

    } catch (err) {
        console.error("Error:", err.message);
        alert("Error: " + err.message);
    }
}

async function addLoan() {
    try {
        const container = document.getElementById("loanContainer");
        container.innerHTML = "";

        const res = await fetch(`${API_BASE}/attributes/loans`);
        const data = await res.json();
        const attributes = data.attributes;

        for (let i = 0; i < attributes.length; i++) {
            const div = document.createElement("div");
            
            if (attributes[i].key === "employee" || attributes[i].key === "logDate" || attributes[i].key === "monthYear") {
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
        submit.onclick = async (e) => {
            submit.disabled = true;
            try {
                await storeLoan(e);
            } finally {
                submit.disabled = false;
            }
        };
        submit.style.marginRight = "10px";
        container.appendChild(submit);

        const cancelBtn = document.createElement("button");
        cancelBtn.type = "button";
        cancelBtn.className = "cancel";
        cancelBtn.textContent = "Cancel";
        cancelBtn.onclick = (e) => cancel("loanContainer");
        container.appendChild(cancelBtn);

    } catch (error) {
        console.log(error);
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
            return "text";
    }
}

let loans = [];
async function storeLoan() {
    if (!await initUser()) return;

    const employee = userName;
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    logDate = document.getElementById("logDate").value;
    const monthYear = `${year}-${month}`;

    const plate = document.getElementById("plate").value;
    const amount = parseInt(document.getElementById("amount").value);
    const company = document.getElementById("company").value;
    
    try {
        const loanData = {
            plate,
            company,
            logDate,
            monthYear,
            employee,
            amount
        };

        await saveData('loans', loanData);
        alert("Data saved successfully");
        
    } catch (err) {
        console.error("Error:", err.message);
        alert("Error: " + err.message);
    }

    const container = document.getElementById("loanContainer");
    container.innerHTML = "";

    loans.push({ company, amount });
}

async function addFiche() {
    try {
        const container = document.getElementById("ficheContainer");
        container.innerHTML = "";

        const res = await fetch(`${API_BASE}/attributes/fiche`);
        const data = await res.json();
        const attributes = data.attributes;

        for (let i = 0; i < attributes.length; i++) {
            const div = document.createElement("div");
            
            if (attributes[i].key === "employee" || attributes[i].key === "logDate") {
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
        submit.textContent = "Save Fiche";
        submit.onclick = async (e) => {
            submit.disabled = true;
            try {
                await storeFiche(e);
            } finally {
                submit.disabled = false;
            }
        };
        submit.style.marginRight = "10px";
        container.appendChild(submit);

        const cancelBtn = document.createElement("button");
        cancelBtn.type = "button";
        cancelBtn.className = "cancel";
        cancelBtn.textContent = "Cancel";
        cancelBtn.onclick = (e) => cancel("ficheContainer");
        container.appendChild(cancelBtn);

    } catch (error) {
        console.log(error);
    }
}

let fiche = [];
async function storeFiche() {
    if (!await initUser()) return;

    const employee = userName;
    logDate = document.getElementById("logDate").value;

    const plate = document.getElementById("plate").value;
    const amount = parseInt(document.getElementById("amount").value);
    const company = document.getElementById("company").value;
    
    try {
        const ficheData = {
            plate,
            company,
            logDate,
            employee,
            amount
        };

        await saveData('fiche', ficheData);
        alert("Data saved successfully");
        
    } catch (err) {
        console.error("Error:", err.message);
        alert("Error: " + err.message);
    }

    const container = document.getElementById("ficheContainer");
    container.innerHTML = "";

    fiche.push({ company, amount });
}

async function MomoLoss() {
    const momo = document.getElementById("momo").value;
    document.getElementById("tempMomoLoss").textContent = (parseInt((momo / 100) * 0.5).toLocaleString());
}

function cancel(id) {
    document.getElementById(id).innerHTML = "";
}