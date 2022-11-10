import {storeUser} from 'Wook_Market/src/lib/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {request} from 'Wook_Market/src/lib/http';
import {apiUrl} from 'Wook_Market/app.json';

export const registerUser = async (
  onError,
  onSuccess,
  {email, password, lastName, firstName, phone},
) => {
  request({
    method: 'post',
    url: apiUrl + '/signup',
    data: {
      email,
      password,
      name: lastName,
      first_name: firstName,
      phone,
    },
    onComplete: (firstResponse) => {
      request({
        method: 'get',
        url: apiUrl + '/user',
        headers: {Authorization: `Bearer ${firstResponse.data.token}`},
        onComplete: async (secondeResponse) => {
          await storeToken(firstResponse.data.token);
          await storeUser(secondeResponse.data);
          onSuccess();
        },
        onError: (error) => {
          onError(error);
        },
        showNetworkError: true,
      });
    },
    onError: (error) => {
      onError(error);
    },
    showNetworkError: true,
  });
};


export const registerPro = async (
  onError,
  onSuccess,
  {companyName, address, postalCode, city, siret, email, password, phone},
) => {
  request({
    method: 'post',
    url: apiUrl + '/signup/pro',
    data: {
      company_name: companyName,
      address: address,
      postal_code: postalCode,
      city: city,
      siret: siret,
      email: email,
      password: password,
      phone: phone,
    },
    onComplete: (firstResponse) => {
      request({
        method: 'get',
        url: apiUrl + '/user',
        headers: {Authorization: `Bearer ${firstResponse.data.token}`},
        onComplete: async (secondeResponse) => {
          await storeToken(firstResponse.data.token);
          await storeUser(secondeResponse.data);
          onSuccess();
        },
        onError: (error) => {
          onError(error);
        },
        showNetworkError: true,
      });
    },
    onError: (error) => {
      onError(error);
    },
    showNetworkError: true,
  });
};

export const loginUser = async (onError, onSuccess, {email, password}) => {
  request({
    method: 'post',
    url: apiUrl + '/login',
    data: {
      email,
      password,
    },
    onComplete: (firstResponse) => {
      request({
        method: 'get',
        url: apiUrl + '/user',
        headers: {Authorization: `Bearer ${firstResponse.data.token}`},
        onComplete: async (secondeResponse) => {
          await storeToken(firstResponse.data.token);
          await storeUser(secondeResponse.data);
          onSuccess();
        },
        onError: (error) => {
          onError(error);
        },
        showNetworkError: true,
      });
    },
    onError: (error) => {
      onError(error);
    },
    showNetworkError: true,
  });
};

export const resetPassword = (onError, onSuccess, {email}) => {
  request({
    method: 'get',
    url: apiUrl + '/password/code',
    params: {
      email,
    },
    onComplete: (response) => {
      onSuccess();
    },
    onError: (error) => {
      console.log(error);
      onError(error);
    },
    showNetworkError: true,
  });
};

export const verifyCode = (params, onSuccess, onError) => {
  request({
    method: 'get',
    url: apiUrl + '/password/code/check',
    params,
    onComplete: (response) => {
      onSuccess();
    },
    onError: (error) => {
      onError(error);
    },
    showNetworkError: true,
  });
};

export const updatePassword = (data, onSuccess, onError) => {
  request({
    method: 'post',
    url: apiUrl + '/password/reset',
    data,
    onComplete: async (response) => {
      await storeUser(response.data.data);
      onSuccess();
    },
    onError: (error) => {
      onError(error);
    },
    showNetworkError: true,
  });
};

export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('TOKEN', token);
  } catch (error) {
    // Error saving data
  }
};

export const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem('TOKEN');
    // We have data!!
    return value;
  } catch (error) {
    // Error retrieving data
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('TOKEN');
  } catch (error) {
    // Error removing data
  }
};
