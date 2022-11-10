import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';

class CustomPageIndicator extends React.Component {
  render() {
    const selectedPage = this.props.selectedPage;

    return (
      <View style={[styles.containerStyle, this.props.style]}>
        <View
          style={
            selectedPage === 0 ? styles.selectedElemetStyle : styles.elemetStyle
          }
        />
        <View
          style={
            selectedPage === 1
              ? {...styles.selectedElemetStyle, backgroundColor: colors.GREEN}
              : styles.elemetStyle
          }
        />
        <View
          style={
            selectedPage === 2 ? styles.selectedElemetStyle : styles.elemetStyle
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  elemetStyle: {
    width: 20,
    height: 6,
    borderRadius: 4,
    backgroundColor: colors.LIGHTER_GRAY,
    marginRight: 3,
  },

  selectedElemetStyle: {
    width: 30,
    height: 6,
    borderRadius: 4,
    backgroundColor: colors.ORANGE,
    marginRight: 3,
  },
});

export default CustomPageIndicator;
