let storage = [];

function update(){
    // wyczyszczenie listy
    let list = document.getElementsByClassName("table-row")
    while( list.length>0) list[0].remove()

    // wygenerowanie nowej numeracji
    for(let i =0;i<storage.length;i++){
        storage[i].lp=i+1
    }

    // wygenerowanie nowej listy z storage
    storage.forEach(element=>{
        createRow(element)
    })

    // ustawienie sumy
    let sum = 0.0
    if(storage.length !== 0) {
        sum = storage.map(element=>element.price*element.amount).reduce((a,b)=>{return a+b})
        sum = sum.toFixed(2)
    }
    document.getElementById("field_sum").innerHTML = sum + " zł"
}

function createRow(element){
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
    tdPrice.innerHTML = element.price.toFixed(2) + " zł"
    tdAmount.innerHTML = element.amount
    tdCost.innerHTML = (element.price*element.amount).toFixed(2)
    tdControlls.appendChild(getControlsDiv())

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
    let pointer = document.getElementById("table-row-add")
    pointer.parentElement.insertBefore(tr, pointer)

    tr.appendChild(tdLp)
    tr.appendChild(tdName)
    tr.appendChild(tdPrice)
    tr.appendChild(tdAmount)
    tr.appendChild(tdCost)
    tr.appendChild(tdControlls)

    tr.onclick = (event) => {
        let index = parseInt(tr.children[0].innerHTML) 
        if(event.target.id==="button-up"){
            if(index === 1) return
            swapElementsByIndexes(index-1,index-2)
            updateLocalStorage()
            update()
        }
        else if(event.target.id==="button-down"){
            if(index === storage.length) return
            swapElementsByIndexes(index-1,index)
            updateLocalStorage()
            update()
        }
        else if(event.target.id==="button-edit"){
            let element = storage[index-1]
            storage.splice(index-1,1)
            update()

            document.getElementById("text-add-name").value = element.name
            document.getElementById("text-add-price").value = element.price
            document.getElementById("text-add-amount").value = element.amount

            document.getElementById("button-add").hidden = true
            document.getElementById("button-cancel").hidden = false
            document.getElementById("button-confirm").hidden =false


            document.getElementById("button-cancel").onclick = function () {
                cancelButtonOnClick(element)
            }

            document.getElementById("button-confirm").onclick = updateButtonOnClick

        }
        else if(event.target.id==="button-delete"){
            storage.splice(index-1,1)
            updateLocalStorage()
            update()
        }
      }

}

function updateButtonOnClick(){
    document.getElementById("button-add").hidden = false
    document.getElementById("button-cancel").hidden = true
    document.getElementById("button-confirm").hidden =true
    addNewObjectFromForm()
}

function cancelButtonOnClick(element){
    document.getElementById("button-add").hidden = false
    document.getElementById("button-cancel").hidden = true
    document.getElementById("button-confirm").hidden =true

    storage.push(element)
    update()
    resetForm()
}

function swapElementsByIndexes(indexA,indexB){
    let temp = storage[indexA]
    storage[indexA] = storage[indexB]
    storage[indexB] = temp
}

function getControlsDiv(){
    let span = document.createElement("span")
    let buttonEdit = document.createElement("input")
    buttonEdit.type= "button"
    buttonEdit.id="button-edit"
    buttonEdit.classList.add("control-buttons")
    span.appendChild(buttonEdit)

    let buttonDelete = document.createElement("input")
    buttonDelete.type= "button"
    buttonDelete.id="button-delete"
    buttonDelete.classList.add("control-buttons")
    buttonDelete.style.marginLeft="10px"
    span.appendChild(buttonDelete)

    let buttonUp = document.createElement("input")
    buttonUp.type= "button"
    buttonUp.id="button-up"
    buttonUp.classList.add("control-buttons")
    buttonUp.style.marginLeft="10px"
    span.appendChild(buttonUp)

    let buttonDown = document.createElement("input")
    buttonDown.type= "button"
    buttonDown.id="button-down"
    buttonDown.classList.add("control-buttons")
    buttonDown.style.marginLeft="10px"
    span.appendChild(buttonDown)

    return span    
}

function addNewObjectFromForm(){
    let newObject = {}
    newObject.name = document.getElementById("text-add-name").value
    newObject.price = document.getElementById("text-add-price").value
    newObject.amount = document.getElementById("text-add-amount").value

    // sprawdzenie poprawności danych w obiekcie
    if (newObject.price.length === 0 ||
        newObject.amount.length === 0) {

        newObject = false
        alert("Wprowadzono błędne dane!")
    } else {
        newObject.price = parseFloat(newObject.price)
        newObject.amount=parseInt(newObject.amount)
    }

    if (newObject.name.length === 0 ||
        newObject.price<=0 ||
        !((Math.round(newObject.price*100)/100) === newObject.price) ||
        newObject.amount <=0) {

        newObject = false
        alert("Wprowadzono błędne dane!")
    }

    // dodanie obiektu
    if(newObject){
        storage.push(newObject)
        updateLocalStorage()
        update()
        resetForm()
    }
}

function updateLocalStorage(){
    localStorage["storage"] = JSON.stringify(storage)
}

function resetForm(){
    document.getElementById("text-add-name").value = ""
    document.getElementById("text-add-price").value = ""
    document.getElementById("text-add-amount").value = ""
}

window.onload = function (){
    // inicjalizacja przycisku dodawania
    let button = document.getElementById("button-add")
    button.onclick = addNewObjectFromForm

    // pobranie danych z local storage
    storage = JSON.parse(localStorage["storage"] || "[]")

    // aktualizacja widoku
    update()
}
