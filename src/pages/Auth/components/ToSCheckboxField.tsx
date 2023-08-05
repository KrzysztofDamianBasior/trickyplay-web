// @ts-nocheck
import { useField, FieldHookConfig } from "formik";

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

type Props = {
  label: string;
};

const ToSCheckboxField = ({
  label,
  ...props
}: Props & FieldHookConfig<string>) => {
  const [field, meta] = useField(props);

  return (
    <FormControlLabel
      sx={{ m: 1 }}
      label={label}
      required
      control={<Checkbox name="checkedToS" {...field} {...props} />}
    />
  );
};

export default ToSCheckboxField;
