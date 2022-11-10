import {request} from 'Wook_Market/src/lib/http';
import {apiUrl} from 'Wook_Market/app.json';

export const confirmPayment = async (
  onSuccess,
  onError,
  onLoad,
  paymentIntent,
) => {
  onLoad();
  request({
    method: 'post',
    url: apiUrl + '/purchase/confirm',
    data: {
      payment_intent: paymentIntent,
    },
    onComplete: (response) => {
      onSuccess(response);
    },
    onError: (error) => {
      onError();
    },
    showNetworkError: false,
  });
};
