import {Platform, Dimensions, StatusBar, Appearance} from 'react-native';
import {Header} from 'react-navigation-stack';

const LOADING_INDICATOR = {id: Number.MAX_VALUE};

const ALREADY_OPEN = 'alreadyOpen';
var {height: WINDOW_HEIGHT, width: WINDOW_WIDTH} = Dimensions.get('window');
const {height: DEVICE_HEIGHT, width: DEVICE_WIDTH} = Dimensions.get('screen');
const OS_IOS = Platform.OS === 'ios';
const IS_IPHONE_X =
  OS_IOS &&
  (DEVICE_HEIGHT === 812 ||
    DEVICE_WIDTH === 812 ||
    DEVICE_HEIGHT === 896 ||
    DEVICE_WIDTH === 896);
const OS_ANDROID = !OS_IOS;
const OS_VERSION = Platform.Version;
const STATUSBAR_HEIGHT = Platform.select({
  ios: IS_IPHONE_X ? 44 : 20,
  android: StatusBar.currentHeight,
  default: 0,
});
const ACTIONBAR_HEIGHT = OS_IOS
  ? Header.HEIGHT - STATUSBAR_HEIGHT
  : Header.HEIGHT - 20; // The one with window title
var NAVBAR_HEIGHT = DEVICE_HEIGHT - WINDOW_HEIGHT; // Android (the one with back, home and multitast buttons)
if (NAVBAR_HEIGHT > 60) NAVBAR_HEIGHT -= STATUSBAR_HEIGHT; // In some devices window height doesn't include statusbar height

// The one returned by Dimensions.get('window') is not the one I need
WINDOW_HEIGHT =
  DEVICE_HEIGHT - STATUSBAR_HEIGHT - ACTIONBAR_HEIGHT - NAVBAR_HEIGHT;

const IS_DEVICE_SMALL = WINDOW_HEIGHT <= 600;

const IS_DARK_MODE = Appearance.getColorScheme() === 'dark';

const ERROR_MESSAGES = {
  GENERIC_REQUIRED: 'generic.required',
  EMAIL_REQUIRED: 'email.required',
  PASSWORD_REQUIRED: 'password.required',
  NAME_REQUIRED: 'name.required',
  FIRST_NAME_REQUIRED: 'first_name.required',
  PHONE_REQUIRED: 'phone.required',
  EMAIL_UNIQUE: 'email.unique',
  PHONE_UNIQUE: 'phone.unique',
  EMAIL_EMAIL: 'email.email',
  PASSWORD_MIN: 'password.min',
  PHONE_REGEX: 'phone.regex',
  USER_UNAUTHORIZED: 'user.unauthorized',
  ERROR: 'error',
  NETWORK_ERROR: 'Network Error',
  EMAIL_EXIST: 'email.exists',
  INVALID_ADDRESS: 'address.invalid',
  CODE_INVALIDE: 'code.invalid',
  CODE_UNIQUE: 'code.unique',
  NOTE_FOUND: 'not_found',
};

const ONE_DAY = 86400;

const INVALID_NUMBER = 'invalid_number';
const INCORRECT_NUMBER = 'incorrect_number';
const INCORRECT_CVV = 'incorrect_cvc';
const INVALID_CVV = 'invalid_cvc';
const INVALID_EXPIRY_MONTH = 'invalid_expiry_month';
const INVALID_EXPIRY_YEAR = 'invalid_expiry_year';
const INVALID_REQUEST = 'stripe.invalid_request';
const STRIPE_GENERIC = 'stripe.generic';

const INVALIDE_QUANTITY = 'quantity.invalid';

const GRAM_UNIT = 'g';
const KILO_GRAM_UNIT = 'kg';
const NO_UNIT = '';
const ITEMS = 'items';

export {
  OS_IOS,
  OS_ANDROID,
  OS_VERSION,
  IS_IPHONE_X,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  DEVICE_HEIGHT,
  DEVICE_WIDTH,
  STATUSBAR_HEIGHT,
  NAVBAR_HEIGHT,
  ACTIONBAR_HEIGHT,
  IS_DARK_MODE,
  ALREADY_OPEN,
  IS_DEVICE_SMALL,
  ERROR_MESSAGES,
  LOADING_INDICATOR,
  GRAM_UNIT,
  KILO_GRAM_UNIT,
  ITEMS,
  NO_UNIT,
  INVALID_NUMBER,
  INCORRECT_NUMBER,
  INCORRECT_CVV,
  INVALID_CVV,
  INVALID_EXPIRY_MONTH,
  INVALID_EXPIRY_YEAR,
  INVALIDE_QUANTITY,
  INVALID_REQUEST,
  STRIPE_GENERIC,
  ONE_DAY,
};
