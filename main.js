/*
1. Get latitude & longitude coordinates
        - geolocation API in the browser
2. Get "point" data:
                                           👇 latitude,longitude
        GET https://api.weather.gov/points/39.7456,-97.0892

        Target Data from the Response Body:
            data.properties.forecastHourly
                - An API URL for retrieving hourly forecast data.
3. Get hourly "forecast" data
        GET https://api.weather.gov/gridpoints/TOP/31,80/forecast/hourly

        Target Data from the Response Body:
            data.properties.periods
                - An array of hourly weather periods
                - A "weather period" object:
                    {
                        "number": 1,
                        "name": "",
                        "startTime": "2021-10-18T09:00:00-05:00",
                        "endTime": "2021-10-18T10:00:00-05:00",
                        "isDaytime": true,
                        "temperature": 52,
                        "temperatureUnit": "F",
                        "temperatureTrend": null,
                        "windSpeed": "15 mph",
                        "windDirection": "S",
                        "icon": "https://api.weather.gov/icons/land/day/skc?size=small",
                        "shortForecast": "Sunny",
                        "detailedForecast": ""
                    }
*/
//default location data
let mainElement = document.querySelector("main")

let lat = 39.7456
let long = -97.0892
console.log(navigator.geolocation.getCurrentPosition(success, error))

function success(position){
    lat = position.coords.latitude
    long = position.coords.longitude
    fetch(`https://api.weather.gov/points/${lat},${long}`)
    .then(response => response.json())
    .then(data => {
        let hourlyForecastURL = data.properties.forecastHourly
        // console.log(hourlyForecastURL)
        getHourlyForecast(hourlyForecastURL)
    })
}

function error(){
    console.log("error getting geolocation data")
}


function getHourlyForecast(url){
    fetch(url)
    .then(response => response.json())
    .then(data => {
        let hourlyForecastArray = data.properties.periods
        // console.log(hourlyForecastArray)
        displayForecast(hourlyForecastArray)
    })
}

function displayForecast(arr){
    for (let index = 0; index < 12; index += 1){
        let currentItem = arr[index]
        let weatherCard = document.createElement("div")
        weatherCard.classList.add("weatherCard")
        mainElement.append(weatherCard)
        let time = document.createElement("p")
        time.append(currentItem.startTime.slice(11, 16))
        weatherCard.append(time)
        let weatherIcon = document.createElement("img")
        weatherIcon.src = currentItem.icon
        weatherCard.append(weatherIcon)
        let weatherDescription = document.createElement("h3")
        weatherDescription.append(currentItem.shortForecast)
        weatherCard.append(weatherDescription)
        let temperature = document.createElement("p")
        temperature.append(`${currentItem.temperature} ${currentItem.temperatureUnit}`)
        weatherCard.append(temperature)
    }
}
