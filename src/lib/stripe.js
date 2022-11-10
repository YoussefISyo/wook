import {stripeKey, stripeUrl} from 'Wook_Market/app.json';
import {request} from 'Wook_Market/src/lib/http';
import {apiUrl} from 'Wook_Market/app.json';
import {storeUser} from 'Wook_Market/src/lib/user';

export const createCard = (
  cardNumber,
  monthExpiry,
  yearExpiry,
  cardCVV,
  cardName,
  onError,
  onSuccess,
) => {
  request({
    method: 'post',
    url: stripeUrl,
    params: {
      'card[number]': cardNumber,
      'card[exp_month]': monthExpiry,
      'card[exp_year]': '20' + yearExpiry,
      'card[cvc]': cardCVV,
      type: 'card',
    },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + stripeKey,
    },
    onComplete: (paymentInformation) => {
      console.log(paymentInformation);
      request({
        method: 'post',
        url: apiUrl + '/payment/update',
        data: {
          payment_method_id: paymentInformation.id,
          type: paymentInformation.type,
          last4: paymentInformation.card.last4,
          brand: paymentInformation.card.brand,
        },
        onComplete: async (response) => {
          await storeUser(response.data);
          onSuccess();
        },
        onError: (error) => {
          console.log("errooor ", error)

          onError(error);
        },
        showNetworkError: false,
      });
    },
    onError: (error) => {
      console.log(error)
      onError(error.code);
    },
    showNetworkError: false,
  });
};
