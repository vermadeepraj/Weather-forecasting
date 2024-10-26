const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoText = inputPart.querySelector(".info-text"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i");


const key = "22316fcfde43761c66be68a84c39e73b";

let api;
inputField.addEventListener("keyup", e =>{
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});



locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser not support geolocation api");
    }
});



function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;
    fetchData();
}



function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    fetchData();
}



function onError(error){
    infoText.innerText = error.message;
    infoText.classList.add("error");
}



function fetchData(){
    infoText.innerText = "Getting weather details...";
    infoText.classList.add("pending");
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoText.innerText = "Something went wrong";
        infoText.classList.replace("pending", "error");
    });
}



function weatherDetails(info){
    if(info.cod == "404"){
        infoText.classList.replace("pending", "error");
        infoText.innerText = `${inputField.value} isn't a valid city name`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;
        if(id == 800){
            wIcon.src = "icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "icons/storm.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "icons/rain.svg";
        }
        
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp)-273;
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like)-273;
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoText.classList.remove("pending", "error");
        infoText.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}
arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});