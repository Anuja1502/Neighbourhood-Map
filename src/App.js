// I have used parts of code from the Udacity lesson on Google maps and React
import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader';
import Suggestions_Location from './Suggestions_Location';

class App extends Component{
  state = {
    map: '',
    markers: [],
    locations : [
        {title: 'Kingdom of Dreams', location: {lat: 28.4679, lng: 77.0689}},
        {title: 'Leisure Valley Park', location: {lat: 28.4697, lng:  77.0662}},
        {title: 'Crowne Plaza', location: {lat: 28.46832, lng: 77.05981}},
        {title: 'Ambience Mall', location: {lat: 28.5048, lng: 77.0970}},
        {title: 'The Oberoi', location: {lat: 28.5024, lng: 77.0887}},
        {title: 'Mgf Metropolitan Mall', location: {lat: 28.4809, lng: 77.0803}}
       ]
           
   };
    
    componentWillReceiveProps({isScriptLoadSucceed}){
  
        if (isScriptLoadSucceed) {

            var map = new window.google.maps.Map(document.getElementById('map'), {
              center: {lat: 28.4809, lng: 77.0803},
              zoom: 13,
              mapTypeControl: false
            });
            this.setState({'map':map});
            for (var id = 0; id < this.state.locations.length; id ++) {
              this.makeMarkerForId(this, id, this.state, map);
            }
        }
       
        else{
            alert("script not loaded")
        }
    }
  
    populateInfoWindow(marker) {
        var infowindow = new window.google.maps.InfoWindow();
        if (infowindow.marker !== marker) {
          infowindow.setContent('');
          infowindow.marker = marker;
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
        var url = "https://api.foursquare.com/v2/venues/search?client_id=ARAFJJVKEMWVFJ23DXCY05L1H4ZDQ5H1E1L2WHTBSIT23S2R&client_secret=TXOTEEUP4K4CJ2KHTNOVDJFXTN5T3VB3AQZGLHYU2BLRILZL&v=20180323&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
        fetch(url)
            .then(
                function (response) {
                    response.json().then(function (data) {

                        var location_data = data.response.venues[0];
                        var add= '<b>Full Address: </b>' +location_data.location.formattedAddress + '<br>';
                        var type= '<b>Type: </b>' +location_data.categories[0].name+ '<br>';
                        var v = '<b>Verified Location: </b>' + (location_data.verified ? 'Yes' : 'No') + '<br>';
                        var count = '<b>CheckIns: </b>' + location_data.stats.checkinsCount + '<br>';
                        var user_count = '<b>Users: </b>' + location_data.stats.usersCount + '<br>';
                        var tip_count = '<b>Tips: </b>' + location_data.stats.tipCount + '<br>';
                        var moreInfo = '<a href="https://foursquare.com/v/'+ location_data.id +'" target="_blank">More information</a>'
                        infowindow.setContent(add+type+v+count+user_count+tip_count+moreInfo);
                    });
                }
            )
            .catch(function (err) {
                infowindow.setContent(err);
            });
            infowindow.open(this.state.map, marker);
          
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
      }
    }

    makeMarkerForId(app, id, state, map) {
          var col='ff0000';
          var defaultIcon = new window.google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ col +
          '|40|_|%E2%80%A2',
          new window.google.maps.Size(21, 34),
          new window.google.maps.Point(0, 0),
          new window.google.maps.Point(10, 34),
          new window.google.maps.Size(21,34));
          var position = state.locations[id].location;
          var title = state.locations[id].title;
          
          var marker = new window.google.maps.Marker({
            position: position,
            title: title,
            icon: defaultIcon,
            id: id
          });
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(function(){ marker.setAnimation(null); }, 750);
        
         state.markers.push(marker);
         marker.setMap(map);
          
         marker.addListener('click', function() {
            app.populateInfoWindow(marker);
          });

    }

    makeMarker(app, e){
          var state = app.state;
          var id = e.target.id;
          if(state.markers.length>0){
             for (var i = 0; i < state.markers.length; i++) {
               state.markers[i].setMap(null);
             }
           }
          app.makeMarkerForId(app, id, state, state.map);
    }

    render(){
        return(
          <div  className="container">
            <div className="container2">
            <Suggestions_Location locations={this.state.locations} makeMarker={this.makeMarker} App={this} aria-labelledby="Suggested Locations" />
            <div id="map" style={{height: "100%"}}></div>
            </div>
          </div>
              
        )
    }
}

export default scriptLoader(
    ["https://maps.googleapis.com/maps/api/js?key=AIzaSyBzATqDIP6404qURdN2-qonE2lwMP84Bn8"]
)(App)
