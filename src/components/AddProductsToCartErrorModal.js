import React from 'react';
import {Text, View, StyleSheet, FlatList, Image} from 'react-native';
import Modal from 'react-native-modal';
import CircularButton from 'Wook_Market/src/components/CircularButton';
import GenericButton from 'Wook_Market/src/components/GenericButton';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import {_} from 'Wook_Market/src/lang/i18n';

const CLOSE = require('Wook_Market/src/assets/icons/close_drawer_icon.png');

const AddProductsToCartErrorModal = ({
  isVisible,
  onPress,
  products,
  errorMessage,
  enabled,
  loading,
  onButtonPress,
}) => {
  const renderItem = (item, index) => {
    return (
      <View style={$.listItemContainerStyle}>
        <Image source={{uri: item.image}} style={$.imageStyle} />
        <Text style={$.textStyleTwo}>{item.name}</Text>
      </View>
    );
  };

  return (
    <Modal isVisible={isVisible}>
      <View style={$.containerOneStyle}>
        <CircularButton
          style={$.buttonOneStyle}
          image={CLOSE}
          onPress={onPress}
        />
        {errorMessage === false ? (
          <View>
            <Text style={$.textOneStyle}>{_('error.productOutFofStock')}</Text>
            <FlatList
              nestedScrollEnabled={false}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={$.containerFourStyle}
              style={{maxHeight: 200}}
              data={products}
              renderItem={({item, index}) => renderItem(item, index)}
            />
            <Text style={$.textOneStyle}>{_('error.addProducts')}</Text>
            <GenericButton
              text={_('login.add')}
              containerStyle={$.buttonTwoStyle}
              enabled={enabled}
              loading={loading}
              onPress={onButtonPress}
            />
          </View>
        ) : (
          <Text style={$.textOneStyle}>{_('error.productsNotAvailable')}</Text>
        )}
      </View>
    </Modal>
  );
};

const $ = StyleSheet.create({
  containerOneStyle: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'stretch',
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
    marginTop: 8,
    fontSize: 16,
    marginBottom: 6,
  },
  textFailedOneStyle: {
    borderColor: colors.ORANGE,
    borderWidth: 1,
    borderBottomColor: colors.ORANGE,
    borderRadius: 8,
    height: 100,
  },
  buttonTwoStyle: {marginTop: 4, marginBottom: 8, marginHorizontal: 12},
  containerFourStyle: {
    paddingHorizontal: 16,
    paddingBottom: 6,
    paddingTop: 4,
  },
  textStyleTwo: {
    color: colors.CART_TEXT_COLOR,
    marginLeft: 8,
    alignSelf: 'center',
  },
  imageStyle: {width: 50, height: 50, borderRadius: 25, resizeMode: 'contain'},
  listItemContainerStyle: {flexDirection: 'row', paddingVertical: 4},
});

export default AddProductsToCartErrorModal;
