import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import OrderDetailListItem from 'Wook_Market/src/components/OrderDetailListItem';
import AddProductsToCartErrorModal from 'Wook_Market/src/components/AddProductsToCartErrorModal';
import GenericButton from 'Wook_Market/src/components/GenericButton';
import BackButton from 'Wook_Market/src/components/BackButton';
import {_} from 'Wook_Market/src/lang/i18n';
import {getOrderDetail} from 'Wook_Market/src/lib/order';
import GenericError from 'Wook_Market/src/components/GenericError';
import {multipleAddToCart} from 'Wook_Market/src/lib/cart';
import {
  getProductsIdAndQuantity,
  getProductsNameAndImage,
  getAvailableProducts,
  formatPrice,
} from 'Wook_Market/src/lib/util';

const BACK_WHTE_ICON = require('Wook_Market/src/assets/icons/back_white_icon.png');

class OrderDetailScreen extends Component {
  state = {
    data: [],
    currentState: '',
    userAddress: '',
    status: '',

    cardName: '',
    cardImage: '',
    cardDigits: '',
    showModal: false,
    modalData: [],
    showErrorMessage: false,
    availableProducts: [],
    addButtonLoading: false,
    addButtonEnabled: true,
    modalButtonLoading: false,
    modalButtonEnabled: true,
  };

  getTopContent(loading, enabled) {
    return (
      <View style={$.containerFiveStyle}>
        <Text style={$.textOneStyle}>{_('main.products')}</Text>
        <GenericButton
          text={_('main.addAgain')}
          textStyle={{fontSize: 13}}
          containerStyle={{marginLeft: 'auto', width: 150}}
          onPress={() => this.multipleAddToCart()}
          loading={loading}
          style={{paddingVertical: 12}}
          enabled={enabled}
          spinnerSize={20}
          loadingStyle={{marginLeft: 'auto', width: 150}}
        />
      </View>
    );
  }

  onAddProductsLoading = () => {
    this.setState({
      ...this.state,
      addButtonEnabled: false,
      addButtonLoading: true,
    });
  };

  onAddProductsSuccess = () => {
    Analytics.event('mes_commandes_ajouter_a_nouveau_ouverture_ecran');

    this.setState({
      ...this.state,
      addButtonEnabled: true,
      addButtonLoading: false,
    });
    this.props.navigation.pop(2);
    this.props.navigation.navigate('Main', {
      screen: 'Tab',
      params: {screen: 'PanelTab'},
    });
  };

  multipleAddToCart = () => {
    multipleAddToCart(
      () => {
        this.onAddProductsSuccess();
      },
      (products) => {
        this.onAddProductsError(products['quantity.invalid']);
      },
      () => {
        this.onAddProductsLoading();
      },
      getProductsIdAndQuantity(this.state.data),
    );
  };

  onAddProductsErrorFromModal = (products) => {
    if (!products) {
      this.setState({
        ...this.state,
        modalButtonEnabled: true,
        modalButtonLoading: false,
      });
      return;
    }
    this.setState({
      ...this.state,
      modalData: [...getProductsNameAndImage(products)],
      showErrorMessage: products.length === this.state.data,
      availableProducts: getAvailableProducts(
        getProductsNameAndImage(products),
        this.state.data,
      ),
      modalButtonEnabled: true,
      modalButtonLoading: false,
    });
  };

  onAddProductsLoadingFromModal = () => {
    this.setState({
      ...this.state,
      modalButtonEnabled: false,
      modalButtonLoading: true,
    });
  };

  onAddProductsSuccessFromModal = () => {
    this.setState({
      ...this.state,
      modalButtonEnabled: true,
      modalButtonLoading: false,
      showModal: false,
    });
    this.props.navigation.pop(2);
    this.props.navigation.navigate('Main', {
      screen: 'Tab',
      params: {screen: 'PanelTab'},
    });
  };

  multipleAddToCartFromModale = () => {
    multipleAddToCart(
      () => {
        this.onAddProductsSuccessFromModal();
      },
      (products) => {
        this.onAddProductsErrorFromModal(products['quantity.invalid']);
      },
      () => {
        this.onAddProductsLoadingFromModal();
      },
      this.state.availableProducts,
    );
  };

  onAddProductsError = (products) => {
    if (!products) {
      this.setState({
        ...this.state,
        addButtonEnabled: true,
        addButtonLoading: false,
      });
      return;
    }
    this.setState(
      {
        ...this.state,
        modalData: [...getProductsNameAndImage(products)],
        showErrorMessage: products.length === this.state.data.length,
        availableProducts: getAvailableProducts(
          getProductsNameAndImage(products),
          this.state.data,
        ),
        addButtonEnabled: true,
        addButtonLoading: false,
      },
      () => {
        this.setState({...this.state, showModal: true});
      },
    );
  };

  getBottomContent = (address, cardImage, cardName, cardDigits, totalPrice, status) => {
    return (
      <View>
        <Text style={$.textTwoStyle}>{_('card.totalOrder')}</Text>
        <Text style={$.textFiveStyle}>
          {formatPrice(totalPrice)}
          {_('login.currencyType')}

          <Text style={{color: "red"}} >
            {(status=="pending")? " (Non payé)" : ""}

          </Text>
        </Text>
        <Text style={$.textTwoStyle}>{_('main.orderDate')}</Text>
        <Text style={$.textFiveStyle}>{this.state.orderDate}</Text>
        <Text style={$.textTwoStyle}>{_('card.deleveryAddress')}</Text>
        <Text style={$.textFiveStyle}>{address}</Text>
        {cardName.length > 0 ? (
          <View>
            <Text style={$.textTwoStyle}>{_('main.paymentMethod')}</Text>
            <Text style={$.textThreeStyle}>
              {this.capitalizeFirstLetter(cardName)}
            </Text>
            {cardName == "Carte bancaire" && <View style={$.containerOneStyle}>
              <Image source={{uri: cardImage}} style={$.imageStyle} />
              <Text style={$.textFourStyle}>******</Text>
              <Text style={$.textEightStyle}>{cardDigits}</Text>
            </View>}
          </View>
        ) : null}
      </View>
    );
  };

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  getOrderDetailLoading = () => {
    this.setState({...this.state, currentState: 'loading'});
  };

  getOrderDetailSuccess = (order) => {
    this.setState({
      ...this.state,
      data: order.products,
      currentState: 'success',
      userAddress: order.type!="click_collect"? order.user_address: "Click & collect",
      cardName: this.getCardName(order.user_payment.name)  ?? '',
      cardImage: order.user_payment.image ?? '',
      cardDigits: order.user_payment.last_four_digit ?? '',
      totalPrice: order.total,
      orderDate: this.dateToYMD(order.created_at),
      status: order.status
    });
  };

  getCardName = (type) => {
    if(type=="cash") {
      return "Cash"
    }
    if(type=="cash_pro") {
      return "Cash (paiement fin du mois)";
    }

    if(type=="check_pro") {
      return "Chèque (paiement fin du mois)";
    }

    if(type=="card_pro") {
      return "Carte bancaire";
    }

    if(type=="card") {
      return "Carte bancaire";
    }
  }
  dateToYMD = (seconds) => {
    const date = new Date(seconds * 1000);
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + y;
  };

  getOrderDetailError = () => {
    this.setState({
      ...this.state,
      currentState: 'error',
    });
  };

  getOrderDetail = () => {
    getOrderDetail(
      () => {
        this.getOrderDetailLoading();
      },
      (order) => {
        this.getOrderDetailSuccess(order);
      },
      () => {
        this.getOrderDetailError();
      },
      this.orderId,
    );
  };

  renderItem = ({item}) => {
    return <OrderDetailListItem product={item} />;
  };

  setNavigationOptions() {
    this.props.navigation.setOptions({
      title: `${_('main.order')} ${_('main.hash')}${this.orderId}`,
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

  componentDidMount() {
    this.orderId = this.props.route.params.orderId;
    this.setNavigationOptions();
    this.getOrderDetail();
  }

  openEmail = () => {
    Linking.canOpenURL('mailto:')
      .then((supported) => {
        if (!supported) {
          installmailApp;
          this.createErrorAlert('', _('error.installmailApp'));
        } else {
          return Linking.openURL(
            `mailto:Contact@wookmarket.com?subject=${_('error.reportProblem')}`,
          );
        }
      })
      .catch((err) => {
        this.createErrorAlert('', _('error.randomError'));
      });
  };

  openPhone = () => {
    Linking.canOpenURL('tel:')
      .then((supported) => {
        if (!supported) {
          installmailApp;
          this.createErrorAlert('', _('error.installPhoneApp'));
        } else {
          return Linking.openURL('tel:+00335419801234');
        }
      })
      .catch((err) => {
        this.createErrorAlert('', _('error.randomError'));
      });
  };

  createErrorAlert = (title, massage) =>
    Alert.alert(
      '',
      massage,
      [
        {
          text: _('main.ok'),
          onPress: () => {},
        },
      ],
      {cancelable: false},
    );

  closeModal = () => {
    this.setState({
      ...this.state,
      showModal: false,
      modalData: [],
      availableProducts: [],
      modalButtonEnabled: true,
      modalButtonLoading: false,
    });
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={$.containerThreeStyle}>
          {this.state.currentState === 'success' ? (
            <FlatList
              nestedScrollEnabled={false}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={true}
              ListHeaderComponent={() =>
                this.getTopContent(
                  this.state.addButtonLoading,
                  this.state.addButtonEnabled,
                )
              }
              ListFooterComponent={() =>
                this.getBottomContent(
                  this.state.userAddress,
                  this.state.cardImage,
                  this.state.cardName,
                  this.state.cardDigits,
                  this.state.totalPrice,
                  this.state.status
                )
              }
              contentContainerStyle={$.containerFourStyle}
              data={this.state.data}
              renderItem={this.renderItem}
            />
          ) : this.state.currentState === 'loading' ? (
            <View style={$.errorContainerStyle}>
              <ActivityIndicator color={colors.ORANGE} size="large" />
            </View>
          ) : this.state.currentState === 'error' ? (
            <View style={$.errorContainerStyle}>
              <GenericError
                errorText={_('login.errorMessage')}
                onRetry={() => this.getOrderDetail()}
              />
            </View>
          ) : null}
          <View
            shadowOffset={{width: 1, height: 1}}
            shadowColor="black"
            shadowOpacity={0.2}
            style={$.containerTwoStyle}>
            <Text style={$.textSixStyle}>{_('main.haveAnOrderProblem')}</Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  this.openEmail();
                }}>
                <Text style={$.textSevenStyle}>{_('main.reportProblem')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {this.state.showModal ? (
            <AddProductsToCartErrorModal
              isVisible={true}
              products={this.state.modalData}
              onPress={() => this.closeModal()}
              errorMessage={this.state.showErrorMessage}
              enabled={this.state.modalButtonEnabled}
              loading={this.state.modalButtonLoading}
              onButtonPress={() => {
                this.multipleAddToCartFromModale();
              }}
            />
          ) : null}
        </View>
      </SafeAreaView>
    );
  }
}

const $ = StyleSheet.create({
  containerOneStyle: {
    flexDirection: 'row',
    marginTop: 6,
    marginBottom: 24,
  },
  containerTwoStyle: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
    width: '100%',
    elevation: 8,
  },
  containerThreeStyle: {flex: 1, backgroundColor: 'white'},
  textOneStyle: {
    color: colors.PAYMENT_TEXT_COLOR,
    fontSize: 16,
    marginTop: 12,
    marginBottom: 8,
    fontWeight: '700',
  },
  containerFourStyle: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 6,
  },
  textTwoStyle: {
    color: colors.PAYMENT_TEXT_COLOR,
    fontSize: 16,
    marginTop: 22,
    marginBottom: 12,
    fontWeight: '700',
  },
  textThreeStyle: {
    color: colors.TOTAL_PRICE_TEXT_COLOR,
    marginBottom: 4,
  },
  textFourStyle: {
    paddingTop: 5,
    alignSelf: 'center',
    color: colors.DELIVERY_TIME_COLOR,
  },
  textFiveStyle: {
    color: colors.DELIVERY_TIME_COLOR,
  },
  textSixStyle: {color: colors.REPORT_TEXT_COLOR, marginBottom: 4},
  imageStyle: {width: 55, height: 30},
  textEightStyle: {
    alignSelf: 'center',
    color: colors.DELIVERY_TIME_COLOR,
  },
  textSevenStyle: {color: colors.ORANGE},
  containerFiveStyle: {flexDirection: 'row', marginBottom: 6, marginTop: 8, justifyContent: "space-between"},
  errorContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default OrderDetailScreen;
