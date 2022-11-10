import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Text,
  SafeAreaView,
  ActivityIndicator,
  View,
  ScrollView,
  FlatList,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import RatingBar from 'Wook_Market/src/components/RatingBar';
import ClickableRatingBar from 'Wook_Market/src/components/ClickableRatingBar';
import GenericButton from 'Wook_Market/src/components/GenericButton';
import CircularButton from 'Wook_Market/src/components/CircularButton';
import QuantitySection from 'Wook_Market/src/components/QuantitySection';
import GenericError from 'Wook_Market/src/components/GenericError';
import ScreenState from 'Wook_Market/src/lib/ScreenState';
import QuantityModal from 'Wook_Market/src/components/QuantityModal';
import {ButtonState} from 'Wook_Market/src/components/FastAddButton';
import {getProduct, rateProduct} from 'Wook_Market/src/lib/lists';
import {
  handleError,
  calculateDiscountRatio,
  formatPrice,
  calculatePrice,
  formatQuantity,
  formatUnit,
  getMinQuantity,
  getIncrementValue,
  increment,
  decrement,
  formatAddToCartText,
} from 'Wook_Market/src/lib/util';
import {_} from 'Wook_Market/src/lang/i18n';
import {getToken} from 'Wook_Market/src/lib/authentication';
import {
  addToCart,
  validateCart,
  stateFromAddedToCart,
} from 'Wook_Market/src/lib/cart';
import CustomToast from 'Wook_Market/src/lib/CustomToast';
import BackButton from 'Wook_Market/src/components/BackButton';
import CartCount from 'Wook_Market/src/components/CartCount';
import {Alert} from 'react-native';
import {AppContext} from 'Wook_Market/src/lib/AppContext';
import DiscountItemWide from 'Wook_Market/src/components/DiscountItemWide';

REVIEW_ICON = require('Wook_Market/src/assets/icons/review_image.png');
PLUS_ICON = require('Wook_Market/src/assets/icons/plus_icon.png');
MINUS_ICON = require('Wook_Market/src/assets/icons/minus_quantity_product_detail_icon.png');
CLOSE_ICON = require('Wook_Market/src/assets/icons/close_popup_icon.png');
DANGER_ICON = require('Wook_Market/src/assets/icons/danger_icon_info.png');

class ProductDetailScreen extends React.Component {
  static contextType = AppContext;
  state = {
    data: {},
    isRatingModalVisible: false,
    isQuantityModalVisible: false,
    isAdding: false,
    temporaryRating: 0,
    screenState: ScreenState.LOADING,
    errorMessage: '',
    quantity: null,
    minQuantityItems: null,
    minQuantityGrams: null,
    minBalance: null,
    products: [],
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

  openRatingModal = () => {
    this.setState({isRatingModalVisible: true});
  };

  rate = async () => {
    const onSuccess = (data) => {
      this.setState({
        data: data,
        temporaryRating: data.user_rating,
        isRating: false,
        isRatingModalVisible: false,
      });
    };

    const onError = (error) => {
      this.setState({
        isRating: false,
        isRatingModalVisible: false,
      });

      Toast.show({
        type: 'error',
        visibilityTime: 2000,
        text1: handleError(error),
      });
    };

    const onLoad = () => {
      this.setState({
        isRating: true,
      });
    };

    await rateProduct(
      onSuccess,
      onError,
      onLoad,
      this.state.data.id,
      this.state.temporaryRating,
      true,
    );
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
      this.state.data.quantity,
    );
    this.setState({
      quantity: result,
    });
  };

  closeRatingModal = () => {
    this.setState({
      isRatingModalVisible: false,
      temporaryRating: this.state.data.user_rating,
    });
  };

  navigateBackToRefresh = () => {
    if (this.previousRoute === 'Products') {
      this.context.activateShouldRefreshProductsScreen();
    } else if (this.previousRoute === 'Discounts') {
      this.context.activateShouldRefreshDiscountsScreen();
    } else if (this.previousRoute === 'SearchResult') {
      this.context.activateShouldRefreshSearchResultScreen();
    }
  };

  formatPaymentConfiramtionData = (response) => {
    return {
      user: response.user,
      credit: response.credit,
      products: [
        {
          id: this.state.data.id,
          name: this.state.data.name,
          price:
            this.state.data.promotion !== 0
              ? this.state.data.new_price
              : this.state.data.price,
          image: this.state.data.image,
          quantity: this.state.quantity,
          unit: this.state.data.unit,
        },
      ],
    };
  };

  hasRatedBefore = () => {
    return this.state.data.user_rating > 0;
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
      console.log("add_to cart", item)
      Analytics.event('ajout_au_panier_depuis_details_produit', {product_name: item.name});

      this.context.updateProductsCount(data);
      item = {...item, added_to_cart: true};
      const addedQuantity = this.state.quantity;
      this.setState(
        {
          isAdding: false,
          data: item,
          quantityInCart: addedQuantity,
        },
        () => {
          Toast.show({
            visibilityTime: 0,
            text1: formatAddToCartText(
              this.state.data.unit,
              this.state.quantity,
            ),
            onHide: this.navigateBackToRefresh,
          });
        },
      );
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

  getProductDetails = async () => {
    onSuccess = (data, products) => {
      this.setState({
        screenState: ScreenState.SUCCESS,
        data: data.item,
        products: products,
        minQuantityItems: data.minQuantityItems,
        minQuantityGrams: data.minQuantityGrams,
        minBalance: data.minBalance,
        loyaltyBonusCap: data.loyaltyBonusCap,
        quantity: getMinQuantity(
          data.item.unit,
          data.minQuantityItems,
          data.minQuantityGrams,
        ),
        quantityInCart: data.item.qt_in_cart,
        temporaryRating: data.item.user_rating,
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

    await getProduct(onSuccess, onError, onLoad, this.item.id, this.category);
  };

  refreshScreen = () => {
    if (this.context.getShouldRefreshProductDetailScreen()) {
      this.getProductDetails();
      this.context.validateProductDetailScreenRefresh();
    }
  };

  componentDidMount() {
    this.item = this.props.route.params.item;
    this.previousRoute = this.props.route.params.previousRoute;
    this.category = this.props.route.params.item.category;
    this.getProductDetails();

    this.unsubscribe = this.props.navigation.addListener(
      'focus',
      this.refreshScreen,
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  renderHorizontalItem = ({item}) => {
    if (item.id === this.props.route.params.item.id) return null;
    return (
      <DiscountItemWide
        style={{marginRight: 20}}
        title={item.name}
        image={item.image}
        oldPrice={item.price}
        price={item.new_price}
        displayDiscount={false}
        state={stateFromAddedToCart(item.added_to_cart)}
        onAdd={() => this.handleAddToCartFromListPress(item)}
        onPress={() => this.onPressItem(item)}
      />
    );
  };

  getFooterComponent = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={this.handleViewMorePress}
        style={styles.listFooterContainerStyle}>
        <Text style={styles.listFooterTextStyle}>{_('main.viewMore')}</Text>
      </TouchableOpacity>
    );
  };

  handleViewMorePress = async () => {
    if (this.previousRoute === 'Products') {
      this.props.navigation.navigate('Products', {
        category: this.item.category,
      });
    } else if (this.previousRoute === 'Discounts') {
      await this.props.navigation.pop();
      await this.props.navigation.navigate('Tab', {
        screen: 'ProductsTab',
        params: {
          screen: 'Products',
          params: {category: this.item.category},
        },
      });
    } else {
      this.props.navigation.replace('Products', {category: this.item.category});
    }
  };

  onPressItem(item) {
    Analytics.event('clic_produit_similaire', {product_name: item.name});
    this.props.navigation.replace('ProductDetail', {
      item: item,
      previousRoute: this.previousRoute,
    });
  }

  handleAddToCartFromListPress = async (item) => {
    const token = await getToken();

    if (token === null) {
      this.props.navigation.navigate('LoginFromMain');
      return;
    }

    const products = this.state.products;

    const itemIndex = products.indexOf(item);

    onSuccess = async (data) => {
      this.context.updateProductsCount(data);

      products[itemIndex] = {...item, added_to_cart: true};

      this.setState(
        (prevState) => ({
          ...prevState,
          products: products,
          isAdding: false,
        }),
        () => {
          Toast.show({
            visibilityTime: 0,
            text1: formatAddToCartText(
              this.state.data.unit,
              this.state.quantity,
            ),
            onHide: this.navigateBackToRefresh,
          });
        },
      );
    };

    onError = (error) => {
      products[itemIndex] = {...item, added_to_cart: false};

      this.setState(
        (prevState) => ({
          ...prevState,
          products: products,
          isAdding: false,
        }),
        () => {
          Toast.show({
            type: 'error',
            visibilityTime: 2000,
            text1: handleError(error),
          });
        },
      );
    };

    onLoad = () => {
      this.setState((prevState) => ({
        ...prevState,
        products: products,
        isAdding: true,
      }));
    };

    await addToCart(
      onSuccess,
      onError,
      onLoad,
      item.id,
      getMinQuantity(
        item.unit,
        this.state.minQuantityItems,
        this.state.minQuantityGrams,
      ),
      undefined,
      undefined,
      false,
    );
  };

  render() {
    return (
      <SafeAreaView style={{height: '100%', justifyContent: 'center'}}>
        {this.state.screenState === ScreenState.SUCCESS ? (
          <View style={{flex: 1}}>
            <ScrollView bounces={false} contentContainerStyle={{flexGrow: 1}}>
              <View
                style={{
                  backgroundColor: colors.FADING_GRAY,
                }}>
                <View style={styles.imageContainerStyle}>
                  <ImageBackground
                    source={{uri: this.state.data.image}}
                    style={styles.imageStyle}
                    imageStyle={{
                      borderRadius: 7,
                      resizeMode: 'contain',
                    }}>
                    {this.state.data.promotion != 0 ? (
                      <View style={styles.circularContainerStyle}>
                        <Text
                          style={
                            styles.discountRatioStyle
                          }>{`-${calculateDiscountRatio(
                          this.state.data.price,
                          this.state.data.new_price,
                        )}%`}</Text>
                      </View>
                    ) : null}
                  </ImageBackground>
                </View>
              </View>

              <View
                backgroundColor="white"
                shadowOffset={{width: 0, height: 0}}
                shadowColor="black"
                shadowOpacity={0.2}
                style={{
                  flex: 1,
                  backgroundColor: 'white',
                  elevation: 4,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    marginHorizontal: 27,
                    marginTop: 25,
                  }}>
                  <Text style={styles.titleStyle}>{this.state.data.name}</Text>

                  {this.state.quantityInCart ? (
                    <CartCount
                      quantity={formatQuantity(
                        this.state.data.unit,
                        this.state.quantityInCart,
                      )}
                      unit={formatUnit(
                        this.state.data.unit,
                        this.state.quantityInCart,
                      )}
                    />
                  ) : null}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 7,
                    alignItems: 'center',
                  }}>
                  <RatingBar
                    size={14}
                    rating={this.state.data.average_rating}
                    style={{marginLeft: 27, marginTop: 4}}
                  />
                  <Text style={styles.priceTextStyle}>
                    {_('main.unitPrice')}{' '}
                    {this.state.data.promotion != 0
                      ? formatPrice(this.state.data.new_price)
                      : formatPrice(this.state.data.price)}
                    €
                  </Text>
                </View>

                <Text
                  style={[
                    styles.quantityPriceStyle,
                    !this.state.data.description ||
                    this.state.data.description.length === 0
                      ? {marginBottom: 30}
                      : null,
                  ]}>
                  {_('main.quantity')}: {this.state.data.quantity}{' '}
                  {formatUnit(this.state.data.unit, this.state.data.quantity)}
                </Text>

                {this.state.data.description &&
                this.state.data.description.length > 0 ? (
                  <Text style={styles.descriptionTextStyle}>
                    {this.state.data.description}
                  </Text>
                ) : null}

                {this.state.data.can_rate ? (
                  <TouchableOpacity
                    style={styles.cardClickContainerStyle}
                    activeOpacity={0.8}
                    backgroundColor="white"
                    onPress={this.openRatingModal}>
                    <View style={styles.cardContainerStyle}>
                      <Image
                        source={REVIEW_ICON}
                        style={styles.reviewIconStyle}
                      />
                      <View style={styles.cardSubContainerStyle}>
                        <Text style={styles.cardTextStyle}>
                          {this.hasRatedBefore()
                            ? _('main.wouldYouLikeToRateAgain')
                            : _('main.wouldYouLikeToRate')}
                        </Text>
                        <RatingBar
                          size={14}
                          rating={this.state.data.user_rating}
                          style={{marginTop: 2}}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : null}
                <View>
                  <View style={styles.dividerStyle} />
                  <Text style={styles.similarProductsTexttStyle}>
                    {_('main.similareProducts')}
                  </Text>
                  <FlatList
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    contentContainerStyle={styles.similarproductsListStyle}
                    ListFooterComponent={this.getFooterComponent}
                    data={this.state.products}
                    renderItem={this.renderHorizontalItem}
                    extraData={this.state.products}
                    keyExtractor={(item) => item.id.toString()}
                  />
                </View>
              </View>

              <Modal isVisible={this.state.isRatingModalVisible}>
                <View style={styles.modalContainerStyle}>
                  <CircularButton
                    style={{
                      backgroundColor: colors.MODAL_CLOCE_BUTTON_COLOR,
                      width: 40,
                      height: 40,
                      alignSelf: 'flex-end',
                    }}
                    image={CLOSE_ICON}
                    onPress={this.closeRatingModal}
                  />
                  <Text style={styles.modalTitleStyle}>
                    {_('main.rateProduct')}
                  </Text>
                  <Image
                    style={styles.modalImageStyle}
                    source={{uri: this.state.data.image}}
                  />
                  <ClickableRatingBar
                    size={38}
                    rating={this.state.data.user_rating}
                    spacing={5}
                    style={{alignSelf: 'center', marginTop: 30}}
                    onClick={(rating) =>
                      this.setState({temporaryRating: rating})
                    }
                  />
                  <GenericButton
                    text="Ajouter la note"
                    containerStyle={styles.modalButtonStyle}
                    onPress={this.rate}
                    loading={this.state.isRating}
                    enabled={!this.state.isRating}
                  />
                </View>
              </Modal>
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
                  maxQuantity={this.state.data.quantity}
                  minQuantityGrams={this.state.minQuantityGrams}
                  minQuantityItems={this.state.minQuantityItems}
                />
                <View style={styles.priceContainer}>
                  {this.state.data.promotion != 0 ? (
                    <Text style={styles.quantityTextStyle}>
                      {formatPrice(
                        calculatePrice(
                          this.state.data.price,
                          this.state.quantity,
                        ),
                      )}
                      €
                    </Text>
                  ) : null}
                  <Text style={styles.priceTextStyleBig}>
                    {this.state.data.promotion != 0
                      ? formatPrice(
                          calculatePrice(
                            this.state.data.new_price,
                            this.state.quantity,
                          ),
                        )
                      : formatPrice(
                          calculatePrice(
                            this.state.data.price,
                            this.state.quantity,
                          ),
                        )}
                    €
                  </Text>
                </View>
              </View>

              <View style={styles.buttonsContainerStyle}>
                <GenericButton
                  style={styles.genericButtonStyle}
                  containerStyle={{
                    flex: 1,
                    marginRight: 5,
                  }}
                  textStyle={{color: 'white', fontSize: 13}}
                  text={_('main.addToPanel')}
                  onPress={this.handleAddToCartPress}
                />
              </View>
            </View>
          </View>
        ) : null}

        {this.state.screenState === ScreenState.ERROR ? (
          <GenericError
            errorText={this.state.errorMessage}
            onRetry={this.getProductDetails}
          />
        ) : null}

        {this.state.screenState === ScreenState.LOADING ? (
          <ActivityIndicator size="large" color={colors.ORANGE} />
        ) : null}

        {this.state.isQuantityModalVisible ? (
          <QuantityModal
            isVisible={true}
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
  listFooterTextStyle: {
    fontSize: 16,
    color: colors.ORANGE,
    fontWeight: '600',
    marginHorizontal: 30,
  },
  listFooterContainerStyle: {
    shadowOffset: {width: 1, height: 1},
    shadowColor: 'black',
    shadowOpacity: 0.2,
    flex: 1,
    paddingBottom: 'auto',
    elevation: 4,
    borderRadius: 15,
    backgroundColor: 'white',
    marginTop: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dividerStyle: {
    height: 1,
    alignSelf: 'stretch',
    marginLeft: 100,
    marginRight: 100,
    backgroundColor: colors.DIVIDER_COLOR,
  },
  similarProductsTexttStyle: {
    color: colors.CART_TEXT_COLOR,
    fontSize: 16,
    marginLeft: 27,
    marginBottom: 16,
    marginTop: 16,
  },
  similarproductsListStyle: {
    paddingLeft: 24,
    paddingRight: 18,
    paddingBottom: 16,
  },
  modalImageStyle: {
    backgroundColor: colors.MODAL_CLOCE_BUTTON_COLOR,
    alignSelf: 'center',
    marginTop: 30,
    width: 100,
    height: 100,
    borderRadius: 50,
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
    elevation: 8,
    shadowOffset: {width: 1, height: 1},
    shadowColor: 'black',
    shadowOpacity: 0.2,
    backgroundColor: 'white',
  },
  modalTitleStyle: {
    textAlign: 'center',
    fontSize: 17,
    color: colors.DELIVERY_TIME_COLOR,
    marginTop: 23,
  },
  modalContainerStyle: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 26,
    paddingVertical: 35,
    alignItems: 'stretch',
    marginHorizontal: 20,
  },
  quantityContainerStyle: {
    marginLeft: 27,
    marginRight: 10,
  },
  buySectionStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
  },
  cardContainerStyle: {
    backgroundColor: 'white',
    height: 77,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardClickContainerStyle: {
    shadowOffset: {width: 1, height: 1},
    shadowColor: 'black',
    shadowOpacity: 0.2,
    backgroundColor: 'white',
    marginBottom: 20,
    elevation: 4,
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 27,
  },
  cardTextStyle: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.DELIVERY_TIME_COLOR,
  },
  cardSubContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 11,
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
  imageStyle: {
    justifyContent: 'space-between',
    width: '100%',
    aspectRatio: 1.8,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    resizeMode: 'contain',
  },
  circularContainerStyle: {
    justifyContent: 'center',
    alignContent: 'center',
    width: 73,
    height: 73,
    borderRadius: 73,
    backgroundColor: 'white',
    alignSelf: 'flex-end',
    marginRight: 15,
    marginTop: 17,
  },
  discountRatioStyle: {
    fontSize: 24,
    color: colors.ORANGE,
    fontWeight: '600',
    textAlign: 'center',
  },
  titleStyle: {
    marginRight: 10,
    flex: 0.98,
    fontSize: 20,
    fontWeight: '400',
    color: colors.CART_TEXT_COLOR,
  },
  priceTextStyle: {
    marginRight: 27,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '400',
    color: colors.DELIVERY_TIME_COLOR,
  },
  quantityPriceStyle: {
    marginLeft: 27,
    marginRight: 27,
    marginTop: 10,
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '400',
    color: colors.DELIVERY_TIME_COLOR,
  },
  descriptionTextStyle: {
    lineHeight: 20,
    marginHorizontal: 30,
    marginBottom: 30,
    fontSize: 14,
    fontWeight: '400',
    color: colors.DELIVERY_TIME_COLOR,
  },
  reviewIconStyle: {
    marginLeft: 7,
    width: 67,
    height: 57,
    marginLeft: 7,
  },
  quantityTextStyle: {
    color: colors.ORANGE,
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'line-through',
    fontWeight: '500',
    marginRight: 6,
  },
  priceTextStyleBig: {
    color: colors.MEDIUM_GREEN,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    marginRight: 6,
  },
  buttonsContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 44,
    marginHorizontal: 27,
    marginTop: 15,
    marginBottom: 15,
  },
  modalButtonStyle: {
    marginTop: 45,
    marginBottom: 10,
    borderRadius: 5,
  },
  genericButtonStyle: {
    alignSelf: 'stretch',
    width: '100%',
    paddingVertical: 13,
    borderRadius: 5,
    height: 45,
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

export default ProductDetailScreen;
