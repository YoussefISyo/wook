import React, {useState} from 'react';
import {productsCountFromList} from 'Wook_Market/src/lib/util';

const AppContext = React.createContext();

const AppProvider = ({children}) => {
  const [productsCount, setProductsCount] = useState(0);

  const [shouldRefresh, setShouldRefresh] = useState({
    ProductsScreen: false,
    DiscountsScreen: false,
    OffersScreen: false,
    SearchResultScreen: false,
    ProductDetailScreen: true,
    SearchResultScreen: true,
  });

  const updateProductsCount = (products) => {
    setProductsCount(productsCountFromList(products));
  };

  const resetProductsCount = () => {
    setProductsCount(0);
  };

  const getProductsCount = () => {
    return productsCount;
  };

  const activateShouldRefresh = () => {
    setShouldRefresh({
      ProductsScreen: true,
      DiscountsScreen: true,
      OffersScreen: true,
      ProductDetailScreen: true,
      SearchResultScreen: true,
    });
  };

  const activateShouldRefreshOffersScreen = () => {
    setShouldRefresh({...shouldRefresh, OffersScreen: true});
  };

  const activateShouldRefreshProductsScreen = () => {
    setShouldRefresh({...shouldRefresh, ProductsScreen: true});
  };

  const activateShouldRefreshDiscountsScreen = () => {
    setShouldRefresh({...shouldRefresh, DiscountsScreen: true});
  };

  const activateShouldRefreshSearchResultScreen = () => {
    setShouldRefresh({...shouldRefresh, SearchResultScreen: true});
  };

  const activateShouldRefreshProductDetailScreen = () => {
    setShouldRefresh({...shouldRefresh, ProductDetailScreen: true});
  };

  const validateProductsScreenRefresh = () => {
    setShouldRefresh({...shouldRefresh, ProductsScreen: false});
  };

  const validateDiscountsScreenRefresh = () => {
    setShouldRefresh({...shouldRefresh, DiscountsScreen: false});
  };

  const validateOffersScreenRefresh = () => {
    setShouldRefresh({...shouldRefresh, OffersScreen: false});
  };

  const validateSearchResultScreenRefresh = () => {
    setShouldRefresh({...shouldRefresh, SearchResultScreen: false});
  };

  const validateProductDetailScreenRefresh = () => {
    setShouldRefresh({...shouldRefresh, ProductDetailScreen: false});
  };

  const getShouldRefreshProductsScreen = () => shouldRefresh.ProductsScreen;
  const getShouldRefreshDiscountsScreen = () => shouldRefresh.DiscountsScreen;
  const getShouldRefreshOffersScreen = () => shouldRefresh.OffersScreen;
  const getShouldRefreshSearchResultScreen = () =>
    shouldRefresh.SearchResultScreen;
  const getShouldRefreshProductDetailScreen = () =>
    shouldRefresh.ProductDetailScreen;

  return (
    <AppContext.Provider
      value={{
        activateShouldRefresh,
        activateShouldRefreshProductsScreen,
        activateShouldRefreshDiscountsScreen,
        activateShouldRefreshOffersScreen,
        activateShouldRefreshSearchResultScreen,
        activateShouldRefreshProductDetailScreen,
        validateProductsScreenRefresh,
        validateDiscountsScreenRefresh,
        validateOffersScreenRefresh,
        validateSearchResultScreenRefresh,
        validateProductDetailScreenRefresh,
        getShouldRefreshProductsScreen,
        getShouldRefreshDiscountsScreen,
        getShouldRefreshOffersScreen,
        getShouldRefreshSearchResultScreen,
        getShouldRefreshProductDetailScreen,
        updateProductsCount,
        getProductsCount,
        resetProductsCount,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export {AppContext, AppProvider};

//getShouldRefreshProductDetailScreen ,  validateProductDetailScreenRefresh , getShouldRefreshProductDetailScreen
