import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { Item, Input } from 'native-base';
import i18n from 'i18next';

export const TextEntry = ({ value = '', onChange, valueType, ...props }) => {
  const [text, setText] = useState(value);
  const [height, setHeight] = useState(36);
  const [focused, setFocused] = useState(false);

  let newStyle = {
    height,
    width: '100%',
    minHeight: Platform.OS == 'android' ? 45 : 28,
    fontSize: 18
  }

  if (Platform.OS === 'ios') {
    if (focused) {
      newStyle.maxHeight = 100;
    }

    newStyle.borderBottomWidth = 1;
    newStyle.borderBottomColor = 'grey'
  }

  const updateHeight = (contentHeight) => {
    if (contentHeight !== height && contentHeight >= newStyle.minHeight) {
      if (!text) {
        setHeight(newStyle.minHeight);
      } else {
        setHeight(contentHeight);
      }
    }
  }

  const onEndEditing = () => {
    onChange(text);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'height' : "padding"}
      keyboardVerticalOffset={45}
    >
      <View {...props}>
        <Item>
          <TextInput
            placeholder={i18n.t('text_entry:type_placeholder')}
            onChangeText={setText}
            onEndEditing={onEndEditing}
            style={[newStyle]}
            keyboardType={valueType && valueType.includes('integer') ? `numeric` : `default`}
            value={text}
            multiline={true}
            onBlur={() => setFocused(false)}
            onFocus={() => setFocused(true)}
            onContentSizeChange={(e) => updateHeight(e.nativeEvent.contentSize.height)}
          />
        </Item>
      </View>
    </KeyboardAvoidingView>
  )
};

TextEntry.defaultProps = {
  value: '',
};

TextEntry.propTypes = {
  value: PropTypes.string,
  valueType: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
