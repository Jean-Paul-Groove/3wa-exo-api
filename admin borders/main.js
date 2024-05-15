const regionQuery = await fetch('https://geo.api.gouv.fr/regions')
const regions = await regionQuery.json() 
let selectedRegion
let departements = []
let selectedDepartement

const regionSelect = document.querySelector('#region-select')
const departementSelect = document.querySelector('#departement-select')
const communesForm = document.querySelector('#territory-selection')
const communeListElement = document.querySelector('#commune-list')
console.log(regions)
for(const region of regions){
const optionElement = document.createElement('option')
optionElement.value = region.code
optionElement.innerText = region.nom
regionSelect.append(optionElement)
}

regionSelect.addEventListener("change", onRegionSelection)
async function onRegionSelection(e){
    departements = []
    if(e.target.value !=="null"){
        const departementQuery = await fetch(`https://geo.api.gouv.fr/regions/${e.target.value}/departements`)
        departements = await departementQuery.json()
    }else{
        communeListElement.innerHTML=''
        selectedDepartement = undefined
    }
    departementSelect.innerHTML = ''
    for(const dep of departements){
        const optionElement = document.createElement('option')
        optionElement.value = dep.code
        optionElement.innerText = dep.nom
        departementSelect.append(optionElement)
        }
}

departementSelect.addEventListener("change", onDepartementSelection)

function onDepartementSelection(e){
    if(e.target.value){
      selectedDepartement = {code: e.target.value}
    }else{
        selectedDepartement = undefined
        communeListElement.innerHTML =''
    }
}
communesForm.addEventListener("submit", displayCommunes)

async function displayCommunes(e){
    e.preventDefault()
    if(selectedDepartement){

        const communeQuery = await fetch(`https://geo.api.gouv.fr/departements/${selectedDepartement.code}/communes`)
        const communesList = await communeQuery.json()
        communesList.sort((a,b)=> b.population-a.population)
        console.log(communesList)
        for(const commune of communesList){

           const li = document.createElement('li')
           li.innerText = `${commune.nom} - ${commune.population} habitants`
           communeListElement.append(li)
        }
    }
}
