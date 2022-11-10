import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import CircularButton from 'Wook_Market/src/components/CircularButton';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {_} from 'Wook_Market/src/lang/i18n';
import {formatPrice} from 'Wook_Market/src/lib/util';

const REMOVE = require('Wook_Market/src/assets/icons/delete_product_icon.png');
const PLUS = require('Wook_Market/src/assets/icons/plus_icon.png');
const MINUS = require('Wook_Market/src/assets/icons/minus_icon.png');

const CartListItem = ({
  product,
  onPressRemove,
  onPressCounter,
  minQtItems,
  minQtGrams,
  onEditQuantityClick,
}) => {
  const handleDecrementCounter = () => {
    if (product.quantity > minQtItems && product.unit === 'items') {
      onPressCounter(product.id, product.quantity - 1, product.price, 'minus');
    }
    if (product.quantity * 1000 > minQtGrams && product.unit === 'kg') {
      onPressCounter(
        product.id,
        product.quantity - 0.1,
        product.price,
        'minus',
      );
    }
  };
  const handleGroupedProductIncrementCounter = () => {
    if (product.unit === 'items') {
      onPressCounter(product.id, product.quantity + 1, product.price, 'add');
    }

    if (product.unit === 'kg') {
      onPressCounter(product.id, product.quantity + 0.1, product.price, 'add');
    }
  };
  const handleIncrementCounter = () => {
    if (product.quantity < product.quantity_max && product.unit === 'items') {
      onPressCounter(product.id, product.quantity + 1, product.price, 'add');
    }

    if (product.quantity < product.quantity_max && product.unit === 'kg') {
      onPressCounter(product.id, product.quantity + 0.1, product.price, 'add');
    }
  };
  const displayQuantity = (unit, quantity) => {
    if (unit === 'items') return `${quantity}`;
    if (unit === 'kg') {
      if (quantity < 1.0) {
        return `${quantity * 1000}g`;
      } else {
        return `${quantity}kg`;
      }
    }
  };
  const toggleDecrimentButton = () => {
    if (product.unit === 'items') {
      if (product.quantity > minQtItems) {
        return true;
      } else {
        return false;
      }
    }

    if (product.unit === 'kg') {
      if (product.quantity * 1000 > minQtGrams) {
        return true;
      } else {
        return false;
      }
    }
  };
  return (
    <View>
      <View style={$.outerContainerStyle}>
        <View style={$.containerOneStyle}>
          <Image source={{uri: product.image}} style={$.imageStyle} />
          <View style={$.containerTwoStyle}>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={$.textThreeStyle}>
              {product.name}
            </Text>
            <View style={$.containerThreeStyle}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={$.textTwoStyle}>
                {formatPrice(product.price * product.quantity)}
                {_('login.currencyType')}
              </Text>
            </View>
            {product.error_message ? (
              <Text style={$.textStyleFour}>{product.error_message}</Text>
            ) : null}
            <View style={{flexDirection: 'row', marginTop: 8}}>
              <CircularButton
                style={[
                  $.buttonOneStyle,
                  toggleDecrimentButton()
                    ? null
                    : {backgroundColor: colors.GRAY_DISABLED, borderWidth: 0},
                ]}
                elevation={false}
                image={MINUS}
                onPress={() => {
                  handleDecrementCounter();
                }}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onEditQuantityClick}
                style={$.quantityContainerStyle}>
                <Text style={$.textOneStyle}>
                  {displayQuantity(product.unit, product.quantity)}
                </Text>
              </TouchableOpacity>
              <CircularButton
                style={[
                  $.buttonTwoStyle,
                  product.quantity >= product.quantity_max &&
                  product.type !== 'grouped'
                    ? {backgroundColor: colors.GRAY_DISABLED, borderWidth: 0}
                    : null,
                ]}
                elevation={false}
                image={PLUS}
                onPress={() => {
                  product.type === 'grouped'
                    ? handleGroupedProductIncrementCounter()
                    : handleIncrementCounter();
                }}
              />
            </View>
          </View>
        </View>
      </View>
      <CircularButton
        style={{position: 'absolute', right: 0}}
        elevation={true}
        image={REMOVE}
        onPress={() => {
          onPressRemove();
        }}
      />
    </View>
  );
};

const $ = StyleSheet.create({
  outerContainerStyle: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    margin: 10,
    backgroundColor: 'white',
    elevation: 2,
    shadowOffset: {width: 0.2, height: 0.2},
    shadowColor: 'black',
    shadowOpacity: 0.1,
  },
  containerOneStyle: {
    flexDirection: 'row',
  },
  imageStyle: {
    width: 100,
    height: 90,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  containerTwoStyle: {
    alignSelf: 'center',
    marginLeft: 10,
    flex: 1,
  },
  buttonOneStyle: {
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
  buttonTwoStyle: {
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
  textOneStyle: {
    fontSize: 12,
    borderColor: colors.GRAY_VARIANT,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.CART_QUANTITY_COLOR,
  },
  quantityContainerStyle: {
    width: 45,
    height: 34,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: colors.GRAY_VARIANT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTwoStyle: {
    fontSize: 14,
    color: colors.CART_PRICE_COLOR,
  },
  textThreeStyle: {
    fontSize: 18,
    marginBottom: 4,
    color: colors.CART_TEXT_COLOR,
    marginEnd: 4,
  },
  textStyleFour: {
    fontSize: 12,
    color: 'red',
    marginTop: 2,
  },
});

export default CartListItem;