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
        generateNewRowByObject(element)
    })

    // ustawienie sumy
    let sum
    if(storage.length === 0) {
        sum = 0.0
    } else {
        sum = storage.map(element=>element.price*element.amount).reduce((a,b)=>{return a+b})
    }
    document.getElementById("field_sum").innerHTML = sum + " zł"
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
        let up = "Up"
        let down = "Down"
        let edit = "Edytuj"
        let del = "Usuń"

        let index = parseInt(tr.children[0].innerHTML) 
        if(event.target.value==up){
            if(index == 1) return
            swapElementsByIndexes(index-1,index-2)
            updateLocalStorage()
            update()
        }
        else if(event.target.value==down){
            if(index == storage.length) return
            swapElementsByIndexes(index-1,index)
            updateLocalStorage()
            update()
        }
        else if(event.target.value==edit){
            let element = storage[index-1]
            storage.splice(index-1,1)
            update()

            document.getElementById("text-add-name").value = element.name
            document.getElementById("text-add-price").value = element.price
            document.getElementById("text-add-amount").value = element.amount
            
            document.getElementById("text-submit").hidden = true
            document.getElementById("text-update-cancel").hidden = false
            document.getElementById("text-update").hidden =false


            document.getElementById("text-update-cancel").onclick = function () {
                cancelButtonOnClick(element)
            }

            document.getElementById("text-update").onclick = updateButtonOnClick

        }
        else if(event.target.value==del){
            storage.splice(index-1,1)
            updateLocalStorage()
            update()
        }
      }

}

function updateButtonOnClick(){
    document.getElementById("text-submit").hidden = false
    document.getElementById("text-update-cancel").hidden = true
    document.getElementById("text-update").hidden =true
    addButtonOnCLickListener()
}

function cancelButtonOnClick(element){
    document.getElementById("text-submit").hidden = false
    document.getElementById("text-update-cancel").hidden = true
    document.getElementById("text-update").hidden =true

    storage.push(element)
    update()
    clearAddForm()
}

function swapElementsByIndexes(indexA,indexB){
    let temp = storage[indexA]
    storage[indexA] = storage[indexB]
    storage[indexB] = temp
}

function getControlsDiv(){
    let up = "Up"
    let down = "Down"
    let edit = "Edytuj"
    let del = "Usuń"

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

function addButtonOnCLickListener(){
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
        newObject.amount=parseFloat(newObject.amount)
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
        clearAddForm()
    }
}

function updateLocalStorage(){
    localStorage["storage"] = JSON.stringify(storage)
}

function clearAddForm(){
    document.getElementById("text-add-name").value = ""
    document.getElementById("text-add-price").value = ""
    document.getElementById("text-add-amount").value = ""
}

window.onload = function (){
    // inicjalizacja przycisku dodawania
    let button = document.getElementById("text-submit")
    button.onclick = addButtonOnCLickListener

    // pobranie danych z local storage
    storage = JSON.parse(localStorage["storage"] || "[]")

    // aktualizacja widoku
    update()
}
