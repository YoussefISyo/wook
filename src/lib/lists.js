import {
  request,
  customRequest,
  parallelRequest,
} from 'Wook_Market/src/lib/http';
import {apiUrl} from 'Wook_Market/app.json';

const getSuggestions = async (name, onSuccess, errorCallback, onLoad) => {
  onLoad();
  const url = `${apiUrl}/products`;

  const onComplete = (data) => {
    onSuccess(data.data);
  };

  const onError = (error) => {
    errorCallback(error);
  };

  request({
    method: 'get',
    url: url,
    params: {
      name,
      type: 'autocomplete',
    },
    onComplete: onComplete,
    onError: onError,
    showNetworkError: false,
  });
};

const getCategories = async (page, onSuccess, onError, onLoad, new_open) => {
  onLoad();
  const url = `${apiUrl}/categories?page=${page}`;
  console.log(url);
  const onComplete = (data) => {
    onSuccess({
      list: data.data,
      lastPage: data.last_page,
      version: data.config.version,
      new_open: new_open,
    });
  };

  request({
    method: 'get',
    url: url,
    params: {
      page,
    },
    onComplete: onComplete,
    onError: onError,
    showNetworkError: false,
  });
};

const getProducts = async (page, onSuccess, onError, onLoad, categoryId) => {
  onLoad();
  const url = `${apiUrl}/products`;

  const onComplete = (data) =>
    onSuccess({list: data.data, lastPage: data.last_page});

  request({
    method: 'get',
    url: url,
    params: {
      category: categoryId,
      page,
      exclude_promotions: true,
    },
    onComplete: onComplete,
    onError: onError,
    showNetworkError: false,
  });
};

const getDiscounts = async (page, onSuccess, onError, onLoad, categoryId) => {
  onLoad();
  const url = `${apiUrl}/promotions`;

  const onComplete = (data) =>
    onSuccess({
      list: data.data,
      lastPage: data.last_page,
      minQuantityItems: data.config.MIN_QT_ITEMS,
      minQuantityGrams: data.config.MIN_QT_GRAMS,
    });

  request({
    method: 'get',
    url: url,
    params: categoryId
      ? {
          category: categoryId,
          page,
        }
      : {page},
    onComplete: onComplete,
    onError: onError,
    showNetworkError: false,
  });
};

const getProduct = async (onSuccess, onError, onLoad, id, category) => {
  onLoad();
  const url = `${apiUrl}/products/${id}`;

  const onComplete = (responseOne, responseTwo) => {
    onSuccess(
      {
        item: responseOne.data.product,
        minQuantityItems: responseOne.config.MIN_QT_ITEMS,
        minQuantityGrams: responseOne.config.MIN_QT_GRAMS,
        minBalance: responseOne.config.ORDER_MIN_AMOUNT,
        loyaltyBonusCap: responseOne.config.LOYALTY_BONUS_CAP,
      },
      responseTwo.data,
    );
  };

  parallelRequest({
    calls: [
      customRequest({
        method: 'get',
        url: url,
      }),
      customRequest({
        method: 'get',
        url: apiUrl + '/products',
        params: {
          category: category.id,
          exclude_promotions: true,
          type: 'similar_prods',
        },
      }),
    ],
    onComplete: onComplete,
    onError: onError,
    showNetworkError: false,
  });
};

const getBothProductsAndDiscounts = async (
  discountsPage,
  productsPage,
  onSuccess,
  onError,
  onLoad,
  categoryId,
) => {
  onLoad();

  const productsUrl = `${apiUrl}/products`;
  const discountsUrl = `${apiUrl}/promotions`;

  const onDiscountsComplete = (discountsData) => {
    //get products

    onComplete = (productsData) => {
      //products complete
      const products = productsData.data ?? [];
      const discounts = discountsData.data ?? [];
      const productsLastPage = productsData.last_page;
      const discountsLastPage = discountsData.last_page;

      onSuccess({
        discounts: {list: discounts, lastPage: discountsLastPage},
        products: {list: products, lastPage: productsLastPage},
        minQuantityItems: productsData.config.MIN_QT_ITEMS,
        minQuantityGrams: productsData.config.MIN_QT_GRAMS,
      });
    };

    request({
      method: 'get',
      params: {
        category: categoryId,
        page: productsPage,
        exclude_promotions: true,
      },
      url: productsUrl,
      onComplete: onComplete,
      onError: onError,
      showNetworkError: false,
    });
  };

  //get discounts
  request({
    method: 'get',
    params: {page: discountsPage, category: categoryId},
    url: discountsUrl,
    onComplete: onDiscountsComplete,
    onError: onError,
    showNetworkError: false,
  });
};

const getGroupedProducts = async (page, onSuccess, onError, onLoad) => {
  onLoad();
  const url = `${apiUrl}/grouped/products?page=${page}`;

  const onComplete = (data) => {
    onSuccess({
      list: data.data,
      lastPage: data.last_page,
      minQuantityItems: data.config.MIN_QT_ITEMS,
      minQuantityGrams: data.config.MIN_QT_GRAMS,
    });
  };

  request({
    method: 'get',
    url: url,
    params: {
      page,
    },
    onComplete: onComplete,
    onError: onError,
    showNetworkError: false,
  });
};

const getGroupedProduct = async (onSuccess, onError, onLoad, id) => {
  onLoad();
  const url = `${apiUrl}/grouped/products/${id}`;

  const onComplete = (response) => {
    onSuccess({
      item: response.data.product,
      minQuantityItems: response.data.MIN_QT_ITEMS,
      minQuantityGrams: response.data.MIN_QT_GRAMS,
      minBalance: response.data.ORDER_MIN_AMOUNT,
    });
  };

  request({
    method: 'get',
    url: url,
    onComplete,
    onError: onError,
    showNetworkError: false,
  });
};

const rateProduct = async (
  onSuccess,
  onError,
  onLoad,
  productId,
  rating,
  showNetworkError,
) => {
  onLoad ? onLoad() : null;

  const url = `${apiUrl}/products/${productId}/rate`;

  request({
    method: 'post',
    url,
    data: {
      rating: rating,
    },
    onComplete: (response) => {
      onSuccess ? onSuccess(response.data) : null;
    },
    onError: (error) => {
      onError ? onError(error) : null;
    },
    showNetworkError: showNetworkError ? showNetworkError : true,
  });
};

const searchProduct = async (name, page, onSuccess, onError, onLoad) => {
  onLoad();
  const url = `${apiUrl}/products`;

  const onComplete = (data) => {
    onSuccess({
      list: data.data,
      lastPage: data.last_page,
      minQuantityItems: data.config.MIN_QT_ITEMS,
      minQuantityGrams: data.config.MIN_QT_GRAMS,
    });
  };

  request({
    method: 'get',
    url: url,
    params: {
      page,
      name,
    },
    onComplete: onComplete,
    onError: onError,
    showNetworkError: false,
  });
};

export {
  getCategories,
  getSuggestions,
  getProducts,
  getProduct,
  searchProduct,
  getDiscounts,
  getBothProductsAndDiscounts,
  rateProduct,
  getGroupedProducts,
  getGroupedProduct,
};
