// @ts-nocheck
import { useField, FieldHookConfig } from "formik";
import TextField from "@mui/material/TextField";

type Props = {
  label: string;
};

const UsernameField = ({
  label,
  ...props
}: Props & FieldHookConfig<string>) => {
  const [field, meta] = useField(props);

  return (
    <TextField
      variant="standard"
      fullWidth
      required
      label={label}
      {...field}
      {...props}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
      value={meta.value}
      sx={{ m: 1 }}
    />
  );
};

export default UsernameField;
