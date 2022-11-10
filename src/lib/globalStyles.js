var colors = {
  GRAY: '#BCBCBC',
  GREY: '#F2F2F2',
  LIGHT_GRAY: '#9B9B9B',
  LIGHT_BLUE: '#3366BB',
  LIGHTER_GRAY: '#BFBFBF',
  TEXT_LIGHT_GRAY: '#999999',
  ORANGE: '#F27C32',
  LIGHT_ORANGE: '#FFF3EC',
  GREEN: '#18B36A',
  DARK_GREEN: '#0D9E5A',
  SMOOTH_GRAY: '#D3D3D3',
  TURORIAL_TITLE_GRAY: '#515151',
  HINT_GRAY: '#8B8B8B',
  ITEM_TEXT_GRAY: '#5C5C5C',
  GRAY_VARIANT: '#EBEBEB',
  CART_TEXT_COLOR: '#626262',
  CART_QUANTITY_COLOR: '#757575',
  CART_PRICE_COLOR: '#A1A1A1',
  DELIVERY_TIME_COLOR: '#808080',
  DELIVERY_TIME_COLOR_PLUS: '#858585',
  TOTAL_PRICE_TEXT_COLOR: '#5C5C5C',
  DISABLED_BUTTON_COLOR: '#FFEBEB',
  PRODUCT_ITEM_BORDER_GRAY: '#F4F4F4',
  PRODUCT_ITEM_TITLE_GRAY: '#737373',
  MEDIUM_GREEN: '#47A378',
  BORDER_GRAY: '#EAEAEA',
  DARK_GRAY: '#A6A6A6',
  BORDER_COLOR_GRAY: '#F0F0F0',
  FADING_GRAY: '#F9F9F9',
  GRAY_SUGGESTION: '#7D7D7D',
  GRAY_DISABLED: '#DDDDDD',
  MODAL_CLOCE_BUTTON_COLOR: '#F2F2F2',
  GRAY_HEADER: '#7A7A7A',
  TERMS_OF_USE_TEXT_COLOR: '#646464',
  DELEVERY_CACD_BACKGROUND_COLOR: '#FFFCFA',
  PAYMENT_TEXT_COLOR: '#686868',
  REPORT_TEXT_COLOR: '#595959',
  HINT_MESSAGE_ORANGE: '#F88B46',
  DIVIDER_COLOR: '#DADADA',
  LIGHT_PINK: '#F7F7F7',
  DISABLED_GRAY: '#C4C4C4',
  LIGHT_GREEN: '#27AE60',
  LIGHT_ORANGE: '#FD8E481A',
  HORIZONTAL_LINE_COLOR: '#DADADA',
  CLOSE_BUTTON_BACKGROUND_COLOR: '#F2F2F2',
  RED: '#FF5757',
  LIGHT_BLACK: '#00000080',
};

const poppins = {
  fontWeight100: Platform.select({
    ios: {fontWeight: '100'},
    android: {fontFamily: 'Poppins-ExtraLight'},
  }),
  fontWeight300: Platform.select({
    ios: {fontWeight: '300'},
    android: {fontFamily: 'Poppins-Light'},
  }),
  fontWeight400: Platform.select({
    ios: {fontWeight: '400'},
    android: {fontFamily: 'Poppins-Regular'},
  }),
  fontWeight500: Platform.select({
    ios: {fontWeight: '500'},
    android: {fontFamily: 'Poppins-Medium'},
  }),
  fontWeight600: Platform.select({
    ios: {fontWeight: '600'},
    android: {fontFamily: 'Poppins-SemiBold'},
  }),
  fontWeight700: Platform.select({
    ios: {fontWeight: '700'},
    android: {fontFamily: 'Poppins-Bold'},
  }),
  fontWeight800: Platform.select({
    ios: {fontWeight: '800'},
    android: {fontFamily: 'Poppins-ExtraBold'},
  }),

  fontWeightLighter: Platform.select({
    ios: {fontWeight: '100'},
    android: {fontFamily: 'Poppins-ExtraLight'},
  }),
  fontWeightLight: Platform.select({
    ios: {fontWeight: '300'},
    android: {fontFamily: 'Poppins.Light'},
  }),
  fontWeightRegular: Platform.select({
    ios: {fontWeight: '400'},
    android: {fontFamily: 'Poppins-Regular'},
  }),
  fontWeightMedium: Platform.select({
    ios: {fontWeight: '500'},
    android: {fontFamily: 'Poppins-Medium'},
  }),
  fontWeightSemibold: Platform.select({
    ios: {fontWeight: '600'},
    android: {fontFamily: 'Poppins.SemiBold'},
  }),
  fontWeightBold: Platform.select({
    ios: {fontWeight: '700'},
    android: {fontFamily: 'Poppins-Bold'},
  }),
  fontWeightBolder: Platform.select({
    ios: {fontWeight: '800'},
    android: {fontFamily: 'Poppins-ExtraBold'},
  }),
  MODAL_CLOCE_BUTTON_COLOR: '#F2F2F2',
  CONFIRMATION_PRICE_COLOR: '#A2A2A2',
  ORDER_DETAIL_TITLE_COLOR: '#686868',
  CLAIM_TEXT_COLOR: '#595959',
  LIGHT_BLUE: '#3366BB',
};

const GLOBAL_HEADER_STYLE = {
  headerTintColor: 'white',
  headerStyle: {backgroundColor: colors.ORANGE},
  headerBackTitleVisible: false,
  headerTitleAlign: 'center',
  cardStyle: {backgroundColor: 'white'},
};

export {colors, GLOBAL_HEADER_STYLE, poppins};
