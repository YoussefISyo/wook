import React from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import GenericButton from 'Wook_Market/src/components/GenericButton';
import Modal from 'react-native-modal';
import CircularButton from 'Wook_Market/src/components/CircularButton';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {_} from 'Wook_Market/src/lang/i18n';

const CLOSE = require('Wook_Market/src/assets/icons/close_popup_icon.png');

const MyCartModal = ({
  isVisible,
  onClosePress,
  onConfirmPress,
  item,
  loading = false,
  enabled = true,
}) => {
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

  return (
    <Modal isVisible={isVisible}>
      <View style={$.containerOneStyle}>
        <CircularButton
          style={$.buttonOneStyle}
          image={CLOSE}
          onPress={onClosePress}
        />
        <Text style={$.textOneStyle}>{_('card.confirmItemDeletion')}</Text>
        <Image
          style={$.imageOneStyle}
          source={{uri: item !== null ? item.image : ''}}
        />
        <Text style={$.textTwoStyle}>{item !== null ? item.name : ''}</Text>
        <Text style={$.textTwoStyle}>
          {item !== null ? displayQuantity(item.unit, item.quantity) : ''}
        </Text>
        <GenericButton
          text={_('main.confirm')}
          containerStyle={{marginTop: 30}}
          loading={loading}
          enabled={enabled}
          onPress={onConfirmPress}
        />
      </View>
    </Modal>
  );
};

const $ = StyleSheet.create({
  containerOneStyle: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 40,
    alignItems: 'stretch',
    marginHorizontal: 20,
  },
  buttonOneStyle: {
    backgroundColor: colors.MODAL_CLOCE_BUTTON_COLOR,
    width: 40,
    height: 40,
    alignSelf: 'flex-end',
  },
  textOneStyle: {
    textAlign: 'center',
    color: colors.DELIVERY_TIME_COLOR,
    marginTop: 14,
    fontSize: 16,
  },
  imageOneStyle: {
    borderRadius: 90,
    width: 90,
    height: 90,
    marginTop: 16,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  textTwoStyle: {
    textAlign: 'center',
    color: colors.CART_TEXT_COLOR,
    marginTop: 16,
    fontSize: 16,
  },
  textTwoStyle: {
    textAlign: 'center',
    color: colors.LIGHT_GRAY,
    marginTop: 6,
  },
});

export default MyCartModal;
