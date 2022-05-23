import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import colors from 'src/constants/colors';
import ServiceElement from 'src/components/ServiceElement';

class ServiceDetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.service = this.props.route.params.service;
  }

  displayNewOrder = () => {
    this.props.navigation.navigate('Order', {service: this.service});
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <ServiceElement
            serviceCategory={this.props.route.params.serviceCategory}
            service={this.service}
            isItem={false}
            navigate={this.props.navigation.navigate}
          />
        </ScrollView>
        <TouchableOpacity
          style={styles.order_button}
          onPress={() => this.displayNewOrder()}>
          <Text style={styles.text_button}>Je commande</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F4F4',
  },
  order_button: {
    backgroundColor: colors.green,
    height: 50,
    borderWidth: 1,
    borderColor: colors.disabledColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_button: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ServiceDetailsScreen;
