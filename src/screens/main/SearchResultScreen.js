import React from 'react';
import {
  View,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  Image,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import {searchProduct} from 'Wook_Market/src/lib/lists';
import ScreenState from 'Wook_Market/src/lib/ScreenState';
import {
  handleError,
  calculateDiscountRatio,
  getMinQuantity,
} from 'Wook_Market/src/lib/util';
import GenericError from 'Wook_Market/src/components/GenericError';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import DiscountItem from 'Wook_Market/src/components/DiscountItem';
import ProductItem, {
  PRODUCT_ITEM_HEIGHT,
} from 'Wook_Market/src/components/ProductItem';
import SearchBar from 'Wook_Market/src/components/SearchBar';
import {ButtonState} from 'Wook_Market/src/components/FastAddButton';
import {addToCart, stateFromAddedToCart} from 'Wook_Market/src/lib/cart';
import {getToken} from 'Wook_Market/src/lib/authentication';
import {_} from 'Wook_Market/src/lang/i18n';
import Toast from 'react-native-toast-message';
import CustomToast from 'Wook_Market/src/lib/CustomToast';
import ListFooter from 'Wook_Market/src/components/ListFooter';
import {AppContext} from 'Wook_Market/src/lib/AppContext';
import OfferItemSmall from '../../components/OfferItemSmall';

const HEADER = require('Wook_Market/src/assets/images/top_header_image.png');
const FOOTER = require('Wook_Market/src/assets/images/bottom_image.png');

const HeaderComponent = ({term, style}) => {
  return (
    <Text
      numberOfLines={2}
      ellipsizeMode="tail"
      style={[styles.headerComponentStyle, style]}>
      {_('main.resultOf')} “{term}”
    </Text>
  );
};

class SearchResultScreen extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.term = this.props.route.params.term;
    this.onRefresh = this.onRefresh.bind(this);
    this.currentPage = 1;
  }

  state = {
    list: [],
    lastPage: 1,
    minQuantityItems: null,
    minQuantityGrams: null,
    screenState: ScreenState.LOADING,
    showSuggestions: false,
    errorMessage: '',
    isAdding: false,
    paginationLoading: false,
    paginationError: false,
    end: false,
  };

  async searchProducts(term) {
    onSuccess = (data) => {
      this.setState({
        list: data.list,
        lastPage: data.lastPage,
        minQuantityItems: data.minQuantityItems,
        minQuantityGrams: data.minQuantityGrams,
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

    await searchProduct(term, this.currentPage, onSuccess, onError, onLoad);
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
      await searchProduct(
        this.term,
        this.currentPage + 1,
        this.endReachedSuccess,
        this.endReachedError,
        this.endReachedLoading,
      );
    }
  };

  handleRetryPress = async () => {
    if (this.currentPage < this.state.lastPage) {
      await searchProduct(
        this.term,
        this.currentPage + 1,
        this.endReachedSuccess,
        this.endReachedError,
        this.endReachedLoading,
      );
    }
  };

  onRefresh = async () => {
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
    await searchProduct(
      this.term,
      this.currentPage,
      onSuccess,
      onError,
      onLoad,
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
        style={{marginTop: 10, marginBottom: 10}}
      />
    );
  };

  renderItem(item, index) {
    if (item.type === 'grouped') {
      return (
        <OfferItemSmall
          style={{marginHorizontal: 6, marginBottom: 12}}
          title={item.name}
          image={item.image}
          price={item.price}
          rating={item.average_rating}
          state={stateFromAddedToCart(item.added_to_cart)}
          onAdd={() => this.handleAddToCartPress(item)}
          onPress={() => this.onPressItem(item)}
        />
      );
    } else {
      if (item.promotion === 0) {
        return (
          <ProductItem
            style={{marginHorizontal: 6, marginBottom: 12}}
            title={item.name}
            image={item.image}
            price={item.price}
            rating={item.average_rating}
            state={stateFromAddedToCart(item.added_to_cart)}
            onAdd={() => this.handleAddToCartPress(item)}
            onPress={() => this.onPressItem(item)}
          />
        );
      } else {
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
            onPress={() => this.onPressItem(item)}
          />
        );
      }
    }
  }

  onPressItem(item) {
    if (item.type === 'grouped')
      this.props.navigation.navigate('OfferDetail', {
        item: item,
        previousRoute: this.props.route.name,
      });
    else
      this.props.navigation.navigate('ProductDetail', {
        item: item,
        previousRoute: this.props.route.name,
      });
  }

  search(text) {
    this.term = text;
    this.searchProducts(this.term);
  }

  refreshScreen = () => {
    if (this.context.getShouldRefreshSearchResultScreen()) {
      this.currentPage = 1;
      this.searchProducts(this.term);
      this.context.validateSearchResultScreenRefresh();
    }
    if (this.props.route.params) {
      if (this.props.route.params.shouldRefresh) {
        this.searchProducts(this.terRm);
      }
    }
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener(
      'focus',
      this.refreshScreen,
    );
    this.searchProducts(this.term);
  }

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
          onSubmit={(text) => this.search(text)}
        />

        <View style={{marginTop: 72, flex: 1}}>
          {this.state.screenState === ScreenState.SUCCESS &&
          this.state.list.length === 0 ? (
            <View>
              <HeaderComponent
                term={this.term}
                style={{marginTop: 24, marginHorizontal: 28}}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  marginHorizontal: 28,
                  marginTop: 12,
                  color: colors.DELIVERY_TIME_COLOR,
                }}>
                {_('main.noResultsFound')}
              </Text>
            </View>
          ) : null}

          {this.state.screenState === ScreenState.SUCCESS &&
          this.state.list.length != 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listStyle}
              extraData={this.state.list}
              numColumns={2}
              data={this.state.list}
              renderItem={({item, index}) => this.renderItem(item, index)}
              extraData={this.state.list}
              keyExtractor={(item, index) => item.id.toString()}
              onEndReached={() => this.handleEndReached()}
              ListHeaderComponent={() => (
                <HeaderComponent
                  term={this.term}
                  style={{marginBottom: 24, marginHorizontal: 2}}
                />
              )}
              refreshControl={
                <RefreshControl
                  colors={[colors.ORANGE]}
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                  tintColor={colors.ORANGE}
                />
              }
              ListFooterComponent={this.renderFooter}
              getItemLayout={(data, index) => ({
                length: PRODUCT_ITEM_HEIGHT,
                offset: PRODUCT_ITEM_HEIGHT * index,
                index,
              })}
            />
          ) : null}

          {this.state.screenState === ScreenState.LOADING ? (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <ActivityIndicator size="large" color={colors.ORANGE} />
            </View>
          ) : null}

          {this.state.screenState === ScreenState.ERROR ? (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <GenericError
                errorText={this.state.errorMessage}
                onRetry={this.searchProducts(this.term)}
              />
            </View>
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
  listStyle: {paddingTop: 15, marginHorizontal: 24},
  headerComponentStyle: {
    fontSize: 18,
    color: colors.GRAY_HEADER,
    fontWeight: '500',
  },
});

export default SearchResultScreen;
