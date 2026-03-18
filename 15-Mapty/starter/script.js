'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const create_btn = document.querySelector(".action-button-create");
const delete_btn = document.querySelector(".action-button-delete");
const reset_btn = document.querySelector(".action-button-reset");
const map = L.map("map");

let workouts = localStorage.getItem("workouts") != "" ? JSON.parse(localStorage.getItem("workouts")) : [];
let markers = []
let action_mode = "normal";

form.addEventListener("submit", e =>{
    e.preventDefault();
})

navigator.geolocation.getCurrentPosition(mapEvent =>{
    displayMap(mapEvent.coords)
}, _ =>{
    displayMap();
})

function displayMap(coords = { "latitude": 52.753079784853185, "longitude": 18.261690120407142}){
    const latlng = [coords.latitude,coords.longitude];
    map.setView(latlng, 13)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);

    //? LOCAL STORAGE
    workouts.forEach(workout =>{
        displayExcercise(workout);
        displayMarker(workout.latlng,workout.type);
    })

    create_btn.addEventListener("click", e =>{
        action_mode = "create";
        form.classList.remove("hidden");
        inputDistance.focus()
    })

    map.on("click", submitWokrout)
}

function verifyInputs(...inputs){
    return inputs.every(input =>{
        return Number.isFinite(+input) && +input > 0;
    })
}

function displayMarker(latlng,activity){
    const marker = L.marker(latlng).bindPopup(
    L.popup({
        autoClose:false,
        closeButton:false,
        closeOnClick:false,
        className: activity == "running" ? "leaflet-popup running-popup" : "leaflet-popup cycling-popup"})
    .setContent(`${inputType.value[0].toUpperCase()}${inputType.value.slice(1)} on ${(new Date()).toLocaleDateString()}`))
    marker.addTo(map).openPopup();
    markers.push(marker)
}

function submitWokrout(clickEvent){
    if(action_mode != "create") return;
    if(!verifyInputs(inputDistance.value,inputDuration.value, inputType.value === "running" ? inputCadence.value : inputElevation.value)) return;

    workouts.unshift(
        {
            id: Date.now()+"".slice(-9),
            type: inputType.value,
            distance: inputDistance.value,
            duration: inputDuration.value,
            cadence: inputCadence.value,
            elevation: inputElevation.value,
            latlng: clickEvent.latlng,
        }
    )

    displayExcercise(workouts[0])
    displayMarker(clickEvent.latlng,inputType.value)
    localStorage.setItem("workouts",JSON.stringify(workouts))

    action_mode = "normal";
    form.classList.add("hidden");
    inputDistance.value = '';
    inputDuration.value = '';
    inputCadence.value = '';
    inputElevation.value = '';
}

inputType.addEventListener("change", e=>{
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden")
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden")
})


function displayExcercise(workout) {
    let html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${inputType.value[0].toUpperCase()}${inputType.value.slice(1)} on ${(new Date()).toLocaleDateString()}</h2>
        <div class="workout__details">
            <span class="workout__icon">🏃‍♂️</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
        </div>
        <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${(workout.duration/workout.distance).toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
        </div>
    `
    html += workout.type === "running" ?
    `<div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
        </div>
    </li>` :
    `<div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevation}</span>
            <span class="workout__unit">m</span>
        </div>
    </li>`
    form.insertAdjacentHTML("afterend",html);
}


reset_btn.addEventListener("click", _ =>{
    localStorage.setItem("workouts", "");
    [...document.querySelectorAll(".workout")].forEach( el =>{
        el.remove();
    })
    markers.forEach(el => {
        el.remove();
    })
})


containerWorkouts.addEventListener("click", e=>{
    const workout = e.target.closest(".workout")
    if(!workout) return;
    const workoutData = workouts.find(wrkout =>{
        return wrkout.id ==  workout.dataset.id;
    })
    if(action_mode === "normal"){
        map.setView(workoutData.latlng, 13, {
            animate: true,
            pan: {
                duration: 0.6,
            },
        })
    }
    else if(action_mode === "delete"){
        workout.remove();
        markers.find(marker =>{return marker._latlng.lat === workoutData.latlng.lat}).remove();
        workouts.splice(workouts.indexOf(workoutData),1)
        localStorage.setItem("workouts",JSON.stringify(workouts))
        action_mode = "normal";
    }
})

delete_btn.addEventListener("click", _ =>{
    action_mode = "delete";
})
