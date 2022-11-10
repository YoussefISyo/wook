import AsyncStorage from '@react-native-async-storage/async-storage';
import {request} from 'Wook_Market/src/lib/http';
import {apiUrl} from 'Wook_Market/app.json';
import {removeToken} from 'Wook_Market/src/lib/authentication';
import {removeOrdersFromCache} from 'Wook_Market/src/lib/order';
import * as RootNavigation from 'Wook_Market/src/lib/RootNavigation';

export async function updateProfile(data, onSuccess, onError) {
  request({
    method: 'post',
    url: apiUrl + '/user',
    data,
    onComplete: async (response) => {
      await storeUser(response.data);
      onSuccess();
    },
    onError: (error) => {
      onError(error);
    },
    showNetworkError: true,
  });
}

export async function updateProfilePro(data, onSuccess, onError) {
  request({
    method: 'post',
    url: apiUrl + '/pro',
    data,
    onComplete: async (response) => {
      await storeUser(response.data);
      onSuccess();
    },
    onError: (error) => {
      onError(error);
    },
    showNetworkError: true,
  });
}

export const updateAddress = async (data, onSuccess, onError) => {
  console.log('update');
  console.log(data);
  request({
    method: 'post',
    url: apiUrl + '/user/address',
    data,
    onComplete: async (response) => {
      await storeUser(response.data);
      onSuccess();
    },
    onError: (error) => {
      onError(error);
    },
    showNetworkError: true,
  });
};

export function getRemoteUserData(onSuccess, onError) {
  request({
    method: 'get',
    url: apiUrl + '/user',
    onComplete: async (response) => {
      await storeUser(response.data);
      onSuccess(response);
    },
    onError: (error) => {
      onError(error);
    },
    showNetworkError: false,
  });
}

export async function storeUser(user) {
  try {
    await AsyncStorage.setItem('USER', JSON.stringify(user));
  } catch (error) {
    // Error saving data
  }
}
export async function removeUser() {
  try {
    await AsyncStorage.removeItem('USER');
  } catch (error) {
    // Error removing data
  }
}
export async function getUser() {
  try {
    const value = await AsyncStorage.getItem('USER');
    if (value !== null) {
      // We have data!!
      return value;
    }
  } catch (error) {
    // Error retrieving data
  }
}
export const deleteAccount = (params, onSuccess, onError) => {
  request({
    method: 'delete',
    url: apiUrl + '/delete-account',
    headers: {Authorization: `Bearer ${params.token}`},
    onComplete: async (response) => {
      console.log(response);
      await removeToken();
      await removeUser();
      await removeOrdersFromCache();
      RootNavigation.replace('Auth');
      onSuccess();
    },
    onError: (error) => {
      onError(error);
    },
    showNetworkError: true,
  });
};

export async function logout() {
  await removeToken();
  await removeUser();
  await removeOrdersFromCache();
  RootNavigation.replace('Auth');
}
