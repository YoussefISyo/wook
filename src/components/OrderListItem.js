import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {_} from 'Wook_Market/src/lang/i18n';
import {formatPrice} from 'Wook_Market/src/lib/util';

const OrderLisrItem = ({order, onPress}) => {
  const dateToYMD = (seconds) => {
    const date = new Date(seconds * 1000);
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + y;
  };
  return (
    <TouchableOpacity
      style={$.touchabeStyle}
      activeOpacity={0.7}
      onPress={onPress}>
      <View
        style={$.containerStyle}
        shadowOffset={{width: 1, height: 1}}
        shadowColor="black"
        shadowOpacity={0.2}>
        <Text style={$.textOneStyle}>#{order.id}</Text>
        <Text style={$.textTwoStyle}>{dateToYMD(order.created_at)}</Text>
        <Text style={$.textThreeStyle}>
          {order.products.length}{' '}
          {order.products.length > 1 ? _('login.products') : _('login.product')}
        </Text>
        <Text
          style={[
            $.textTwoStyle,
            {position: 'absolute', bottom: 16, right: 16},
          ]}>
          {formatPrice(order.total)}
          {_('login.currencyType')}

        </Text>
      </View>
    </TouchableOpacity>
  );
};

const $ = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
  },
  textOneStyle: {
    color: colors.ITEM_TEXT_GRAY,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  textTwoStyle: {
    color: colors.LIGHT_GRAY,
    fontSize: 12,
  },
  textThreeStyle: {
    color: colors.ORANGE,
    fontSize: 12,
    position: 'absolute',
    right: 0,
    marginTop: 16,
    marginRight: 16,
  },
  touchabeStyle: {
    elevation: 4,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 16,
    shadowOffset: {width: 1, height: 1},
    shadowColor: 'black',
    shadowOpacity: 0.2,
  },
});

export default OrderLisrItem;
