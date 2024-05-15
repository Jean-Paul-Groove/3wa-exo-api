const geolocationButton = document.querySelector("#geolocation");
geolocationButton.addEventListener("click", getMyLocation);
const adressElement = document.querySelector("#adress");
const adressLabel = document.querySelector("#adress-label");
async function getMyLocation(e) {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    const crd = pos.coords;
    displayAdress(crd.longitude, crd.latitude);
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
}

async function displayAdress(long, lat) {
  const adressQuery = await fetch(
    `https://api-adresse.data.gouv.fr/reverse/?lat=${lat}&lon=${long}`
  );
  const adressResult = await adressQuery.json();

  adressLabel.innerText = adressResult.features[0].properties.label;
}
