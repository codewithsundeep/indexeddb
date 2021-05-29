window.onload=getTodo;


const input = document.getElementById("toDoInput");
const add = document.getElementById("add");
const form = document.querySelector("form");
const table = document.querySelector("table");
let obj = "";
// click event listener for add button
form.addEventListener("submit",addClicked);
// add button event function
function addClicked(e) {
  e.preventDefault();
  e.stopPropagation();
// object to store in indexedDB
 obj = {
          todo:input.value
}
// Open a indexedDB
const idb = indexedDB.open("todoapp",1);
idb.onupgradeneeded=upgrade;
idb.onsuccess=success;
idb.onerror=error;         
}
// upgradeneeded event function
function upgrade(e) {
          const db = e.target.result;
          db.createObjectStore("newtodo",{autoIncrement:true});
}
// indexedDB onsuccess event function
function success(e) {
          const db = e.target.result;
          const tx = db.transaction("newtodo","readwrite");
          const store = tx.objectStore("newtodo");
          if(store.put(obj)){
                    db.close();
                    alert("Data Added Succesfully");
                    table.innerHTML="";
                    getTodo();
                   
          }
}
// indexedDB onerror event function
function error(e) {
          e.preventDefault();
          alert("Oops! this error was happen \n"+e.target.error.message);
}
/*
Data storing process is ended here
*/

/*
To get data on webpage, code have started from here
*/



  function getTodo(){
const idb = indexedDB.open("todoapp",1);
idb.onsuccess=e=>{
const db = e.target.result;
const tx = db.transaction("newtodo","readonly");
const store = tx.objectStore("newtodo");
const cursor = store.openCursor();
cursor.onsuccess=e=>{
          const dataObj = e.target.result;
          if(dataObj){
                    
                    const tr = document.createElement("tr");
                    tr.innerHTML=`
                    <td>${dataObj.value.todo}</td>
                    <td><button id="${dataObj.key}"class="delete">Delete</button></td>
                    `;
                    table.appendChild(tr);
                   
                    dataObj.continue();
                    

          } 
          else{
                    deleteFunc();
          }
          
}
cursor.onerror=e=>{
          alert("This error was happen\n"+e.target.error.message);
}


}
idb.onerror=e=>{
          e.preventDefault();
          alert("This error was happen\n"+e.target.error.message);
}
}

// read data in webpage function is closed here

//delete function is started from here
function deleteFunc(e) {
 deleteData = document.querySelectorAll(".delete");
deleteData.forEach(e => {
          e.addEventListener("click",(e)=>{
                    const id = e.target.id;
                    const idb = indexedDB.open("todoapp",1);
                    idb.onsuccess=e=>{
                              const db = e.target.result;
                              const tx = db.transaction("newtodo","readwrite");
                              const store = tx.objectStore("newtodo");
                              if(store.delete(Number(id))){
                                        alert("data has been deleted succesfully");
                                        table.innerHTML="";
                                        getTodo();
                              }
                              
                    }
                    idb.onerror=e=>{
                              alert("This error was happen\n"+e.target.error.message);
                    }
          })
});
}

