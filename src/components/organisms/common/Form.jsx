import { View } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';

const Form = ({
  defaultValues = {},
  children,
  mode = 'onSubmit',
  style,
  ...props
}) => {
  const methods = useForm({ defaultValues, mode });

  return (
    <FormProvider {...methods}>
      <View style={style} {...props}>
        {children}
      </View>
    </FormProvider>
  );
};

export default Form;
