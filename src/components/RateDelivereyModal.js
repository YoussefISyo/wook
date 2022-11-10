import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {_} from 'Wook_Market/src/lang/i18n';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import ClickableRatingBar from 'Wook_Market/src/components/ClickableRatingBar';
import GenericButton from 'Wook_Market/src/components/GenericButton';
import CircularButton from 'Wook_Market/src/components/CircularButton';

CLOSE_ICON = require('Wook_Market/src/assets/icons/close_popup_icon.png');

export class RateDelivereyModal extends Component {
  state = {
    rating: 0,
  };
  setRating = (rating) => {
    this.setState({...this.state, rating});
  };
  render() {
    return (
      <Modal isVisible={this.props.isRatingModalVisible}>
        <View style={styles.modalContainerStyle}>
          <CircularButton
            style={styles.closeButtonStyle}
            image={CLOSE_ICON}
            onPress={this.props.closeRatingModal}
          />
          <Text style={styles.modalTitleStyle}>{_('main.rate')}</Text>
          <ClickableRatingBar
            size={38}
            rating={0}
            spacing={5}
            style={{alignSelf: 'center', marginTop: 30}}
            onClick={this.setRating}
          />
          <GenericButton
            text={_('main.addTheRating')}
            containerStyle={styles.modalButtonStyle}
            onPress={() => this.props.rate(this.state.rating)}
            loading={this.props.loading}
            enabled={this.props.enabled}
          />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContainerStyle: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 26,
    paddingVertical: 35,
    alignItems: 'stretch',
    marginHorizontal: 20,
  },
  closeButtonStyle: {
    backgroundColor: colors.MODAL_CLOCE_BUTTON_COLOR,
    width: 40,
    height: 40,
    alignSelf: 'flex-end',
  },
  modalTitleStyle: {
    textAlign: 'center',
    fontSize: 17,
    color: colors.DELIVERY_TIME_COLOR,
    marginTop: 23,
  },
  modalButtonStyle: {
    marginTop: 45,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default RateDelivereyModal;
