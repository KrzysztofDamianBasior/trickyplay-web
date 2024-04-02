// @ts-nocheck
import { useState } from "react";
import { useField, FieldHookConfig } from "formik";

import {
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

type Props = {
  label: string;
  id: string;
};

const PasswordField = ({
  label,
  id,
  ...props
}: Props & FieldHookConfig<string>) => {
  const [showPassword, setShowPassword] = useState(false);
  const [field, meta] = useField(props);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <FormControl variant="standard" fullWidth required>
      <InputLabel htmlFor={id} error={meta.touched && Boolean(meta.error)}>
        {label}
      </InputLabel>
      <Input
        {...field}
        {...props}
        value={meta.value}
        error={meta.touched && Boolean(meta.error)}
        id={id}
        type={showPassword ? "text" : "password"}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
      {meta.touched && Boolean(meta.error) && (
        <FormHelperText id={id + "-helper-text"} sx={{ color: "error.main" }}>
          {meta.error}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default PasswordField;
