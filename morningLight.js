$( document ).ready(function() {

var positionMessage = document.getElementById("positionMessage");
var timeBefore = document.getElementById("timeBefore").value;
var alarmTimeEl = document.getElementById("alarmTime");

var lat;
var lng;


// Find Tomorrow
  moment.updateLocale('en', {
    calendar : {
        lastDay : '[Yesterday]',
        sameDay : '[Today]',
        nextDay : 'YYYY-MM-DD',
        lastWeek : '[Last] dddd',
        nextWeek : '[Next] dddd',
        sameElse : 'L'
    }
  });
  var tomorrow = moment().add(1, 'days').calendar(); 


// Asks the user for their location:
  function getLatLng() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onPositionUpdate);
    } else {
      alert("navigator.geolocation is not available");
    }
  }


// Sets the latitude and Longitude for the location of the user's browser:
  function onPositionUpdate(position) {
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      fetchSunrise();
  }


// Get the sunrise times
  function fetchSunrise(){
    
    var queryURL = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${tomorrow}&formatted=0`;
        
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {

        // RESPONSE: 
        console.log(response);

        // GET TIMES:
        var initialSunrise = response.results.sunrise;
        var initialAstroTwilight = response.results.astronomical_twilight_begin;
        var initialNauticalTwilight = response.results.nautical_twilight_begin;
        var initialCivilTwilight = response.results.civil_twilight_begin;

        var myTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        var sunriseTimeUgly = moment(initialSunrise).tz(myTimezone);


        var sunriseTime = moment(sunriseTimeUgly).format("h:mm");

        positionMessage.textContent= `Tomorrow the sun will rise at ${sunriseTime}`;



      // Set Alarm Time
        alarmTime = moment(sunriseTimeUgly).subtract(timeBefore, 'minutes').format("'LT'");
        console.log(`Alarmtime is ${alarmTime}`);
        alarmTimeEl.textContent = alarmTime;



        

      });
  }

  

getLatLng();

 
}); // DOCUMENT READY