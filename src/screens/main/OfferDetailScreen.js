import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  Text,
  SafeAreaView,
  ActivityIndicator,
  View,
  Image,
} from 'react-native';

import {colors} from 'Wook_Market/src/lib/globalStyles';
import {ScrollView} from 'react-native-gesture-handler';
import GenericButton from 'Wook_Market/src/components/GenericButton';
import GenericError from 'Wook_Market/src/components/GenericError';
import TableCase from 'Wook_Market/src/components/TableCase';
import ScreenState from 'Wook_Market/src/lib/ScreenState';
import Toast from 'react-native-toast-message';
import CustomToast from 'Wook_Market/src/lib/CustomToast';
import OfferStatisticsItem from 'Wook_Market/src/components/OfferStatisticsItem';
import Divider from 'Wook_Market/src/components/Divider';
import QuantityModal from 'Wook_Market/src/components/QuantityModal';
import QuantitySection from 'Wook_Market/src/components/QuantitySection';
import {getGroupedProduct} from 'Wook_Market/src/lib/lists';
import {
  handleError,
  formatPrice,
  calculatePrice,
  getMinQuantity,
  getIncrementValue,
  increment,
  decrement,
  formatAddToCartText,
  getQuantityByIndex,
  getPriceByIndex,
  formatExpirationText,
  calculateGroupedProductPrice,
} from 'Wook_Market/src/lib/util';
import {_} from 'Wook_Market/src/lang/i18n';
import {getToken} from 'Wook_Market/src/lib/authentication';
import {addToCart} from 'Wook_Market/src/lib/cart';
import {AppContext} from 'Wook_Market/src/lib/AppContext';

PLUS_ICON = require('Wook_Market/src/assets/icons/plus_icon.png');
MINUS_ICON = require('Wook_Market/src/assets/icons/minus_quantity_product_detail_icon.png');

class OfferDetailScreen extends React.Component {
  static contextType = AppContext;

  state = {
    data: {},
    isAdding: false,
    screenState: ScreenState.LOADING,
    errorMessage: '',
    quantity: null,
    unitPrice: null,
    minQuantityItems: null,
    minQuantityGrams: null,
    isQuantityModalVisible: false,
  };

  openQuantityModal = () => {
    this.setState({isQuantityModalVisible: true});
  };

  onCloseQuantityModelPress = () => {
    this.setState({isQuantityModalVisible: false});
  };

  onConfirmQuantityModalPress = (isQuantityEdited, quantity, _) => {
    if (isQuantityEdited)
      this.setState({
        quantity: quantity,
        isQuantityModalVisible: false,
      });
    else
      this.setState({
        isQuantityModalVisible: false,
      });
  };

  increment = () => {
    const currentQuantity = this.state.quantity;
    const result = increment(
      currentQuantity,
      getIncrementValue(this.state.data.unit),
      this.state.data.quantity,
    );
    this.setState({
      quantity: result,
    });
  };

  decrement = () => {
    const currentQuantity = this.state.quantity;
    const result = decrement(
      currentQuantity,
      getIncrementValue(this.state.data.unit),
    );
    this.setState({
      quantity: result,
    });
  };

  navigateBackToRefresh = () => {
    this.context.activateShouldRefreshOffersScreen();
  };

  handleAddToCartPress = async () => {
    const token = await getToken();

    if (token === null) {
      this.props.navigation.navigate('LoginFromMain');
      return;
    }
    if (this.state.isAdding) return;

    let item = this.state.data;

    onSuccess = async (data) => {
      this.context.updateProductsCount(data);
      item = {...item, added_to_cart: true};
      const addedQuantity = this.state.quantity;
      this.setState({
        isAdding: false,
        data: item,
        quantityInCart: addedQuantity,
      });

      Toast.show({
        visibilityTime: 0,
        text1: formatAddToCartText(this.state.data.unit, this.state.quantity),
        onHide: this.navigateBackToRefresh,
      });
    };

    onError = (error) => {
      item = {...item, added_to_cart: false};
      this.setState({
        data: item,
        isAdding: false,
      });

      Toast.show({
        type: 'error',
        visibilityTime: 2000,
        text1: handleError(error),
      });
    };

    onLoad = () => {
      this.setState({
        isAdding: true,
      });
    };

    await addToCart(
      onSuccess,
      onError,
      onLoad,
      item.id,
      this.state.quantity,
      undefined,
      undefined,
      false,
    );
  };

  getGroupedProductDetails = async (item) => {
    onSuccess = (data) => {
      const unitPrice = calculateGroupedProductPrice(
        data.item.price,
        data.item.price_pools,
        data.item.orders_count,
      );

      console.log(data.minQuantityGrams);
      console.log(data.minQuantityItems);

      this.setState({
        screenState: ScreenState.SUCCESS,
        data: data.item,
        unitPrice: unitPrice,
        minQuantityItems: data.minQuantityItems,
        minQuantityGrams: data.minQuantityGrams,
        quantity: getMinQuantity(
          data.item.unit,
          data.minQuantityItems,
          data.minQuantityGrams,
        ),
      });
    };

    onError = (error) => {
      this.setState({
        screenState: ScreenState.ERROR,
        errorMessage: handleError(error),
      });
    };

    onLoad = () => {
      this.setState({
        errorMessage: '',
        screenState: ScreenState.LOADING,
      });
    };

    await getGroupedProduct(onSuccess, onError, onLoad, item.id);
  };

  componentDidMount() {
    this.item = this.props.route.params.item;
    this.getGroupedProductDetails(this.item);
  }

  render() {
    return (
      <SafeAreaView style={{height: '100%', justifyContent: 'center'}}>
        {this.state.screenState === ScreenState.SUCCESS ? (
          <View style={{flex: 1}}>
            <ScrollView
              bounces={false}
              contentContainerStyle={{
                flexGrow: 1,
              }}>
              <View
                style={{
                  backgroundColor: colors.FADING_GRAY,
                }}>
                <View style={styles.imageContainerStyle}>
                  <Image
                    source={{uri: this.state.data.image}}
                    style={styles.imageStyle}
                    imageStyle={{
                      borderRadius: 7,
                    }}
                  />
                </View>
              </View>
              <View
                backgroundColor="white"
                shadowOffset={{width: 0, height: 0}}
                shadowColor="black"
                shadowOpacity={0.2}
                style={styles.whiteViewContainerStyle}>
                <Text style={styles.titleStyle}>{this.state.data.name}</Text>
                <View style={styles.tableContainerStyle}>
                  <TableCase
                    top={_('main.buyers')}
                    bottom={`${this.state.data.customers_count} ${
                      this.state.data.numOfBuyers === 1
                        ? _('main.buyer')
                        : _('main.buyers')
                    }`}
                  />
                  <Divider />
                  <TableCase
                    top={_('main.orders')}
                    bottom={`${this.state.data.orders_count} ${
                      this.state.data.numOfOrders === 1
                        ? _('main.passed')
                        : _('main.passedPlural')
                    }`}
                  />
                  <Divider />
                  <TableCase
                    top={_('main.expiresIn')}
                    bottom={formatExpirationText(
                      this.state.data.start_date,
                      this.state.data.end_date,
                    )}
                  />
                </View>

                <OfferStatisticsItem
                  firstQuantity={getQuantityByIndex(
                    0,
                    this.state.data.price_pools,
                  )}
                  secondQuantity={getQuantityByIndex(
                    1,
                    this.state.data.price_pools,
                  )}
                  lastQuantity={getQuantityByIndex(
                    2,
                    this.state.data.price_pools,
                  )}
                  firstDiscount={getPriceByIndex(
                    0,
                    this.state.data.price_pools,
                  )}
                  secondDiscount={getPriceByIndex(
                    1,
                    this.state.data.price_pools,
                  )}
                  lastDiscount={getPriceByIndex(2, this.state.data.price_pools)}
                  numOfOrders={this.state.data.orders_count}
                  initialPrice={this.state.data.price}
                  circleSize={42}
                  fontSize={13}
                  rectangleSize={14}
                  style={styles.offerStatisticsStyle}
                />

                <Text style={styles.descriptionTextStyle}>
                  {this.state.data.description}
                </Text>
              </View>
            </ScrollView>

            <View style={styles.fixedAreaStyle}>
              <View style={styles.buySectionStyle}>
                <QuantitySection
                  style={styles.quantityContainerStyle}
                  onQuantityPress={this.openQuantityModal}
                  onIncrementPress={this.increment}
                  onDecrementPress={this.decrement}
                  unit={this.state.data.unit}
                  quantity={this.state.quantity}
                  minQuantityGrams={this.state.minQuantityGrams}
                  minQuantityItems={this.state.minQuantityItems}
                />

                <View style={styles.priceContainer}>
                  <Text style={styles.priceTextStyleBig}>
                    {formatPrice(
                      calculatePrice(this.state.unitPrice, this.state.quantity),
                    )}
                    €
                  </Text>
                </View>
              </View>
              <View style={styles.buttonsContainerStyle}>
                <GenericButton
                  text={_('main.addToPanel')}
                  constainerStyle={{flex: 1}}
                  style={styles.genericButtonStyle}
                  onPress={this.handleAddToCartPress}
                />
              </View>
            </View>
          </View>
        ) : null}

        {this.state.screenState === ScreenState.ERROR ? (
          <GenericError
            errorText={this.state.errorMessage}
            onRetry={this.getGroupedProductDetails}
          />
        ) : null}

        {this.state.screenState === ScreenState.LOADING ? (
          <ActivityIndicator size="large" color={colors.ORANGE} />
        ) : null}

        {this.state.isQuantityModalVisible ? (
          <QuantityModal
            isVisible={true}
            isGrouped={true}
            onClosePress={this.onCloseQuantityModelPress}
            item={this.state.data}
            currentQuantity={this.state.quantity}
            minQtItems={this.state.minQuantityItems}
            minQtGrams={this.state.minQuantityGrams}
            onConfirmPress={this.onConfirmQuantityModalPress}
          />
        ) : null}

        {this.state.isAdding ? (
          <View style={styles.overlayContainerOneStyle}>
            <View style={styles.overlayContainerTwoStyle} />
            <ActivityIndicator color={colors.ORANGE} size="large" />
          </View>
        ) : null}

        <CustomToast />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  priceTextStyleBig: {
    color: colors.MEDIUM_GREEN,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    marginRight: 6,
  },
  priceContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'flex-end',
    marginRight: 20,
  },
  fixedAreaStyle: {
    elevation: 4,
    shadowOffset: {width: 1, height: 1},
    shadowColor: 'black',
    shadowOpacity: 0.2,
    backgroundColor: 'white',
  },
  imageStyle: {
    aspectRatio: 1.8,
    justifyContent: 'space-between',
    width: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    resizeMode: 'contain',
  },
  imageContainerStyle: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 30,
    marginTop: 20,
    marginBottom: 26,
    borderRadius: 7,
    backgroundColor: 'white',
  },
  titleStyle: {
    marginRight: 10,
    marginLeft: 27,
    marginTop: 20,
    fontSize: 20,
    fontWeight: '400',
    color: colors.CART_TEXT_COLOR,
  },
  tableContainerStyle: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.BORDER_GRAY,
    marginHorizontal: 26,
    marginTop: 17,
  },
  descriptionTextStyle: {
    alignSelf: 'center',
    lineHeight: 20,
    marginHorizontal: 30,
    marginTop: 17,
    marginBottom: 20,
    fontSize: 14,
    fontWeight: '400',
    color: colors.DELIVERY_TIME_COLOR,
  },
  whiteViewContainerStyle: {flex: 1, backgroundColor: 'white', elevation: 4},
  offerStatisticsStyle: {
    alignSelf: 'center',
    marginTop: 10,
    paddingTop: 8,
    marginHorizontal: 26,
    height: 80,
  },
  buySectionStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  quantityContainerStyle: {
    marginHorizontal: 27,
    marginRight: 10,
  },
  genericButtonStyle: {
    alignSelf: 'stretch',
    width: '100%',
    paddingVertical: 13,
    borderRadius: 5,
    height: 45,
  },
  buttonsContainerStyle: {
    marginHorizontal: 27,
    marginTop: 15,
    marginBottom: 20,
  },
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

export default OfferDetailScreen;
