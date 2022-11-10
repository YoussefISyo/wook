import React from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import GenericButton from 'Wook_Market/src/components/GenericButton';
import Modal from 'react-native-modal';
import CircularButton from 'Wook_Market/src/components/CircularButton';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {_} from 'Wook_Market/src/lang/i18n';
import {formatPrice} from 'Wook_Market/src/lib/util';

const GIFT = require('Wook_Market/src/assets/images/gift_image.png');
const CLOSE = require('Wook_Market/src/assets/icons/close_popup_icon.png');

export const PaymentConfirmationScreenModal = ({
  isVisible,
  onClosePress,
  loyaltyBonus,
  checkout,
  onConfirmPress,
}) => {
  displayBonusValue = () => {
    if (checkout >= loyaltyBonus) {
      return formatPrice(loyaltyBonus);
    } else {
      return formatPrice(checkout);
    }
  };
  return (
    <Modal isVisible={isVisible}>
      <View style={$.containerOneStyle}>
        <CircularButton
          style={$.buttonOneStyle}
          image={CLOSE}
          onPress={() => {
            onClosePress();
          }}
        />
        <Image style={$.imageStyle} source={GIFT} />
        <Text style={$.textOneStyle}>-{displayBonusValue()}</Text>
        <Text style={$.textTwoStyle}>
          {_('login.useBonusTextOne')}{' '}
          <Text style={{color: colors.ORANGE}}>
            {displayBonusValue()}
            {_('login.currencyType')}
          </Text>{' '}
          {_('login.uneBonusTextTow')}
        </Text>
        <GenericButton
          text={_('main.use')}
          style={{marginTop: 26}}
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
    position: 'absolute',
    right: 0,
    marginTop: 40,
    marginRight: 30,
  },
  textOneStyle: {
    textAlign: 'center',
    color: colors.ORANGE,
    marginTop: 6,
    fontSize: 18,
  },
  textTwoStyle: {
    textAlign: 'center',
    color: colors.LIGHT_GRAY,
    marginTop: 12,
  },
  imageStyle: {
    alignSelf: 'center',
    marginTop: 12,
  },
});

export default PaymentConfirmationScreenModal;
