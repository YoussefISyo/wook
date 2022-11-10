import {
  request,
  customRequest,
  parallelRequest,
} from 'Wook_Market/src/lib/http';
import {apiUrl} from 'Wook_Market/app.json';
import {ButtonState} from 'Wook_Market/src/components/FastAddButton';

export const MINIMUM_BALANCE = 60.0;

export const getCardItems = (onSuccess, onError, cartType) => {
  parallelRequest({
    calls: [
      customRequest({
        method: 'get',
        url: apiUrl + '/cart',
        params: {
          cart_type: cartType,
        },
      }),
      customRequest({
        method: 'get',
        url: apiUrl + '/salespoints',
      }),
    ],
    onComplete: (responseOne, responseTwo) => {
      console.log('response api');
      console.log(responseOne.data);
      onSuccess(responseOne, responseTwo.data);
    },
    onError: (error) => {
      console.log(error);

      onError();
    },
    showNetworkError: false,
  });
};

export const removeItemFromCard = (itemId, onSuccess, onError, cartType) => {
  request({
    method: 'post',
    url: apiUrl + '/cart/remove',
    data: {
      product: itemId,
      cart_type: cartType,
    },
    onComplete: (response) => {
      onSuccess(response);
    },
    onError: (error) => {
      onError();
    },
    showNetworkError: true,
  });
};

export const addToCart = (
  onSuccess,
  onError,
  onLoad,
  productId,
  quantity,
  barCode,
  cartType,
  showNetworkError,
) => {
  onLoad ? onLoad() : null;
  request({
    method: 'post',
    url: apiUrl + '/cart/add',
    data: {
      product: productId,
      quantity: quantity,
      barcode: barCode,
      cart_type: cartType,
    },
    onComplete: (response) => {
      console.log(response);
      onSuccess ? onSuccess(response.data.products) : null;
    },
    onError: (error) => {
      console.log(error);

      onError ? onError(error) : null;
    },
    showNetworkError: showNetworkError === false ? showNetworkError : true,
  });
};

export const validateCart = async (
  onSuccess,
  onError,
  onLoad,
  products,
  useBonus,
  endPoint,
  orderType,
  promoCode,
  salePoint,
  paymentType,
  showNetworkError,
) => {
  onLoad();
  request({
    method: 'post',
    url: apiUrl + (endPoint ?? '/purchase/check'),
    data: {
      order_items: products,
      use_bonus: useBonus ?? false,
      order_type: orderType ? orderType : 'cart',
      promocode: promoCode,
      sales_point: salePoint,
      payment_type: paymentType,
    },
    onComplete: (response) => {
      onSuccess(response.data, response.config);
    },
    onError: (error) => {
      console.log(error);
      onError(error);
    },
    showNetworkError: showNetworkError === false ? showNetworkError : true,
  });
};

export const multipleAddToCart = (onSuccess, onError, onLoad, products) => {
  onLoad();
  request({
    method: 'post',
    url: apiUrl + '/cart/add/multiple',
    data: {
      products,
    },
    onComplete: (response) => {
      onSuccess(response);
    },
    onError: (error) => {
      onError(error);
    },
    showNetworkError: true,
  });
};

export const stateFromAddedToCart = (added_to_cart) => {
  if (added_to_cart === true) return ButtonState.CHECKED;
  else if (added_to_cart === false) return ButtonState.DEFAULT;
  else return added_to_cart;
};
