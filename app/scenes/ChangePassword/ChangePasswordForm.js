import React from 'react';
import { ActivityIndicator } from 'react-native';
import { propTypes } from 'react-redux';
import { Button, Form, Text } from 'native-base';
import { reduxForm, Field } from 'redux-form';
import { FormInputItem } from '../../components/form/FormItem';
import styles from './styles';

const validate = ({ oldPassword, password }) => {
  const errors = {};

  if (password && (!oldPassword || oldPassword.length === 0)) {
    errors.oldPassword = 'Please enter your old password';
  }
  if (oldPassword && (!password || password.length === 0)) {
    errors.password = 'Please enter a new password';
  }

  return errors;
};

const UserForm = ({ handleSubmit, submitting, error, primaryColor }) => (
  <Form>
    <Field
      component={FormInputItem}
      placeholder="Current password"
      name="oldPassword"
      style={styles.text}
      secureTextEntry
      autoComplete="off"
      autoCorrect={false}
      autoCapitalize="none"
    />
    <Field
      component={FormInputItem}
      placeholder="New password"
      name="password"
      style={styles.text}
      secureTextEntry
      autoComplete="off"
      autoCorrect={false}
      autoCapitalize="none"
    />
    <Button
      warning
      style={{ marginTop: 40, backgroundColor: primaryColor }}
      block
      onPress={handleSubmit}
      disabled={submitting}
    >
      {submitting
        ? <ActivityIndicator color={primaryColor} />
        : <Text style={styles.buttonText}>Update</Text>}
    </Button>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </Form>
);

UserForm.propTypes = {
  ...propTypes,
};

const UserFormConnected = reduxForm({
  form: 'user-form',
  validate,
  enableReinitialize: true,
})(UserForm);

export default UserFormConnected;
