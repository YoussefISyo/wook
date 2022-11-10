import NetInfo from '@react-native-community/netinfo';
import {
  ERROR_MESSAGES,
  INVALID_NUMBER,
  INCORRECT_NUMBER,
  INCORRECT_CVV,
  INVALID_CVV,
  INVALID_EXPIRY_MONTH,
  INVALID_EXPIRY_YEAR,
  INVALID_REQUEST,
  STRIPE_GENERIC,
  INVALIDE_QUANTITY,
  ONE_DAY,
} from 'Wook_Market/src/lib/Constants';
import {storeOrdersList} from 'Wook_Market/src/lib/order';
import {_} from 'Wook_Market/src/lang/i18n';
import {
  GRAM_UNIT,
  KILO_GRAM_UNIT,
  ITEMS,
  NO_UNIT,
} from 'Wook_Market/src/lib/Constants';
import {Alert} from 'react-native';
import dash from 'lodash';

const handleError = (error) => {
  if (error) {
    if (error.message === 'Network Error') return _('login.networkError');
    else {
      return error[Object.keys(error)[0]].error ?? _('login.errorMessage');
    }
  } else return _('login.errorMessage');
};

const scrollListToTop = (ref) => {
  ref.scrollToOffset({
    x: 0,
    y: 0,
    index: 0,
    animated: false,
  });
};

const isInternetReachable = async () => {
  var networkInfo = await NetInfo.fetch();
  return networkInfo.isInternetReachable;
};

const calculateDiscountRatio = (price, newPrice) => {
  if (newPrice === 0) return 0;
  else return Math.round((1 - newPrice / price) * 100);
};

export const handleRegisterError = (error) => {
  const errorState = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    alertError: '',
    invalideData: false,
  };
  const emptyErrorState = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    alertError: '',
    invalideData: false,
  };
  for (let key in error) {
    switch (key) {
      case ERROR_MESSAGES.EMAIL_REQUIRED:
      case ERROR_MESSAGES.EMAIL_UNIQUE:
      case ERROR_MESSAGES.EMAIL_EMAIL:
        errorState.email = error[key];
        break;
      case ERROR_MESSAGES.PASSWORD_REQUIRED:
      case ERROR_MESSAGES.PASSWORD_MIN:
        errorState.password = error[key];
        break;
      case ERROR_MESSAGES.NAME_REQUIRED:
        errorState.lastName = error[key];
        break;
      case ERROR_MESSAGES.FIRST_NAME_REQUIRED:
        errorState.firstName = error[key];
        break;
      case ERROR_MESSAGES.PHONE_REQUIRED:
      case ERROR_MESSAGES.PHONE_REGEX:
      case ERROR_MESSAGES.PHONE_UNIQUE:
        errorState.phone = error[key];
        break;
      case ERROR_MESSAGES.ERROR:
      case ERROR_MESSAGES.USER_UNAUTHORIZED:
        errorState.alertError = error[key];
        errorState.invalideData = true;
        break;
      case ERROR_MESSAGES.EMAIL_EXIST:
        errorState.email = error[key];
        break;
    }
  }

  if (dash.isEqual(errorState, emptyErrorState) && error && !error.message) {
    Alert.alert('', error[Object.keys(error)[0]]);
    return errorState;
  }

  return errorState;
};

const handlePromoCodeRemoteErrors = (error) => {
  const errorState = {
    promoCode: '',
  };
  const emptyErrorState = {
    promoCode: '',
  };

  for (let key in error) {
    switch (key) {
      case ERROR_MESSAGES.CODE_INVALIDE:
        errorState.promoCode = error[key];
        break;
      case ERROR_MESSAGES.CODE_UNIQUE:
        errorState.promoCode = error[key];
        break;
    }
  }

  if (dash.isEqual(errorState, emptyErrorState) && error && !error.message) {
    Alert.alert('', error[Object.keys(error)[0]]);
    return errorState;
  }

  return errorState;
};

const handleAddressRemotErrors = (error) => {
  const errorState = {
    selectedAddress: '',
  };
  const emptyErrorState = {
    selectedAddress: '',
  };

  for (let key in error) {
    switch (key) {
      case ERROR_MESSAGES.INVALID_ADDRESS:
        errorState.selectedAddress = error[key];
        break;
    }
  }

  if (dash.isEqual(errorState, emptyErrorState) && error && !error.message) {
    Alert.alert('', error[Object.keys(error)[0]]);
    return errorState;
  }

  return errorState;
};

const handleRegisterLocalInputError = ({
  lastName,
  firstName,
  email,
  password,
  phone,
}) => {
  const errorState = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  };

  if (firstName.length === 0)
    errorState.firstName = _('error.firstNameRequired');
  if (lastName.length === 0) errorState.lastName = _('error.lastNameRequired');
  if (email.length === 0) errorState.email = _('error.emailRequired');
  if (password.length === 0) errorState.password = _('error.passwordRequired');
  if (phone.length === 0) errorState.phone = _('error.phoneRequired');

  return errorState;
};

const handleRegisterProLocalInputError = ({
  companyName,
  address,
  postalCode,
  city,
  siret,
  email,
  password,
  phone
}) => {
  const errorState = {
    email: '',
    password: '',
    phone: '',
    companyName: "",
    address: "", 
    postalCode: "",
    city: "",
    siret: ""
  };

  if (companyName.length === 0)
    errorState.companyName = _('error.companyNameRequired');
  if (address.length === 0) errorState.address = _('error.addressRequired');
  if (postalCode.length === 0) errorState.postalCode = _('error.postalCodeRequired');
  if (city.length === 0) errorState.city = _('error.cityRequired');
  if (siret.length === 0)
  {
    errorState.siret = _('error.siretRequired');
  } 
  else {
    if(!isSIRET(siret)) errorState.siret = _('error.siretIncorrect');
  }
  if (email.length === 0) errorState.email = _('error.emailRequired');
  if (password.length === 0) errorState.password = _('error.passwordRequired');
  if (phone.length === 0) errorState.phone = _('error.phoneRequired');

  return errorState;
};

const handleProfileLocalInputError = ({lastName, firstName, email, phone}) => {
  const errorState = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
  };

  if (firstName.length === 0)
    errorState.firstName = _('error.firstNameRequired');
  if (lastName.length === 0) errorState.lastName = _('error.lastNameRequired');
  if (email.length === 0) errorState.email = _('error.emailRequired');
  if (phone.length === 0) errorState.phone = _('error.phoneRequired');

  return errorState;
};


const handleProfileProLocalInputError = ({
  company_name,
  address,
  postal_code,
  city,
  siret,
  email,
  phone
}) => {
  const errorState = {
    email: '',
    phone: '',
    company_name: "",
    address: "", 
    postal_code: "",
    city: "",
    siret: ""
  };

  if (company_name.length === 0)
    errorState.company_name = _('error.companyNameRequired');
  if (address.length === 0) errorState.address = _('error.addressRequired');
  if (postal_code.length === 0) errorState.postal_code = _('error.postalCodeRequired');
  if (city.length === 0) errorState.city = _('error.cityRequired');
  if (siret.length === 0)
  {
    errorState.siret = _('error.siretRequired');
  } 
  else {
    if(!isSIRET(siret)) errorState.siret = _('error.siretIncorrect');
  }
  if (email.length === 0) errorState.email = _('error.emailRequired');
  if (phone.length === 0) errorState.phone = _('error.phoneRequired');

  return errorState;
};

const handleLoginLocalInputError = (email, password) => {
  const errorState = {
    email: '',
    password: '',
    alertError: '',
    invalideData: false,
  };
  if (email.length === 0) errorState.email = _('error.emailRequired');
  if (password.length === 0) errorState.password = _('error.passwordRequired');

  return errorState;
};

const handleEmailLocalInputError = (email) => {
  const errorState = {
    email: '',
  };
  if (email.length === 0) errorState.email = _('error.emailRequired');

  return errorState;
};

const handlePasswordLocalInputError = (password) => {
  const errorState = {
    password: '',
  };
  if (password.length === 0) errorState.password = _('error.passwordRequired');

  return errorState;
};

export const handlePymentMethodError = (error) => {};

const _priceFormatter = new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

//Detail
const formatPrice = (price) => {
  return _priceFormatter.format(Math.round(price * 100) / 100);
};

//offer
const formatOfferPrice = (price) => {
  const fracDigit = price < 100 ? 2 : price < 1000 ? 1 : 0;
  const offerPriceFormatter = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: fracDigit,
    maximumFractionDigits: fracDigit,
  });

  return offerPriceFormatter.format(Math.round(price * 100) / 100);
};

const formatQuantity = (unit, quantity) => {
  if (unit === KILO_GRAM_UNIT && quantity >= 1) {
    if (quantity % Math.round(quantity) === 0) return Math.round(quantity);
    else return quantity.toFixed(1);
  } else if (unit === KILO_GRAM_UNIT && quantity < 1)
    return Math.round(quantity * 1000);
  else return quantity;
};

const gramsToKilograms = (g) => g / 1000;

const getMinQuantity = (unit, itemsMin, weightMin) => {
  if (unit === ITEMS) return itemsMin;
  else return gramsToKilograms(weightMin);
};

const getMaxQuantity = (unit, quantity) => {
  if (unit === KILO_GRAM_UNIT) return Math.floor(quantity * 10) / 10;
  else return quantity;
};

const calculatePrice = (price, quantity) => {
  return price * quantity;
};

const calculateGroupedProductPrice = (price, pricePools, ordersCount) => {
  let finalPrice = price;
  for (quantity in pricePools) {
    if (ordersCount >= parseFloat(quantity)) finalPrice = pricePools[quantity];
  }
  return finalPrice;
};

const formatExpirationText = (startDate, endDate) => {
  var seconds = endDate - startDate;
  var days = Math.floor(seconds / (3600 * 24));
  var hours = Math.floor((seconds % (3600 * 24)) / 3600);

  var hoursDisplay =
    hours > 0
      ? `${hours} ${hours === 1 ? _('main.hour') : _('main.hours')}`
      : _('main.lessThanOneHour');

  var timeDisplay =
    days > 0
      ? `${days} ${days === 1 ? _('main.day') : _('main.days')}`
      : hoursDisplay;

  return timeDisplay;
};

const formatUnit = (fUnit, quantity) => {
  if (fUnit === KILO_GRAM_UNIT && quantity < 1) return 'g';
  else if (fUnit === KILO_GRAM_UNIT && quantity >= 1) return 'kg';
  else return NO_UNIT;
};

const getIncrementValue = (unit) => {
  if (unit === KILO_GRAM_UNIT) return 0.1;
  else return 1;
};

const increment = (currentValue, incrementValue) => {
  const result = Math.round((currentValue + incrementValue) * 10) / 10;
  return result;
};

const decrement = (currentValue, incrementValue) => {
  return Math.round((currentValue - incrementValue) * 10) / 10;
};

const formatAddToCartText = (fUnit, fQuantity) => {
  const quantity = formatQuantity(fUnit, fQuantity);
  const unit = formatUnit(fUnit, fQuantity);
  if (quantity > 1) {
    if (unit === GRAM_UNIT || unit === KILO_GRAM_UNIT)
      return `${quantity} ${unit} ${_('main.addedArticlesG')}`;
    else return `${quantity} ${unit} ${_('main.addedArticles')}`;
  } else {
    if (unit === GRAM_UNIT || unit === KILO_GRAM_UNIT)
      return `${quantity} ${unit} ${_('main.addedArticleG')}`;
    else return `${quantity} ${unit} ${_('main.addedArticle')}`;
  }
};

//gets quantity from grouped Product pricePools
const getQuantityByIndex = (index, pricePools) => {
  return parseInt(Object.keys(pricePools)[index]);
};

//gets Price from grouped Product pricePools
const getPriceByIndex = (index, pricePools) => {
  return formatOfferPrice(pricePools[Object.keys(pricePools)[index]]);
};

const handleAddPaymentMethodErrors = (errorCode) => {
  const error = {
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    alertMessage: '',
  };
  switch (errorCode) {
    case INCORRECT_NUMBER:
    case INVALID_NUMBER:
      error.cardNumber = _('error.invalidNumber');
      break;
    case INCORRECT_CVV:
    case INVALID_CVV:
      error.cardCVV = _('error.invalidCVV');
      break;
    case INVALID_EXPIRY_MONTH:
    case INVALID_EXPIRY_YEAR:
      error.cardExpiry = _('error.invalidExpirationDate');
      break;
    default:
      error.alertMessage = _('error.addCreditCardFailed');
  }
  return error;
};

const getProductsIdAndQuantity = (products) => {
  const productsOutput = [];
  products.forEach((product) =>
    productsOutput.push({product: product.id, qt: product.quantity}),
  );
  return productsOutput;
};

const getProductsNameAndImage = (products) => {
  const productsOutput = [];
  products.forEach((product) =>
    productsOutput.push({
      id: product.product,
      image: product.extra.image,
      name: product.extra.name,
    }),
  );
  return productsOutput;
};

const getProductsId = (products) => {
  const ids = [];
  products.forEach((product) => ids.push(product.id));
  return ids;
};

const getAvailableProductsId = (firstProductsList, secondProductsList) => {
  const first = getProductsId(firstProductsList);
  const second = getProductsId(secondProductsList);
  const availableProductsId = [];
  second.forEach((id) => {
    if (first.includes(id) === false) {
      availableProductsId.push(id);
    }
  });
  return availableProductsId;
};

const getAvailableProducts = (firstProductsList, secondProductsList) => {
  const availableProductsId = getAvailableProductsId(
    firstProductsList,
    secondProductsList,
  );

  const availableProducts = [];

  secondProductsList.forEach((product) => {
    if (availableProductsId.includes(product.id)) {
      availableProducts.push({product: product.id, qt: product.quantity});
    }
  });
  return availableProducts;
};

const mapCartProductsToErrors = (products, errors) => {
  const productsOutput = [];

  products.forEach((product) => {
    let isInserted = false;
    errors.forEach((error) => {
      if (product.id === error.product) {
        productsOutput.push({...product, error_message: error.error});
        isInserted = true;
      }
    });
    if (isInserted === false) productsOutput.push(product);
  });
  return productsOutput;
};

const storeOrdersForRating = async (order, ordersList) => {
  if (ordersList !== null) {
    const lastOrder = ordersList[0];
    const timeInterval = order.createdAt - lastOrder.createdAt;
    if (timeInterval > ONE_DAY) {
      await storeNewOrdersList(order);
    } else {
      const lastRemoteOrderDay = new Date(order.createdAt * 1000).getDate();
      const lastLocalOrderDay = new Date(lastOrder.createdAt * 1000).getDate();
      if (lastLocalOrderDay === lastRemoteOrderDay) {
        const lastRemoteOrderHour = new Date(order.createdAt * 1000).getHours();
        if (lastRemoteOrderHour > 20) {
          await storeNewOrdersList(order);
        } else {
          ordersList.push(order);
          await storeOrdersList(ordersList);
        }
      } else {
        const lastRemoteOrderHour = new Date(order.createdAt * 1000).getHours();
        const lastLocalOrderHour = new Date(
          lastOrder.createdAt * 1000,
        ).getHours();
        if (lastRemoteOrderHour <= 20 && lastLocalOrderHour > 20) {
          ordersList.push(order);
          await storeOrdersList(ordersList);
        } else {
          await storeNewOrdersList(order);
        }
      }
    }
  } else {
    await storeNewOrdersList(order);
  }
};

const storeNewOrdersList = async (order) => {
  const newOrdersList = [];
  newOrdersList.push(order);
  await storeOrdersList(newOrdersList);
};

const mapStripeErrorToMessage = (error) => {
  for (let key in error) {
    switch (key) {
      case INVALID_REQUEST:
        return error[INVALID_REQUEST];
      case STRIPE_GENERIC:
        return error[STRIPE_GENERIC];
    }
  }
};

const productsCountFromList = (products) => {
  let count = 0;
  products.forEach((product) => {
    if (product.unit === 'items') {
      count += product.quantity;
    } else {
      count++;
    }
  });
  return count;
};

const handleValidateCardErrors = (error) => {
  if (error[INVALIDE_QUANTITY]) {
    return error[INVALIDE_QUANTITY];
  } else if (!error.message) {
    Alert.alert('', error[Object.keys(error)[0]]);
    return '';
  } else return '';
};

const isValidNumber = (n) => {
  return !isNaN(n);
};

const applyPromoCode = (amount, percent, oldeCheckout) => {
  let newCheckout = 0.0;

  if (amount && amount > 0.0) {
    newCheckout = oldeCheckout - amount;
  }

  if (percent && percent > 0.0) {
    newCheckout = oldeCheckout - oldeCheckout * percent * 0.01;
  }

  const removedAmount = oldeCheckout - newCheckout;

  return {newCheckout, removedAmount};
};

const isSIRET = (number, size=14) => {
  if (isNaN(number) || number.length!=size) return false;
  var bal = 0;
  var total = 0;
  for (var i=size-1; i>=0; i--){
      var step = (number.charCodeAt(i)-48)*(bal+1);
      /*if (step>9) { step -= 9; }
       total += step;*/
      total += (step>9)?step-9:step;
      bal = 1-bal;
  }
  return (total%10==0)?true:false;
}

export {
  handleError,
  isInternetReachable,
  calculateDiscountRatio,
  scrollListToTop,
  formatPrice,
  formatOfferPrice,
  calculatePrice,
  formatQuantity,
  formatUnit,
  getMaxQuantity,
  getMinQuantity,
  getIncrementValue,
  increment,
  decrement,
  formatAddToCartText,
  getProductsIdAndQuantity,
  getProductsNameAndImage,
  getAvailableProducts,
  mapCartProductsToErrors,
  handleAddPaymentMethodErrors,
  formatExpirationText,
  getQuantityByIndex,
  getPriceByIndex,
  calculateGroupedProductPrice,
  mapStripeErrorToMessage,
  handleValidateCardErrors,
  handleRegisterLocalInputError,
  handleLoginLocalInputError,
  handleEmailLocalInputError,
  handlePasswordLocalInputError,
  handleProfileLocalInputError,
  storeOrdersForRating,
  isValidNumber,
  handleAddressRemotErrors,
  productsCountFromList,
  handlePromoCodeRemoteErrors,
  applyPromoCode,
  handleRegisterProLocalInputError,
  handleProfileProLocalInputError
};
