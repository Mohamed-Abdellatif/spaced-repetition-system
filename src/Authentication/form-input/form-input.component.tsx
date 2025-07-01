import { Group, Input, FormInputLabel } from "./form-input-style.js";

const FormInput = ({ label, ...otherProps }:any) => {
  return (
    <Group>
      <Input {...otherProps} />
      {label && (
        <FormInputLabel shrink={otherProps.value.length}>
          {label}
        </FormInputLabel>
      )}
    </Group>
  );
};

export default FormInput;
