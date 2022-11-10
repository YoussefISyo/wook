import {getToken} from 'Wook_Market/src/lib/authentication';
import {ERROR_MESSAGES} from 'Wook_Market/src/lib/Constants';
import axios from 'axios';
import {Alert, Platform} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {_, currentLocale} from 'Wook_Market/src/lang/i18n';
import DeviceInfo from 'react-native-device-info';
import {apiUrl} from 'Wook_Market/app.json';
import {logout} from 'Wook_Market/src/lib/user';

export const api = axios.create({
  baseURL: apiUrl,
});

export const request = async ({
  method,
  url,
  params,
  data,
  headers = {},
  onComplete,
  onError,
  showNetworkError = true,
}) => {
  console.log(currentLocale);
  const token = await getToken();
  axios({
    url: url,
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': currentLocale ? currentLocale.split('-')[0] : 'fr', // en-US >> en
      'device-brand': DeviceInfo.getBrand(),
      'device-model': DeviceInfo.getModel(),
      'app-version': DeviceInfo.getVersion(),
      Authorization: `Bearer ${token}`,
      ...headers,
    },
    data: data,
    params: params,
  }).then(
    (response) => {
      onComplete(response.data);
    },
    async (error) => {
      if (
        error.response &&
        error.response.data &&
        error.response.data.errors &&
        token !== null
      ) {
        if (
          Object.keys(error.response.data.errors)[0] ===
          ERROR_MESSAGES.USER_UNAUTHORIZED /*||
          Object.keys(error.response.data.errors)[0] ===
            ERROR_MESSAGES.NOTE_FOUND*/
        ) {
          Alert.alert('', _('error.unauthenticated'));
          await logout();
          return;
        }
      }

      if (error.response && error.response.data && error.response.data.errors) {
        return onError(
          error.response.data.errors
            ? error.response.data.errors
            : error.response.data.error,
        );
      } else if (showNetworkError) {
        if (ERROR_MESSAGES.NETWORK_ERROR === error.message) {
          Alert.alert('', _('login.networkError'), [
            {
              text: _('main.ok'),
            },
          ]);
          onError(error);
        } else {
          Alert.alert('', _('login.serverError'), [
            {
              text: _('main.ok'),
            },
          ]);
          onError(error);
        }
      } else {
        onError(error);
      }
    },
  );
};

export const customRequest = async ({
  method,
  url,
  params,
  data,
  headers = {},
}) => {
  const token = await getToken();
  return axios({
    url: url,
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': currentLocale ? currentLocale.split('-')[0] : 'fr', // en-US >> en
      'device-brand': DeviceInfo.getBrand(),
      'device-model': DeviceInfo.getModel(),
      'app-version': DeviceInfo.getVersion(),
      Authorization: `Bearer ${token}`,
      ...headers,
    },
    data: data,
    params: params,
  });
};

export const parallelRequest = async ({
  calls,
  onComplete,
  onError,
  showNetworkError = true,
}) => {
  const token = await getToken();
  axios
    .all(calls)
    .then(
      axios.spread((responseOne, responseTow) => {
        onComplete(responseOne.data, responseTow.data);
      }),
    )
    .catch(async (error) => {
      if (
        error.response &&
        error.response.data &&
        error.response.data.errors &&
        token !== null
      ) {
        if (
          Object.keys(error.response.data.errors)[0] ===
          ERROR_MESSAGES.USER_UNAUTHORIZED /*||
          Object.keys(error.response.data.errors)[0] ===
            ERROR_MESSAGES.NOTE_FOUND*/
        ) {
          Alert.alert('', _('error.unauthenticated'));
          await logout();
          return;
        }
      }
      if (error.response && error.response.data && error.response.data.errors) {
        return onError(
          error.response.data.errors
            ? error.response.data.errors
            : error.response.data.error,
        );
      } else if (showNetworkError) {
        if (ERROR_MESSAGES.NETWORK_ERROR === error.message) {
          Alert.alert('', _('login.networkError'), [
            {
              text: _('main.ok'),
            },
          ]);
          onError(error);
        } else {
          Alert.alert('', _('login.serverError'), [
            {
              text: _('main.ok'),
            },
          ]);
          onError(error);
        }
      } else {
        onError(error);
      }
    });
};
