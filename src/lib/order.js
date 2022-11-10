import {request} from 'Wook_Market/src/lib/http';
import {apiUrl} from 'Wook_Market/app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getOrdersList = (onLoad, onSuccess, onError, currentPage) => {
  onLoad();
  request({
    method: 'get',
    url: apiUrl + '/orders',
    params: {page: currentPage},
    onComplete: (response) => {
      onSuccess(response);
    },
    onError: (error) => {
      onError();
    },
    showNetworkError: false,
  });
};

export const getOrderDetail = (onLoad, onSuccess, onError, id) => {
  onLoad();
  request({
    method: 'get',
    url: apiUrl + `/orders/${id}`,
    onComplete: (response) => {
      onSuccess(response.data.order);
    },
    onError: (error) => {
      onError();
    },
    showNetworkError: false,
  });
};

export const storeOrdersList = async (orders) => {
  try {
    await AsyncStorage.setItem('ORDERS', JSON.stringify(orders));
  } catch (error) {
    // Error saving data
  }
};

export const getOrdersListFromLocalCache = async () => {
  try {
    const orders = JSON.parse(await AsyncStorage.getItem('ORDERS'));
    if (orders !== null) {
      // We have data!!
      return orders;
    } else {
      return null;
    }
  } catch (error) {
    // Error retrieving data
  }
};

export const removeOrdersFromCache = async () => {
  try {
    await AsyncStorage.removeItem('ORDERS');
  } catch (error) {
    // Error removing data
  }
};

export const rateDelivery = (onLoad, onSuccess, onError, orders, rating) => {
  onLoad();
  request({
    method: 'post',
    url: apiUrl + '/orders/rate',
    data: {
      orders,
      rating,
      comment: '',
    },
    onComplete: (response) => {
      onSuccess();
    },
    onError: (error) => {
      onError();
    },
    showNetworkError: true,
  });
};
