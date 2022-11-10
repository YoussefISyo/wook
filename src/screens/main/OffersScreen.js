import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  StatusBar,
  RefreshControl,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import OfferItem from 'Wook_Market/src/components/OfferItem';
import SearchBar from 'Wook_Market/src/components/SearchBar';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import ScreenState from 'Wook_Market/src/lib/ScreenState';
import {ButtonState} from 'Wook_Market/src/components/FastAddButton';
import {_} from 'Wook_Market/src/lang/i18n';
import Toast from 'react-native-toast-message';
import CustomToast from 'Wook_Market/src/lib/CustomToast';
import ListFooter from 'Wook_Market/src/components/ListFooter';
import {getToken} from 'Wook_Market/src/lib/authentication';
import {getDiscounts, getGroupedProducts} from 'Wook_Market/src/lib/lists';
import {addToCart, stateFromAddedToCart} from 'Wook_Market/src/lib/cart';
import {
  handleError,
  getMinQuantity,
  getQuantityByIndex,
  getPriceByIndex,
  formatExpirationText,
} from 'Wook_Market/src/lib/util';
import {AppContext} from 'Wook_Market/src/lib/AppContext';
import GenericError from 'Wook_Market/src/components/GenericError';

const HEADER = require('Wook_Market/src/assets/images/top_header_image.png');
const FOOTER = require('Wook_Market/src/assets/images/bottom_image.png');

class OffersScreen extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.currentPage = 1;
    this.onRefresh = this.onRefresh.bind(this);
  }

  state = {
    list: [],
    lastPage: 1,
    minQuantityItems: null,
    minQuantityGrams: null,
    screenState: ScreenState.LOADING,
    errorMessage: '',
    refreshing: false,
    isAdding: false,
    paginationLoading: false,
    paginationError: false,
    end: false,
  };

  search(text) {
    this.props.navigation.navigate('SearchResult', {term: text});
  }

  onItemPress(item) {
    this.props.navigation.navigate('OfferDetail', {item: item});
  }

  renderItem = (item, index) => {
    return (
      <OfferItem
        title={item.name}
        image={item.image}
        initialPrice={item.price}
        numOfOrders={item.orders_count}
        firstQuantity={getQuantityByIndex(0, item.price_pools)}
        secondQuantity={getQuantityByIndex(1, item.price_pools)}
        lastQuantity={getQuantityByIndex(2, item.price_pools)}
        firstDiscount={getPriceByIndex(0, item.price_pools)}
        secondDiscount={getPriceByIndex(1, item.price_pools)}
        lastDiscount={getPriceByIndex(2, item.price_pools)}
        expiresIn={formatExpirationText(item.start_date, item.end_date)}
        state={stateFromAddedToCart(item.added_to_cart)}
        style={styles.itemStyle}
        onPress={() => this.onItemPress(item)}
        onAdd={() => {
          this.handleAddToCartPress(item);
        }}
      />
    );
  };

  isListEmpty = (groupedProductsList) => {
    return groupedProductsList.length === 0;
  };

  getGroupedProductsList = async () => {
    onSuccess = (data) => {
      const groupedProductsList = data.list;

      this.setState({
        list: groupedProductsList,
        lastPage: data.lastPage,
        minQuantityItems: data.minQuantityItems,
        minQuantityGrams: data.minQuantityGrams,
        screenState: this.isListEmpty(groupedProductsList)
          ? ScreenState.EMPTY
          : ScreenState.SUCCESS,
        end: this.currentPage === data.lastPage,
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

    await getGroupedProducts(this.currentPage, onSuccess, onError, onLoad);
  };

  handleAddToCartPress = async (item) => {
    const token = await getToken();

    if (token === null) {
      this.props.navigation.navigate('LoginFromMain');
      return;
    }
    if (this.state.isAdding) return;

    const list = this.state.list;
    const itemIndex = list.indexOf(item);

    onSuccess = async (data) => {
      this.context.updateProductsCount(data);
      list[itemIndex] = {...item, added_to_cart: true};
      this.setState((prevState) => ({
        ...prevState,
        isAdding: false,
        list: list,
      }));
    };

    onError = (error) => {
      list[itemIndex] = {...item, added_to_cart: false};
      this.setState((prevState) => ({
        ...prevState,
        list: list,
        isAdding: false,
      }));

      Toast.show({
        position: 'bottom',
        type: 'error',
        visibilityTime: 2000,
        text1: handleError(error),
      });
    };

    onLoad = () => {
      list[itemIndex] = {...item, added_to_cart: ButtonState.LOADING};

      this.setState((prevState) => ({
        ...prevState,
        list: list,
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
      await getGroupedProducts(
        this.currentPage + 1,
        this.endReachedSuccess,
        this.endReachedError,
        this.endReachedLoading,
      );
    }
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
        end: this.currentPage === data.lastPage,
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

    await getGroupedProducts(this.currentPage, onSuccess, onError, onLoad);
  };

  handleRetryPress = async () => {
    if (this.currentPage < this.state.lastPage) {
      await getDiscounts(
        this.currentPage + 1,
        this.endReachedSuccess,
        this.endReachedError,
        this.endReachedLoading,
      );
    }
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
        onPress={this.handleRetryPress}
        style={{marginTop: 8}}
      />
    );
  };

  refreshScreen = () => {
    if (this.context.getShouldRefreshOffersScreen()) {
      this.currentPage = 1;
      this.getGroupedProductsList();
      this.context.validateOffersScreenRefresh();
    }
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener(
      'focus',
      this.refreshScreen,
    );
    this.getGroupedProductsList();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <SafeAreaView style={styles.containerStyle}>
        <Image style={{position: 'absolute', width: '100%'}} source={HEADER} />
        <Image
          style={{position: 'absolute', bottom: 0, width: '100%'}}
          source={FOOTER}
        />
        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor={colors.ORANGE}
        />
        <SearchBar
          navigation={this.props.navigation}
          style={styles.searchBarStyle}
          placeholder={_('main.search')}
          onSubmit={(text) => this.search(text)}
        />

        <View
          style={{
            marginTop: 72,
            justifyContent: 'center',
            flex: 1,
          }}>
          {this.state.screenState === ScreenState.SUCCESS ||
          this.state.screenState === ScreenState.EMPTY ? (
            <View
              style={{
                width: '100%',
                height: '100%',
              }}>
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listStyle}
                extraData={this.state.list}
                data={this.state.list}
                windowSize={201}
                renderItem={({item, index}) => this.renderItem(item, index)}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={this.handleEndReached}
                onEndReachedThreshold={0.6}
                refreshControl={
                  <RefreshControl
                    colors={[colors.ORANGE]}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                    tintColor={colors.ORANGE}
                  />
                }
                windowSize={201}
                maxToRenderPerBatch={20}
                ListFooterComponent={this.renderFooter}
              />
              {this.state.list.length === 0 ? (
                <View style={styles.emptyStateContainerStyle}>
                  <Text style={{fontSize: 16}}>{_('error.emptyOffers')}</Text>
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
              onRetry={this.getGroupedProductsList}
            />
          ) : null}
        </View>
        <CustomToast />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {flex: 1},
  searchBarStyle: {
    marginTop: 24,
    marginHorizontal: 26,
  },
  itemStyle: {
    marginTop: 10,
  },
  listStyle: {paddingTop: 6, alignItems: 'center'},
  emptyStateContainerStyle: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OffersScreen;
