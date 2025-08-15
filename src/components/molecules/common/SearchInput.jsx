import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import Input from '@atoms/inputs/Input';
import SubmitButtonIcon from '@atoms/inputs/SubmitButtonIcon';

const SearchInput = ({ name = 'search', placeholder = 'search', onSearch, icon=require('@assets/search.png'), style, onChangeText }) => {
  // const methods = useForm();
  const methods = useForm({ defaultValues: { [name]: '' } });

  const handleSearch = (data) => {
    onSearch?.(data[name]);
  };

  const value = useWatch({ control: methods.control, name });
  const prevRef = useRef();
  useEffect(() => {
    if (onChangeText && value !== prevRef.current) {
      prevRef.current = value;
      onChangeText?.(value ?? '');
    }
  }, [value, onChangeText]);

  return (
    <FormProvider {...methods}>
      <View style={[styles.container, style]}>
        <View style={styles.inputWrapper}>
          <Input
            name={name}
            placeholder={placeholder}
            style={styles.inputContainer}
            inputStyle={styles.input}
          />
        </View>
        <SubmitButtonIcon
          // onSubmit={handleSearch}
          onSubmit={() => methods.handleSubmit(handleSearch)()}
          icon = {icon}
          style={styles.submit}
        />
      </View>
    </FormProvider>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    backgroundColor: '#FFFFFF',
    borderColor: '#E6E6E6',
    borderWidth: 1,
    borderRadius: 20,
  },
  inputWrapper: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: 'transparent',
    height: '100%',
  },
  input: {
    backgroundColor: 'transparent',
    fontSize: 20,
    height: '100%',
    paddingHorizontal: 0,
  },
  submit: {
    width: 38,
    height: 38,
    marginLeft: 8,
  },
});
