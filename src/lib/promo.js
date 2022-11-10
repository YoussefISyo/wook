import {request} from 'Wook_Market/src/lib/http';
import {apiUrl} from 'Wook_Market/app.json';

export const validatePromoCode = (onLoad, onSuccess, onError, promocode) => {
  onLoad();
  request({
    method: 'post',
    url: apiUrl + '/promocode/validate',
    data: {
      promocode,
    },
    onComplete: (response) => {
      onSuccess(response.data.promocode);
    },
    onError: (error) => {
      onError(error);
    },
    showNetworkError: true,
  });
};
