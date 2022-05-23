import api from 'src/constants/api';

export function searchDirection(start, end) {
  const requestUrl = `${api.mapboxApiUrl}/directions/v5/mapbox/driving/
        ${start.longitude},${start.latitude};
        ${end.longitude},${end.latitude}?geometries=geojson&access_token=${
    api.mapboxAccessToken
  }`;
  return fetch(requestUrl)
    .then(response => response.json())
    .then(response => {
      if (response.error) {
        throw response.error;
      }
      const result = {
        direction: response.routes[0].geometry.coordinates.map(crd => {
          return {longitude: crd[0], latitude: crd[1]};
        }),
        duration: response.routes[0].duration,
        distance: response.routes[0].distance,
      };
      return result;
    })
    .catch(error => {
      console.error(error);
    });
}

export function searchPlaces(query) {
  const requestUrl = `${api.algoliaApiUrl}/1/places/query`;
  return fetch(requestUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: query,
      countries: ['dz'],
      hitsPerPage: 10,
      language: 'fr',
    }),
  })
    .then(response => response.json())
    .then(response => {
      if (response.error) {
        throw response.error;
      }
      const places = Array.from(response.hits).map(place => {
        return {
          id: place.objectID,
          name: place.locale_names[0],
          province: place.administrative[0].split(' - ')[0],
          coordinate: {
            longitude: place._geoloc.lng,
            latitude: place._geoloc.lat,
          },
        };
      });
      return places;
    })
    .catch(error => {
      console.log(error);
    });
}

export function reverseGeocode(coordinate) {
  const requestUrl = `${api.algoliaApiUrl}/1/places/reverse?aroundLatLng=${
    coordinate.latitude
  },${coordinate.longitude}&hitsPerPage=1&language=fr`;
  return fetch(requestUrl)
    .then(response => response.json())
    .then(response => {
      if (response.error) {
        throw response.error;
      }
      const place = Array.from(response.hits).map(place => {
        return {
          id: place.objectID,
          name: place.locale_names[0],
          province: place.administrative[0].split(' - ')[0],
          coordinate: coordinate,
        };
      })[0];
      return place;
    })
    .catch(error => {
      console.log(error);
    });
}
