const geolocationButton = document.querySelector("#geolocation")
geolocationButton.addEventListener("click", getMyLocation)
async function getMyLocation(e){
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
      
      async function success(pos) {
        const crd = pos.coords;
        const cinemaNear = await getCinemaList(0, {lat:crd.latitude,lon:crd.longitude})
        displayCinemas(cinemaNear.results, 'Cinemas proches de vous', cinemaNear.total_count)
        displayPagination(cinemaNear)
      }
      
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
      
      navigator.geolocation.getCurrentPosition(success, error, options);
}
async function getCinemaList(offset=0, coordinates =undefined){
  let cinemaQuery
  if(coordinates){
  cinemaQuery = await fetch(`https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/records?where=within_distance(geolocalisation%2C%20geom'POINT(${coordinates.lon} ${coordinates.lat})',10km)&limit=100`)
  }else{
    cinemaQuery = await fetch('https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/records?limit=100&offset='+offset)

  }
const cinemaList = await cinemaQuery.json()
return cinemaList
}
const cinemaList = await getCinemaList()
const cinemaListElement = document.querySelector('#cinema-list')
const allButton = document.querySelector('#all')
const h1 =document.querySelector('h1')
const h2 =document.querySelector('h2')
const pagination = document.querySelector('#pagination')
let currentPage = 1
function displayCinemas(list, title, count){
  h1.innerText = title
  h2.innerText = count + ' cinemas au total'
  cinemaListElement.innerHTML=''
  for(const cinema of list){
   const li = document.createElement('li')
   const name = document.createElement('p')
   name.innerText = cinema.nom
   const adress = document.createElement('p')
   adress.innerText = cinema.adresse
   const city = document.createElement('p')
   city.innerText = cinema.commune
   li.append(name)
   li.append(adress)
   li.append(city)
   cinemaListElement.append(li)
  }
}
function displayPagination(queryResult){
  pagination.innerHTML =''
  const totalCount = queryResult.total_count
  if(totalCount){
    const numberOfPages = Math.ceil(totalCount /100)
    if(numberOfPages <=1){
      return
    }
    for(let i =1; i<=numberOfPages; i++){
      const pageButton = document.createElement("button")
      pageButton.innerText = i
      pagination.append(pageButton)
      pageButton.addEventListener("click",async (e)=> await changePage(e, i))
    }
  }
}
async function changePage(e,pageNumber){
  e.preventDefault()
  if(currentPage===pageNumber){
    return
  }
  currentPage = pageNumber
  const newList =await getCinemaList((pageNumber-1)*100)
  displayCinemas(newList.results, 'Cinemas en France, page '+pageNumber, newList.total_count)
}
function init(){
  currentPage =1
  displayCinemas(cinemaList.results,'Cinemas en France, page '+currentPage, cinemaList.total_count )
  displayPagination(cinemaList)
}
init()
allButton.addEventListener("click", (e)=> init())
