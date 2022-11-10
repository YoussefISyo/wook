import React from 'react';
import {
  View,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Image,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Text,
} from 'react-native';

import {getDiscounts} from 'Wook_Market/src/lib/lists';
import ScreenState from 'Wook_Market/src/lib/ScreenState';
import {
  handleError,
  calculateDiscountRatio,
  getMinQuantity,
} from 'Wook_Market/src/lib/util';
import {addToCart, stateFromAddedToCart} from 'Wook_Market/src/lib/cart';
import GenericError from 'Wook_Market/src/components/GenericError';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import DiscountItem from 'Wook_Market/src/components/DiscountItem';
import SearchBar from 'Wook_Market/src/components/SearchBar';
import {getToken} from 'Wook_Market/src/lib/authentication';
import {ButtonState} from 'Wook_Market/src/components/FastAddButton';
import {_} from 'Wook_Market/src/lang/i18n';
import Toast from 'react-native-toast-message';
import CustomToast from 'Wook_Market/src/lib/CustomToast';
import ListFooter from 'Wook_Market/src/components/ListFooter';
import {AppContext} from 'Wook_Market/src/lib/AppContext';

const HEADER = require('Wook_Market/src/assets/images/top_header_image.png');
const FOOTER = require('Wook_Market/src/assets/images/bottom_image.png');

class DiscountsScreen extends React.Component {
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

  renderItem = ({item, index}) => {
    return (
      <DiscountItem
        style={{marginHorizontal: 5, marginBottom: 12}}
        title={item.name}
        image={item.image}
        oldPrice={item.price}
        discountRatio={calculateDiscountRatio(item.price, item.new_price)}
        price={item.new_price}
        rating={item.average_rating}
        state={stateFromAddedToCart(item.added_to_cart)}
        onAdd={() => this.handleAddToCartPress(item)}
        onPress={() => this.onItemPress(item)}
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
        onPress={this.handleRetryPress}
        style={{marginTop: 8}}
      />
    );
  };

  onItemPress(item) {
    Analytics.event('clic_produit_depuis_liste_produits', {product_name: item.name});

    this.props.navigation.navigate('ProductDetail', {
      item: item,
      previousRoute: this.props.route.name,
    });
  }

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
      Analytics.event('ajout_au_panier_depuis_liste_produits', {product_name: item.name});

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

  isListEmpty = (discountsList) => {
    return discountsList.length === 0;
  };

  getDiscountsList = async () => {
    onSuccess = (data) => {
      const discountsList = data.list;

      this.setState({
        list: discountsList,
        minQuantityItems: data.minQuantityItems,
        minQuantityGrams: data.minQuantityGrams,
        lastPage: data.lastPage,
        screenState: this.isListEmpty(discountsList)
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

    await getDiscounts(this.currentPage, onSuccess, onError, onLoad);
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
      await getDiscounts(
        this.currentPage + 1,
        this.endReachedSuccess,
        this.endReachedError,
        this.endReachedLoading,
      );
    }
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

    await getDiscounts(this.currentPage, onSuccess, onError, onLoad);
  };

  search(text) {
    Analytics.event('rechercher_produit_depuis_liste_produits', {product_name: text});

    this.props.navigation.navigate('SearchResult', {term: text});
  }

  refreshScreen = () => {
    if (this.context.getShouldRefreshDiscountsScreen()) {
      this.currentPage = 1;
      this.getDiscountsList();
      this.context.validateDiscountsScreenRefresh();
    }
  };

  componentDidMount = () => {
    this.unsubscribe = this.props.navigation.addListener(
      'focus',
      this.refreshScreen,
    );
    this.getDiscountsList();
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <SafeAreaView style={styles.containerStyle}>
        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor={colors.ORANGE}
        />
        <Image style={{position: 'absolute', width: '100%'}} source={HEADER} />
        <Image
          style={{position: 'absolute', bottom: 0, width: '100%'}}
          source={FOOTER}
        />
        <SearchBar
          navigation={this.props.navigation}
          style={styles.searchBarStyle}
          placeholder={_('main.search')}
          previousRoute={this.props.route.name}
          onSubmit={(text) => this.search(text)}
        />

        <View style={{marginTop: 72, justifyContent: 'center', flex: 1}}>
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
                numColumns={2}
                data={this.state.list}
                renderItem={this.renderItem}
                extraData={this.state.list}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={() => this.handleEndReached()}
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
                  <Text style={{fontSize: 16}}>
                    {_('error.emptyDiscounts')}
                  </Text>
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
              onRetry={this.getDiscountsList}
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
  listStyle: {paddingTop: 15, marginHorizontal: 24, paddingBottom: 16},
  emptyStateContainerStyle: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DiscountsScreen;
