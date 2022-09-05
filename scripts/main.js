import tabJoursEnOrdre from './Utilitaire/gestionTemps.js'

// console.log (tabJoursEnOrdre)

const CLEFAPI = '1257511eea399e94c32d2f8aa211e3c7';
let resultatsAPI;

const temps = document.querySelector('.temps');
const temperature = document.querySelector('.temperature');
const localisation = document.querySelector('.localisation');
const heure = document.querySelectorAll('.heure-nom-prevision');
const tempPourH = document.querySelectorAll('.heure-prevision-valeur');
const joursDiv = document.querySelectorAll('.jour-prevision-nom');
const tempsJoursDiv = document.querySelectorAll('.jour-prevision-temp');
const imgIcone = document.querySelector('.logo-meteo');
const chargementContainer = document.querySelector('.overlay-icone-chargement');
const messageBienvenue = document.querySelector('.bienvenue');

//Creation de la demande de possition et stockage de la longitude et latitude 
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {


        let long = position.coords.longitude; //stockage de longitude
        let lat = position.coords.latitude; //stockage de latitude
        AppelAPI(long, lat);

    }, () => {
        alert("Vous avez refuser la géolocalisation")
    })
}


function AppelAPI(long, lat) {

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${CLEFAPI}`)
        .then((reponse) => {
            return reponse.json();
        })
        .then((data) => {
            console.log(data);

            resultatsAPI = data;

            temps.innerText = resultatsAPI.current.weather[0].description;
            temperature.innerText = `${Math.trunc(resultatsAPI.current.temp)}°`;
            localisation.innerText = resultatsAPI.timezone;


            //les heures par tranche de 3 avec leurs temperatures

            let heureActuelle = new Date().getHours();

            for (let i = 0; i < heure.length; i++) {

                let heureIncr = heureActuelle + i * 3;

                if (heureIncr > 24) {
                    heure[i].innerText = `${heureIncr - 24} h`;
                }
                else if (heureIncr === 24) {
                    heure[i].innerText = "00 h";
                }
                else {
                    heure[i].innerText = `${heureIncr} h`;
                }
            }

            //temps par tranche de 3 heures
            for (let j = 0; j < tempPourH.length; j++) {
                tempPourH[j].innerText = `${Math.trunc(resultatsAPI.hourly[j * 3].temp)}°`;
            }

            //trois premiere lettre du jour

            for (let k = 0; k < tabJoursEnOrdre.length; k++) {
                joursDiv[k].innerText = tabJoursEnOrdre[k].slice(0, 3);
            }

            //temperature par jour 
            for (let m = 0; m < 7; m++) {
                tempsJoursDiv[m].innerText = `${Math.trunc(resultatsAPI.daily[m + 1].temp.day)}°`
            }

            //icone meteo dynamique et message bienvenue
            if (heureActuelle >= 6 && heureActuelle < 21) {
                imgIcone.src = `ressources/jour/${resultatsAPI.current.weather[0].icon}.svg`
                messageBienvenue.innerText = `Il fait jour`;
            }
            else {
                imgIcone.src = `ressources/nuit/${resultatsAPI.current.weather[0].icon}.svg`
                messageBienvenue.innerText = `Il fait nuit`;
            }

            messageBienvenue.innerHTML += `<br> Nous sommes ${tabJoursEnOrdre[0]}`;
            chargementContainer.classList.add('disparition');

        })

}