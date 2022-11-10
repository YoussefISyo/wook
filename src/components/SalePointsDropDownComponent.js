import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
} from 'react-native';
import {colors} from 'Wook_Market/src/lib/globalStyles';
import SalePointListItem from 'Wook_Market/src/components/SalePointListItem';
import {_} from 'Wook_Market/src/lang/i18n';

const ICON_DROP_DOWN = require('Wook_Market/src/assets/icons/icn_drop_down_list.png');

const SalePointsDropDownComponent = ({
  salePoints,
  onSalePointSelect,
  salePoint,
}) => {
  const [isListVisible, setIsListVisible] = useState(false);

  const renderItem = ({item: salePoint, index}) => {
    return (
      <SalePointListItem
        salePoint={salePoint}
        onSalePointSelect={handleSalePointSelect}
      />
    );
  };

  const handleSalePointSelect = (salePoint) => {
    onSalePointSelect(salePoint);
    setIsListVisible(!isListVisible);
  };

  const handleDropDownPress = () => {
    setIsListVisible(!isListVisible);
  };

  const renderSeparator = () => <View style={$.separatoreStyle} />;

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        style={$.containerOneStyle}
        onPress={handleDropDownPress}>
        <View style={$.containrTwoStyle}>
          <Text style={$.textOneStyle}>
            {salePoint ? salePoint.name : _('main.chooseShopTitle')}
          </Text>
          <Text style={$.textTwoStyle}>
            {salePoint ? salePoint.address : _('main.chooseShopDescription')}
          </Text>
        </View>
        <Image source={ICON_DROP_DOWN} />
      </TouchableOpacity>
      {isListVisible ? (
        <View style={$.listStyle}>
          <FlatList
            data={salePoints}
            keyExtractor={(item) => item.id.toString()}
            nestedScrollEnabled
            bounces={false}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={$.listContentStyle}
            ItemSeparatorComponent={renderSeparator}
            renderItem={renderItem}
          />
        </View>
      ) : null}
    </>
  );
};

const $ = StyleSheet.create({
  containerOneStyle: {
    flexDirection: 'row',
    width: '100%',
    padding: 16,
    borderColor: colors.ORANGE,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colors.DELEVERY_CACD_BACKGROUND_COLOR,
  },
  containrTwoStyle: {flex: 1, marginRight: 16},
  textOneStyle: {color: colors.ITEM_TEXT_GRAY, marginBottom: 6},
  textTwoStyle: {color: colors.DELIVERY_TIME_COLOR, fontSize: 13},
  listStyle: {
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 3,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    backgroundColor: 'white',
    elevation: 4,
    borderRadius: 10,
    height: Platform.OS === 'ios' ? 213 : 225,
    zIndex: 100,
  },
  listContentStyle: {
    paddingHorizontal: 18,
  },
  separatoreStyle: {
    borderBottomColor: colors.LIGHT_GRAY,
    borderBottomWidth: 0.5,
    marginHorizontal: 2,
  },
});

export default SalePointsDropDownComponent;
