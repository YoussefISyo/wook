import React from 'react';
import {Text, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {WINDOW_WIDTH} from 'Wook_Market/src/lib/Constants';
import RatingBar from 'Wook_Market/src/components/RatingBar';
import FastAddButton from './FastAddButton';
import OfferStatisticsItem from 'Wook_Market/src/components/OfferStatisticsItem';
import {_} from 'Wook_Market/src/lang/i18n';

const itemWidth = WINDOW_WIDTH * 0.85;

const OfferItem = ({
  title,
  image,
  firstQuantity,
  secondQuantity,
  lastQuantity,
  firstDiscount,
  secondDiscount,
  lastDiscount,
  numOfOrders,
  initialPrice,
  expiresIn,
  state,
  onAdd,
  onPress,
  style,
  innerStyle,
}) => {
  return (
    <TouchableOpacity
      shadowOffset={{width: 1, height: 1}}
      shadowColor="black"
      shadowOpacity={0.2}
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.clickContainerStyle, style]}>
      <View style={styles.containerStyle}>
        <Image source={{uri: image}} style={styles.imageStyle} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
            marginHorizontal: 8,
          }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.titleStyle}>
            {title}
          </Text>
        </View>

        <OfferStatisticsItem
          firstQuantity={firstQuantity}
          secondQuantity={secondQuantity}
          lastQuantity={lastQuantity}
          firstDiscount={firstDiscount}
          secondDiscount={secondDiscount}
          lastDiscount={lastDiscount}
          numOfOrders={numOfOrders}
          initialPrice={initialPrice}
          style={[styles.statisticsViewStyle, innerStyle]}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <View
            style={{
              marginLeft: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <Text style={styles.expirationTextStyle}>
              {_('main.expiresIn')}
            </Text>
            <Text style={{...styles.expirationTextStyle, color: colors.ORANGE}}>
              {expiresIn}
            </Text>
          </View>

          <FastAddButton state={state} onAdd={onAdd} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  clickContainerStyle: {
    shadowOffset: {width: 1, height: 1},
    shadowColor: 'black',
    shadowOpacity: 0.2,
    backgroundColor: 'white',
    elevation: 2,
    width: itemWidth,
    borderRadius: 15,
  },
  containerStyle: {
    backgroundColor: 'white',
    width: itemWidth,
    borderRadius: 15,
  },
  statisticsViewStyle: {
    marginTop: 10,
    marginHorizontal: 8,
    paddingVertical: 0,
  },

  imageStyle: {
    width: '100%',
    aspectRatio: 5 / 2,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    resizeMode: 'contain',
  },
  titleStyle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.PRODUCT_ITEM_TITLE_GRAY,
  },
  priceStyle: {
    maxWidth: 90,
    marginLeft: 10,
    marginRight: 4,
    marginTop: 4,
    fontSize: 18,
    fontWeight: '500',
    color: colors.ORANGE,
  },
  expirationTextStyle: {
    marginRight: 4,
    fontSize: 13,
    color: colors.DELIVERY_TIME_COLOR,
    fontWeight: '400',
  },
});

export default OfferItem;
