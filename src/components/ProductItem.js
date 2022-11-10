import React from 'react';
import {Text, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import RatingBar from 'Wook_Market/src/components/RatingBar';
import FastAddButton from 'Wook_Market/src/components/FastAddButton';
import {formatPrice} from 'Wook_Market/src/lib/util';

const ProductItem = ({
  title,
  image,
  price,
  rating,
  state,
  onAdd,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.clickContainerStyle, style]}>
      <View backgroundColor="white" style={styles.containerStyle}>
        <Image source={{uri: image}} style={styles.imageStyle} />
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.titleStyle}>
          {title}
        </Text>

        <RatingBar
          size={10}
          rating={rating}
          style={{marginLeft: 10, marginTop: 3, marginBottom: 'auto'}}
        />

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.priceStyle}>
            {formatPrice(price)}€
          </Text>

          <FastAddButton onAdd={onAdd} state={state} />
        </View>
      </View>
    </TouchableOpacity>
  );
};
export const PRODUCT_ITEM_HEIGHT = 206;

const styles = StyleSheet.create({
  clickContainerStyle: {
    shadowOffset: {width: 1, height: 1},
    shadowColor: 'black',
    shadowOpacity: 0.2,
    flex: 1 / 2,
    borderRadius: 15,
    elevation: 4,
    height: PRODUCT_ITEM_HEIGHT,
    backgroundColor: 'white',
  },
  containerStyle: {
    width: '100%',
    backgroundColor: 'white',
    height: 206,
    borderRadius: 15,
  },
  imageStyle: {
    width: '100%',
    flexShrink: 1 / 2,
    height: 124,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    resizeMode: 'contain',
  },
  titleStyle: {
    marginLeft: 10,
    marginTop: 12,
    fontSize: 14,
    fontWeight: '400',
    color: colors.PRODUCT_ITEM_TITLE_GRAY,
  },
  priceStyle: {
    maxWidth: 90,
    marginBottom: 3,
    marginLeft: 10,
    marginRight: 4,
    marginTop: 4,
    fontSize: 18,
    fontWeight: '500',
    color: colors.ORANGE,
  },
});

export default ProductItem;
