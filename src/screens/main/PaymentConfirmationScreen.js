import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
import ConfirmationListItem from 'Wook_Market/src/components/ConfirmationListItem';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {OS_IOS} from 'Wook_Market/src/lib/Constants';
import {_} from 'Wook_Market/src/lang/i18n';
import GenericButton from 'Wook_Market/src/components/GenericButton';
import PaymentConfirmationScreenModal from 'Wook_Market/src/components/PaymentConfirmationScreenModal';
import BackButton from 'Wook_Market/src/components/BackButton';
import Collapsible from 'react-native-collapsible';
import {
  formatPrice,
  productsCountFromList,
  handlePromoCodeRemoteErrors,
  applyPromoCode,
} from 'Wook_Market/src/lib/util';
import {validatePromoCode} from 'Wook_Market/src/lib/promo';
import {storeUser} from 'Wook_Market/src/lib/user';
import TextField from 'Wook_Market/src/components/TextField';
const BACK_WHTE_ICON = require('Wook_Market/src/assets/icons/back_white_icon.png');
const SHOW_MORE_ICON = require('Wook_Market/src/assets/icons/icn_show_all.png');
const SHOW_LESS_ICON = require('Wook_Market/src/assets/icons/icn_show_less.png');

const calculateTotalPrice = (data) => {
  let totalPrice = 0;
  data.forEach((product) => {
    totalPrice += product.price * product.quantity;
  });
  return totalPrice;
};

class PaymentConfirmationScreen extends Component {
  state = {
    data: [],
    isModalVisible: false,
    totalePrice: 0.0,
    checkout: 0.0,
    balence: 0.0,
    loyaltyBonus: 0.0,
    minLoyaltyBonus: 0.0,
    user: {},
    isCollapsed: false,
    promoCode: '',
    promoCodeDiscount: 0.0,
    loading: false,
    enabled: true,
    error: {
      promoCode: '',
    },
    deliveryRegion: '',
    salePoints: [],
    orderType: 'delivery',
    minOrderAmount: 0,
  };

  constructor(props) {
    super(props);
    this.checkout = 0.0;
    this.promoCodeDiscount = 0.0;
  }

  updateCardItems = async (
    data,
    minLoyaltyBonus,
    deliveryRegion,
    salePoints,
    orderType,
    minOrderAmount,
  ) => {
    await storeUser(data.user);
    const totalPrice = calculateTotalPrice(data.products);
    const checkout = totalPrice - data.user.credit;
    this.checkout = checkout;
    this.setState((prevState) => ({
      ...prevState,
      data: data.products,
      totalePrice: totalPrice,
      balence: data.user.credit,
      checkout: checkout,
      loyaltyBonus: data.user.loyalty_bonus,
      minLoyaltyBonus,
      user: data.user,
      deliveryRegion,
      salePoints,
      orderType,
      minOrderAmount: minOrderAmount,
    }));
  };

  componentDidMount() {
    this.updateCardItems(
      this.props.route.params.data,
      this.props.route.params.minLoyaltyBonus,
      this.props.route.params.deliveryRegion,
      this.props.route.params.salePoints,
      this.props.route.params.orderType,
      this.props.route.params.minOrderAmount,
    );
    this.previousRoute = this.props.route.params.previousRoute;
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    this.setNavigationOptions();
  }

  navigateBack = (barCode) => {
    this.props.navigation.navigate(this.previousRoute, {
      barCode: barCode,
      previousRoute: this.previousRoute,
    });
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  setNavigationOptions() {
    this.props.navigation.setOptions({
      headerLeft: () => {
        return (
          <BackButton
            onPress={() => this.navigateBack()}
            image={BACK_WHTE_ICON}
          />
        );
      },
    });
  }

  renderItem = ({item}) => {
    return <ConfirmationListItem product={item} />;
  };

  renderSeparator = () => <View style={$.separatoreContainerStyle} />;

  handleOnClosePress = () => {
    this.setState({isModalVisible: false});
    this.navigateToPaymantScreen(false);
  };

  handleLoyaltyBonus = () => {
    if (
      this.state.loyaltyBonus >= this.state.minLoyaltyBonus &&
      this.state.checkout > 0
    ) {
      this.setState({isModalVisible: true});
    } else {
      this.navigateToPaymantScreen(false);
    }
  };

  onUneBonusPress = async () => {
    await this.setState({
      ...this.state,
      isModalVisible: false,
    });
    this.navigateToPaymantScreen(true);
  };

  navigateToPaymantScreen = (useBonus) => {
    if (this.state.orderType === 'pay_go') {
      Analytics.event('commande_etape2_confirmer', {
        total: this.state.checkout < 0 ? 0 : formatPrice(this.state.checkout),
        promocode: this.state.promoCodeDiscount ? 'oui' : 'non',
      });

      this.props.navigation.navigate('Payment', {
        useBonus,
        minOrderAmount: this.state.minOrderAmount,
        checkout: useBonus
          ? this.state.checkout - this.state.loyaltyBonus
          : this.state.checkout,
        data: this.state.data,
        orderType: this.state.orderType,
        promoCode:
          parseFloat(this.state.promoCodeDiscount) > 0.0
            ? this.state.promoCode
            : null,
      });
    } else {
      Analytics.event('commande_etape2_confirmer', {
        total: this.state.checkout < 0 ? 0 : formatPrice(this.state.checkout),
        promocode: this.state.promoCodeDiscount ? 'oui' : 'non',
      });

      this.props.navigation.navigate('Purchase', {
        useBonus,
        minOrderAmount: this.state.minOrderAmount,
        checkout: useBonus
          ? this.state.checkout - this.state.loyaltyBonus
          : this.state.checkout,
        totalPrice: this.state.totalPrice,
        data: this.state.data,
        deliveryRegion: this.state.deliveryRegion,
        salePoints: this.state.salePoints,
        orderType: this.state.orderType,
        promoCode:
          parseFloat(this.state.promoCodeDiscount) > 0.0
            ? this.state.promoCode
            : null,
      });
    }
  };

  toggleCollapsibleContent = () => {
    this.setState({isCollapsed: !this.state.isCollapsed});
  };

  setPromoCode = (value) => {
    this.setState((prevState) => ({...prevState, promoCode: value}));
    this.resetError('promoCode', value.length);
  };

  resetError(key, length) {
    if (length > 0 && this.state.error[key] !== '') {
      this.setState((prevState) => ({
        ...prevState,
        error: {...this.state.error, [key]: ''},
      }));
    }
  }

  validatePromoCode = () => {
    if (this.state.promoCode.length === 0 || this.state.loading === true)
      return;

    validatePromoCode(
      this.onValidatePromoCodeLoading,
      this.onValidatePromoCodeSuccess,
      this.onValidatePromoCodeError,
      this.state.promoCode,
    );
  };

  onValidatePromoCodeLoading = () => {
    this.setState({loading: true, enabled: false});
  };

  onValidatePromoCodeSuccess = (promocode) => {
    const {newCheckout, removedAmount} = applyPromoCode(
      promocode.amount_off,
      promocode.percent_off,
      this.checkout,
    );

    const newPromoCodeDiscount = this.promoCodeDiscount + removedAmount;

    this.setState({
      loading: false,
      enabled: true,
      checkout: newCheckout,
      promoCodeDiscount: newPromoCodeDiscount,
    });
  };

  onValidatePromoCodeError = (error) => {
    this.setState({
      loading: false,
      enabled: true,
      error: handlePromoCodeRemoteErrors(error),
    });
  };

  render() {
    return (
      <KeyboardAvoidingView behavior={OS_IOS ? 'padding' : null} enabled>
        <SafeAreaView style={{height: '100%'}}>
          <View style={{flex: 1}}>
            <FlatList
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={$.listContainerStyle}
              ItemSeparatorComponent={this.renderSeparator}
              data={this.state.data}
              renderItem={this.renderItem}
            />
            <View
              style={$.constainerSixStyle}
              shadowOffset={{width: 0, height: -0.1}}
              shadowRadius={1}
              shadowColor="black"
              shadowOpacity={0.3}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={this.toggleCollapsibleContent}>
                <View style={$.collapsibleHeaderStyle}>
                  <Text style={$.promoHeaderTextStyle}>
                    {this.state.isCollapsed
                      ? _('main.showMore')
                      : _('main.showLess')}
                  </Text>
                  <Image
                    style={{alignSelf: 'center'}}
                    source={
                      this.state.isCollapsed ? SHOW_MORE_ICON : SHOW_LESS_ICON
                    }
                  />
                </View>
              </TouchableOpacity>
              <Collapsible collapsed={this.state.isCollapsed}>
                <Text style={$.promoTextStyle}>{_('main.promoCodeText')}</Text>
                <View style={$.promoCOdeHorizontalContainerStyle}>
                  <TextField
                    selectionColor={colors.ORANGE}
                    containerStyle={{flex: 1, marginRight: 24}}
                    autoCorrect={false}
                    placeholder={_('main.promoCode')}
                    value={this.state.promoCode}
                    error={this.state.error.promoCode}
                    onChangeText={(value) => {
                      this.setPromoCode(value);
                    }}
                    onSubmitEditing={() => {}}
                    returnKeyType="done"
                  />
                  <GenericButton
                    style={[
                      {
                        paddingHorizontal: 28,
                        paddingVertical: Platform.OS === 'android' ? 11 : 12,
                      },
                      this.state.promoCode.length > 0
                        ? $.enabledPromoButtonStyle
                        : $.disabledPromoButtonStyle,
                    ]}
                    textStyle={[
                      this.state.promoCode.length > 0
                        ? {color: colors.ORANGE}
                        : {color: 'white'},
                    ]}
                    text={_('main.apply')}
                    activeOpacity={this.state.promoCode.length === 0 ? 1 : 0.7}
                    onPress={this.validatePromoCode}
                    containerStyle={{alignSelf: 'flex-end', marginBottom: -4}}
                    loadingStyle={[
                      {
                        paddingHorizontal: Platform.OS === 'android' ? 50 : 51,
                        paddingVertical: 10,
                        opacity: 0.7,
                      },
                      $.enabledPromoButtonStyle,
                    ]}
                    enabled={this.state.enabled}
                    loading={this.state.loading}
                    spinnerColor={colors.ORANGE}
                    spinnerSize={24}
                  />
                </View>
                <View style={$.containerFiveStyle}>
                  <Text
                    style={{color: colors.DELIVERY_TIME_COLOR, fontSize: 16}}>
                    {_('card.productsNumber')}
                  </Text>
                  <Text style={$.textTwoStyle}>
                    {productsCountFromList(this.state.data)}{' '}
                    {_('login.products')}
                  </Text>
                </View>
                <View style={$.containerFourStyle}>
                  <Text style={$.textFiveStyle}>{_('card.totalOrder')}</Text>
                  <Text style={$.textThreeStyle}>
                    {formatPrice(this.state.totalePrice)}
                    {_('login.currencyType')}
                  </Text>
                </View>
                {parseFloat(this.state.balence) != 0.0 ? (
                  <View style={$.containerThreeStyle}>
                    <Text
                      style={{color: colors.DELIVERY_TIME_COLOR, fontSize: 16}}>
                      {_('card.balance')}
                    </Text>
                    <Text style={$.textTwoStyle}>
                      {(this.state.balence > 0 ? '-' : '+') +
                        formatPrice(Math.abs(this.state.balence))}
                      {_('login.currencyType')}
                    </Text>
                  </View>
                ) : null}
                {parseFloat(this.state.promoCodeDiscount) > 0.0 ? (
                  <View style={$.containerThreeStyle}>
                    <Text
                      style={{color: colors.DELIVERY_TIME_COLOR, fontSize: 16}}>
                      {_('main.promoCode')}
                    </Text>
                    <Text style={[$.textTwoStyle, {color: colors.LIGHT_GREEN}]}>
                      -{formatPrice(this.state.promoCodeDiscount)}
                      {_('login.currencyType')}
                    </Text>
                  </View>
                ) : null}
              </Collapsible>
              {parseFloat(this.state.checkout) !==
              parseFloat(this.state.totalePrice) ? (
                <View
                  style={{width: '100%', flexDirection: 'row', marginTop: 8}}>
                  <Text
                    style={{
                      color: colors.TOTAL_PRICE_TEXT_COLOR,
                      fontSize: 18,
                    }}>
                    {_('card.totalPrice')}
                  </Text>
                  <Text style={$.textFourStyle}>
                    {this.state.checkout < 0
                      ? 0
                      : formatPrice(this.state.checkout)}
                    {_('login.currencyType')}
                  </Text>
                </View>
              ) : null}
              <GenericButton
                text={_('card.confirm')}
                containerStyle={$.buttonStyle}
                onPress={this.handleLoyaltyBonus}
              />
            </View>
            <PaymentConfirmationScreenModal
              isVisible={this.state.isModalVisible}
              onClosePress={this.handleOnClosePress}
              loyaltyBonus={this.state.loyaltyBonus}
              checkout={this.state.checkout}
              onConfirmPress={this.onUneBonusPress}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const $ = StyleSheet.create({
  disabledPromoButtonStyle: {
    backgroundColor: colors.DISABLED_GRAY,
    borderWidth: 1,
    borderColor: colors.DISABLED_GRAY,
  },
  enabledPromoButtonStyle: {
    borderWidth: 1,
    borderColor: colors.ORANGE,
    backgroundColor: 'white',
  },
  promoCOdeHorizontalContainerStyle: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 6,
  },
  promoHeaderTextStyle: {
    fontSize: 16,
    marginRight: 10,
    color: colors.REPORT_TEXT_COLOR,
  },
  promoTextStyle: {
    color: colors.REPORT_TEXT_COLOR,
    fontSize: 16,
    marginTop: 16,
  },
  collapsibleHeaderStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.LIGHT_PINK,
    paddingVertical: 12,
    marginHorizontal: -24,
  },
  textOneStyle: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 8,
  },
  containerThreeStyle: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 8,
  },
  textTwoStyle: {
    marginLeft: 'auto',
    color: colors.DELIVERY_TIME_COLOR,
    fontSize: 16,
  },
  containerFourStyle: {width: '100%', flexDirection: 'row', marginBottom: 8},
  textThreeStyle: {
    marginLeft: 'auto',
    color: colors.DELIVERY_TIME_COLOR,
    fontSize: 16,
  },
  containerFiveStyle: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 8,
    marginTop: 16,
  },
  constainerSixStyle: {
    paddingHorizontal: 16,
    backgroundColor: 'white',
    elevation: 8,
  },
  textFourStyle: {
    marginLeft: 'auto',
    color: colors.TOTAL_PRICE_TEXT_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
  },
  textFiveStyle: {
    color: colors.DELIVERY_TIME_COLOR,
    fontSize: 16,
  },
  separatoreContainerStyle: {
    borderBottomColor: colors.GRAY_VARIANT,
    borderBottomWidth: 0.6,
  },
  listContainerStyle: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 6,
  },
  buttonStyle: {marginHorizontal: 12, marginTop: 20, marginBottom: 30},
  errorContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default PaymentConfirmationScreen;
