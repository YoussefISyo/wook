import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';

import {colors} from 'Wook_Market/src/lib/globalStyles';
import {WINDOW_WIDTH} from 'Wook_Market/src/lib/Constants';
import {getSuggestions} from 'Wook_Market/src/lib/lists';
import {handleError, isInternetReachable} from 'Wook_Market/src/lib/util';

SEARCH_ICON = require('Wook_Market/src/assets/icons/search_Icon.png');
CLOSE_ICON = require('Wook_Market/src/assets/icons/close_popup_icon.png');

const SuggestionList = ({data, onItemPress}) => {
  return (
    <View
      style={{
        //marginHorizontal: 2,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: 'white',
      }}>
      <View style={styles.suggestionListStyle}>
        <FlatList
          keyboardShouldPersistTaps="always"
          bounces={false}
          contentContainerStyle={styles.listStyle}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          data={data}
          renderItem={({item}) => (
            <SearchSuggestion
              text={item.name}
              onPress={() => onItemPress(item)}
            />
          )}
        />
      </View>
    </View>
  );
};

const SearchSuggestion = ({text, onPress}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Text
        style={{
          paddingVertical: 10,
          paddingLeft: 10,
          fontSize: 12,
          fontWeight: '400',
          color: colors.GRAY_SUGGESTION,
        }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

class SearchBar extends React.Component {
  state = {
    value: '',
    suggestions: [],
    isLoading: false,
    errorMessage: '',
    selectedSuggestion: null,
  };

  cWidth = WINDOW_WIDTH - this.props.style.marginHorizontal * 2;
  cStyle = {...styles.containerStyle, ...this.props.style, width: this.cWidth};

  resetState = () => {
    this.textInput.clear();
    this.setState((prevState) => ({
      ...prevState,
      value: '',
      suggestions: [],
      isLoading: false,
      errorMessage: '',
      selectedSuggestion: null,
    }));
  };

  getSuggestionsList = async (text) => {
    onSuccess = (data) => {
      console.log('onSuccess text: ', data.length);
      console.log('onSuccess called text: ', text);
      const value = this.state.value;
      this.setState((prevState) => ({
        ...prevState,
        isLoading: false,
        suggestions: value ? data : [],
      }));
    };

    onError = (error) => {
      this.setState((prevState) => ({
        ...prevState,
        isLoading: false,
        errorMessage: handleError(error),
      }));
    };

    onLoad = () => {
      this.setState((prevState) => ({
        ...prevState,
        isLoading: true,
        errorMessage: '',
      }));
    };

    await getSuggestions(text, onSuccess, onError, onLoad);
  };

  handleTextChange = async (text) => {
    this.setState(
      {
        ...this.state,
        value: text,
        suggestions: text === '' ? [] : this.state.suggestions,
      },
      () => {
        if (
          this.state.value.trim().length > 1 &&
          isInternetReachable() &&
          this.showSuggestions
        ) {
          if (this.state.value.length % 2 === 0) {
            this.getSuggestionsList(this.state.value);
          }
        }
      },
    );
  };

  handleClearText() {
    this.handleTextChange('');
  }

  handleSuggestionClick = (item) => {
    // this.props.navigation.navigate('ProductDetail', {item: item});
    this.setState({selectedSuggestion: item}, () => Keyboard.dismiss());
  };

  onSubmit(term) {
    if (term.trim().length > 0) this.props.onSubmit(term);
  }

  _keyboardDidHide = () => {
    const selectedSuggestion = this.state.selectedSuggestion;
    if (selectedSuggestion) {
      if (selectedSuggestion.type === 'default')
        this.props.navigation.navigate('ProductDetail', {
          item: selectedSuggestion,
          previousRoute: this.props.previousRoute,
        });
      else
        this.props.navigation.navigate('OfferDetail', {
          item: selectedSuggestion,
        });
    }
  };

  componentDidMount() {
    this.showSuggestions = this.props.showSuggestions ?? true;

    this.unsubscribe = this.props.navigation.addListener(
      'blur',
      this.resetState,
    );
    Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    this.unsubscribe();
    Keyboard.removeListener('keyboardDidHide');
  }

  render() {
    return (
      <View style={this.cStyle}>
        <View style={styles.searchBarContainerStyle}>
          <Image
            source={this.props.icon ?? SEARCH_ICON}
            style={[styles.iconStyle, this.props.iconStyle]}
          />
          <TextInput
            ref={(input) => {
              this.textInput = input;
            }}
            autoCorrect={false}
            returnKeyType="search"
            autoCapitalize="none"
            numberOfLines={1}
            placeholder={this.props.placeholder}
            selectionColor={colors.ORANGE}
            style={[styles.inputStyle, this.props.inputStyle]}
            value={this.state.value}
            onChangeText={(newText) => this.handleTextChange(newText)}
            onSubmitEditing={() => this.onSubmit(this.state.value)}
          />

          {this.state.value.length === 0 || this.state.isLoading ? null : (
            <TouchableOpacity
              activeOpacity={0.8}
              style={{padding: 10}}
              onPress={() => this.handleClearText()}>
              <Image
                source={CLOSE_ICON}
                style={{
                  height: 20,
                  width: 20,
                }}
              />
            </TouchableOpacity>
          )}

          {this.state.isLoading ? (
            <ActivityIndicator
              size={15}
              color={colors.HINT_GRAY}
              style={{margin: 10}}
            />
          ) : null}
        </View>
        {this.state.suggestions.length !== 0 && this.showSuggestions ? (
          <SuggestionList
            data={this.state.suggestions}
            onItemPress={(item) => this.handleSuggestionClick(item)}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listStyle: {
    //paddingLeft: 8,
    backgroundColor: 'white',
    paddingVertical: 10,
    //paddingRight: 18,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  containerStyle: {
    alignSelf: 'center',
    zIndex: 1,
    position: 'absolute',
    flex: 1,
  },
  suggestionListStyle: {
    backgroundColor: 'white',
    borderColor: colors.SMOOTH_GRAY,
    borderWidth: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  searchBarContainerStyle: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.SMOOTH_GRAY,
  },
  iconStyle: {width: 20, height: 20, marginLeft: 10, marginRight: 5},
  inputStyle: {
    flex: 1,
    height: 42,
    fontSize: 14,
    color: colors.HINT_GRAY,
    opacity: 0.8,
  },
});

export default SearchBar;
