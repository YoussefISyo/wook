import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  StatusBar,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
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
import BackButton from 'Wook_Market/src/components/BackButton';
import ButtonWithLeftIcon from 'Wook_Market/src/components/ButtonWithLeftIcon';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {_} from 'Wook_Market/src/lang/i18n';
import GenericButton from 'Wook_Market/src/components/GenericButton';
import MyCartModal from 'Wook_Market/src/components/MyCartModal';
import GenericError from 'Wook_Market/src/components/GenericError';
import EditQuantityModal from 'Wook_Market/src/components/EditQuantityModal';
import { createPrinter } from 'typescript';

const BACK_WHTE_ICON = require('Wook_Market/src/assets/icons/back_white_icon.png');
const HEADER = require('Wook_Market/src/assets/images/top_header_image.png');
const FOOTER = require('Wook_Market/src/assets/images/bottom_image.png');
const SCAN_WHITE = require('Wook_Market/src/assets/icons/icn_scan_product.png');
const SCAN_ORANGE = require('Wook_Market/src/assets/icons/icn_scan_new_product.png');

const calculateTotalPrice = (data) => {
  let totalPrice = 0;
  data.forEach((product) => {
    totalPrice += product.price * product.quantity;
  });
  return totalPrice;
};

export class PayAndGoScreen extends Component {
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
  };

  componentDidMount = () => {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      const params = this.props.route.params;
      if (params && params.barCode && params.previousRoute === 'Camera') {
        this.addItemByCodebar();
      } else {
        this.getCardItems();
      }
    });
    this.getCardItems();
    this.setNavigationOptions();
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  backAction = () => {
    this.navigateBack(null);
    return true;
  };

  navigateBack = (barCode) => {
    this.props.navigation.navigate(this.previousRoute, {
      barCode: barCode,
      previousRoute: null,
    });
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

  addItemByCodebar = () => {
    const params = this.props.route.params;
    //hhh
    //console.log(this.state.data[0].barcode == params.barCode)

    //console.log(this.state.data)

    let product_ = this.state.data.filter((product) => 
      product.barcode == params.barCode

    );
    //console.log("product_", product_)


    if(product_.length>0){
      Alert.alert('', "Ce produit a déjà été scanné. Vous pouvez augmenter la quantité directement dans le panier");
      return;
    }

    if (params && params.barCode) {
      addToCart(
        (data) => this.editQuantitySeccess(data),
        () => this.addItemByCadeBarError(),
        () => this.editQuantityLoading(),
        undefined,
        1,
        params.barCode,
        'pay_go',
      );
    }
  };

  addItemByCadeBarError = () => {
    this.setState({...this.state, editQuantityLoading: false});
    Alert.alert('', _('main.noProduct'));
  };

  updateCardItems(response) {
    const {data, config} = response;
    const totalPrice = calculateTotalPrice(data.products);
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

  getCardItems = () => {
    this.setState({...this.state, currentState: 'loading'});
    getCardItems(
      (responceOne) => {
        this.updateCardItems(responceOne);
      },
      () => {
        this.setState({
          ...this.state,
          currentState: 'error',
        });
      },
      'pay_go',
    );
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
    Analytics.event('pay_and_go_scan_success');
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
      undefined,
      'pay_go',
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
      'pay_go',
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
      'pay_go',
    );
  };

  validateCartSuccess = (data, config) => {
    this.setState({...this.state, loading: false, enabled: true});
    Analytics.event('commande_etape1_passer_une_commande', {total: this.state.checkout < 0 ? 0 : formatPrice(this.state.checkout)});

    this.props.navigation.navigate('PaymentConfirmationFromDetail', {
      data: data,
      minLoyaltyBonus: config.LOYALTY_BONUS_CAP,
      deliveryRegion: this.state.deliveryRegion,
      orderType: 'pay_go',
      previousRoute: 'PayAndGo',
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

  openCamera = () => {
    const camera = 'Camera';
    const payAndGo = 'PayAndGo';
    this.props.navigation.navigate(camera, {previousRoute: payAndGo});
  };

  render() {
    const {
      data,
      currentState,
      totalePrice,
      minimumBalance,
      balence,
      checkout,
      enabled,
      loading,
      isModalVisible,
      itemToRemove,
      buttonEnabled,
      buttonLoading,
      itemToEdit,
      openEditQuantityModal,
      minQtGrams,
      minQtItems,
      editQuantityLoading,
    } = this.state;

    return (
      <SafeAreaView flex={1}>
        {currentState === 'error' ? (
          <View style={$.errorContainerStyle}>
            <Image style={$.imageOneStyle} resizeMode="cover" source={HEADER} />
            <GenericError
              errorText={_('login.errorMessage')}
              onRetry={this.getCardItems}
            />
            <Image style={$.imageTwoStyle} source={FOOTER} />
          </View>
        ) : currentState === 'loading' ? (
          <View style={$.errorContainerStyle}>
            <Image style={$.imageOneStyle} resizeMode="cover" source={HEADER} />
            <ActivityIndicator color={colors.ORANGE} size="large" />
            <Image style={$.imageTwoStyle} source={FOOTER} />
          </View>
        ) : data.length === 0 ? (
          <View
            style={[$.errorContainerStyle, {width: '100%', height: '100%'}]}>
            <Image style={$.imageOneStyle} resizeMode="cover" source={HEADER} />
            {!editQuantityLoading ? (
              <View>
                <Text style={$.emptyStateTextStyle}>
                  {_('main.noProducts')}
                </Text>
                <ButtonWithLeftIcon
                  text={_('main.addProduct')}
                  icon={SCAN_WHITE}
                  containerStyle={{marginHorizontal: 24, marginTop: 20}}
                  onPress={() => {Analytics.event('pay_and_go_clic_ajouter_procuit'); this.openCamera();}}
                />
              </View>
            ) : null}
            <Image style={$.imageTwoStyle} source={FOOTER} />
            {editQuantityLoading ? (
              <View style={$.overlayContainerOneStyle}>
                <View style={$.overlayContainerTwoStyle} />
                <ActivityIndicator color={colors.ORANGE} size="large" />
              </View>
            ) : null}
          </View>
        ) : (
          <View style={$.containerOneStyle}>
            <StatusBar
              translucent
              barStyle="light-content"
              backgroundColor={colors.ORANGE}
            />
            <Image style={$.imageOneStyle} resizeMode="cover" source={HEADER} />
            <ButtonWithLeftIcon
              text={_('main.addProduct')}
              icon={SCAN_ORANGE}
              containerStyle={{
                marginHorizontal: 24,
                marginTop: 20,
                marginBottom: 8,
                backgroundColor: 'white',
                backgroundColor: 'white',
                elevation: 2,
                shadowOffset: {width: 0.2, height: 0.2},
                shadowColor: 'black',
                shadowOpacity: 0.1,
              }}
              textStyle={{color: colors.ORANGE}}
              onPress={() => { Analytics.event('pay_and_go_clic_ajouter_procuit'); this.openCamera()}}
            />
            <FlatList
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={$.containerFiveStyle}
              data={data}
              renderItem={this.renderItem}
            />
            <View
              style={$.containerSixStyle}
              shadowOffset={{width: 0.5, height: 0.5}}
              shadowColor="black"
              shadowOpacity={0.2}>
              <Image style={$.imageTwoStyle} source={FOOTER} />
              <View style={$.containerTowStyle}>
                <Text style={$.textOneStyle}>{_('card.deliveryTime')}</Text>
                <View style={$.containerFourStyle}>
                  <Text style={$.textSixStyle}>{_('card.totalOrder')}</Text>
                  <Text style={[$.textThreeStyle]}>
                    {formatPrice(totalePrice)}
                    {_('login.currencyType')}
                  </Text>
                </View>
                {balence != 0 ? (
                  <View style={$.containerThreeStyle}>
                    <Text style={$.textFiveStyle}>{_('card.balance')}</Text>
                    <Text style={$.textTwoStyle}>
                    {(balence >0 ? "-" : "+") + formatPrice(Math.abs(balence))}
                      {_('login.currencyType')}
                    </Text>
                  </View>
                ) : null}
                {checkout !== totalePrice ? (
                  <View style={$.containerSevenStyle}>
                    <Text style={$.textSevenStyle}>{_('card.totalPrice')}</Text>
                    <Text style={$.textFourStyle}>
                      {checkout < 0 ? 0 : formatPrice(checkout)}
                      {_('login.currencyType')}
                    </Text>
                  </View>
                ) : null}
                <GenericButton
                  enabled={enabled}
                  text={_('card.goToOrder')}
                  containerStyle={$.buttonOneStyle}
                  onPress={() => {
                    this.validateCart();
                  }}
                  minBalance={minimumBalance}
                  loading={loading}
                />
              </View>
            </View>
            {isModalVisible ? (
              <MyCartModal
                isVisible={true}
                item={itemToRemove}
                loading={buttonLoading}
                enabled={buttonEnabled}
                onClosePress={() => this.closeModale()}
                onConfirmPress={this.onConfirmPress}
              />
            ) : null}
            {openEditQuantityModal ? (
              <EditQuantityModal
                isVisible={true}
                onClosePress={this.onCloseEditQuantityModelPress}
                item={itemToEdit}
                minQtItems={minQtItems}
                minQtGrams={minQtGrams}
                onConfirmPress={this.onConfirmEditQuantityPress}
              />
            ) : null}
            {editQuantityLoading ? (
              <View style={$.overlayContainerOneStyle}>
                <View style={$.overlayContainerTwoStyle} />
                <ActivityIndicator color={colors.ORANGE} size="large" />
              </View>
            ) : null}
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const $ = StyleSheet.create({
  containerOneStyle: {flex: 1},
  containerFiveStyle: {margin: 12, paddingBottom: 16},
  containerSixStyle: {
    backgroundColor: 'white',
    elevation: 8,
  },
  containerTowStyle: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
  },
  containerFourStyle: {width: '100%', flexDirection: 'row', marginBottom: 8},
  containerSevenStyle: {width: '100%', flexDirection: 'row'},
  containerThreeStyle: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 8,
  },
  errorContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  imageOneStyle: {position: 'absolute', width: '100%', top: 0},
  imageTwoStyle: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  emptyStateTextStyle: {
    color: colors.DELIVERY_TIME_COLOR,
    paddingHorizontal: 24,
    textAlign: 'center',
  },
  textOneStyle: {
    color: colors.DELIVERY_TIME_COLOR,
    textAlign: 'center',
    marginBottom: 12,
  },
  textSixStyle: {
    color: colors.DELIVERY_TIME_COLOR,
    fontSize: 16,
  },
  textFiveStyle: {color: colors.DELIVERY_TIME_COLOR, fontSize: 16},
  textTwoStyle: {
    marginLeft: 'auto',
    color: colors.DELIVERY_TIME_COLOR,
    fontSize: 16,
  },
  textThreeStyle: {
    marginLeft: 'auto',
    color: colors.DELIVERY_TIME_COLOR,
    fontSize: 16,
  },
  textFourStyle: {
    marginLeft: 'auto',
    color: colors.TOTAL_PRICE_TEXT_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
  },
  textSevenStyle: {color: colors.TOTAL_PRICE_TEXT_COLOR, fontSize: 18},
  buttonOneStyle: {marginBottom: 14, marginTop: 16},
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
});

export default PayAndGoScreen;
