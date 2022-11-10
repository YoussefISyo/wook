import React, {Component} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  RefreshControl,
  ColorPropType,
  SafeAreaView,
} from 'react-native';
import OrderListItem from 'Wook_Market/src/components/OrderListItem';
import CustomToast from 'Wook_Market/src/lib/CustomToast';
import Toast from 'react-native-toast-message';
import {getOrdersList} from 'Wook_Market/src/lib/order';
import BackButton from 'Wook_Market/src/components/BackButton';
import GenericError from 'Wook_Market/src/components/GenericError';
import {_} from 'Wook_Market/src/lang/i18n';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {AppContext} from 'Wook_Market/src/lib/AppContext';

const BACK_WHTE_ICON = require('Wook_Market/src/assets/icons/back_white_icon.png');
const HEADER = require('Wook_Market/src/assets/images/top_header_image.png');
const FOOTER = require('Wook_Market/src/assets/images/bottom_image.png');
const RETRY_ICON = require('Wook_Market/src/assets/icons/icn_loader_products.png');

class OrdersScreen extends Component {
  static contextType = AppContext;
  state = {
    data: [],
    isAddCategoryModalVisible: false,
    isUpdateCategoryModalVisible: false,
    isDeleteCategoryModalVisible: false,
    currentState: '',
    refrechLoading: false,
    refrechError: false,
    lastPage: 0,
    end: false,
    refreshing: false,
  };

  componentDidMount() {
    if (this.props.route.params) {
      this.context.activateShouldRefresh();
      if (this.props.route.params.orderType !== 'pay_go')
        this.context.resetProductsCount();
    }
    this.currentPage = 1;
    this.getOrdersList();
    //this.setNavigationOptions();
  }

  onGetOrdersListSuccess = (response) => {
    this.setState({
      ...this.state,
      data: response.data,
      currentState: 'success',
      lastPage: response.last_page,
      refrechError: false,
    });
    if (this.currentPage >= this.state.lastPage) {
      this.setState({...this.state, end: true});
    }
  };
  onGetOrdersListError = () => {
    this.setState({...this.state, currentState: 'error'});
  };

  onGetOrdersListLoading = () => {
    this.setState({...this.state, currentState: 'loading'});
  };

  getOrdersList() {
    getOrdersList(
      () => this.onGetOrdersListLoading(),
      (response) => this.onGetOrdersListSuccess(response),
      () => this.onGetOrdersListError(),
      undefined,
    );
  }

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

  renderItem = ({item}) => {
    return (
      <OrderListItem
        order={item}
        onPress={() => {
          //send order id with navigation
          Analytics.event('mes_commandes_details_ouverture_ecran');

          this.props.navigation.navigate('OrderDetail', {orderId: item.id});
        }}
      />
    );
  };

  onRefrechFromBottomLoading = () => {
    this.setState({...this.state, refrechLoading: true, refrechError: false});
  };

  onRefrechFromBottomSeccess = (response) => {
    this.setState((prevState) => ({
      ...prevState,
      data: [...this.state.data, ...response.data],
      refrechLoading: false,
    }));
    if (this.currentPage >= this.state.lastPage) {
      this.setState((prevState) => ({...prevState, end: true}));
    }
  };

  onRefrechFromBottomError = () => {
    this.currentPage--;
    this.setState({...this.state, refrechLoading: false, refrechError: true});
    Toast.show({
      type: 'error',
      visibilityTime: 2000,
      text1: _('error.refreshError'),
    });
  };

  onEndReached = () => {
    if (
      this.currentPage < this.state.lastPage &&
      this.state.refrechLoading === false &&
      this.state.refrechError === false
    ) {
      this.currentPage++;
      getOrdersList(
        () => this.onRefrechFromBottomLoading(),
        (response) => this.onRefrechFromBottomSeccess(response),
        () => this.onRefrechFromBottomError(),
        this.currentPage,
      );
    }
    if (this.currentPage > this.state.lastPage) {
      this.setState({...this.state, end: true});
    }
    if (this.currentPage === this.state.lastPage) {
      this.currentPage++;
    }
  };

  renderFooter = () => {
    if (
      !this.state.refrechLoading &&
      !this.state.refrechError &&
      this.state.end
    )
      return null;

    if (this.state.refrechError) {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => this.onRefrechFromBottom()}>
          <View style={{marginVertical: 8, alignItems: 'center'}}>
            <Image source={RETRY_ICON} />
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <View style={{marginVertical: 8}}>
        <ActivityIndicator color={colors.ORANGE} size="large" />
      </View>
    );
  };

  onRefrechFromBottom = () => {
    if (this.currentPage < this.state.lastPage) {
      this.currentPage++;
      getOrdersList(
        () => this.onRefrechFromBottomLoading(),
        (response) => this.onRefrechFromBottomSeccess(response),
        () => this.onRefrechFromBottomError(),
        this.currentPage,
      );
    }
    if (this.currentPage > this.state.lastPage) {
      this.setState({...this.state, end: true});
    }
    if (this.currentPage == this.state.lastPage) {
      this.currentPage++;
    }
  };

  onRefreshFromTopLoading = () => {
    this.setState({...this.state, refreshing: true});
  };

  onRefreshFromTopSeccess = (response) => {
    const data = [...response.data];

    this.setState((prevState) => ({
      ...prevState,
      data: data,
      refreshing: false,
      lastPage: response.last_page,
      refrechError: false,
      end: false,
      refrechLoading: false,
    }));
    this.currentPage = 1;
    if (this.currentPage >= this.state.lastPage) {
      this.setState({...this.state, end: true});
    }
  };

  onRefreshFromTopError = () => {
    this.setState({
      ...this.state,
      refreshing: false,
    });
    Toast.show({
      type: 'error',
      visibilityTime: 2000,
      text1: _('error.refreshError'),
    });
  };

  onRefreshFromTop = () => {
    getOrdersList(
      () => this.onRefreshFromTopLoading(),
      (response) => this.onRefreshFromTopSeccess(response),
      () => this.onRefreshFromTopError(),
      undefined,
    );
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={$.containerOneStyle}>
          <Image style={$.imageOneStyle} source={HEADER} />
          <Image style={$.imageTwoStyle} source={FOOTER} />
          {this.state.currentState === 'success' ? (
            <View style={{width: '100%', height: '100%'}}>
              <FlatList
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={$.containerTwoStyle}
                data={this.state.data}
                renderItem={this.renderItem}
                extraData={false}
                ListFooterComponent={this.renderFooter}
                onEndReached={() => this.onEndReached()}
                windowSize={201}
                maxToRenderPerBatch={40}
                refreshing={this.state.refreshing}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefreshFromTop}
                    tintColor={colors.ORANGE}
                    colors={[colors.ORANGE]}
                  />
                }
              />
              {this.state.data.length === 0 ? (
                <View style={$.emtyContainrStyle}>
                  <Text style={$.errorTextStyle}>{_('main.noOrders')}</Text>
                </View>
              ) : null}
            </View>
          ) : this.state.currentState === 'loading' ? (
            <View style={$.errorContainerStyle}>
              <ActivityIndicator color={colors.ORANGE} size="large" />
            </View>
          ) : this.state.currentState === 'error' ? (
            <View style={$.errorContainerStyle}>
              <GenericError
                errorText={_('login.errorMessage')}
                onRetry={() => this.getOrdersList()}
              />
            </View>
          ) : null}
          <CustomToast />
        </View>
      </SafeAreaView>
    );
  }
}

const $ = StyleSheet.create({
  errorTextStyle: {
    textAlign: 'center',
    fontSize: 16,
  },
  containerOneStyle: {flex: 1, backgroundColor: 'white'},
  imageOneStyle: {position: 'absolute', width: '100%'},
  imageTwoStyle: {position: 'absolute', bottom: 0, width: '100%'},
  containerTwoStyle: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 8,
  },
  errorContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emtyContainrStyle: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
});

export default OrdersScreen;
