import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import RatingBar from 'Wook_Market/src/components/RatingBar';
import FastAddButton from 'Wook_Market/src/components/FastAddButton';
import {formatPrice} from 'Wook_Market/src/lib/util';

const DiscountItem = ({
  title,
  image,
  oldPrice,
  price,
  discountRatio,
  rating,
  state,
  onAdd,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.95}
      backgroundColor="white"
      onPress={onPress}
      style={[styles.containerStyle, style]}>
      <View style={{backgroundColor: 'white', borderRadius: 15, height: 206}}>
        <ImageBackground
          source={{uri: image}}
          style={styles.imageStyle}
          imageStyle={{
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            resizeMode: 'contain',
          }}>
          <View style={styles.circularContainerStyle}>
            <Text
              style={styles.discountRatioStyle}>{`-${discountRatio}%`}</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.oldPriceStyle}>
              {formatPrice(oldPrice)}€
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.priceStyle}>
              {formatPrice(price)}€
            </Text>
          </View>
        </ImageBackground>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.titleStyle}>
          {title}
        </Text>
        <View
          style={{
            marginTop: 'auto',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <RatingBar size={10} rating={rating} style={{marginLeft: 6}} />

          <FastAddButton onAdd={onAdd} state={state} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const DISCOUNT_ITEM_HEIGHT = 206;

const styles = StyleSheet.create({
  containerStyle: {
    shadowOffset: {width: 1, height: 1},
    shadowColor: 'black',
    shadowOpacity: 0.2,
    flex: 1 / 2,
    backgroundColor: 'white',
    elevation: 4,
    height: DISCOUNT_ITEM_HEIGHT,
    borderRadius: 15,
    borderColor: colors.PRODUCT_ITEM_BORDER_GRAY,
  },
  imageStyle: {
    width: '100%',
    justifyContent: 'space-between',
    flexShrink: 1 / 2,
    height: 124,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    resizeMode: 'contain',
  },
  titleStyle: {
    marginRight: 10,
    marginLeft: 10,
    marginTop: 20,
    fontSize: 14,
    fontWeight: '400',
    color: colors.PRODUCT_ITEM_TITLE_GRAY,
  },
  oldPriceStyle: {
    textAlign: 'center',
    textDecorationLine: 'line-through',
    maxWidth: 80,
    marginRight: 9,
    fontSize: 14,
    fontWeight: '500',
    color: colors.ORANGE,
  },
  priceStyle: {
    textAlign: 'center',
    maxWidth: 80,
    marginRight: 5,
    fontSize: 15,
    fontWeight: '500',
    color: colors.MEDIUM_GREEN,
  },
  circularContainerStyle: {
    justifyContent: 'center',
    alignContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 60 / 2,
    backgroundColor: 'white',
    alignSelf: 'flex-end',
    marginRight: 10,
    marginTop: 10,
  },
  discountRatioStyle: {
    fontSize: 16,
    color: colors.ORANGE,
    fontWeight: '600',
    textAlign: 'center',
  },
  priceContainer: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR_GRAY,
    height: 32,
    marginHorizontal: 3,
    top: 16,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DiscountItem;
