import React, {Component} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  SafeAreaView,
  Text,
  ActivityIndicator,
} from 'react-native';
import {apiUrl} from 'Wook_Market/app.json';

// import Pdf from 'react-native-pdf';
import {_} from 'Wook_Market/src/lang/i18n';
import {WebView} from 'react-native-webview';
import 'react-native-get-random-values';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import BackButton from 'Wook_Market/src/components/BackButton';
import GenericError from 'Wook_Market/src/components/GenericError';

const BACK_WHTE_ICON = require('Wook_Market/src/assets/icons/back_white_icon.png');

export class TermsOfUseScreen extends Component {
  state = {
    currentState: 'notloaded',
  };

  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({currentState: 'success'});
    // });
    this.setNavigationOptions();
  }

  setNavigationOptions() {
    this.props.navigation.setOptions({
      headerLeft: () => {
        return (
          <BackButton
            onPress={() => this.props.navigation.pop()}
            image={BACK_WHTE_ICON}
          />
        );
      },
    });
  }

  reload = () => {
    this.setState({currentState: 'success'});
  };

  render() {
    const source = {
      uri:
        'https://drive.google.com/viewerng/viewer?embedded=true&url=' +
        apiUrl +
        '/cgu',
      cache: true,
    };
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        {this.state.currentState === 'success' ? (
          <WebView
            source={{
              uri: 'https://drive.google.com/viewerng/viewer?embedded=true&url=https://wookmarket.dzmob.com/api/cgu',
            }}
            androidHardwareAccelerationDisabled={false}
            style={{flex: 1}}
            onError={(error) => {
              console.log(error);
            }}
            onLoadStart={() => {
              this.setState({currentState: 'success'});
            }}
            onLoadEnd={(end) => {
              this.setState({currentState: 'success'});
            }}
          />
        ) : (
          <ActivityIndicator size="large" color={colors.ORANGE} />
        )}
      </View>
      // <SafeAreaView style={{flex: 1}}>
      // <View style={styles.container}>
      //   {this.state.currentState === 'success' ? (
      //     <WebView
      //       source={{
      //         uri: 'https://github.com/facebook/react-native',
      //       }}
      //       androidHardwareAccelerationDisabled={true}
      //       style={{flex: 1}}
      //     />
      //   ) : // <WebView
      //   //   source={{
      //   //     uri: 'https://drive.google.com/viewerng/viewer?embedded=true&url=https://wookmarket.dzmob.com/api/cgu',
      //   //   }}
      //   //   style={{flex: 1}}
      //   // />
      //   // <Pdf
      //   //   source={source}
      //   //   onLoadComplete={(numberOfPages, filePath) => {}}
      //   //   onPageChanged={(page, numberOfPages) => {}}
      //   //   onError={(error) => {
      //   //     this.setState({currentState: 'error'});
      //   //   }}
      //   //   onPressLink={(uri) => {}}
      //   //   style={styles.pdf}
      //   //   activityIndicatorProps={{progressTintColor: colors.ORANGE}}
      //   // />
      //   null}
      //   {this.state.currentState === 'error' ? (
      //     <View style={styles.errorContainerStyle}>
      //       <GenericError
      //         errorText={_('login.errorMessage')}
      //         onRetry={this.reload}
      //       />
      //     </View>
      //   ) : null}
      // </View>
      // </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  errorContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default TermsOfUseScreen;
