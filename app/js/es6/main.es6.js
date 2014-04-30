/* global google:true */
/* jshint unused: false, camelcase: false*/
/* global AmCharts: true */
(function(){
  'use strict';
$(document).ready(init);

function init(){
initMap(36,-87, 3);
$('#go').click(add);
}

var map;
var chart = {};

function initMap(lat, lng, zoom){

  let mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP};
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

function addMarker(lat, lng, name){
  let latLng = new google.maps.LatLng(lat, lng);
  new google.maps.Marker({map: map, position: latLng, title: name,}); //icon: './media/icon.jpg'
}

function add(){
  let zip = $('#input').val().trim();
  show(zip);
  get(zip);
}

function show(zip){

  let geocoder = new google.maps.Geocoder();

   geocoder.geocode({address: zip}, (results, status)=>{
    let location = {};
    let name = results[0].formatted_address;
    let lat = results[0].geometry.location.lat();
    let lgn = results[0].geometry.location.lng();
    addMarker(lat,lgn, name);
    let latLng = new google.maps.LatLng(lat, lgn);
    map.setCenter(latLng);
    map.setZoom(10);
  });
}

function get(zip) {
    var url = 'http://api.wunderground.com/api/f7683fa5314899af/forecast10day/q/'+zip+'.json?callback=?';
    $.getJSON(url, data=>{
      $('#graphs').append(`<div class=graph data-zip=${zip}></div>`);
    initGraph(zip);
    data.forecast.simpleforecast.forecastday.forEach(m=>chart[zip].dataProvider.push({day:m.date.weekday, tempLow:m.low.fahrenheit, tempHigh:m.high.fahrenheit}));
    chart[zip].validateData();
  });
  }



  // function display(data){
  // data.forecast.simpleforecast.forecastday.forEach(m=>chart.dataProvider.push({day:m.date.weekday, tempLow:m.low.fahrenheit, tempHigh:m.high.fahrenheit}));
  // chart.validateData();
  //
  // }



  function initGraph(zip){
    let graph = $(`.graph[data-zip=${zip}]`)[0];
    chart[zip] = AmCharts.makeChart(graph, {
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


})();
