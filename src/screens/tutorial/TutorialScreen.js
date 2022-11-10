import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import GenericButton from 'Wook_Market/src/components/GenericButton';
import CustomPageIndicator from 'Wook_Market/src/components/CustomPageIndicator';
import {IS_DEVICE_SMALL} from 'Wook_Market/src/lib/Constants';
import {colors, poppins} from 'Wook_Market/src/lib/globalStyles';
import {setAlreadyOpen} from 'Wook_Market/src/screens/Reception';
import {_} from 'Wook_Market/src/lang/i18n';

CHOOSE_PRODUCT_IMAGE = require('Wook_Market/src/assets/images/choose_product_image.png');
SAFE_PAYMENT_IMAGE = require('Wook_Market/src/assets/images/payement_image.png');
DELIVERY_IMAGE = require('Wook_Market/src/assets/images/delivery_image.png');

class TutorialScreen extends React.Component {
  state = {currentPage: 0};

  pages = [
    {
      title: _('main.pageOneTitle'),
      content: _('main.pageOneContent'),
      image: CHOOSE_PRODUCT_IMAGE,
    },
    {
      title: _('main.pageTwoTitle'),
      content: _('main.pageTwoContent'),
      image: SAFE_PAYMENT_IMAGE,
    },
    {
      title: _('main.pageThreeTitle'),
      content: _('main.pageThreeContent'),
      image: DELIVERY_IMAGE,
    },
  ];

  handlePageSelected(pageSelectedEvent) {
    this.setState({currentPage: pageSelectedEvent.nativeEvent.position});
  }

  handlePress() {
    const selectedPage = this.state.currentPage;
    if (selectedPage === this.pages.length - 1) {
      setAlreadyOpen();
      this.props.navigation.replace('Auth');
      return;
    }
    this.viewPager.setPage(selectedPage + 1);
  }

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'space-around',
        }}>
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />
        <View>
          <View style={styles.viewPagerContainer}>
            <ViewPager
              style={styles.viewPager}
              initialPage={this.state.currentPage}
              ref={(viewPager) => (this.viewPager = viewPager)}
              onPageSelected={(pageSelectedEvent) =>
                this.handlePageSelected(pageSelectedEvent)
              }>
              {this.pages.map((page) => {
                return (
                  <View key={this.pages.indexOf(page)} style={styles.pageStyle}>
                    <Image source={page.image} style={styles.imageStyle} />
                    <Text style={styles.titleStyle}>{page.title}</Text>
                    <Text style={styles.contentStyle}>{page.content}</Text>
                  </View>
                );
              })}
            </ViewPager>
          </View>

          <CustomPageIndicator selectedPage={this.state.currentPage} />
        </View>

        <GenericButton
          text={
            this.state.currentPage == this.pages.length - 1
              ? 'Commencer'
              : 'Suivant'
          }
          style={
            this.state.currentPage === 1
              ? {...styles.buttonStyle, backgroundColor: colors.DARK_GREEN}
              : styles.buttonStyle
          }
          onPress={() => this.handlePress()}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },

  viewPagerContainer: {
    justifyContent: 'flex-end',
    height: IS_DEVICE_SMALL ? 420 : 520,
  },

  pageStyle: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  imageStyle: {
    marginTop: IS_DEVICE_SMALL ? 0 : 20,
    resizeMode: 'center',
    width: 280,
    height: 280,
  },

  titleStyle: {
    marginTop: IS_DEVICE_SMALL ? 0 : 40,
    ...poppins.fontWeight500,
    fontSize: 24,
    fontFamily: 'Poppins-Medium',
    color: colors.TURORIAL_TITLE_GRAY,
    marginHorizontal: 30,
    textAlign: 'center',
  },

  contentStyle: {
    color: colors.TEXT_LIGHT_GRAY,
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    ...poppins.fontWeight400,
    marginTop: IS_DEVICE_SMALL ? 8 : 18,
    marginHorizontal: 30,
    textAlign: 'center',
    marginHorizontal: 22,
    lineHeight: 25,
  },
  buttonStyle: {marginHorizontal: 56, marginBottom: 40, height: 45},
});

export default TutorialScreen;
