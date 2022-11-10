import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import CircularButton from 'Wook_Market/src/components/CircularButton';
import GenericButton from 'Wook_Market/src/components/GenericButton';
import TextField from 'Wook_Market/src/components/TextField';
import {colors} from 'Wook_Market/src/lib/globalStyles';

const CLOSE = require('Wook_Market/src/assets/icons/close_popup_icon.png');

const OrderDetailModal = ({isVisible, onPress}) => {
  return (
    <Modal isVisible={isVisible}>
      <View style={$.containerOneStyle}>
        <CircularButton
          style={$.buttonOneStyle}
          image={CLOSE}
          onPress={onPress}
        />
        <Text style={$.textOneStyle}>Réclamation</Text>
        <TextField
          selectionColor={colors.ORANGE}
          multiline={true}
          textAlignVertical="top"
          inputStyle={$.textFailedOneStyle}
          textAlign="flex-start"
          placeholder="Right some thing..."
        />
        <GenericButton text="Confirmer" style={$.buttonTwoStyle} />
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
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
  },
  textOneStyle: {
    textAlign: 'center',
    color: colors.DELIVERY_TIME_COLOR,
    marginTop: 16,
    fontSize: 16,
    marginBottom: 30,
  },
  textFailedOneStyle: {
    borderColor: colors.ORANGE,
    borderWidth: 1,
    borderBottomColor: colors.ORANGE,
    borderRadius: 8,
    height: 100,
  },
  buttonTwoStyle: {marginTop: 26},
});

export default OrderDetailModal;
