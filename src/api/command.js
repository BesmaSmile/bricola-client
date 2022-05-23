import api from 'src/constants/api';

export function getNearestPartners(coordinates, serviceId) {
  const requestUrl = `${api.bricolaApiUrl}/partner/nearest`;

  return fetch(requestUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...coordinates,
      serviceId,
    }),
  })
    .then(response => {
      if (response.error) {
        throw response.error;
      }
      if (response.ok) {
        return response.json();
      }
    })
    .catch(error => {
      throw error;
    });
}
