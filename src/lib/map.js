import {placeUrl, mapKey, placeDetailUrl} from 'Wook_Market/app.json';
import {request} from 'Wook_Market/src/lib/http';

export const addressSearch = (input, sessiontoken, onSuccess, onError) => {
  request({
    method: 'get',
    url: placeUrl,
    params: {
      input,
      key: mapKey,
      sessiontoken,
      types: 'address',
      language: 'fr',
      components: 'country:fr',
    },
    onComplete: async (response) => {
      onSuccess(response.predictions);
    },
    onError: (error) => {
      console.log("error", error)
      onError();
    },
    showNetworkError: false,
  });
};

export const locationSearch = (palceId, onSuccess, onError) => {
  request({
    method: 'get',
    url: placeDetailUrl,
    params: {
      place_id: palceId,
      key: mapKey,
    },
    onComplete: async (response) => {
      onSuccess(response.result);
    },
    onError: (error) => {
      onError();
    },
    showNetworkError: false,
  });
};
