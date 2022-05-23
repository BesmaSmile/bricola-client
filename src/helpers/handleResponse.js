export default function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      let error = 'Une erreur est survenue';
      if (response.status === 400) {
        const field = Object.keys(data.errors)[0];
        error = {field, code: data.errors[field][0]};
      } else {
        error = {field: 'none', code: data.errors};
      }
      //const error = (data && data.errors) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
}
