async function checkWeather(){
 
  let firstApiKey = `3fc8a028655f363852aca1b09b46c610`;
  // let secondApiKey = `c8af1b4e2ad0ac98b2c469ae954cf6e4`;
  let thirdApiKey = `LYm1OxxMN7DboBPjyb1qPjCGyjflwEYk`;


  let cityInput = document.getElementById('cityInput');
  let cityName = cityInput.value;

  if(!cityName){
    alert("Please enter a city name");
  }

  document.getElementById('cityInput').disable = true;
  document.getElementById('button').disable = true;
  document.getElementById('loading').classList.add('spinner-border');


   try{


    const [openWeather, accuWeather] = await Promise.all([
      fetchOpenWeatherApi(cityName),
      fetchAccuWeatherApi(cityName)
    ]);

    // console.log(openWeather);
    // console.log(accuWeather);

    let resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
 <div class="row row-cols-1 row-cols-md-2 g-4 mt-2">

  <div class="col">
    <div class="card h-100 border p-4 border-dark bg-dark text-white">
      <div class="card-body">
        <i class="fa-solid fa-cloud" style="color: #dee0e3;"></i>
        <h4 class="card-title text-center">Open Weather api</h4>
        <h5 class="card-title text-center" text-center>${openWeather.cityName}</h5>
        <p class="card-text text-center"><i class="fa-solid fa-sun fa-lg" style="color: #c1c5cd;"></i>Weather : ${openWeather.weather}</p>
        <p class="card-text text-center">Description : ${openWeather.description}</p>
        <p class="card-text text-center"><i class="fa-solid fa-temperature-three-quarters fa-lg" style="color: #c1c5cd;"></i> Temperature : ${openWeather.temperature}°C</p>
        <p class="card-text text-center"><i class="fa-solid fa-cloud-rain fa-lg" style="color: #c1c5cd;"></i> Humidity : ${openWeather.humidity}</p>
        <p class="card-text text-center"><i class="fa-solid fa-wind fa-lg" style="color: #c1c5cd;"></i> Wind-Speed : ${openWeather.windSpeed}</p>
        <p class="card-text text-center"><i class="fa-solid fa-wind fa-lg" style="color: #c1c5cd;"></i>Wind-Degree : ${openWeather.windDeg}</p>
      </div>
    </div>
  </div>

  <div class="col">
    <div class="card h-100 p-4 border-dark bg-dark text-white">
      <div class="card-body">
        <i class="fa-solid fa-cloud" style="color: #dee0e3;"></i>
        <h4 class="card-title text-center">Weather Stack Api</h4>
        <h5 class="card-title text-center">${openWeather.cityName}</h5>
        <p class="card-text text-center"><i class="fa-solid fa-sun fa-lg" style="color: #c1c5cd;"></i>Weather : ${accuWeather.weather}</p>
        <p class="card-text text-center">Local-time : ${accuWeather.date}</p>
        <p class="card-text text-center"><i class="fa-solid fa-temperature-three-quarters fa-lg" style="color: #c1c5cd;"></i>Temperature : ${accuWeather.temperature}°C</p>
        <p class="card-text text-center"><i class="fa-solid fa-cloud-rain fa-lg" style="color: #c1c5cd;"></i> Humidity : ${accuWeather.humidity}</p>
        <p class="card-text text-center"><i class="fa-solid fa-wind fa-lg" style="color: #c1c5cd;"></i> Day-time : ${accuWeather.daytime}</p>
        <p class="card-text text-center"><i class="fa-solid fa-wind fa-lg" style="color: #c1c5cd;"></i> Night-time : ${accuWeather.nighttime}</p>
      </div>
    </div>
  </div>
</div>
    `

    let feedBack = document.getElementById('feedback');
    feedBack.innerHTML = `
    <div class="input-group flex-nowrap mt-3 mb-5">
       <input type="text" id="cityInput" class="form-control" placeholder="Give your feed back about this project" aria-label="Username" aria-describedby="addon-wrapping">
       <button class="input-group-text" id="button">Submit</button>
    </div>
    `
    
  document.getElementById('cityInput').disable = false;
  document.getElementById('button').disable = false;
  document.getElementById('loading').style.display = 'none';
  cityInput.value = '';
  
   }catch(err){

    let resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
     <h3 class="text-danger text-center mt-5">Error occurs while fetching weather data: ${err.message}</h3>   
    `

   let feedBack = document.getElementById('feedback');
    feedBack.innerHTML = `
    <div class="input-group flex-nowrap mt-3 mb-5">
       <input type="text" id="cityInput" class="form-control" placeholder="Give your feed back about this project" aria-label="Username" aria-describedby="addon-wrapping">
       <button class="input-group-text bg-dark text-white" id="button">Submit</button>
    </div>
    `

    document.getElementById('cityInput').disable = false;
    document.getElementById('button').disable = false;
    document.getElementById('loading').style.display = 'none';
    cityInput.value = '';
   }

  async function fetchOpenWeatherApi(cityName){
    let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${firstApiKey}`);
    let data = await res.json();

    if(res.ok){
      return {
        cityName : data.name,
        weather : data.weather[0].main,
        description : data.weather[0].description,
        temperature : data.main.temp,
        humidity : data.main.humidity,
        windSpeed : data.wind.speed,
        windDeg : data.wind.deg
      };
    }else{
      throw new Error("Could get teh OpenweatherApi", data.message);
    }
  }

  // async function fetchWeatherStackApi(cityName){
  //   let res = await fetch(`http://api.weatherstack.com/current?access_key=${secondApiKey}&query=${cityName}`);
  //   let data = await res.json();
  //   console.log("WeatherStack", data);
  //   if(res.ok){
  //     return {
  //       cityName : data.location.name,
  //       locationTime : data.location.localtime,
  //       weather : data.current.weather_descriptions[0],
  //       temperature : data.current.temperature,
  //       humidity : data.current.humidity,
  //       windSpeed : data.current.wind_speed,
  //       windDeg : data.current.wind_degree,
  //     };
  //   }else{
  //     throw new Error("Could get teh OpenweatherApi", data.message);
  //   }
    
  // }


  // Accu Weather APi

  async function fetchForeCast(cityCode){
    let res = await fetch(`https://dataservice.accuweather.com/forecasts/v1/daily/1day/${cityCode}?apikey=${thirdApiKey}`);
    let data = await res.json();
    return data;
  }

  async function fetchAccuWeatherApi(cityName){
    // Getting city code from the location api
    let res = await fetch(`https://dataservice.accuweather.com/locations/v1/search?q=${cityName}&apikey=${thirdApiKey}`);
    let data = await res.json();
    let foreCast = await fetchForeCast(data[0].Key); 
      
    if(res.ok){
      return {
        weather : foreCast.Headline.Category,
        description : foreCast.Headline.Text,
        date : foreCast.DailyForecasts[0].Date,
        temperature : foreCast.DailyForecasts[0].Temperature.Maximum.Value,
        humidity : foreCast.DailyForecasts[0].Temperature.Minimum.Value,
        daytime : foreCast.DailyForecasts[0].Day.IconPhrase, 
        nighttime : foreCast.DailyForecasts[0].Night.IconPhrase
      }
    }else{
      throw new Error("Could get teh OpenweatherApi", data.message);
    }
  }
}
