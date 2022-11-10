import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import OfferChart from 'Wook_Market/src/components/OfferChart';
import {formatPrice} from 'Wook_Market/src/lib/util';
import {_} from 'Wook_Market/src/lang/i18n';

const OfferStatisticsItem = ({
  firstQuantity,
  secondQuantity,
  lastQuantity,
  firstDiscount,
  secondDiscount,
  lastDiscount,
  numOfOrders,
  initialPrice,
  style,
  circleSize,
  fontSize,
  rectangleSize,
}) => {
  return (
    <View style={[styles.containerStyle, style]}>
      <View style={{marginRight: 10, justifyContent: 'center', flex: 1}}>
        <Text style={styles.titleStyle}>{_('main.ordersNumber')}</Text>
        <View style={styles.priceContainerStyle}>
          <Text style={styles.priceValueStyle}>Prix</Text>
          <Text
            style={
              numOfOrders < firstQuantity
                ? styles.orangePriceTextStyle
                : styles.linedPriceTextStyle
            }>
            {formatPrice(initialPrice)}€
          </Text>
        </View>
      </View>
      <OfferChart
        firstQuantity={firstQuantity}
        secondQuantity={secondQuantity}
        lastQuantity={lastQuantity}
        firstDiscount={firstDiscount}
        secondDiscount={secondDiscount}
        lastDiscount={lastDiscount}
        numOfOrders={numOfOrders}
        size={circleSize}
        fontSize={fontSize}
        rectangleSize={rectangleSize}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingVertical: 6,
    paddingTop: 2,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    height: 70,
    borderRadius: 8,
    borderColor: colors.BORDER_GRAY,
  },
  titleStyle: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.DELIVERY_TIME_COLOR,
  },
  orangePriceTextStyle: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '500',
    color: colors.ORANGE,
  },
  linedPriceTextStyle: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '500',
    color: colors.ORANGE,
    textDecorationLine: 'line-through',
  },
  priceContainerStyle: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceValueStyle: {fontSize: 12, fontWeight: '400', color: colors.ORANGE},
});

export default OfferStatisticsItem;
