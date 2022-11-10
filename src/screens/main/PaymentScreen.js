import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  NativeModules,
  DeviceEventEmitter,
  Alert,
  Platform,
  FlatList,
} from 'react-native';

import {colors} from 'Wook_Market/src/lib/globalStyles';
import PaymentMethodCard from 'Wook_Market/src/components/PaymentMethodCard';
import GenericButton from 'Wook_Market/src/components/GenericButton';
import {_} from 'Wook_Market/src/lang/i18n';
import BackButton from 'Wook_Market/src/components/BackButton';
import PaymentMethodListItem from 'Wook_Market/src/components/PaymentMethodListItem';
const BACK_WHTE_ICON = require('Wook_Market/src/assets/icons/back_white_icon.png');
import {getUser} from 'Wook_Market/src/lib/user';
import {formatPrice, storeOrdersForRating} from 'Wook_Market/src/lib/util';
import {getOrdersListFromLocalCache} from 'Wook_Market/src/lib/order';
import {
  getProductsIdAndQuantity,
  handleValidateCardErrors,
  mapCartProductsToErrors,
} from 'Wook_Market/src/lib/util';
import {getPaymentMethods} from 'Wook_Market/src/lib/paymentService';
import {validateCart} from 'Wook_Market/src/lib/cart';
import {confirmPayment} from 'Wook_Market/src/lib/payment';
import {AppContext} from 'Wook_Market/src/lib/AppContext';
import PaymentMethod from 'Wook_Market/src/lib/PaymentMethod';

const {CheckoutModule, StripeBridge} = NativeModules;

class PaymentScreen extends Component {
  static contextType = AppContext;

  state = {
    useBonus: false,
    user: {},
    checkout: 0,
    data: [],
    enabled: true,
    loading: false,
    alertError: '',
    order: {
      createdAt: -1,
      id: -1,
    },
    paymentIntent: '',
    paymentMethods: [],
    paymentMethod: null,
    orderType: 'delivery',
    salePoint: null,
    promoCode: null,
  };

  handlePayPress = async (clientSecret) => {
    //const { clientSecret } = await fetchPaymentIntentClientSecret();

    const {error, paymentIntent} = await this.confirmPayment(clientSecret, {
      type: 'Alipay',
    });

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else if (paymentIntent) {
      Alert.alert(
        'Success',
        `The payment was confirmed successfully! currency: ${paymentIntent.currency}`,
      );
    }
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      await this.getUserData();
    });
    this.initStateFromParams();
    this.setNavigationOptions();
    this.mounted = true;
    this.receiveEvent = this.receiveEvent.bind(this);
    DeviceEventEmitter.addListener('Response', this.receiveEvent);
  }

  initStateFromParams = () => {
    this.setState({
      useBonus: this.props.route.params.useBonus,
      checkout: this.props.route.params.checkout,
      minOrderAmount: this.props.route.params.minOrderAmount,
      data: this.props.route.params.data,
      orderType: this.props.route.params.orderType,
      salePoint: this.props.route.params.salePoint,
      //paymentMethods: getPaymentMethods(this.props.route.params.orderType,this.state.user.role ),
      promoCode: this.props.route.params.promoCode,
    });
  };

  receiveEvent = async (message) => {
    if (message === 'Success') {
      this.confirmPayment();
    } else if (message === 'PaymentFailedError') {
      this.setState({
        ...this.state,
        loading: false,
        enabled: true,
        alertError: _('error.paymentFailed'),
      });
    } else if (message === 'RequestFailedError') {
      this.setState({
        ...this.state,
        loading: false,
        enabled: true,
        alertError: _('login.serverError'),
      });
    }
  };

  storeOrdersForRating = async () => {
    const orders = await getOrdersListFromLocalCache();
    await storeOrdersForRating(this.state.order, orders);
  };

  createAlert = () => {
    Alert.alert(
      '',
      this.state.alertError,
      [
        {
          text: _('login.close'),
          onPress: () =>
            this.setState({
              ...this.state,
              alertError: '',
            }),
        },
      ],
      {cancelable: false},
    );
  };

  createPurchaseErrorAlert = (error) => {
    Alert.alert(
      '',
      _('error.purchaseError'),
      [
        {
          text: _('error.gotToCart'),
          onPress: () => {
            this.props.navigation.navigate('MyCart', {
              data: mapCartProductsToErrors(this.state.data, error),
            });
          },
        },
      ],
      {cancelable: false},
    );
  };

  getUserData = async () => {
    const user = JSON.parse(await getUser());
    this.setState((prevState) => ({
      ...prevState,
      user: user,
      paymentMethods: getPaymentMethods(
        this.props.route.params.orderType,
        user.role,
      ),
    }));
  };

  setNavigationOptions() {
    this.props.navigation.setOptions({
      headerLeft: () => {
        return (
          <BackButton
            onPress={() => this.props.navigation.pop()}
            image={BACK_WHTE_ICON}
          />
        );
      },
    });
  }

  confirmPayment = () => {
    confirmPayment(
      (response) => this.onConfirmPaymentSuccess(response),
      () => this.onConfirmPaymentError(),
      () => this.onConfirmPaymentLoading(),
      this.state.paymentIntent,
    );
  };

  onConfirmPaymentLoading = () => {};

  onConfirmPaymentSuccess = (response) => {
    this.setState({...this.state, loading: false, enabled: true}, () => {
      console.log(response.data.loyalty_bonus);
      this.storeOrdersForRating();

      Alert.alert(
        '',
        'Commande effectuée. Vous avez cumulé ' +
          response.data.loyalty_bonus +
          ' € bonus de fidélité ',
        [
          {
            text: _('main.ok'),
            onPress: () => {
              this.navigateToOrdersScreen();
            },
          },
        ],
        {cancelable: false},
      );
    });
  };

  onConfirmPaymentError = () => {
    this.setState({...this.state, loading: false, enabled: true});
    Alert.alert('', _('login.serverError'));
  };

  navigate = (destination, params) => {
    this.props.navigation.navigate(destination, params);
  };

  validateCart = () => {
    if (
      this.state.orderType == 'delivery' &&
      this.state.checkout < this.state.minOrderAmount
    ) {
      Alert.alert(
        '',
        `${_('main.minimumForDelivery1')} ${this.state.minOrderAmount}€ ${_(
          'main.minimumForDelivery2',
        )}`,
      );
      return;
    }

    validateCart(
      (data, config) => {
        this.validateCartSuccess(data, config);
      },
      (error) => {
        this.validateCartError(error);
      },
      () => {
        this.validateCartLoading();
      },
      getProductsIdAndQuantity(this.state.data),
      this.state.useBonus,
      '/purchase/prepare',
      this.state.orderType,
      this.state.promoCode,
      this.state.salePoint,
      this.getPaymentType(this.state.paymentMethod),
    );
  };

  getPaymentType = (paymentMethod) => {
    if (paymentMethod === 1) return 'alipay';
    if (paymentMethod === 2) return 'card';
    if (paymentMethod === 3) return 'cash';
    //pro
    if (paymentMethod === 10) return 'card_pro';
    if (paymentMethod === 11) return 'check_pro';
    if (paymentMethod === 12) return 'cash_pro';
  };

  validateCartSuccess = (data, config) => {
    Analytics.event('commande_etape4_paiement_et_achat', {
      payment_method: this.getPaymentType(this.state.paymentMethod),
    });

    this.setState(
      {
        ...this.state,
        order: {createdAt: data.order.created_at, id: data.order.id},
        paymentIntent: data.payment_intent,
      },
      () => {
        if (data.amount_cents === 0) {
          this.setState({...this.state, loading: false, enabled: true});
          this.storeOrdersForRating();
          this.navigateToOrdersScreen();
          return;
        }
        if (
          this.getPaymentType(this.state.paymentMethod) === 'cash' ||
          this.getPaymentType(this.state.paymentMethod) === 'cash_pro' ||
          this.getPaymentType(this.state.paymentMethod) === 'check_pro'
        ) {
          this.setState({...this.state, loading: false, enabled: true});
          this.storeOrdersForRating();
          Alert.alert('', _('main.notOrderPending'), [
            {
              text: _('main.ok'),
              //onPress: () => this.props.navigation.replace('Main'),
            },
          ]);
          this.navigateToOrdersScreen();

          return;
        }
        if (Platform.OS === 'android') {
          if (this.getPaymentType(this.state.paymentMethod) === 'card') {
            CheckoutModule.makePayment(data.client_secret, data.payment_method);
          }
          if (this.getPaymentType(this.state.paymentMethod) === 'card_pro') {
            CheckoutModule.makePayment(data.client_secret, data.payment_method);
          }
          if (this.getPaymentType(this.state.paymentMethod) === 'alipay') {
            //this.handlePayPress(data.client_secret);
            CheckoutModule.makeAlipayPayment(data.client_secret);
          }
        } else {
          if (this.getPaymentType(this.state.paymentMethod) === 'card') {
            this.handlePaymentIos(data.client_secret, data.payment_method);
          }
          if (this.getPaymentType(this.state.paymentMethod) === 'card_pro') {
            this.handlePaymentIos(data.client_secret, data.payment_method);
          }
          if (this.getPaymentType(this.state.paymentMethod) === 'alipay') {
            this.handleAlipayPaymentIos(data.client_secret);
          }
        }
      },
    );
  };

  handleAlipayPaymentIos = (clientId) => {
    StripeBridge.createAlipayPayment(
      clientId,
      async (error, res, payment_method) => {
        console.log(error, res, payment_method);
        if (res == 'SUCCESS') {
          this.confirmPayment();
        } else if (res == 'CANCEL') {
          this.setState({
            ...this.state,
            loading: false,
            enabled: true,
            alertError: _('error.paymentFailed'),
          });
        } else if (res == 'ERROR') {
          this.setState({
            ...this.state,
            loading: false,
            enabled: true,
            alertError: _('login.serverError'),
          });
        }
      },
    );
  };

  handlePaymentIos = (clientId, paymentMethodId) => {
    StripeBridge.createPayment(
      clientId,
      paymentMethodId,
      async (error, res, payment_method) => {
        if (res == 'SUCCESS') {
          this.confirmPayment();
        } else if (res == 'CANCEL') {
          this.setState({
            ...this.state,
            loading: false,
            enabled: true,
            alertError: _('error.paymentFailed'),
          });
        } else if (res == 'ERROR') {
          this.setState({
            ...this.state,
            loading: false,
            enabled: true,
            alertError: _('login.serverError'),
          });
        }
      },
    );
  };

  validateCartError = (errorValue) => {
    const error = handleValidateCardErrors(errorValue);
    if (error === '') {
      this.disablePurchaseButton();
      return;
    }
    this.disablePurchaseButton();
    this.createPurchaseErrorAlert(error);
  };

  disablePurchaseButton = () => {
    this.setState({
      ...this.state,
      loading: false,
      enabled: true,
    });
  };

  validateCartLoading = () => {
    this.setState({...this.state, loading: true, enabled: false});
  };

  navigateToOrdersScreen = () => {
    this.props.navigation.pop(3);
    if (this.state.orderType === 'pay_go') {
      this.props.navigation.navigate('Orders', {
        orderType: this.state.orderType,
      });
    } else {
      this.props.navigation.navigate('Main', {
        screen: 'Tab',
        params: {
          screen: 'ProductsTab',
          params: {screen: 'Orders', params: {orderType: this.state.orderType}},
        },
      });
    }
  };

  getDisabledOpacity = () => {
    return this.state.user.card_type &&
      this.state.user.last4 &&
      this.state.user.card_brand &&
      this.state.paymentMethod
      ? false
      : true;
  };

  isPaymentButtonEnabled = () => {
    console.log(this.state.paymentMethod);

    if (this.state.paymentMethod == 12) {
      return this.state.enabled ? true : false;
    }
    if (this.state.paymentMethod == 11) {
      return this.state.enabled ? true : false;
    }

    if (this.state.paymentMethod == 3) {
      return this.state.enabled ? true : false;
    }

    if (this.state.paymentMethod == 1) {
      return this.state.enabled ? true : false;
    }

    return this.state.user.card_type &&
      this.state.user.last4 &&
      this.state.user.card_brand &&
      this.state.enabled &&
      this.state.paymentMethod
      ? true
      : false;
  };

  getListHeaderComponent = () => {
    return <Text style={$.titleStyle}>{_('main.choosePaymentMethod')}</Text>;
  };

  getListFooterComponent = () => {
    return this.getPaymentType(this.state.paymentMethod) === 'card' ||
      this.getPaymentType(this.state.paymentMethod) === 'card_pro' ? (
      <View>
        <View style={$.horizontalLineStyle} />
        <View style={$.containerSixStyle}>
          <Text style={$.textOneStyle}>{_('main.bankCard')}</Text>
          {this.state.user.card_brand ? null : (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => this.navigate('PaymentMethodFromTab')}>
              <Text style={{color: colors.ORANGE, fontWeight: 'bold'}}>
                {_('login.add')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {this.state.user.card_type &&
        this.state.user.last4 &&
        this.state.user.card_brand ? (
          <PaymentMethodCard
            cardBrand={this.state.user.card_brand}
            cardType={this.state.user.card_type}
            last4={this.state.user.last4}
            image={this.state.user.card_image}
            onEditPress={() => this.navigate('PaymentMethodFromTab')}
          />
        ) : (
          <GenericButton
            disabledText={_('card.paymentMethodRequired')}
            enabled={false}
          />
        )}
      </View>
    ) : null;
  };

  renderItem = ({item, index}) => {
    return (
      <PaymentMethodListItem
        item={item}
        paymentMethod={this.state.paymentMethod}
        onPaymentMethodSelect={this.handlePaymentMethodSelect}
      />
    );
  };

  handlePaymentMethodSelect = (paymentMethod) => {
    this.setState({paymentMethod});
    //Analytics.event('commande_etape4_paiement_et_achat', {payment_method: this.getPaymentType(paymentMethod)});
  };

  renderSeparator = () => <View style={$.separatoreStyle} />;

  render() {
    return (
      <SafeAreaView style={$.containerThreeStyle}>
        <FlatList
          data={this.state.paymentMethods}
          keyExtractor={(item) => item.id.toString()}
          bounces={false}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={this.getListHeaderComponent}
          ListFooterComponent={this.getListFooterComponent}
          ItemSeparatorComponent={this.renderSeparator}
          contentContainerStyle={{padding: 24}}
          renderItem={this.renderItem}
        />
        <View style={$.bottomContainerStyle}>
          <View
            style={
              this.state.paymentMethod == 10
                ? $.containerFiveStyle1
                : $.containerFiveStyle
            }>
            <Text style={$.textSixStyle}>{_('card.totalOrder')}</Text>
            <Text
              style={
                this.state.paymentMethod == 10
                  ? $.textThreeStyle1
                  : $.textThreeStyle
              }>
              {this.state.checkout < 0 ? 0 : formatPrice(this.state.checkout)}
              {_('login.currencyType')}
            </Text>
          </View>
          {this.state.paymentMethod == 10 && (
            <>
              <View style={$.containerFiveStyle1}>
                <Text style={$.textSixStyle}>{_('main.discount2percent')}</Text>
                <Text style={$.textThreeStyle1}>
                  {'-'}{' '}
                  {this.state.checkout * 0.02 < 0
                    ? 0
                    : formatPrice(this.state.checkout * 0.02)}
                  {_('login.currencyType')}
                </Text>
              </View>

              <View style={$.containerFiveStyle}>
                <Text style={$.textSixStyle}>{_('card.totalOrder')}</Text>
                <Text style={$.textThreeStyle}>
                  {this.state.checkout - this.state.checkout * 0.02 < 0
                    ? 0
                    : formatPrice(
                        this.state.checkout - this.state.checkout * 0.02,
                      )}
                  {_('login.currencyType')}
                </Text>
              </View>
            </>
          )}
          <GenericButton
            text={_('card.buy')}
            containerStyle={{marginBottom: 36}}
            disabledOpacity={this.getDisabledOpacity()}
            enabled={this.isPaymentButtonEnabled()}
            loading={this.state.loading}
            onPress={this.validateCart}
          />
          {this.state.alertError !== '' ? this.createAlert() : null}
        </View>
      </SafeAreaView>
    );
  }
}

const $ = StyleSheet.create({
  titleStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.PAYMENT_TEXT_COLOR,
    marginBottom: 16,
  },
  textOneStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.PAYMENT_TEXT_COLOR,
    marginBottom: 24,
  },
  containerThreeStyle: {
    height: '100%',
  },
  containerFiveStyle1: {width: '100%', flexDirection: 'row', marginBottom: 6},
  containerFiveStyle: {width: '100%', flexDirection: 'row', marginBottom: 16},

  textThreeStyle: {
    marginLeft: 'auto',
    color: colors.DELIVERY_TIME_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
  },

  textThreeStyle1: {
    marginLeft: 'auto',
    color: colors.DELIVERY_TIME_COLOR,
    fontSize: 16,
  },

  textSixStyle: {color: colors.DELIVERY_TIME_COLOR, fontSize: 16},
  containerSixStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  textTwoStyle: {color: colors.ORANGE, fontWeight: '600'},
  bottomContainerStyle: {
    paddingHorizontal: 24,
    marginTop: 'auto',
    backgroundColor: 'white',
    elevation: 8,
    paddingTop: 24,
    shadowOffset: {width: 0, height: -0.1},
    shadowRadius: 1,
    shadowColor: 'black',
    shadowOpacity: 0.3,
  },
  separatoreStyle: {
    borderBottomColor: colors.LIGHT_GRAY,
    borderBottomWidth: 0.5,
    marginHorizontal: 2,
  },
  horizontalLineStyle: {
    borderBottomColor: colors.HORIZONTAL_LINE_COLOR,
    borderBottomWidth: 1,
    marginTop: 20,
    marginBottom: 24,
    marginHorizontal: 82,
  },
});

export default PaymentScreen;
