import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import colors from 'src/constants/colors';
import MenuItem from 'src/components/MenuItem';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import publicationService from 'src/services/publication.service';
import {getPublications} from 'src/store/reducers/publicationReducer';
import {getAuth} from 'src/store/reducers/userReducer';
import {useRequestState} from 'src/tools/hooks';

const PublicationElement = ({item}) => (
  <Image
    style={styles.image}
    source={{uri: publicationService.getPublicationImage(item.image)}}
  />
);

const width = Math.round(Dimensions.get('window').width);
const height = Math.round((width * 2) / 3);

const HomeScreen = ({loadPublications, auth, publications, navigation}) => {
  const pubRef = useRef();
  const publicationsRequest = useRequestState();
  const displayServicesOfCategory = serviceCategory => {
    navigation.navigate('Services', {serviceCategory: serviceCategory});
  };
  useEffect(() => {
    publicationsRequest.sendRequest(() => loadPublications(auth));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    pubRef?.current?.startAutoplay(true);
  }, []);

  return (
    <View style={styles.main_container}>
      <ScrollView style={styles.main_container}>
        <View style={styles.menu_container}>
          <Text style={styles.title_text}>Catégories</Text>
          <View>
            <View style={styles.menu_row}>
              <MenuItem
                title="Transport"
                displayServicesOfCategory={displayServicesOfCategory}
              />
              <MenuItem
                title="Service à domicile"
                displayServicesOfCategory={displayServicesOfCategory}
              />
              <MenuItem
                title="Santé"
                displayServicesOfCategory={displayServicesOfCategory}
              />
            </View>

            <View style={styles.menu_row}>
              <MenuItem
                title="Informatique"
                displayServicesOfCategory={displayServicesOfCategory}
              />
              <MenuItem
                title="Surveillance"
                displayServicesOfCategory={displayServicesOfCategory}
              />
              <MenuItem
                title="Auto"
                displayServicesOfCategory={displayServicesOfCategory}
              />
            </View>
          </View>
        </View>
        {publications?.length > 0 && (
          <Carousel
            ref={pubRef}
            data={publications}
            renderItem={PublicationElement}
            sliderWidth={width}
            itemWidth={width}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  title_text: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 15,
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.textColorDefault,
  },
  menu_container: {
    margin: 10,
  },
  menu_row: {
    flexDirection: 'row',
  },
  menu_item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  icon_container: {
    backgroundColor: 'red',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  map: {
    flex: 5,
  },
  text: {
    padding: 20,
  },
  image: {
    resizeMode: 'cover',
    width: width - 20,
    height: height - 20,
    margin: 10,
    borderRadius: 5,
  },
});

const mapStateToProps = (state, props) => ({
  auth: getAuth(state.user),
  publications: getPublications(state.publication),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadPublications: publicationService.loadPublications,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeScreen);
