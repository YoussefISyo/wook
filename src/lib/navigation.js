import React, {useEffect, useContext} from 'react';

import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {AppContext} from 'Wook_Market/src/lib/AppContext';
import {navigationRef, isReadyRef} from 'Wook_Market/src/lib/RootNavigation';
import NetInfo from '@react-native-community/netinfo';
import {getCardItems} from 'Wook_Market/src/lib/cart';

import CategoriesScreen from 'Wook_Market/src/screens/main/CategoriesScreen';
import OrdersScreen from 'Wook_Market/src/screens/main/OrdersScreen';
import OrderDetailScreen from 'Wook_Market/src/screens/main/OrderDetailScreen';
import ProductDetailScreen from 'Wook_Market/src/screens/main/ProductDetailScreen';
import ProductsScreen from 'Wook_Market/src/screens/main/ProductsScreen';
import SearchResultScreen from 'Wook_Market/src/screens/main/SearchResultScreen';
import TurorialScreen from 'Wook_Market/src/screens/tutorial/TutorialScreen';
import LoginScreen from 'Wook_Market/src/screens/auth/LoginScreen';
import RegisterProScreen from 'Wook_Market/src/screens/auth/RegisterProScreen';
import LoginFromMainScreen from 'Wook_Market/src/screens/main/LoginFromMainScreen';
import RegisterScreen from 'Wook_Market/src/screens/auth/RegisterScreen';
import ChangePasswordScreen from 'Wook_Market/src/screens/auth/ChangePasswordScreen';
import VerifyEmailScreen from 'Wook_Market/src/screens/auth/VerifyEmailScreen';
import ResetPasswordScreen from 'Wook_Market/src/screens/auth/ResetPasswordScreen';
import OffersScreen from 'Wook_Market/src/screens/main/OffersScreen';
import OfferDetailScreen from 'Wook_Market/src/screens/main/OfferDetailScreen';
import DiscountsScreen from 'Wook_Market/src/screens/main/DiscountsScreen';
import MyCartScreen from 'Wook_Market/src/screens/main/MyCartScreen';
import PaymentConfirmationScreen from 'Wook_Market/src/screens/main/PaymentConfirmationScreen';
import DeliveryAddressScreen from 'Wook_Market/src/screens/main/DeliveryAddressScreen';
import PaymentMethodScreen from 'Wook_Market/src/screens/main/PaymentMethodScreen';
import PaymentScreen from 'Wook_Market/src/screens/main/PaymentScreen';
import ProfileScreen from 'Wook_Market/src/screens/main/ProfileScreen';
import EditProfileScreen from 'Wook_Market/src/screens/main/EditProfileScreen';
import EditProfileProScreen from 'Wook_Market/src/screens/main/EditProfileProScreen';
import RegisterProFromMainScreen from 'Wook_Market/src/screens/main/RegisterProFromMainScreen';
import TermsOfUseScreen from 'Wook_Market/src/screens/auth/TermsOfUseScreen';
import CustomDrawerContent from 'Wook_Market/src/components/CustomDrawerContent';
import RegisterFromMainScreen from 'Wook_Market/src/screens/main/RegisterFromMainScreen';
import PayAndGoScreen from 'Wook_Market/src/screens/main/PayAndGoScreen';
import PurchaseScreen from 'Wook_Market/src/screens/main/PurchaseScreen';
import CameraScreen from 'Wook_Market/src/screens/main/CameraScreen';
import Reception from '../screens/Reception';
import {GLOBAL_HEADER_STYLE, colors} from 'Wook_Market/src/lib/globalStyles';
import TabBarIcon from 'Wook_Market/src/components/TabBarIcon';
import {_} from 'Wook_Market/src/lang/i18n';
import {getToken} from 'Wook_Market/src/lib/authentication';
import BackButton from 'Wook_Market/src/components/BackButton';
import DrawerIcon from 'Wook_Market/src/components/DrawerIcon';

const MY_CART_OPTIONS = {title: _('main.myCart')};
const PAYMENT_CONFIRMATION_OPTIONS = {title: _('main.paymentConfirmation')};
const ORDERS_OPTIONS = {title: _('main.myOrders')};
const PAYMENT_OPTIONS = {title: _('main.payment')};
const PAYMENT_METHOD_OPTIONS = {title: _('main.paymentMethod')};
const DELIVERY_ADDRESS_OPTIONS = {title: _('login.deliveryAddress')};
const CAMERA_OPTIONS = {headerShown: false};
const TERMES_OF_USE_OPTIONS = {
  title: _('auth.TermsOfUse'),
  headerShown: true,
  headerBackTitleVisible: true,
  headerTintColor: 'white',
  headerStyle: {backgroundColor: colors.ORANGE},
  headerBackTitleVisible: false,
  headerTitleAlign: 'center',
  cardStyle: {backgroundColor: 'white'},
};
const LOGIN_FROM_MAIN_OPTIONS = {
  headerShown: false,
};
const PROFILE_OPTIONS = {title: _('main.profile')};
const EDIT_PROFILE_OPTIONS = {title: _('main.editProfile')};
const OFFERS_OPTIONS = {title: _('main.gropedPuchase')};
const DISCOUNTS_OPTIONS = {title: _('main.promontion')};
const PURCHASE_OPTIONS = {title: _('main.purchase')};
const PAY_AND_GO_OPTIONS = {title: _('main.payAndGo')};

const CART_ACTIVE = require('Wook_Market/src/assets/icons/cart_active_icon.png');
const CART = require('Wook_Market/src/assets/icons/cart_icon.png');
const GROUPE_ACTIVE = require('Wook_Market/src/assets/icons/group_active_icon.png');
const GROUPE = require('Wook_Market/src/assets/icons/group_icon.png');
const OFFERS_ACTIVE = require('Wook_Market/src/assets/icons/offers_active_icon.png');
const OFFERS = require('Wook_Market/src/assets/icons/offers_icon.png');
const PRODUCTS_ACTIVE = require('Wook_Market/src/assets/icons/products_active_icon.png');
const PRODUCTS = require('Wook_Market/src/assets/icons/products_icon.png');
const BACK_WHTE_ICON = require('Wook_Market/src/assets/icons/back_white_icon.png');

const MY_ORDERS_ACTIVE = require('Wook_Market/src/assets/icons/icn_my_orders_active.png');
const MY_ORDERS = require('Wook_Market/src/assets/icons/icn_my_orders_inactive.png');

const setTabBarIcon = (imageActive, imageInActive, focused, size) => {
  return (
    <TabBarIcon
      focused={focused}
      size={size}
      activeSource={imageActive}
      source={imageInActive}
    />
  );
};

const _setNavigationOptions = (navigation, title) => {
  return {
    title: title,
    headerLeft: () => {
      return (
        <BackButton onPress={() => navigation.pop()} image={BACK_WHTE_ICON} />
      );
    },
  };
};

const _setCategoriesNavigationOptions = (navigation) => {
  return {
    title: _('main.categories'),
    headerLeft: () => {
      return (
        <DrawerIcon
          onPress={() => {
            console.log('drawerIcon Pressed');
            navigation.openDrawer();
          }}
        />
      );
    },
  };
};

const AuthStack = createStackNavigator();

export const authStackNavigator = () => {
  return (
    <AuthStack.Navigator
      name="Auth"
      initialRouteName="Login"
      screenOptions={{headerShown: false, headerBackTitleVisible: false}}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
      />
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="RegisterPro" component={RegisterProScreen} />

      <AuthStack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      <AuthStack.Screen
        options={TERMES_OF_USE_OPTIONS}
        name="TermsOfUse"
        component={TermsOfUseScreen}
      />
    </AuthStack.Navigator>
  );
};

const TutorialStack = createStackNavigator();

export const tutorialStackNavigator = () => {
  return (
    <TutorialStack.Navigator
      name="TutorialStack"
      initialRouteName="Tutorial"
      screenOptions={{headerBackTitleVisible: false, headerShown: false}}>
      <TutorialStack.Screen name="Tutorial" component={TurorialScreen} />
    </TutorialStack.Navigator>
  );
};

const hiddenTab = new Set([
  'Profil',
  'EditProfile',
  'SearchResult',
  'DeliveryAddress',
  'PaymentMethod',
  //'Orders',
  'LoginFromMain',
  'RegisterFromMain',
  'PaymentConfirmation',
  'Payment',
  'OrderDetail',
  'DeliveryAddressFromTab',
  'PaymentConfirmationFromDetail',
  'PaymentMethodFromTab',
  'Purchase',
  'PayAndGo',
  'Camera',
]);

getTabBarVisibility = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? '';
  return !hiddenTab.has(routeName);
};

const Tab = createBottomTabNavigator();

export const tabNavigator = () => {
  return (
    <AppContext.Consumer>
      {({getProductsCount}) => (
        <Tab.Navigator
          name="Tab"
          initialRouteName="ProductsTab"
          backBehavior="initialRoute"
          tabBarOptions={{
            keyboardHidesTabBar: true,
          }}>
          <Tab.Screen
            name="ProductsTab"
            children={productsStackNavigator}
            options={({route}) => ({
              title: _('main.products'),
              tabBarIcon: ({focused, color, size}) =>
                setTabBarIcon(PRODUCTS_ACTIVE, PRODUCTS, focused, size),
              tabBarVisible: this.getTabBarVisibility(route),
            })}
          />

          <Tab.Screen
            name="DiscountsTab"
            children={discountsStackNavigator}
            options={({route}) => ({
              title: _('main.promontion'),
              tabBarIcon: ({focused, color, size}) =>
                setTabBarIcon(OFFERS_ACTIVE, OFFERS, focused, size),
              tabBarVisible: this.getTabBarVisibility(route),
            })}
          />
          <Tab.Screen
            name="PanelTab"
            children={panelStackNavigator}
            listeners={({navigation, route}) => ({
              tabPress: async (e) => {
                e.preventDefault();
                const token = await getToken();
                if (token === null) {
                  navigation.navigate('LoginFromMain');
                } else {
                  navigation.navigate('PanelTab');
                }
              },
            })}
            options={({route}) => ({
              title: _('main.myCart'),
              tabBarIcon: ({focused, color, size}) =>
                setTabBarIcon(CART_ACTIVE, CART, focused, size),
              tabBarVisible: this.getTabBarVisibility(route),
              tabBarBadge:
                getProductsCount() === 0
                  ? null
                  : getProductsCount() > 99
                  ? '+99'
                  : getProductsCount(),
            })}
          />
          <Tab.Screen
            name="OrdersTab"
            children={ordersStackNavigator}
            listeners={({navigation, route}) => ({
              tabPress: async (e) => {
                e.preventDefault();
                const token = await getToken();
                if (token === null) {
                  navigation.navigate('LoginFromMain');
                } else {
                  navigation.navigate('OrdersTab');
                }
              },
            })}
            options={({route}) => ({
              title: _('main.myOrders'),
              tabBarIcon: ({focused, color, size}) =>
                setTabBarIcon(MY_ORDERS_ACTIVE, MY_ORDERS, focused, size),
              tabBarVisible: this.getTabBarVisibility(route),
            })}
          />
        </Tab.Navigator>
      )}
    </AppContext.Consumer>
  );
};

const ProductsStack = createStackNavigator();

const productsStackNavigator = (props) => {
  return (
    <ProductsStack.Navigator
      name="ProductsTab"
      initialRouteName="Categories"
      screenOptions={GLOBAL_HEADER_STYLE}>
      <ProductsStack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={({navigation}) => _setCategoriesNavigationOptions(navigation)}
      />
      <ProductsStack.Screen
        name="Products"
        component={ProductsScreen}
        options={({navigation, route}) =>
          _setNavigationOptions(navigation, route.params.category.name)
        }
      />
      <ProductsStack.Screen
        name="Profil"
        component={ProfileScreen}
        options={PROFILE_OPTIONS}
      />
      <ProductsStack.Screen
        name="EditProfile"
        options={EDIT_PROFILE_OPTIONS}
        component={EditProfileScreen}
      />
      <ProductsStack.Screen
        name="EditProfilePro"
        options={EDIT_PROFILE_OPTIONS}
        component={EditProfileProScreen}
      />
      <ProductsStack.Screen
        name="SearchResult"
        component={SearchResultScreen}
        options={({navigation}) =>
          _setNavigationOptions(navigation, _('main.searchResult'))
        }
      />
      <ProductsStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={({navigation, route}) =>
          _setNavigationOptions(navigation, route.params.item.name)
        }
      />
      <ProductsStack.Screen
        name="DeliveryAddress"
        component={DeliveryAddressScreen}
        options={DELIVERY_ADDRESS_OPTIONS}
      />
      <ProductsStack.Screen
        name="PaymentMethod"
        component={PaymentMethodScreen}
        options={PAYMENT_METHOD_OPTIONS}
      />
      <ProductsStack.Screen
        name="Orders"
        component={OrdersScreen}
        options={ORDERS_OPTIONS}
      />
      <ProductsStack.Screen name="OrderDetail" component={OrderDetailScreen} />

      <ProductsStack.Screen
        name="LoginFromMain"
        component={LoginFromMainScreen}
        options={LOGIN_FROM_MAIN_OPTIONS}
      />
      <ProductsStack.Screen
        name="RegisterFromMain"
        component={RegisterFromMainScreen}
        options={LOGIN_FROM_MAIN_OPTIONS}
      />
      <ProductsStack.Screen
        name="RegisterProFromMain"
        component={RegisterProFromMainScreen}
        options={LOGIN_FROM_MAIN_OPTIONS}
      />
      <ProductsStack.Screen
        name="PaymentConfirmationFromDetail"
        component={PaymentConfirmationScreen}
        options={PAYMENT_CONFIRMATION_OPTIONS}
      />
      <ProductsStack.Screen
        name="Payment"
        component={PaymentScreen}
        options={PAYMENT_OPTIONS}
      />
      <ProductsStack.Screen
        name="DeliveryAddressFromTab"
        component={DeliveryAddressScreen}
        options={DELIVERY_ADDRESS_OPTIONS}
      />
      <ProductsStack.Screen
        name="PaymentMethodFromTab"
        component={PaymentMethodScreen}
        options={PAYMENT_METHOD_OPTIONS}
      />
      <ProductsStack.Screen
        name="PayAndGo"
        component={PayAndGoScreen}
        options={PAY_AND_GO_OPTIONS}
      />
      <ProductsStack.Screen
        name="Camera"
        component={CameraScreen}
        options={CAMERA_OPTIONS}
      />
    </ProductsStack.Navigator>
  );
};

const ordersStack = createStackNavigator();

const ordersStackNavigator = () => {
  return (
    <ordersStack.Navigator
      name="OrdersTab"
      initialRouteName="Orders"
      screenOptions={GLOBAL_HEADER_STYLE}>
      <ProductsStack.Screen
        name="Orders"
        component={OrdersScreen}
        options={ORDERS_OPTIONS}
      />
      <ProductsStack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </ordersStack.Navigator>
  );
};
const GroupsStack = createStackNavigator();

const groupsStackNavigator = () => {
  return (
    <GroupsStack.Navigator
      name="GroupsTab"
      initialRouteName="Offers"
      screenOptions={GLOBAL_HEADER_STYLE}>
      <GroupsStack.Screen
        name="Offers"
        component={OffersScreen}
        options={OFFERS_OPTIONS}
      />
      <GroupsStack.Screen
        name="OfferDetail"
        component={OfferDetailScreen}
        options={({navigation, route}) =>
          _setNavigationOptions(navigation, route.params.item.name)
        }
      />
      <GroupsStack.Screen
        name="SearchResult"
        component={SearchResultScreen}
        options={({navigation}) =>
          _setNavigationOptions(navigation, _('main.searchResult'))
        }
      />
      <ProductsStack.Screen
        name="LoginFromMain"
        component={LoginFromMainScreen}
        options={LOGIN_FROM_MAIN_OPTIONS}
      />
      <ProductsStack.Screen
        name="RegisterFromMain"
        component={RegisterFromMainScreen}
        options={LOGIN_FROM_MAIN_OPTIONS}
      />
      <ProductsStack.Screen
        name="RegisterProFromMain"
        component={RegisterProFromMainScreen}
        options={LOGIN_FROM_MAIN_OPTIONS}
      />
    </GroupsStack.Navigator>
  );
};

const DiscountsStack = createStackNavigator();

const discountsStackNavigator = () => {
  return (
    <DiscountsStack.Navigator
      name="DiscountsTab"
      initialRouteName="Discounts"
      screenOptions={GLOBAL_HEADER_STYLE}>
      <DiscountsStack.Screen
        name="Discounts"
        component={DiscountsScreen}
        options={DISCOUNTS_OPTIONS}
      />
      <DiscountsStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={({navigation, route}) =>
          _setNavigationOptions(navigation, route.params.item.name)
        }
      />
      <DiscountsStack.Screen
        name="SearchResult"
        component={SearchResultScreen}
        options={({navigation}) =>
          _setNavigationOptions(navigation, _('main.searchResult'))
        }
      />
      <DiscountsStack.Screen
        name="PaymentConfirmationFromDetail"
        component={PaymentConfirmationScreen}
        options={PAYMENT_CONFIRMATION_OPTIONS}
      />
      <DiscountsStack.Screen
        name="Payment"
        component={PaymentScreen}
        options={PAYMENT_OPTIONS}
      />

      <PanelStack.Screen
        name="DeliveryAddressFromTab"
        component={DeliveryAddressScreen}
        options={DELIVERY_ADDRESS_OPTIONS}
      />
      <PanelStack.Screen
        name="PaymentMethodFromTab"
        component={PaymentMethodScreen}
        options={PAYMENT_METHOD_OPTIONS}
      />

      <ProductsStack.Screen
        name="LoginFromMain"
        component={LoginFromMainScreen}
        options={LOGIN_FROM_MAIN_OPTIONS}
      />
      <ProductsStack.Screen
        name="RegisterFromMain"
        component={RegisterFromMainScreen}
        options={LOGIN_FROM_MAIN_OPTIONS}
      />
      <ProductsStack.Screen
        name="RegisterProFromMain"
        component={RegisterProFromMainScreen}
        options={LOGIN_FROM_MAIN_OPTIONS}
      />
    </DiscountsStack.Navigator>
  );
};

const PanelStack = createStackNavigator();

const panelStackNavigator = () => {
  return (
    <PanelStack.Navigator
      name="Panel"
      initialRouteName="MyCart"
      screenOptions={GLOBAL_HEADER_STYLE}>
      <PanelStack.Screen
        name="MyCart"
        component={MyCartScreen}
        options={MY_CART_OPTIONS}
      />
      <PanelStack.Screen
        name="PaymentConfirmation"
        component={PaymentConfirmationScreen}
        options={PAYMENT_CONFIRMATION_OPTIONS}
      />
      <PanelStack.Screen
        name="Payment"
        component={PaymentScreen}
        options={PAYMENT_OPTIONS}
      />
      <PanelStack.Screen
        name="DeliveryAddressFromTab"
        component={DeliveryAddressScreen}
        options={DELIVERY_ADDRESS_OPTIONS}
      />
      <PanelStack.Screen
        name="PaymentMethodFromTab"
        component={PaymentMethodScreen}
        options={PAYMENT_METHOD_OPTIONS}
      />
      <PanelStack.Screen
        name="SearchResult"
        component={SearchResultScreen}
        options={({navigation}) =>
          _setNavigationOptions(navigation, _('main.searchResult'))
        }
      />
      <PanelStack.Screen
        name="OrdersFromPanel"
        component={OrdersScreen}
        options={ORDERS_OPTIONS}
      />
      <PanelStack.Screen
        name="Purchase"
        component={PurchaseScreen}
        options={PURCHASE_OPTIONS}
      />
    </PanelStack.Navigator>
  );
};

const disabledDrawer = new Set([
  'Products',
  'ProductDetail',
  'Profil',
  'EditProfile',
  'SearchResult',
  'DeliveryAddress',
  'PaymentMethod',
  'Orders',
  'LoginFromMain',
  'RegisterFromMain',
  'RegisterProFromMain',

  'OfferDetail',
  'PaymentConfirmation',
  'Payment',
  'OrderDetail',
  'DeliveryAddressFromTab',
  'PaymentConfirmationFromDetail',
  'PaymentMethodFromTab',
]);

getDrawerIsEnabled = (route, navigation) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? '';
  // console.log('navigation index: ', navigation.state);
  // console.log({route});
  // console.log('route name: '.routeName);
  // console.log('isEnabled: ', !disabledDrawer.has(routeName));
  return !disabledDrawer.has(routeName);
};

const Drawer = createDrawerNavigator();

const mainDrawerNavigator = () => {
  const context = useContext(AppContext);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        getCardItems(
          ({data}, salePoints) => {
            context.updateProductsCount(data.products);
          },
          () => {},
        );
      }
    });

    return function cleanup() {
      unsubscribe();
      context.resetProductsCount();
    };
  }, []);

  return (
    <Drawer.Navigator
      name="Main"
      initialRouteName="Tab"
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="Tab"
        children={tabNavigator}
        options={({route, navigation}) => ({
          gestureEnabled: getDrawerIsEnabled(route, navigation),
        })}
      />
    </Drawer.Navigator>
  );
};

const appTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.ORANGE,
  },
};

const AppStack = createStackNavigator();

export const AppStackNavigator = () => {
  useEffect(() => {
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
      theme={appTheme}>
      <AppStack.Navigator
        name="App"
        initialRouteName="Reception"
        screenOptions={{
          headerShown: false,
          headerBackTitleVisible: false,
        }}>
        <AppStack.Screen name="Reception" component={Reception} />

        <AppStack.Screen
          name="TutorialStack"
          children={tutorialStackNavigator}
        />

        <AppStack.Screen name="Auth" children={authStackNavigator} />
        <AppStack.Screen name="Main" children={mainDrawerNavigator} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};
