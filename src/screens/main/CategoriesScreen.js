import React from 'react';
import {
  StyleSheet,
  FlatList,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  View,
  RefreshControl,
  Text,
  Alert,
  Linking,
} from 'react-native';

import {colors} from 'Wook_Market/src/lib/globalStyles';
import SearchBar from 'Wook_Market/src/components/SearchBar';
import CategoryItem, {
  ITEM_HEIGHT,
} from 'Wook_Market/src/components/CategoryItem';
import GenericError from 'Wook_Market/src/components/GenericError';
import {getCategories} from 'Wook_Market/src/lib/lists';
import ScreenState from 'Wook_Market/src/lib/ScreenState';
import {ONE_DAY} from 'Wook_Market/src/lib/Constants';
import {handleError} from 'Wook_Market/src/lib/util';
import {rateDelivery, removeOrdersFromCache} from 'Wook_Market/src/lib/order';
import {_} from 'Wook_Market/src/lang/i18n';
import Toast from 'react-native-toast-message';
import CustomToast from 'Wook_Market/src/lib/CustomToast';
import ListFooter from 'Wook_Market/src/components/ListFooter';
import RateDelivereyModal from 'Wook_Market/src/components/RateDelivereyModal';
import {getOrdersListFromLocalCache} from 'Wook_Market/src/lib/order';
import {AppContext} from 'Wook_Market/src/lib/AppContext';
import {OS_IOS} from 'Wook_Market/src/lib/Constants';
import DeviceInfo from 'react-native-device-info';

class CategoriesScreen extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.currentPage = 1;
  }

  state = {
    refreshing: false,
    list: [],
    lastPage: 1,
    paginationLoading: false,
    paginationError: false,
    end: false,
    screenState: ScreenState.LOADING,
    errorMessage: '',
    isRatingModalVisible: false,
    ratingButtonEnabled: true,
    ratingButtonLoading: false,
    orders: [],
  };

  getCategoriesList = async (new_open = false) => {
    onSuccess = (data) => {
      if (data.new_open) {
        if (OS_IOS) {
          if (!(DeviceInfo.getVersion() == data.version.ios)) {
            Alert.alert('', 'Une nouvelle mise à jour est disponible.', [
              {text: 'Ignorer', onPress: () => console.log('dismissing alert')},
              {
                text: 'Mettre à jour',
                onPress: () =>
                  Linking.openURL(
                    'https://apps.apple.com/fr/app/wo-ok-market/id1564583592',
                  ), //                  Linking.openURL("market://details?id=com.dzmob.services88");
              },
            ]);
          }
        } else {
          console.log(DeviceInfo.getVersion());
          console.log(data.version.android);
          if (!(DeviceInfo.getVersion() == data.version.android)) {
            Alert.alert('', 'Une nouvelle mise à jour est disponible.', [
              {text: 'Ignorer', onPress: () => console.log('dismissing alert')},

              {
                text: 'Mettre à jour',
                onPress: () =>
                  Linking.openURL('market://details?id=com.wook.market'),
              },
            ]);
          }
        }
      }
      this.setState({
        list: data.list,
        lastPage: data.lastPage,
        screenState: ScreenState.SUCCESS,
        end: this.currentPage >= data.lastPage,
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

    await getCategories(this.currentPage, onSuccess, onError, onLoad, new_open);
  };

  onRefresh = async () => {
    //get data from server refresh data
    this.setState({refreshing: true});
    this.currentPage = 1;
    onSuccess = (data) => {
      this.setState({
        list: data.list,
        refreshing: false,
        paginationError: false,
        end: this.currentPage >= data.lastPage,
      });
    };

    onError = (error) => {
      this.setState({
        refreshing: false,
      });

      Toast.show({
        position: 'bottom',
        type: 'error',
        visibilityTime: 2000,
        text1: handleError(error),
      });
    };

    onLoad = () => {
      this.setState({
        errorMessage: '',
      });
    };

    await getCategories(this.currentPage, onSuccess, onError, onLoad);
  };

  handleRetryPress = async () => {
    if (this.currentPage < this.state.lastPage) {
      await getCategories(
        this.currentPage + 1,
        this.endReachedSuccess,
        this.endReachedError,
        this.endReachedLoading,
      );

      if (this.currentPage > this.state.lastPage) {
        this.setState({...this.state, end: true});
      }
    }
  };

  endReachedSuccess = (data) => {
    const list = this.state.list;
    list.push(...data.list);

    this.setState((prevState) => ({
      ...prevState,
      list: list,
      paginationLoading: false,
      end: this.currentPage + 1 >= this.state.lastPage,
    }));

    this.currentPage++;
  };

  endReachedLoading = () => {
    this.setState({
      paginationLoading: true,
      paginationError: false,
    });
  };

  endReachedError = (error) => {
    this.setState({paginationLoading: false, paginationError: true});

    Toast.show({
      position: 'bottom',
      type: 'error',
      visibilityTime: 2000,
      text1: handleError(error),
    });
  };

  handleEndReached = async () => {
    if (
      this.currentPage < this.state.lastPage &&
      this.state.paginationLoading === false &&
      this.state.paginationError === false
    ) {
      await getCategories(
        this.currentPage + 1,
        this.endReachedSuccess,
        this.endReachedError,
        this.endReachedLoading,
      );
    }
  };

  handleItemPress(item) {
    //console.log(item);
    console.log(item);
    Analytics.event('clic_categorie', {category_name: item.name});
    this.props.navigation.navigate('Products', {category: item});
  }

  search(text) {
    Analytics.event('rechercher_un_produit_depuis_liste_catgories', {
      product_name: text,
    });
    this.props.navigation.navigate('SearchResult', {term: text});
  }

  renderItem = (item) => {
    return (
      <CategoryItem
        style={styles.itemStyle}
        onPress={() => this.handleItemPress(item)}
        image={item.image}
        title={item.name}
      />
    );
  };

  renderFooter = () => {
    if (
      !this.state.paginationLoading &&
      !this.state.paginationError &&
      this.state.end
    )
      return null;
    return (
      <ListFooter
        condition={this.state.paginationError}
        onPress={() => this.handleRetryPress()}
        style={{marginTop: 20}}
      />
    );
  };

  componentDidMount() {
    this.getCategoriesList(true);
    this.checkForDeliveryToRate();
  }

  checkForDeliveryToRate = async () => {
    const orders = await getOrdersListFromLocalCache();
    if (orders !== null) {
      const order = orders[0];
      const orderTime = order.createdAt;
      const currentTime = Math.floor(new Date().getTime() / 1000);
      const diff = currentTime - orderTime;
      if (diff >= ONE_DAY) this.showRatingModal(this.getOrdersId(orders));
    }
  };

  getOrdersId = (orders) => {
    const ordersId = [];
    orders.forEach((order) => ordersId.push(order.id));
    return ordersId;
  };

  removeOrdersFromCache = async () => {
    await removeOrdersFromCache();
  };

  showRatingModal = (orders) => {
    this.setState({
      ...this.state,
      isRatingModalVisible: true,
      orders,
    });
  };

  hideRatingModal = () => {
    this.setState({
      ...this.state,
      isRatingModalVisible: false,
      ratingButtonLoading: false,
      ratingButtonEnabled: true,
    });
  };

  rateDelivery = (rating) => {
    rateDelivery(
      this.rateDeliveryLoading,
      this.rateDeliverySuccess,
      this.rateDeliveryError,
      this.state.orders,
      rating,
    );
  };

  rateDeliveryLoading = () => {
    this.setState((prevState) => ({
      ...prevState,
      ratingButtonLoading: true,
      ratingButtonEnabled: false,
    }));
  };

  rateDeliverySuccess = () => {
    this.removeOrdersFromCache();
    this.hideRatingModal();
  };

  rateDeliveryError = () => {
    this.setState({
      ...this.state,
      ratingButtonLoading: false,
      ratingButtonEnabled: true,
    });
  };

  hideRatingModalAndCleanOrderesFromCache = () => {
    this.hideRatingModal();
    this.removeOrdersFromCache();
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor={colors.ORANGE}
        />
        <SearchBar
          navigation={this.props.navigation}
          style={styles.searchBarStyle}
          placeholder={_('main.search')}
          previousRoute={this.props.route.name}
          onSubmit={(text) => this.search(text)}
        />
        <View style={{marginTop: 67, justifyContent: 'center', flex: 1}}>
          {this.state.screenState === ScreenState.SUCCESS ||
          (this.state.list.length === 0 &&
            this.state.screenState !== ScreenState.LOADING &&
            this.state.screenState !== ScreenState.ERROR) ? (
            <View style={{width: '100%', height: '100%'}}>
              <FlatList
                contentContainerStyle={styles.listContentStyle}
                showsVerticalScrollIndicator={false}
                extraData={false}
                keyExtractor={(item) => {
                  return item.id.toString();
                }}
                data={this.state.list}
                renderItem={({item}) => this.renderItem(item)}
                refreshing={this.state.refreshing}
                refreshControl={
                  <RefreshControl
                    colors={[colors.ORANGE]}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh.bind(this)}
                    tintColor={colors.ORANGE}
                  />
                }
                onEndReached={(info) => this.handleEndReached()}
                windowSize={201}
                maxToRenderPerBatch={20}
                ListFooterComponent={this.renderFooter}
              />
              {this.state.list.length === 0 ? (
                <View style={styles.emptyStateContainerStyle}>
                  <Text style={{fontSize: 16}}>{_('error.emptyCategory')}</Text>
                </View>
              ) : null}
            </View>
          ) : null}

          {this.state.screenState === ScreenState.LOADING ? (
            <ActivityIndicator size="large" color={colors.ORANGE} />
          ) : null}

          {this.state.screenState === ScreenState.ERROR ? (
            <GenericError
              errorText={this.state.errorMessage}
              onRetry={this.getCategoriesList}
            />
          ) : null}
        </View>
        <CustomToast />
        {this.state.isRatingModalVisible ? (
          <RateDelivereyModal
            isRatingModalVisible={this.state.isRatingModalVisible}
            closeRatingModal={this.hideRatingModalAndCleanOrderesFromCache}
            rate={this.rateDelivery}
            enabled={this.state.ratingButtonEnabled}
            loading={this.state.ratingButtonLoading}
          />
        ) : null}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  itemStyle: {
    marginTop: 17,
    marginHorizontal: 32,
  },
  searchBarStyle: {
    marginTop: 20,
    marginHorizontal: 30,
  },
  listContentStyle: {
    paddingBottom: 20,
  },
  errorTextStyle: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 16,
  },
  emptyStateContainerStyle: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CategoriesScreen;
