import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import colors from 'src/constants/colors';
import sizes from 'src/constants/sizes';
import Icon from 'src/components/Icon';
import {inputs} from 'src/assets/styles';

const SelectPicker = ({items, selectedValue, onChange, placeholder}) => {
  const [open, setOpen] = useState(false);

  const handleChange = value => {
    onChange(value);
    setOpen(false);
  };

  return (
    <View style={styles.main_contanier}>
      <Modal isVisible={open}>
        <ScrollView style={styles.modal_content}>
          {items.map(item => (
            <TouchableOpacity
              key={item.value}
              onPress={() => handleChange(item.value)}
              style={[
                styles.item,
                item.value === selectedValue ? styles.selected_item : {},
              ]}>
              <Text
                style={[
                  styles.item_text,
                  item.value === selectedValue ? styles.selected_item_text : {},
                ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Modal>
      <TouchableOpacity
        style={styles.select_container}
        onPress={() => setOpen(true)}>
        <TextInput
          style={inputs.default}
          value={items.find(item => item.value === selectedValue)?.label}
          placeholder={placeholder}
          editable={false}
        />
        <Icon
          viewBox="0 0 35 35"
          width="20px"
          height="20px"
          name="dropdownArrow"
          fill={colors.darkColor}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  main_contanier: {
    flex: 1,
  },
  modal_content: {
    width: 300,
    maxHeight: 500,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  select_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    padding: 10,
    borderBottomWidth: 0.2,
    borderColor: colors.grey,
  },
  selected_item: {
    backgroundColor: colors.light,
  },
  item_text: {
    color: colors.textColorDefault,
    fontSize: sizes.defaultTextSize,
    textAlign: 'center',
  },
  selected_item_text: {
    fontWeight: 'bold',
  },
});

export default SelectPicker;
