import Button from '@atoms/button/Button';
import { useFormContext } from 'react-hook-form';

const SubmitButton = ({ onSubmit, title = '제출', ...props }) => {
  const { handleSubmit } = useFormContext();

  return (
    <Button
      title={title}
      onPress={handleSubmit(onSubmit)}
      {...props}
    />
  );
};

export default SubmitButton;
