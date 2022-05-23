/*import React from 'react';
import {TextInput, ScrollView, Text, View, TouchableOpacity,Image} from 'react-native';
//import RNGooglePlaces from 'react-native-google-places';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const homePlace = {
  description: 'Home',
  geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
};
const workPlace = {
  description: 'Work',
  geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
};

class MapInput extends React.Component {
    openSearchModal() {
        RNGooglePlaces.openAutocompleteModal({
            country: 'DZ',
        })
        .then((place) => {
    		console.log(place);

        })
        .catch(error => console.log(error.message));  // error is a Javascript Error object
      }
    render() {
     
return(
      <GooglePlacesAutocomplete
            placeholder='Search'
            minLength={4} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype

            listViewDisplayed={false}   // true/false/undefined
            fetchDetails={true}
            //renderDescription={row => row.description} // custom description render
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
              console.log(details.geometry.location);
            }}

            getDefaultValue={() => ''}

            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: 'AIzaSyD6qLq2p6Lp5GthB1VMnUTt4ImYWMPsyc8',
              language: 'fr', // language of the results
              components: 'country:dz',
              types: "(cities)"
            }}

            nearbyPlacesAPI='GoogleReverseGeocoding' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            filterReverseGeocodingByTypes={[
            "locality",
            "administrative_area_level_3"
          ]}
            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          />
        );

        
       
    }
}

export default MapInput*/
