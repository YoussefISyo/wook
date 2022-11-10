import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import QuantityCircularButton from 'Wook_Market/src/components/QuantityCircularButton';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {KILO_GRAM_UNIT} from 'Wook_Market/src/lib/Constants';
import {
  formatQuantity,
  formatUnit,
  getMaxQuantity,
  getMinQuantity,
} from 'Wook_Market/src/lib/util';

const QuantitySection = ({
  onQuantityPress,
  onIncrementPress,
  onDecrementPress,
  unit,
  quantity,
  maxQuantity,
  minQuantityGrams,
  minQuantityItems,
  style,
}) => {
  return (
    <View style={[styles.quantityContainerStyle, style]}>
      <QuantityCircularButton
        enabled={
          quantity > getMinQuantity(unit, minQuantityItems, minQuantityGrams)
        }
        style={styles.buttonMinusStyle}
        icon={MINUS_ICON}
        onPress={onDecrementPress}
      />

      <TouchableOpacity
        onPress={onQuantityPress}
        activeOpacity={0.7}
        style={styles.quantityView}>
        <Text
          numberOfLines={1}
          style={[styles.selectionQuantityText, {minWidth: 35}]}>
          {formatQuantity(unit, quantity)}
        </Text>

        {unit === KILO_GRAM_UNIT ? (
          <Text style={[styles.selectionQuantityText, {minWidth: 20}]}>
            {formatUnit(unit, quantity)}
          </Text>
        ) : null}
      </TouchableOpacity>

      <QuantityCircularButton
        enabled={
          maxQuantity ? quantity < getMaxQuantity(unit, maxQuantity) : true
        }
        style={styles.buttonPlusStyle}
        icon={PLUS_ICON}
        onPress={onIncrementPress}
      />
    </View>
  );
};

export default QuantitySection;

const styles = StyleSheet.create({
  quantityView: {
    height: 34,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 4,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: colors.GRAY_VARIANT,
  },
  selectionQuantityText: {
    fontSize: 16,
    color: colors.CART_QUANTITY_COLOR,
    fontWeight: '400',
    textAlign: 'center',
  },
  buttonMinusStyle: {
    minWidth: 34,
    height: 34,
    backgroundColor: 'white',
    borderColor: colors.GRAY_VARIANT,
    borderWidth: 1.5,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
  },
  buttonPlusStyle: {
    minWidth: 34,
    height: 34,
    backgroundColor: 'white',
    borderColor: colors.GRAY_VARIANT,
    borderWidth: 1.5,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
  },
  quantityContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
