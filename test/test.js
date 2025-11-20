// let el;

// function getElementValue(el) {
//     if (!el) return "";
//     if (el.tagName === "SELECT") {
//         return el.value; // current selected option value
//     }
//     if ("value" in el && el.value !== undefined) {
//         return el.value;
//     }
//     return el.textContent.trim();
// }

// async function display() {
    
//     try {
        
//         el = document.getElementById("check"); 
//         const check = getElementValue(el)
        
//         document.getElementById("title").textContent = `${check.toUpperCase()} Report`;
        
//         const hidden = ["cash5000","cash2000","cash1000","cash500","id","shift","email","fiche","listSFC","listBC","bon"]

//         const res = await fetch(`https://mywebapp-backend.onrender.com/api/attributes/${check}`);
//         const data = await res.json();
//         const rawAtributes = data.attributes;

//         const attributes = rawAtributes.filter(attr => !hidden.includes(attr.key))

//         const resDocs = await fetch(`https://mywebapp-backend.onrender.com/api/documents/${check}`);
//         const docData = await resDocs.json();
//         const rows = docData.documents;

//         const headers = document.getElementById("headers");
//         const body = document.getElementById("body");

//         headers.innerHTML = "";
//         body.innerHTML = "";

//         for (let i = 0; i < attributes.length; i++) {

//             const theader = document.createElement("th");

//             if (attributes[i].key === "loans") {

//                 theader.textContent = `VERSEMENT`;
//                 headers.appendChild(theader);
//                 continue;

//             }

//             theader.textContent = `${attributes[i].key.toUpperCase()}`;
//             headers.appendChild(theader);   
                
//         }

//         const totals = Array(attributes.length).fill(0);

//         for (let i = 0; i < rows.length; i++) {
//             const tr = document.createElement("tr");

//             for (let j = 0; j < attributes.length; j++) {

//                 const key = attributes[j].key;
//                 const td = document.createElement("td");

//                 if (key === "loans") {                    

//                     const loans = JSON.parse(rows[i][key]);
//                     if (loans.every(loan => loan.company === "Versement")) {
//                         td.textContent = loans.map(loan => `${loan.amount}`);
//                     }
                    
//                     tr.appendChild(td);
//                     continue;

//                 }

//                 if (key === "logDate") {

//                     const formattedDate = new Date(rows[i][key]).toISOString().split("T")[0];

//                     td.textContent = formattedDate;
                    
//                     tr.appendChild(td);
//                     continue;

//                 }
                
//                 td.textContent = rows[i][key] || ""; 
//                 tr.appendChild(td);       
                
//                 const numValue = Number(rows[i][key]);
//                 if (!isNaN(numValue)) {
//                     totals[j] += numValue;
//                 }
                
//             }

//             body.appendChild(tr);
//         }

//         const totalRow = document.createElement("tr");

//         for (let j = 0; j < attributes.length; j++) {
//           const td = document.createElement("td");
//           // Only show total if it’s numeric (not 0)
//           td.textContent = totals[j] !== 0 ? totals[j].toLocaleString() : "";
//           totalRow.appendChild(td);
//         }

//         body.appendChild(totalRow);
                    
//         const div = document.getElementById("search");
//         const inputSection = document.getElementById("inputSection");
//         inputSection.innerHTML = ``;

//         div.innerHTML = "";

//         const searchWith = document.createElement("h2");
//         searchWith.textContent = `Search With`;

//         div.appendChild(searchWith);

//         const select = document.createElement("select");
//         select.onchange = changeType;
//         select.id = "searchWith";

//         const optionStart = document.createElement("option");        
//         optionStart.textContent = `Search With`
//         select.appendChild(optionStart)

//         for (let i = 0; i < attributes.length; i++) {
//             const option = document.createElement("option")
//             option.textContent = `${attributes[i].key}`
//             select.appendChild(option);            
//         }

//         div.appendChild(select);

//         div.appendChild(document.createElement("br"));

//         const searchButton = document.getElementById("searchButton");
//         searchButton.innerHTML = ``;
        
//         const submit = document.createElement("button");
//         submit.type = "button"; 
//         submit.className = "action-btn";
//         submit.textContent = "Search";
//         submit.onclick = search;
//         searchButton.appendChild(submit);
        
//     } catch (error) {
//         console.log("Error ",error);        
//     }
// }

// async function search() {
//     try {       
//         el = document.getElementById("check"); 
//         const check = getElementValue(el);        

//         const res = await fetch(`https://mywebapp-backend.onrender.com/api/attributes/${check}`);
//         const data = await res.json();
//         const attributes = data.attributes;

//         const resDocs = await fetch(`https://mywebapp-backend.onrender.com/api/documents/${check}`);
//         const docData = await resDocs.json();
//         const rows = docData.documents;

//         let filteredRows = [];

//         const searchWith = document.getElementById("searchWith").value;
//         let searchValue = document.getElementById("searchValue").value;

//         if (searchWith === "logDate") {
//            searchValue = `${searchValue}T00:00:00.000+00:00`
//         }

//         for (let i = 0; i < rows.length; i++) {
//         const row = rows[i];

//             if (row[searchWith] == searchValue) {
//                 filteredRows.push(row);
//             }
//         }

//         console.log("filteredrows",filteredRows);
        

//         const headers = document.getElementById("headers");
//         const body = document.getElementById("body");

//         headers.innerHTML = "";
//         body.innerHTML = "";

//         for (let i = 0; i < attributes.length; i++) {

//             const theader = document.createElement("th");
//             theader.textContent = `${attributes[i].key.toUpperCase()}`;
//             headers.appendChild(theader);   
                
//         }

//         const totals = Array(attributes.length).fill(0);

//         for (let i = 0; i < filteredRows.length; i++) {
            
//             const tr = document.createElement("tr");

//             for (let j = 0; j < attributes.length; j++) {
//                 const key = attributes[j].key;
//                 const td = document.createElement("td");

//                 if (key === "logDate") {

//                     const formattedDate = new Date(filteredRows[i][key]).toISOString().split("T")[0];

//                     td.textContent = formattedDate;
                    
//                     tr.appendChild(td);
//                     continue;

//                 };

//                 td.textContent = filteredRows[i][key] || ""; 
//                 tr.appendChild(td);

//                 const numValue = Number(filteredRows[i][key]);
//                 if (!isNaN(numValue)) {
//                     totals[j] += numValue;
//                 }
//             }

//             body.appendChild(tr);
//         }
//         const totalRow = document.createElement("tr");

//         for (let j = 0; j < attributes.length; j++) {
//           const td = document.createElement("td");
//           // Only show total if it’s numeric (not 0)
//           td.textContent = totals[j] !== 0 ? totals[j].toLocaleString() : "";
//           totalRow.appendChild(td);
//         }

//         body.appendChild(totalRow);

        
//     } catch (error) {
//         console.log(error);
//         display();        
//     }
// }
// function mapTypeToInput(appwriteType) {
//   switch (appwriteType) {
//     case "integer":
//       return "number";
//     case "float":
//       return "number";
//     case "boolean":
//       return "checkbox";
//     case "email":
//       return "email";
//     case "url":
//       return "url";
//     case "datetime":
//       return "datetime-local";
//     default:
//       return "text"; // for string, enum, etc.
//   }
// }

// async function changeType() {

//     try {        
//         el = document.getElementById("check"); 
//         const check = getElementValue(el);        

//         const res = await fetch(`https://mywebapp-backend.onrender.com/api/attributes/${check}`);
//         const data = await res.json();
//         const attributes = data.attributes;
        
//         const inputSection = document.getElementById("inputSection");
//         inputSection.innerHTML = ``;

//         const selectedKey = document.getElementById("searchWith").value;
//         const selectedAttr = attributes.find(attr => attr.key === selectedKey);

//         const input = document.createElement("input");
//         input.innerHTML = ``
//         input.id = "searchValue"   
//         input.textContent = `` 

//         if (selectedKey === "monthYear") {
//             input.type = "month"
//         } else if (selectedKey === "logDate"){
//             input.type = "date"
//         } else if (selectedAttr) {
//             input.type = mapTypeToInput(selectedAttr.type);
//         }else {
//             input.type = "text"; 
//         }
//         inputSection.appendChild(input);
//     } catch (error) {
//         console.log("Error:",error);        
//     }
// }

// async function recent() {
    
// }



/* ---------------------------
   GLOBAL PAGINATION VARIABLES
-----------------------------*/
let allRows = [];          // all documents loaded from backend
let filteredRows = null;   // search uses this
let currentPage = 1;
const pageSize = 20;       // rows per page

// stored attributes for pagination re-render
window.lastAttributes = [];


/* ---------------------------
   RENAME MAP & UTILS
-----------------------------*/
// const renameMap = {
//   monthYear: "User Email",
//   name: "Full Name",
//   age: "User Age",
//   createdAt: "Date Created"
// };

// const cap = s => s && s[0].toUpperCase() + s.slice(1).toLowerCase();

// function rearrangeAndRename(attrs) {
//   const ordered = [
//     ...preferredOrder.map(k => attrs.find(a => a.key === k)).filter(Boolean),
//     ...attrs.filter(a => !preferredOrder.includes(a.key))
//   ];

//   return ordered
//     .filter(a => !hiddenKeys.includes(a.key))
//     .map(a => ({ ...a, key: a.key, displayName: renameMap[a.key] || a.key }));
// }


/* ---------------------------
   BACKEND FETCH FUNCTION
-----------------------------*/
// async function fetchAllDocuments(collectionId) {
//   const databaseId = process.env.APPWRITE_DATABASE_ID;
//   const limit = 100;

//   let all = [];
//   let cursor = null;

//   while (true) {
//     const queries = [Query.limit(limit)];
//     if (cursor) queries.push(Query.cursorAfter(cursor));

//     const result = await databases.listDocuments(databaseId, collectionId, queries);

//     all.push(...result.documents);

//     if (result.documents.length < limit) break;

//     cursor = result.documents[result.documents.length - 1].$id;
//   }

//   return all;
// }


/* ---------------------------
   TABLE RENDER FUNCTION
-----------------------------*/
// function renderTable(attributes, rows, tableBody, totalsRow) {
//   tableBody.innerHTML = "";
//   totalsRow.innerHTML = "";

//   const totals = Array(attributes.length).fill(0);

//   rows.forEach(row => {
//     const tr = document.createElement("tr");

//     attributes.forEach((attr, j) => {
//       const td = document.createElement("td");
//       const key = attr.key;
//       const value = row[key] || "0";

//       if (key === "loans" && value) {
//         const loans = JSON.parse(value);
//         const versements = loans
//           .filter(l => l.company === "Versement")
//           .map(l => l.amount);

//         td.textContent = versements.join(", ") || "0";
//       } else {
//         td.textContent = formatValue(key, value);
//       }

//       tr.appendChild(td);

//       const num = Number(value);
//       if (!isNaN(num)) totals[j] += num;
//       else if (j === 0) totals[j] = "TOTALS";
//     });

//     tableBody.appendChild(tr);
//   });

//   totalsRow.innerHTML = totals
//     .map(t => `<td style="font-weight: bold;">${t ? t.toLocaleString() : ""}</td>`)
//     .join("");

//   tableBody.appendChild(totalsRow);
// }


/* ---------------------------
   PAGINATION ENGINE
-----------------------------*/
function getRowsForPage() {
  const source = filteredRows || allRows;
  const start = (currentPage - 1) * pageSize;
  const totalPages = Math.ceil(source.length / pageSize);

  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;

  document.getElementById("pageNumber").textContent =
    `Page ${currentPage} of ${totalPages}`;

  return source.slice(start, start + pageSize);  
}

function renderCurrentPage(attributes, body) {
  const rowsToShow = getRowsForPage();
  const totalsRow = document.createElement("tr");
  renderTable(attributes, rowsToShow, body, totalsRow);
}


/* ---------------------------
   MAIN DISPLAY FUNCTION
-----------------------------*/
async function display(collectionName) {
  const body = document.getElementById("body");

  try {
    const docData = await (await fetch(`/api/documents/${collectionName}`)).json();

    // load documents into memory
    allRows = docData.documents;
    filteredRows = null;
    currentPage = 1;

    // get attributes
    const attrData = await (await fetch(`/api/attributes/${collectionName}`)).json();
    const attributes = rearrangeAndRename(attrData.attributes);
    window.lastAttributes = attributes;

    renderCurrentPage(attributes, body);

  } catch (error) {
    console.error("Error:", error);
  }
}


/* ---------------------------
   SEARCH FUNCTION
-----------------------------*/
function searchTable(term) {
  const body = document.getElementById("body");
  const attributes = window.lastAttributes;

  term = term.toLowerCase();

  filteredRows = allRows.filter(doc =>
    Object.values(doc).some(v =>
      String(v).toLowerCase().includes(term)
    )
  );

  currentPage = 1;
  renderCurrentPage(attributes, body);
}


/* ---------------------------
   PAGINATION BUTTON EVENTS
-----------------------------*/
document.getElementById("prevPage").onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    const attributes = window.lastAttributes;
    const body = document.getElementById("body");
    renderCurrentPage(attributes, body);
  }
};

document.getElementById("nextPage").onclick = () => {
  const source = filteredRows || allRows;
  if (currentPage < Math.ceil(source.length / pageSize)) {
    currentPage++;
    const attributes = window.lastAttributes;
    const body = document.getElementById("body");
    renderCurrentPage(attributes, body);
  }
};
