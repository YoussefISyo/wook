import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {_} from 'Wook_Market/src/lang/i18n';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import NetInfo from '@react-native-community/netinfo';

export class Timer extends Component {
  state = {
    timer: 59,
  };

  componentDidMount = () => {
    this.setTimer();
  };

  setTimer = () => {
    this.interval = setInterval(
      () => this.setState((prevState) => ({timer: prevState.timer - 1})),
      1000,
    );
  };

  componentDidUpdate = () => {
    if (this.state.timer === 1) {
      this.clearTimer();
    }
  };

  componentWillUnmount = () => {
    this.clearTimer();
  };

  clearTimer = () => {
    clearInterval(this.interval);
  };

  onResendCode = () => {
    this.setState({...this.state, timer: 59});
    this.setTimer();
  };

  resetPasswordOnTimerEnd = async () => {
    let isConnected = null;
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      isConnected = false;
    } else {
      isConnected = true;
      this.onResendCode();
    }

    return isConnected;
  };

  render() {
    return this.state.timer === 1 ? (
      <View style={$.TextStyleThree}>
        <Text style={$.textStyleFour}>{_('login.isCodeRecieved')}</Text>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={async () => {
            this.props.resetPassword(await this.resetPasswordOnTimerEnd());
          }}>
          <Text style={{color: colors.ORANGE}}>{_('login.resendCode')}</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <Text style={$.textStyleFive}>
        {_('login.resendCodeTimeout') + ' ' + this.state.timer}
      </Text>
    );
  }
}

const $ = StyleSheet.create({
  textStyleFour: {
    marginEnd: 8,
  },
  TextStyleThree: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 16,
  },
  textStyleFive: {
    marginTop: 40,
    marginBottom: 16,
    fontSize: 16,
    color: colors.LIGHT_GRAY,
    marginStart: 8,
  },
});

export default Timer;
