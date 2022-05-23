import {useState} from 'react';

function useRequestState() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState();
  const sendRequest = (action, success, failure, errorMessage) => {
    setPending(true);
    setError();
    action()
      .then(result => {
        if (success) {
          success(result);
        }
        setPending(false);
      })
      .catch(err => {
        setPending(false);
        setError(errorMessage || err);
        if (failure) {
          failure(errorMessage || err);
        }
      });
  };
  const clearError = () => setError();
  return {sendRequest, pending, error, clearError};
}

export {useRequestState};
