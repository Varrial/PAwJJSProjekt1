var currencySuffix = " zł"

var storage = [{
    lp:10,
    name:"nazwa4",
    price:123,
    amount:103
},{
    lp:20,
    name:"nazwa3",
    price:23,
    amount:102
},{
    lp:20,
    name:"nazwa2",
    price:13,
    amount:1011
},{
    lp:20,
    name:"nazwa1",
    price:1,
    amount:101
}]

function update(){
    clearList()
    reenumerateStorage()
    generateListFromStorage()
    setContentSumaTextView( sumElementsOnList())
}

function getSumaTextView(){
    return document.getElementById("field_sum")
}

function setContentSumaTextView(content){
    
    getSumaTextView().innerHTML = content+currencySuffix
}

function sumElementsOnList(){
    let sum = 0
    if(storage.length == 0) return 0.0
    sum = storage.map(element=>element.price*element.amount).reduce((a,b)=>{return a+b})
    return sum
}

function generateListFromStorage(){
    storage.forEach(element=>{
        generateNewRowByObject(element)
    })
}

function generateNewRowByObject(element){
    let tr = document.createElement("tr")
    
    
    let tdLp = document.createElement("td")
    let tdName = document.createElement("td")
    let tdPrice = document.createElement("td")
    let tdAmount = document.createElement("td")
    let tdCost = document.createElement("td")
    let tdControlls = document.createElement("td")

    //ustawienie poprawnych wartości pobranych z elementu

    tdLp.innerHTML = element.lp
    tdName.innerHTML = element.name
    tdPrice.innerHTML = element.price
    tdAmount.innerHTML = element.amount
    tdCost.innerHTML = element.price* element.amount
    tdControlls.appendChild(getControllsDiv())

    // Nadanie odpowiednich klas
    tr.classList.add("table-row")

    tdLp.classList.add("table-cell")
    tdName.classList.add("table-cell")
    tdPrice.classList.add("table-cell")
    tdAmount.classList.add("table-cell")
    tdCost.classList.add("table-cell")
    tdControlls.classList.add("table-cell")

    tr.id = "element-number-"+element.lp

    // Dodanie do widoku
    addTableCellAsLast(tr)

    tr.appendChild(tdLp)
    tr.appendChild(tdName)
    tr.appendChild(tdPrice)
    tr.appendChild(tdAmount)
    tr.appendChild(tdCost)
    tr.appendChild(tdControlls)

    tr.onclick = (event) => {
        let up = "Up"
        let down = "Down"
        let edit = "Edytuj"
        let del = "Usuń"

        let index = parseInt(tr.children[0].innerHTML) 
        if(event.target.value==up){
            console.log("UP"+index)
            if(index == 1) return
            swapElementsByIndexes(index-1,index-2)
            console.log("swaped"+index-1+""+index-2)
            pushStorageToLocalStorage()
            update()
        }
        else if(event.target.value==down){
            console.log("DOWN"+index)
            if(index == storage.length) return
            swapElementsByIndexes(index-1,index)
            console.log("swaped"+index-1+""+index)
            pushStorageToLocalStorage()
            update()
        }
        else if(event.target.value==edit){
            console.log("EDIT"+index)
            let element = storage[index-1]
            storage.splice(index-1,1)
            update()

            document.getElementById("text-add-name").value = element.name
            document.getElementById("text-add-price").value = element.price
            document.getElementById("text-add-amount").value = element.amount
            
            document.getElementById("text-submit").hidden = true
            document.getElementById("text-update-cancel").hidden = false
            document.getElementById("text-update").hidden =false


            document.getElementById("text-update-cancel").onclick =  function (){cancelButtonOnClickListener(element)}
            document.getElementById("text-update").onclick =updateButtonOnClickListener

        }
        else if(event.target.value==del){
            console.log("DEL"+index)
            storage.splice(index-1,1)
            pushStorageToLocalStorage()
            update()
        }
      }

}

function updateButtonOnClickListener(){
    document.getElementById("text-submit").hidden = false
    document.getElementById("text-update-cancel").hidden = true
    document.getElementById("text-update").hidden =true
    addButtonOnCLickListener()
}
function cancelButtonOnClickListener(element){
    document.getElementById("text-submit").hidden = false
    document.getElementById("text-update-cancel").hidden = true
    document.getElementById("text-update").hidden =true

    storage.push(element)
    update()
    console.log(element)
    clearAddForm()
}

function swapElementsByIndexes(indexA,indexB){
    let temp = storage[indexA]
    storage[indexA] = storage[indexB]
    storage[indexB] = temp
}

function getControllsDiv(){
    let up = "Up"
    let down = "Down"
    let edit = "Edytuj"
    let del = "Usuń" //WARN: redeklaracja wyżej - muszą się zgadzać

    let span = document.createElement("span")
    let buttonEdit = document.createElement("input")
    buttonEdit.type= "button"
    buttonEdit.value=edit
    span.appendChild(buttonEdit)

    let buttonDelete = document.createElement("input")
    buttonDelete.type= "button"
    buttonDelete.value=del
    buttonDelete.style.marginLeft="10px"
    span.appendChild(buttonDelete)

    let buttonUp = document.createElement("input")
    buttonUp.type= "button"
    buttonUp.value=up
    buttonUp.style.marginLeft="10px"
    span.appendChild(buttonUp)

    let buttonDown = document.createElement("input")
    buttonDown.type= "button"
    buttonDown.value=down
    buttonDown.style.marginLeft="10px"
    span.appendChild(buttonDown)

    return span    
}

function addTableCellAsLast(tableCellElement){
    let pointer = document.getElementById("table-row-add")
       
    pointer.parentElement.insertBefore(tableCellElement,pointer)

}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

function clearList(){
    let list = document.getElementsByClassName("table-row")
    while( list.length>0) list[0].remove()
}
function reenumerateStorage(){
    for(let i =0;i<storage.length;i++){
        storage[i].lp=i+1
    }
}

function addButtonInit(){
    let button = document.getElementById("text-submit")
    button.onclick =addButtonOnCLickListener 
}

function addButtonOnCLickListener(){
    let newObject = {}
    newObject.name = document.getElementById("text-add-name").value
    newObject.price = document.getElementById("text-add-price").value
    newObject.amount = document.getElementById("text-add-amount").value

    console.log(newObject)

    newObject = checkCorrectnessOfObject(newObject)

    if(newObject){
        hideAddingError()
        storage.push(newObject)
        pushStorageToLocalStorage()
        update()
        clearAddForm()

    }
    else{
        showAddingError()
    }

}

function showAddingError(){
    alert("Wprowadzono niepoprawne dane do paragonu! Sprawdź czy dane są wprowadzone w poprawnym formacie, nie są ujemne lub równe 0.");
}

function hideAddingError(){
    ;
}

function checkCorrectnessOfObject(object){
    if(object.name.length==0 ) return false
    
    if(object.price.length==0) return false
    object.price = parseFloat(object.price)
    if(object.price<=0) return false
    if(checkPrecision(object.price)==false) return false

    if(object.amount.length == 0) return false;
    object.amount=parseFloat(object.amount)
    if(object.amount <=0) return false


    return object
}

function checkPrecision(float){
    return ((Math.round(float*100)/100)==float)
}

function pullStorageFromLocalStorage(){
    storage = JSON.parse(localStorage["storage"] || "[]")
}

function pushStorageToLocalStorage(){
    localStorage["storage"] = JSON.stringify(storage)
}

function clearAddForm(){
    document.getElementById("text-add-name").value = ""
    document.getElementById("text-add-price").value = ""
    document.getElementById("text-add-amount").value = ""
}

window.onload = function (){
    addButtonInit()
    pullStorageFromLocalStorage()
    update()
}
