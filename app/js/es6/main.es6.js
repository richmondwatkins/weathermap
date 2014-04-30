/* global google:true */
/* jshint unused: false, camelcase: false*/
/* global AmCharts: true */
(function(){
  'use strict';
$(document).ready(init);

function init(){
initMap(36,-87, 3);
initGraph();
$('#go').click(show);
}

var map;

function initMap(lat, lng, zoom){

  let mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP};
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

function addMarker(lat, lng, name){
  let latLng = new google.maps.LatLng(lat, lng);
  new google.maps.Marker({map: map, position: latLng, title: name,}); //icon: './media/icon.jpg'
}


function show(){
  let input = $('#input').val().trim();
  let geocoder = new google.maps.Geocoder();

   geocoder.geocode({address: input}, (results, status)=>{
    let location = {};
    let name = results[0].formatted_address;
    let lat = results[0].geometry.location.lat();
    let lgn = results[0].geometry.location.lng();
    addMarker(lat,lgn, name);
    let latLng = new google.maps.LatLng(lat, lgn);
    map.setCenter(latLng);
    map.setZoom(10);

    get(lat, lgn);
  });
}

function get(lat, lgn) {
    var url = 'http://api.wunderground.com/api/f7683fa5314899af/forecast10day/q/'+lat+','+lgn+'.json?callback=?';
    $.getJSON(url, display);
  }



   function display(data){
    data.forecast.simpleforecast.forecastday.forEach(m=>chart.dataProvider.push({day:m.date.weekday, tempLow:m.low.fahrenheit, tempHigh:m.high.fahrenheit}));
    chart.validateData();
  }


 var chart;
  function initGraph(){
    chart = AmCharts.makeChart('graph', {
    'type': 'serial',
    'theme': 'chalk',
    'pathToImages': 'http://www.amcharts.com/lib/3/images/',
    'legend': {
        'useGraphSettings': true
    },
    'dataProvider': [],
    'valueAxes': [{
        'id':'v1',
        'minimum': 0,
        'maximum': 100,
        'axisColor': '#FF6600',
        'axisThickness': 2,
        'gridAlpha': 0,
        'axisAlpha': 1,
        'position': 'left'
    }],
    'graphs': [{
        'valueAxis': 'v1',
        'lineColor': '#FF6600',
        'bullet': 'round',
        'bulletBorderThickness': 1,
        'hideBulletsCount': 30,
        'title': 'Daily Low',
        'valueField': 'tempLow',
        'fillAlphas': 0
    }, {
        'valueAxis': 'v1',
        'lineColor': '#B0DE09',
        'bullet': 'triangleUp',
        'bulletBorderThickness': 1,
        'hideBulletsCount': 30,
        'title': 'Daily High',
        'valueField': 'tempHigh',
        'fillAlphas': 0
    }],
    'chartCursor': {
        'cursorPosition': 'mouse'
    },
    'categoryField': 'day',
    'categoryAxis': {
        'axisColor': '#DADADA',
        'minorGridEnabled': true
    }
    });
  }

// function weather(conditions){
//   var tempLow = conditions.forecast.simpleforecast.forecastday.map(lowTemps).forEach(display);
//   var  tempHigh = conditions.forecast.simpleforecast.forecastday.map(highTemps).forEach(display);
//   var  day = conditions.forecast.simpleforecast.forecastday.map(days).forEach(display);
//   console.log(conditions);
//
//   display(day,tempLow,tempHigh);
// }

// function display(day, tempLow, tempHigh){
//   // console.log(day, tempLow, tempHigh);
//   chart.dataProvider.push(day, tempLow, tempHigh);
//   // debugger;
//   chart.validateData();
// }


  //  function lowTemps(conditions) {
  //    return conditions.low.fahrenheit;
  //  }
  //
  //  function highTemps(conditions) {
  //    return conditions.high.fahrenheit;
  //  }
  //
  //
  // function days(conditions) {
  //   return conditions.date.weekday;
  // }

})();
