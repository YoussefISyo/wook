import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  StatusBar,
  View,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {
  getCardItems,
  removeItemFromCard,
  addToCart,
  validateCart,
} from 'Wook_Market/src/lib/cart';
import {
  getProductsIdAndQuantity,
  mapCartProductsToErrors,
  handleValidateCardErrors,
  formatPrice,
} from 'Wook_Market/src/lib/util';
import CartListItem from 'Wook_Market/src/components/CartListItem';
import {_} from 'Wook_Market/src/lang/i18n';
import GenericButton from 'Wook_Market/src/components/GenericButton';
import MyCartModal from 'Wook_Market/src/components/MyCartModal';
import GenericError from 'Wook_Market/src/components/GenericError';
import EditQuantityModal from 'Wook_Market/src/components/EditQuantityModal';
import {AppContext} from 'Wook_Market/src/lib/AppContext';

const HEADER = require('Wook_Market/src/assets/images/top_header_image.png');
const FOOTER = require('Wook_Market/src/assets/images/bottom_image.png');

const calculateTotalPrice = (data) => {
  let totalPrice = 0;
  data.forEach((product) => {
    totalPrice += product.price * product.quantity;
  });
  return totalPrice;
};

class MyCartScreen extends Component {
  static contextType = AppContext;

  state = {
    data: [],
    checkout: 0,
    isModalVisible: false,
    itemToRemove: null,
    balence: 0,
    totalePrice: 0,
    buttonLoading: false,
    currentState: '',
    buttonEnabled: true,
    editQuantityLoading: false,
    minimumBalance: 0,
    minQtItems: 0,
    minQtGrams: 0,
    loading: false,
    enabled: true,
    user: {},
    productsCount: null,
    openEditQuantityModal: false,
    itemToEdit: null,
    deliveryRegion: '',
    salePoints: [],
  };

  updateCardItems(response) {
    console.log('update');
    const {data, config} = response;
    this.context.updateProductsCount(data.products);
    const totalPrice = calculateTotalPrice(data.products);
    console.log(data);
    this.setState((prevState) => ({
      ...prevState,
      data: data.products,
      balence: data.user.credit,
      totalePrice: totalPrice,
      checkout: totalPrice - data.user.credit,
      currentState: 'success',
      minimumBalance: data.ORDER_MIN_AMOUNT,
      minQtItems: data.MIN_QT_ITEMS,
      minQtGrams: data.MIN_QT_GRAMS,
      user: data.user,
      editQuantityLoading: false,
      productsCount: data.products.length,
      enabled: true,
      loading: false,
      deliveryRegion: config.delivery_region,
    }));
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      if (this.props.route.params && this.props.route.params.data) {
        this.setState({...this.state, data: this.props.route.params.data});
        this.props.route.params = undefined;
      } else {
        this.getCardItems();
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getCardItems = () => {
    this.setState({...this.state, currentState: 'loading'});
    getCardItems(
      (responceOne, responceTwo) => {
        console.log('sale point');
        console.log(responceTwo.sales_points);
        this.setSalePoints(responceTwo.sales_points);
        this.updateCardItems(responceOne);
      },
      () => {
        this.setState({
          ...this.state,
          currentState: 'error',
        });
      },
    );
  };

  setSalePoints = (salePoints) => {
    this.setState({salePoints});
  };

  onRemovePressed = (item) => {
    this.setState({
      ...this.state,
      itemToRemove: item,
    });
    this.setState((prevState) => ({
      ...prevState,
      isModalVisible: true,
    }));
  };

  editQuantitySeccess = (data) => {
    this.context.updateProductsCount(data);
    const totalPrice = calculateTotalPrice(data);
    const checkout = totalPrice - this.state.balence;
    this.setState((prevState) => ({
      ...prevState,
      data,
      totalePrice: totalPrice,
      checkout: checkout,
      editQuantityLoading: false,
    }));
  };

  editQuantityLoading = () => {
    this.setState({
      ...this.state,
      editQuantityLoading: true,
      openEditQuantityModal: false,
    });
  };

  editQuantityError = () => {
    this.setState({...this.state, editQuantityLoading: false});
  };

  onDecrimentQuantitySeccess = (data, price) => {
    const totalPrice = calculateTotalPrice(data);
    const checkout = totalPrice - this.state.balence;
    this.setState((prevState) => ({
      ...prevState,
      data,
      totalePrice: totalPrice,
      checkout: checkout,
      editQuantityLoading: false,
    }));
  };

  onCounterPressed = (id, quantity, operation) => {
    if (operation === 'add') {
      this.addTocart(id, quantity);
    } else {
      this.addTocart(id, quantity);
    }
  };

  addTocart = (id, quantity) => {
    addToCart(
      (data) => this.editQuantitySeccess(data),
      () => this.editQuantityError(),
      () => this.editQuantityLoading(),
      id,
      quantity,
    );
  };

  renderItem = ({item}) => {
    return (
      <CartListItem
        product={item}
        onPressRemove={() => this.onRemovePressed(item)}
        onPressCounter={this.onCounterPressed}
        minQtItems={this.state.minQtItems}
        minQtGrams={this.state.minQtGrams}
        onEditQuantityClick={() => this.onOpenEditQuantityModelPress(item)}
      />
    );
  };

  onRemoveItemSeccess(data) {
    if (
      this.state.buttonLoading === true &&
      this.state.buttonEnabled === false
    ) {
      this.setState({
        ...this.state,
        isModalVisible: false,
        buttonEnabled: true,
        buttonLoading: false,
      });
    }
    this.context.activateShouldRefresh();
    this.updateCardItems(data);
  }

  onRemoveItemError = () => {
    if (
      this.state.buttonLoading === true &&
      this.state.buttonEnabled === false
    ) {
      this.setState({
        ...this.state,
        buttonEnabled: true,
        buttonLoading: false,
      });
    }
  };

  onConfirmPress = () => {
    this.setState({...this.state, buttonEnabled: false, buttonLoading: true});
    removeItemFromCard(
      this.state.itemToRemove.id,
      (data) => {
        this.onRemoveItemSeccess(data);
      },
      () => {
        this.onRemoveItemError();
      },
    );
  };

  closeModale = () => {
    this.setState({
      ...this.state,
      isModalVisible: false,
      buttonLoading: false,
      buttonEnabled: true,
    });
  };

  validateCart = () => {
    validateCart(
      (products, config) => {
        this.validateCartSuccess(products, config);
      },
      (error) => {
        this.validateCartError(error);
      },
      () => {
        this.validateCartLoading();
      },
      getProductsIdAndQuantity(this.state.data),
      false,
      '/purchase/check',
    );
  };

  validateCartSuccess = (data, config) => {
    Analytics.event('commande_etape1_passer_une_commande', {
      total: this.state.checkout < 0 ? 0 : formatPrice(this.state.checkout),
    });

    this.setState({...this.state, loading: false, enabled: true});
    this.props.navigation.navigate('PaymentConfirmation', {
      data,
      minLoyaltyBonus: config.LOYALTY_BONUS_CAP,
      minOrderAmount: config.ORDER_MIN_AMOUNT,
      deliveryRegion: this.state.deliveryRegion,
      salePoints: this.state.salePoints,
      orderType: 'delivery',
      previousRoute: 'MyCart',
    });
  };

  validateCartError = (errorValue) => {
    const error = handleValidateCardErrors(errorValue);

    if (error === '') {
      this.setState({
        ...this.state,
        loading: false,
        enabled: true,
      });
      return;
    }

    this.setState({
      ...this.state,
      loading: false,
      enabled: true,
      data: mapCartProductsToErrors(this.state.data, error),
    });
  };

  validateCartLoading = () => {
    this.setState({...this.state, loading: true, enabled: false});
  };

  onCloseEditQuantityModelPress = () => {
    this.setState((prevState) => ({
      ...prevState,
      openEditQuantityModal: false,
      itemToEdit: null,
    }));
  };

  onOpenEditQuantityModelPress = (item) => {
    this.setState({
      ...this.state,
      openEditQuantityModal: true,
      itemToEdit: item,
    });
  };

  onConfirmEditQuantityPress = (isQuantityEdited, quantity, id) => {
    if (isQuantityEdited) {
      this.addTocart(id, quantity);
    } else {
      this.onCloseEditQuantityModelPress();
    }
  };

  render() {
    return this.state.currentState === 'error' ? (
      <View style={$.errorContainerStyle}>
        <Image style={$.imageOneStyle} resizeMode="cover" source={HEADER} />
        <GenericError
          errorText={_('login.errorMessage')}
          onRetry={this.getCardItems}
        />
        <Image style={$.imageTwoStyle} source={FOOTER} />
      </View>
    ) : this.state.currentState === 'loading' ? (
      <View style={$.errorContainerStyle}>
        <Image style={$.imageOneStyle} resizeMode="cover" source={HEADER} />
        <ActivityIndicator color={colors.ORANGE} size="large" />
        <Image style={$.imageTwoStyle} source={FOOTER} />
      </View>
    ) : this.state.data.length === 0 ? (
      <View style={[$.errorContainerStyle, {width: '100%', height: '100%'}]}>
        <Image style={$.imageOneStyle} resizeMode="cover" source={HEADER} />
        <Text style={{fontSize: 16}}>{_('error.emptyCart')}</Text>
        <Image style={$.imageTwoStyle} source={FOOTER} />
      </View>
    ) : (
      <View style={$.containerOneStyle}>
        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor={colors.ORANGE}
        />
        <Image style={$.imageOneStyle} resizeMode="cover" source={HEADER} />
        <FlatList
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={$.containerFiveStyle}
          data={this.state.data}
          renderItem={this.renderItem}
        />
        <View
          style={$.containerSixStyle}
          shadowOffset={{width: 3, height: 3}}
          shadowColor="black"
          shadowOpacity={0.5}>
          <Image style={$.imageTwoStyle} source={FOOTER} />
          <View style={$.containerTowStyle}>
            <Text style={$.textOneStyle}>{_('card.deliveryTime')}</Text>
            <View style={$.containerFourStyle}>
              <Text style={$.textSixStyle}>{_('card.totalOrder')}</Text>
              <Text
                style={[
                  $.textThreeStyle,
                  this.state.totalePrice < this.state.minimumBalance
                    ? {color: 'red'}
                    : null,
                ]}>
                {formatPrice(this.state.totalePrice)}
                {_('login.currencyType')}
              </Text>
            </View>
            {this.state.balence != 0 ? (
              <View style={$.containerThreeStyle}>
                <Text style={$.textFiveStyle}>{_('card.balance')}</Text>
                <Text style={$.textTwoStyle}>
                  {(this.state.balence > 0 ? '-' : '+') +
                    formatPrice(Math.abs(this.state.balence))}
                  {_('login.currencyType')}
                </Text>
              </View>
            ) : null}
            {this.state.checkout !== this.state.totalePrice ? (
              <View style={$.containerSevenStyle}>
                <Text style={$.textSevenStyle}>{_('card.totalPrice')}</Text>
                <Text style={$.textFourStyle}>
                  {this.state.checkout < 0
                    ? 0
                    : formatPrice(this.state.checkout)}
                  {_('login.currencyType')}
                </Text>
              </View>
            ) : null}
            <GenericButton
              enabled={
                //this.state.totalePrice >= this.state.minimumBalance &&
                this.state.enabled ? true : false
              }
              showMinCommand={true}
              text={_('card.goToOrder')}
              containerStyle={$.buttonOneStyle}
              onPress={() => {
                this.validateCart();
              }}
              minBalance={this.state.minimumBalance}
              loading={this.state.loading}
            />
          </View>
        </View>
        {this.state.isModalVisible ? (
          <MyCartModal
            isVisible={true}
            item={this.state.itemToRemove}
            loading={this.state.buttonLoading}
            enabled={this.state.buttonEnabled}
            onClosePress={() => this.closeModale()}
            onConfirmPress={this.onConfirmPress}
          />
        ) : null}
        {this.state.openEditQuantityModal ? (
          <EditQuantityModal
            isVisible={true}
            onClosePress={this.onCloseEditQuantityModelPress}
            item={this.state.itemToEdit}
            minQtItems={this.state.minQtItems}
            minQtGrams={this.state.minQtGrams}
            onConfirmPress={this.onConfirmEditQuantityPress}
          />
        ) : null}
        {this.state.editQuantityLoading ? (
          <View style={$.overlayContainerOneStyle}>
            <View style={$.overlayContainerTwoStyle} />
            <ActivityIndicator color={colors.ORANGE} size="large" />
          </View>
        ) : null}
      </View>
    );
  }
}

const $ = StyleSheet.create({
  buttonOneStyle: {marginBottom: 10, marginTop: 4},
  imageTwoStyle: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  imageOneStyle: {position: 'absolute', width: '100%', top: 0},
  containerOneStyle: {flex: 1},
  containerTowStyle: {
    paddingTop: 8,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
  },
  textOneStyle: {
    color: colors.DELIVERY_TIME_COLOR,
    textAlign: 'center',
    marginBottom: 12,
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
  containerFiveStyle: {margin: 8, paddingBottom: 16},
  containerSixStyle: {
    backgroundColor: 'white',
    elevation: 8,
  },
  containerSevenStyle: {width: '100%', flexDirection: 'row'},
  textFourStyle: {
    marginLeft: 'auto',
    color: colors.TOTAL_PRICE_TEXT_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
  },
  textFiveStyle: {color: colors.DELIVERY_TIME_COLOR, fontSize: 16},
  textSixStyle: {
    color: colors.DELIVERY_TIME_COLOR,
    fontSize: 16,
  },
  textSevenStyle: {color: colors.TOTAL_PRICE_TEXT_COLOR, fontSize: 18},
  overlayContainerOneStyle: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    elevation: 10,
    alignItems: 'center',
    opacity: 1,
    justifyContent: 'center',
  },
  overlayContainerTwoStyle: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'white',
    elevation: 10,
    opacity: 0.3,
  },
  errorContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default MyCartScreen;
