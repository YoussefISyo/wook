import React, {useState} from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import GenericButton from 'Wook_Market/src/components/GenericButton';
import Modal from 'react-native-modal';
import CircularButton from 'Wook_Market/src/components/CircularButton';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {isValidNumber} from 'Wook_Market/src/lib/util';
import {_} from 'Wook_Market/src/lang/i18n';
import TextField from 'Wook_Market/src/components/TextField';

const CLOSE = require('Wook_Market/src/assets/icons/close_popup_icon.png');

const EditQuantityModal = ({
  isVisible,
  onClosePress,
  onConfirmPress,
  item,
  minQtItems,
  minQtGrams,
}) => {
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [error, setError] = useState('');

  const isValidQuantity = () => {
    if (!isValidNumber(quantity) || quantity === '') {
      setError(_('error.validNumber'));
      return;
    } else {
      if (quantity > item.quantity_max && item.type != 'grouped') {
        setError(
          `${_('error.availableQuantity')} ${item.quantity_max}${
            item.unit === 'kg' ? 'kg' : ''
          }`,
        );
        return;
      } else {
        if (item.unit === 'kg' && quantity < minQtGrams / 1000) {
          setError(`${_('error.minValue')} ${minQtGrams / 1000}kg`);
          return;
        }
        if (item.unit === 'items' && quantity < minQtItems) {
          setError(`${_('error.minValue')} ${minQtItems}`);
          return;
        }
      }
    }
    onConfirmPress(item.quantity != quantity, quantity, item.id);
  };

  const isValidInputForWeight = (quantity) => {
    if (
      quantity.charAt(quantity.length - 1) === ' ' ||
      quantity.charAt(quantity.length - 1) === ',' ||
      quantity.charAt(quantity.length - 1) === '-'
    ) {
      return;
    }
    setQuantity(quantity);
  };

  const isValidInputForItem = (quantity) => {
    if (
      quantity.charAt(quantity.length - 1) === ' ' ||
      quantity.charAt(quantity.length - 1) === '.' ||
      quantity.charAt(quantity.length - 1) === ',' ||
      quantity.charAt(quantity.length - 1) === '-'
    ) {
      return;
    }
    setQuantity(quantity);
  };

  const setQuantityValue = (quantity) => {
    if (item.unit === 'kg') {
      isValidInputForWeight(quantity);
    } else {
      isValidInputForItem(quantity);
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
        <TextField
          selectionColor={colors.ORANGE}
          containerStyle={$.quantityTextFeildStyle}
          keyboardType="numeric"
          value={quantity}
          placeholder={_('main.quantity')}
          wheight={item.unit === 'kg'}
          error={error}
          onChangeText={(quantity) => setQuantityValue(quantity)}
        />
        <GenericButton
          text={_('main.confirm')}
          containerStyle={{marginTop: 40}}
          onPress={() => isValidQuantity()}
        />
      </View>
    </Modal>
  );
};

const $ = StyleSheet.create({
  containerOneStyle: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 32,
    paddingBottom: 24,
    alignItems: 'stretch',
    marginHorizontal: 20,
  },
  buttonOneStyle: {
    backgroundColor: colors.MODAL_CLOCE_BUTTON_COLOR,
    width: 34,
    height: 34,
    position: 'absolute',
    right: 16,
    top: 16,
  },
  quantityTextFeildStyle: {
    marginTop: 70,
  },
});

export default EditQuantityModal;
