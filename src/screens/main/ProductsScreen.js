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

import {getToken} from 'Wook_Market/src/lib/authentication';
import {LOADING_INDICATOR} from 'Wook_Market/src/lib/Constants';
import {_} from 'Wook_Market/src/lang/i18n';
import ProductItem, {
  PRODUCT_ITEM_HEIGHT,
} from 'Wook_Market/src/components/ProductItem';
import DiscountItemWide from 'Wook_Market/src/components/DiscountItemWide';
import SearchBar from 'Wook_Market/src/components/SearchBar';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {ButtonState} from 'Wook_Market/src/components/FastAddButton';
import {
  getProducts,
  getDiscounts,
  getBothProductsAndDiscounts,
} from 'Wook_Market/src/lib/lists';
import {addToCart, stateFromAddedToCart} from 'Wook_Market/src/lib/cart';
import ScreenState from 'Wook_Market/src/lib/ScreenState';
import {
  handleError,
  calculateDiscountRatio,
  scrollListToTop,
  getMinQuantity,
} from 'Wook_Market/src/lib/util';
import GenericError from 'Wook_Market/src/components/GenericError';
import Toast from 'react-native-toast-message';
import CustomToast from 'Wook_Market/src/lib/CustomToast';
import ListFooter from 'Wook_Market/src/components/ListFooter';
import {AppContext} from 'Wook_Market/src/lib/AppContext';

const HEADER = require('Wook_Market/src/assets/images/top_header_image.png');
const FOOTER = require('Wook_Market/src/assets/images/bottom_image.png');

class ProductsScreen extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.horizontalListRef = React.createRef();
    this.category = this.props.route.params.category;
    this.verticalPage = 1;
    this.horizontalPage = 1;
    this.onRefresh = this.onRefresh.bind(this);
  }

  state = {
    lastHorizontalPage: 1,
    lastVerticalPage: 1,
    minQuantityGrams: null,
    minQuantityItems: null,
    productsList: [],
    discountsList: [],
    refreshing: false,
    isAdding: false,
    loadingHorizontal: false,
    loadingVertical: false,
    screenState: ScreenState.LOADING,
    errorMessage: '',
    paginationVerticalLoading: false,
    paginationVerticalError: false,
    endVertical: false,
    paginationHorizontalLoading: false,
    paginationHorizontalError: false,
    endHorizontal: false,
  };

  renderHorizontalItem = ({item}) => {
    if (item === LOADING_INDICATOR) {
      return this.renderHorizontalFooter();
    } else
      return (
        <DiscountItemWide
          style={{marginRight: 13}}
          title={item.name}
          image={item.image}
          oldPrice={item.price}
          price={item.new_price}
          state={stateFromAddedToCart(item.added_to_cart)}
          onAdd={() => this.handleAddToCartPress(item)}
          onPress={() => this.onPressItem(item)}
          discountRatio={calculateDiscountRatio(item.price, item.new_price)}
        />
      );
  };

  renderVerticalItem = ({index, item}) => {
    const isLastPairItem = this.state.productsList.length - 1 === index;

    return (
      <ProductItem
        style={{
          marginHorizontal: 6,
          marginRight: isLastPairItem ? 12 : 6,
          marginBottom: 12,
        }}
        title={item.name}
        image={item.image}
        price={item.price}
        rating={item.average_rating}
        state={stateFromAddedToCart(item.added_to_cart)}
        onAdd={() => this.handleAddToCartPress(item)}
        onPress={() => this.onPressItem(item)}
      />
    );
  };

  addHorizontalFooter(list) {
    if (list[list.length - 1] !== LOADING_INDICATOR)
      list.push(LOADING_INDICATOR);
  }

  removeHorizontalFooter(list) {
    if (list[list.length - 1] === LOADING_INDICATOR) list.pop();
  }

  renderHorizontalList = (data) => {
    const isDiscountsListFilled = this.state.discountsList.length > 0;
    const isProductsListFilled = this.state.productsList.length > 0;
    return (
      <View style={styles.horizontalListContainerStyle}>
        {isDiscountsListFilled ? (
          <Text style={styles.discountsHeaderStyle}>{_('main.discounts')}</Text>
        ) : null}

        <FlatList
          bounces={false}
          ref={(ref) => (this.horizontalListRef = ref)}
          contentContainerStyle={{flex: 1}}
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={[
            styles.horizontalListStyle,
            {paddingRight: this.state.loadingHorizontal ? 0 : 21},
          ]}
          data={this.state.discountsList}
          renderItem={this.renderHorizontalItem}
          extraData={this.state.discountsList}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={this.handleHorizontalEndReached}
          onEndReachedThreshold={0.6}
          windowSize={201}
          maxToRenderPerBatch={20}
        />
        {isProductsListFilled ? (
          <Text style={styles.productsHeaderStyle}>{_('main.products')}</Text>
        ) : null}
      </View>
    );
  };

  onRefresh = async () => {
    this.setState({refreshing: true});
    this.horizontalPage = 1;
    this.verticalPage = 1;

    const onSuccess = (data) => {
      //if horizontalList not empty scroll to start
      if (this.state.discountsList.length > 0)
        scrollListToTop(this.horizontalListRef);

      const discountItems = data.discounts.list;
      const productItems = data.products.list;
      const lastProductsPage = data.products.lastPage;
      const lastDiscountsPage = data.discounts.lastPage;

      this.setState({
        lastHorizontalPage: lastDiscountsPage,
        lastVerticalPage: lastProductsPage,
        productsList: productItems,
        discountsList: discountItems,
        refreshing: false,
        paginationVerticalError: false,
        paginationHorizontalError: false,
        endVertical: this.verticalPage >= lastProductsPage,
        endHorizontal: this.horizontalPage >= lastDiscountsPage,
      });
    };

    const onError = (error) => {
      this.setState({refreshing: false});
      Toast.show({
        position: 'bottom',
        type: 'error',
        visibilityTime: 2000,
        text1: handleError(error),
      });
    };

    const onLoad = () => {
      this.setState({
        errorMessage: '',
      });
    };

    await getBothProductsAndDiscounts(
      this.horizontalPage,
      this.verticalPage,
      onSuccess,
      onError,
      onLoad,
      this.category.id,
    );
  };

  renderVerticalList = () => {
    return (
      <View style={{width: '100%', height: '100%'}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{height: '100%'}}
          numColumns={2}
          data={this.state.productsList}
          renderItem={this.renderVerticalItem}
          extraData={this.state.productsList}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={this.handleVerticalEndReached}
          onEndReachedThreshold={0.6}
          windowSize={201}
          maxToRenderPerBatch={20}
          columnWrapperStyle={{marginHorizontal: 23}}
          ListHeaderComponent={this.renderHorizontalList()}
          ListFooterComponent={this.renderVerticalFooter}
          getItemLayout={(data, index) => ({
            length: PRODUCT_ITEM_HEIGHT,
            offset: PRODUCT_ITEM_HEIGHT * index,
            index,
          })}
          refreshing={this.state.refreshing}
          refreshControl={
            <RefreshControl
              colors={[colors.ORANGE]}
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
              tintColor={colors.ORANGE}
            />
          }
        />
        {this.state.productsList.length === 0 &&
        this.state.discountsList.length === 0 ? (
          <View style={styles.emptyStateContainerStyle}>
            <Text style={{fontSize: 16}}>{_('error.emptyProducts')}</Text>
          </View>
        ) : null}
      </View>
    );
  };

  renderHorizontalFooter = () => {
    if (
      !this.state.paginationHorizontalLoading &&
      !this.state.paginationHorizontalError &&
      this.state.endHorizontal
    )
      return null;

    return (
      <ListFooter
        condition={this.state.paginationHorizontalError}
        onPress={this.handleRetryHorizontalPress}
        style={{marginLeft: 8, justifyContent: 'center'}}
      />
    );
  };

  renderVerticalFooter = () => {
    if (
      (!this.state.paginationVerticalLoading &&
        !this.state.paginationVerticalError &&
        this.state.endVertical) ||
      this.state.productsList.length === 0
    )
      return null;

    return (
      <ListFooter
        condition={this.state.paginationVerticalError}
        onPress={this.handleRetryVerticalPress}
        style={{marginTop: 8}}
      />
    );
  };

  handleAddToCartPress = async (item) => {
    const token = await getToken();

    if (token === null) {
      this.props.navigation.navigate('LoginFromMain');
      return;
    }

    const discountItems = this.state.discountsList;
    const productItems = this.state.productsList;

    const itemIndex = item.promotion
      ? discountItems.indexOf(item)
      : productItems.indexOf(item);

    onSuccess = async (data) => {
      console.log('add to cart', item.name);
      Analytics.event('ajout_au_panier_depuis_liste_produits', {
        product_name: item.name,
      });

      this.context.updateProductsCount(data);
      if (item.promotion) {
        discountItems[itemIndex] = {...item, added_to_cart: true};

        this.setState((prevState) => ({
          ...prevState,
          discountsList: discountItems,
          isAdding: false,
        }));
      } else {
        productItems[itemIndex] = {...item, added_to_cart: true};

        this.setState((prevState) => ({
          ...prevState,
          productsList: productItems,
          isAdding: false,
        }));
      }
    };

    onError = (error) => {
      if (item.promotion) {
        discountItems[itemIndex] = {...item, added_to_cart: false};

        this.setState((prevState) => ({
          ...prevState,
          discountsList: discountItems,
          isAdding: false,
        }));
      } else {
        productItems[itemIndex] = {...item, added_to_cart: false};

        this.setState((prevState) => ({
          ...prevState,
          productsList: productItems,
          isAdding: false,
        }));
      }

      Toast.show({
        position: 'bottom',
        type: 'error',
        visibilityTime: 2000,
        text1: handleError(error),
      });
    };

    onLoad = () => {
      if (item.promotion) {
        discountItems[itemIndex] = {
          ...item,
          added_to_cart: ButtonState.LOADING,
        };

        this.setState((prevState) => ({
          ...prevState,
          discountsList: discountItems,
          isAdding: true,
        }));
      } else {
        productItems[itemIndex] = {...item, added_to_cart: ButtonState.LOADING};

        this.setState((prevState) => ({
          ...prevState,
          productsList: productItems,
          isAdding: true,
        }));
      }
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

  onPressItem(item) {
    if (item.promotion) {
      Analytics.event('clic_promotion', {product_name: item.name});
    } else {
      Analytics.event('clic_produit', {product_name: item.name});
    }
    this.props.navigation.navigate('ProductDetail', {
      item: item,
      previousRoute: this.props.route.name,
    });
  }

  isListEmpty = (productsList, discountsList) => {
    return productsList.length === 0 && discountsList.length === 0;
  };

  getLists = async () => {
    onSuccess = (data) => {
      const discountItems = data.discounts.list;
      const productItems = data.products.list;
      const lastDiscountsPage = data.discounts.lastPage;
      const lastProductsPage = data.products.lastPage;

      if (this.horizontalPage < lastDiscountsPage)
        this.addHorizontalFooter(discountItems);

      this.setState({
        screenState: this.isListEmpty(productItems, discountItems)
          ? ScreenState.EMPTY
          : ScreenState.SUCCESS,
        discountsList: discountItems,
        productsList: productItems,
        lastHorizontalPage: lastDiscountsPage,
        lastVerticalPage: lastProductsPage,
        endVertical: this.verticalPage >= lastProductsPage,
        endHorizontal: this.horizontalPage >= lastDiscountsPage,
        minQuantityItems: data.minQuantityItems,
        minQuantityGrams: data.minQuantityGrams,
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

    await getBothProductsAndDiscounts(
      this.horizontalPage,
      this.verticalPage,
      onSuccess,
      onError,
      onLoad,
      this.category.id,
    );
  };

  endReachedHorizontalSuccess = (data) => {
    const discountItems = this.state.discountsList;
    //removing indicator and adding newPage data
    this.removeHorizontalFooter(discountItems);
    discountItems.push(...data.list);
    if (this.horizontalPage + 1 < this.state.lastHorizontalPage)
      this.addHorizontalFooter(discountItems);

    this.setState({
      discountsList: discountItems,
      paginationHorizontalLoading: false,
      endHorizontal: this.horizontalPage + 1 >= this.state.lastHorizontalPage,
    });

    this.horizontalPage++;
  };

  endReachedHorizontalLoading = () => {
    this.setState({
      paginationHorizontalLoading: true,
      paginationHorizontalError: false,
    });
  };

  endReachedHorizontalError = (error) => {
    this.setState({
      paginationHorizontalLoading: false,
      paginationHorizontalError: true,
    });

    Toast.show({
      position: 'bottom',
      type: 'error',
      visibilityTime: 2000,
      text1: handleError(error),
    });
  };

  handleHorizontalEndReached = async () => {
    if (
      this.horizontalPage < this.state.lastHorizontalPage &&
      this.state.paginationHorizontalLoading === false &&
      this.state.paginationHorizontalError === false
    ) {
      await getDiscounts(
        this.horizontalPage + 1,
        this.endReachedHorizontalSuccess,
        this.endReachedHorizontalError,
        this.endReachedHorizontalLoading,
        this.category.id,
      );
    }
  };

  handleRetryHorizontalPress = async () => {
    if (this.horizontalPage < this.state.lastHorizontalPage) {
      await getDiscounts(
        this.horizontalPage + 1,
        this.endReachedHorizontalSuccess,
        this.endReachedHorizontalError,
        this.endReachedHorizontalLoading,
        this.category.id,
      );
    }
  };

  endReachedVerticalSuccess = (data) => {
    const productItems = this.state.productsList;
    productItems.push(...data.list);

    this.setState((prevState) => ({
      ...prevState,
      productsList: productItems,
      paginationVerticalLoading: false,
      endVertical: this.verticalPage + 1 >= this.state.lastVerticalPage,
    }));
    this.verticalPage++;
  };

  endReachedVerticalLoading = () => {
    this.setState({
      paginationVertical: true,
      paginationVerticalError: false,
    });
  };

  endReachedVerticalError = (error) => {
    this.setState({
      paginationVerticalLoading: false,
      paginationVerticalError: true,
    });

    Toast.show({
      position: 'bottom',
      type: 'error',
      visibilityTime: 2000,
      text1: handleError(error),
    });
  };

  handleVerticalEndReached = async () => {
    if (
      this.verticalPage < this.state.lastVerticalPage &&
      this.state.paginationVerticalLoading === false &&
      this.state.paginationVerticalError === false
    ) {
      await getProducts(
        this.verticalPage + 1,
        this.endReachedVerticalSuccess,
        this.endReachedVerticalError,
        this.endReachedVerticalLoading,
        this.category.id,
      );
    }
  };

  handleRetryVerticalPress = async () => {
    if (this.verticalPage < this.state.lastVerticalPage) {
      await getProducts(
        this.verticalPage + 1,
        this.endReachedVerticalSuccess,
        this.endReachedVerticalError,
        this.endReachedVerticalLoading,
        this.category.id,
      );
    }
  };

  search = (text) => {
    Analytics.event('rechercher_produit_depuis_liste_produits', {
      product_name: text,
    });

    this.props.navigation.navigate('SearchResult', {term: text});
  };

  refreshScreen = () => {
    if (this.context.getShouldRefreshProductsScreen()) {
      this.verticalPage = 1;
      this.horizontalPage = 1;
      this.getLists();
      this.context.validateProductsScreenRefresh();
    }
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener(
      'focus',
      this.refreshScreen,
    );
    this.getLists();
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.setState = (state, callback) => {
      return;
    };
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

        <View
          style={{
            marginTop: 72,
            flex: 1,
            justifyContent:
              this.state.screenState === ScreenState.SUCCESS
                ? 'flex-start'
                : 'center',
          }}>
          {this.state.screenState === ScreenState.SUCCESS ||
          this.state.screenState === ScreenState.EMPTY
            ? this.renderVerticalList()
            : null}

          {this.state.screenState === ScreenState.LOADING ? (
            <ActivityIndicator size="large" color={colors.ORANGE} />
          ) : null}

          {this.state.screenState === ScreenState.ERROR ? (
            <GenericError
              errorText={this.state.errorMessage}
              onRetry={this.getLists}
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
    marginBottom: 5,
    marginTop: 24,
    marginHorizontal: 26,
  },

  horizontalListStyle: {
    paddingLeft: 24,
    paddingRight: 21,
    marginBottom: 11,
    paddingBottom: 4,
  },
  horizontalListContainerStyle: {
    marginTop: 10,
    marginBottom: 4,
  },
  discountsHeaderStyle: {
    marginTop: 15,
    marginLeft: 24,
    alignSelf: 'flex-start',
    fontSize: 18,
    color: colors.ITEM_TEXT_GRAY,
    fontWeight: '500',
    marginHorizontal: 6,
    marginBottom: 15,
  },
  productsHeaderStyle: {
    marginBottom: 15,
    marginLeft: 24,
    alignSelf: 'flex-start',
    fontSize: 18,
    color: colors.ITEM_TEXT_GRAY,
    fontWeight: '500',
    marginHorizontal: 6,
  },
  emptyStateContainerStyle: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProductsScreen;
