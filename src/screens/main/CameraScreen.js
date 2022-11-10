import React, {PureComponent} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
  BackHandler,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {isValidNumber} from 'Wook_Market/src/lib/util';
import Toast from 'react-native-toast-message';
import CustomToast from 'Wook_Market/src/lib/CustomToast';
import {_} from 'Wook_Market/src/lang/i18n';

const CLOSE_ICON = require('Wook_Market/src/assets/icons/icn_close_scan_modal.png');
const FLASH_ICON = require('Wook_Market/src/assets/icons/flash.png');

import Sound from 'react-native-sound';
Sound.setCategory('Playback');

class CameraScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.error = false;
    this.isScanned = false;
  }

  state = {
    torchOn: false,
  };

  navigateBack = (barCode) => {
    this.props.navigation.navigate(this.previousRoute, {
      barCode: barCode,
      previousRoute: 'Camera',
    });
  };

  displayError = () => {
    if (!this.error) {
      this.error = true;
      Toast.show({
        type: 'error',
        visibilityTime: 2000,
        text1: _('main.invalideCodeBar'),
        onHide: () => (this.error = false),
      });
    }
  };

  handleTorchPress = () => {
    const torchState = this.state.torchOn;
    this.setState({torchOn: !torchState});
  };

  componentDidMount() {
    this.previousRoute = this.props.route.params.previousRoute;
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );

    const mainBundle =
      Platform.OS === 'ios'
        ? encodeURIComponent(Sound.MAIN_BUNDLE)
        : Sound.MAIN_BUNDLE;

    this.scannerSound = new Sound(
      'barcode_scanner.mp3',
      mainBundle,
      (error) => {
        if (error) {
          return;
        }
      },
    );
  }

  backAction = () => {
    this.navigateBack(null);
    return true;
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={
            this.state.torchOn
              ? RNCamera.Constants.FlashMode.torch
              : RNCamera.Constants.FlashMode.off
          }
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onBarCodeRead={this.handleBarCodeRead}
        />
        <View style={styles.visibleAreaContainerStyle}>
          <View
            style={{flex: 0.38, backgroundColor: colors.LIGHT_BLACK}}></View>
          <View style={{flex: 0.24, flexDirection: 'row', zIndex: 5}}>
            <View style={{flex: 0.06, backgroundColor: colors.LIGHT_BLACK}} />
            <View style={{flex: 0.88, zIndex: 5}}>
              <View style={styles.topLeftCornerContainerStyle} />
              <View style={styles.topRightCornerContainerStyle} />
              <View style={styles.bottomLeftCornerContainerStyle} />
              <View style={styles.bottomRightCornerContainerStyle} />
            </View>
            <View style={{flex: 0.06, backgroundColor: colors.LIGHT_BLACK}} />
          </View>
          <View
            style={{flex: 0.38, backgroundColor: colors.LIGHT_BLACK}}></View>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={this.handleTorchPress}
          style={styles.torchButton}>
          <View>
            <Image source={FLASH_ICON} style={{width: 24, height: 24}} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => this.backAction()}
          style={styles.closeButton}>
          <View>
            <Image source={CLOSE_ICON} />
          </View>
        </TouchableOpacity>
        <View style={styles.loaderStyle}>
          <ActivityIndicator color="white" size="small" />
        </View>
        <CustomToast />
      </View>
    );
  }

  handleBarCodeRead = (code) => {
    const codeStr = code.data;
    if (codeStr && codeStr.length > 0 && !isValidNumber(parseInt(codeStr))) {
      this.displayError();
      return;
    }
    if (!this.isScanned) {
      this.isScanned = true;
      this.scannerSound.play((success) => {
        if (success) {
          this.navigateBack(codeStr);
        }
      });
    }
  };
}

const styles = StyleSheet.create({
  torchButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 36 : 48,
    left: 24,
    width: 48,
    height: 48,
    backgroundColor: colors.GREY,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 48 : 60,
    right: 24,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  loaderStyle: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visibleAreaContainerStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  topLeftCornerContainerStyle: {
    width: 25,
    height: 25,
    position: 'absolute',
    top: -3,
    left: -3,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: 'white',
  },
  topRightCornerContainerStyle: {
    width: 25,
    height: 25,
    position: 'absolute',
    top: -3,
    right: -3,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: 'white',
  },
  bottomLeftCornerContainerStyle: {
    width: 25,
    height: 25,
    position: 'absolute',
    bottom: -3,
    left: -3,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: 'white',
  },
  bottomRightCornerContainerStyle: {
    width: 25,
    height: 25,
    position: 'absolute',
    bottom: -3,
    right: -3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: 'white',
  },
});

export default CameraScreen;
