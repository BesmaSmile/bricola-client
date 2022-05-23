import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  FlatList,
} from 'react-native';

import colors from 'src/constants/colors';
import Icon from 'src/components/Icon';
import {searchPlaces} from 'src/api/maps';

const PlacesSearch = props => {
  const {
    hidePlacesSearchModal,
    selectPlace,
    setupMyLocation,
    addMyLocationChoice,
  } = props;
  const [_mapsPlaces, _setMapsPlaces] = useState([]);
  const searchInput = useRef();

  const handleMyLocationClick = () => {
    setupMyLocation();
    hidePlacesSearchModal(false);
  };

  const _clearText = () => {
    searchInput.current.clear();
    _setMapsPlaces([]);
  };

  const _searchPlaces = text => {
    if (text.length > 3) {
      searchPlaces(text).then(places => {
        _setMapsPlaces(places);
      });
    }
  };

  const _choosePlace = place => {
    hidePlacesSearchModal(false);
    selectPlace(place);
  };

  const itemSeparator = () => <View style={styles.item_separator} />;

  const itemContent = ({item}) => (
    <TouchableHighlight
      underlayColor={colors.disabledColor}
      onPress={() => _choosePlace(item)}>
      <View style={styles.item_container}>
        <Text style={styles.place_text}>{`${item.name} ${item.province}`}</Text>
      </View>
    </TouchableHighlight>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.search_container, styles.inner_container]}>
        <TouchableHighlight
          underlayColor={colors.disabledColor}
          style={styles.button}
          onPress={() => hidePlacesSearchModal(undefined)}>
          <Icon
            viewBox="0 0 25 25"
            width="25px"
            height="20px"
            name="return"
            fill={colors.darkColor}
          />
        </TouchableHighlight>
        <TextInput
          style={styles.search_input}
          placeholder="Recherche"
          onChangeText={text => _searchPlaces(text)}
          ref={searchInput}
          onSubmitEditing={() => {}}
        />
        <TouchableHighlight
          underlayColor={colors.disabledColor}
          style={styles.button}
          onPress={_clearText}>
          <Icon
            viewBox="0 0 25 25"
            width="25px"
            height="25px"
            name="cross"
            fill={colors.darkColor}
          />
        </TouchableHighlight>
      </View>
      <View style={styles.inner_container}>
        {addMyLocationChoice && (
          <TouchableHighlight
            underlayColor={colors.disabledColor}
            onPress={() => handleMyLocationClick()}>
            <View style={styles.item_container}>
              <Icon
                viewBox="0 0 25 25"
                width="25px"
                height="25px"
                name="gpsIndicator"
                fill={colors.darkColor}
              />
              <Text style={styles.place_text}>Ma position</Text>
            </View>
          </TouchableHighlight>
        )}
        <TouchableHighlight
          underlayColor={colors.disabledColor}
          onPress={() => hidePlacesSearchModal(true)}>
          <View style={styles.item_container}>
            <Icon
              viewBox="0 0 25 25"
              width="25px"
              height="25px"
              name="chooseOnMap"
              fill={colors.darkColor}
            />
            <Text style={styles.place_text}>Choisir sur la carte</Text>
          </View>
        </TouchableHighlight>
      </View>
      <FlatList
        style={[styles.list_container, styles.inner_container]}
        data={_mapsPlaces}
        keyExtractor={place => place.id}
        renderItem={itemContent}
        ItemSeparatorComponent={itemSeparator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F4F4',
  },
  list_container: {
    flex: 1,
  },
  inner_container: {
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  search_container: {
    flexDirection: 'row',
    height: 50,
    borderBottomWidth: 1,
    alignItems: 'center',
    borderColor: colors.disabledColor,
  },
  search_input: {
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
    textAlignVertical: 'center',
    padding: 0,
  },
  button: {
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  place_text: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: 'bold',
  },
  item_container: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item_separator: {
    backgroundColor: colors.disabledColor,
    height: 0.5,
  },
});
export default PlacesSearch;
