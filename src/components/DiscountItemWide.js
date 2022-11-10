import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import FastAddButton from 'Wook_Market/src/components/FastAddButton';
import {formatPrice} from 'Wook_Market/src/lib/util';

const DiscountItemWide = ({
  title,
  image,
  oldPrice,
  price,
  state,
  onAdd,
  onPress,
  discountRatio,
  style,
  displayDiscount = true,
}) => {
  return (
    <TouchableOpacity
      backgroundColor="white"
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.clickContainerStyle, style]}>
      <View style={styles.containerStyle}>
        <ImageBackground
          source={{uri: image}}
          imageStyle={{
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            resizeMode: 'contain',
          }}
          style={styles.backgroundImageStyle}>
          {displayDiscount ? (
            <View style={styles.circularContainerStyle}>
              <Text
                style={styles.discountRatioStyle}>{`-${discountRatio}%`}</Text>
            </View>
          ) : null}
        </ImageBackground>

        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.titleTextStyle}>
          {title}
        </Text>

        <View style={styles.bottomContainerStyle}>
          <View style={styles.pricesContainerStyle}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                styles.oldPriceStyle,
                displayDiscount
                  ? null
                  : {textDecorationLine: 'none', fontSize: 16},
              ]}>
              {formatPrice(oldPrice)}€
            </Text>

            {displayDiscount ? (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.priceStyle}>
                {formatPrice(price)}€
              </Text>
            ) : null}
          </View>

          <FastAddButton style={{width: 49}} state={state} onAdd={onAdd} />
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
    width: 282,
    elevation: 4,
    borderRadius: 15,
    backgroundColor: 'white',
    marginTop: 1,
  },
  containerStyle: {
    backgroundColor: 'white',
    width: 282,
    borderRadius: 15,
  },
  backgroundImageStyle: {
    flexDirection: 'row',
    width: '100%',
    height: 129,
    resizeMode: 'contain',
  },
  discountRatioStyle: {
    fontSize: 18,
    color: colors.ORANGE,
    fontWeight: '700',
    textAlign: 'center',
  },
  titleTextStyle: {
    marginLeft: 18,
    marginTop: 9,
    fontSize: 16,
    fontWeight: '400',
    color: colors.PRODUCT_ITEM_TITLE_GRAY,
  },
  bottomContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circularContainerStyle: {
    justifyContent: 'center',
    alignContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    marginLeft: 34,
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  pricesContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  oldPriceStyle: {
    maxWidth: 80,
    marginLeft: 18,
    marginRight: 4,
    fontSize: 15,
    fontWeight: '500',
    color: colors.ORANGE,
    textDecorationLine: 'line-through',
  },
  priceStyle: {
    maxWidth: 80,
    marginLeft: 10,
    marginRight: 4,
    fontSize: 18,
    fontWeight: '500',
    color: colors.MEDIUM_GREEN,
  },
});

export default DiscountItemWide;
