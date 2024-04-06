import React, { useState, useContext } from "react";

import { Formik, Form, type FormikHelpers } from "formik";
import * as Yup from "yup";

import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";

import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import CancelIcon from "@mui/icons-material/Cancel";

import { type ChangeUsernameDialogStatusType } from "..";
import {
  PASSWORD_MESSAGE,
  PASSWORD_REGEX,
  USERNAME_MESSAGE,
  USERNAME_REGEX,
} from "../../../services/account/authenticationConstraints";
import { AccountContext } from "../../../services/account/AccountContext";

type Props = {
  setDialogStatus: (status: ChangeUsernameDialogStatusType) => void;
  onCloseDialog: () => void;
};
const validationSchema = Yup.object().shape({
  username: Yup.string()
    .matches(USERNAME_REGEX, USERNAME_MESSAGE)
    .required("Required"),
  password: Yup.string()
    .matches(PASSWORD_REGEX, PASSWORD_MESSAGE)
    .required("Required"),
});

const ChangeUsernameForm = ({ setDialogStatus, onCloseDialog }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const { authState, updateUsername } = useContext(AccountContext);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const initialValues = {
    newName: "",
    password: "",
  };

  const handleSubmit = async (
    values: {
      newName: string;
      password: string;
    },
    props: FormikHelpers<{
      newName: string;
      password: string;
    }>
  ) => {
    props.setSubmitting(true);

    const changeUsernameResponseStatus = await updateUsername({
      currentPassword: values.password,
      newUsername: values.newName,
    });

    props.resetForm();
    props.setSubmitting(false);

    if (changeUsernameResponseStatus.message === "Success") {
      setDialogStatus("OPERATION_SUCCEEDED");
    } else {
      setDialogStatus("OPERATION_FAILED");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {(props) => (
        <Form>
          {props.isSubmitting ? (
            <>
              <DialogTitle id="change-username-dialog-title">
                Username change process in progress
              </DialogTitle>
              <DialogContent dividers={false}>
                <DialogContentText>
                  Please wait a moment, we are processing your request
                </DialogContentText>
                <LinearProgress color="success" />
              </DialogContent>
            </>
          ) : (
            <>
              <DialogTitle id="change-username-dialog-title">
                Change username
              </DialogTitle>
              <DialogContent dividers={false}>
                <DialogContentText>
                  Hello ${authState.user?.name}.
                </DialogContentText>
                <DialogContentText id="change-username-dialog-description">
                  To change your username, please enter your password and new
                  name
                </DialogContentText>
              </DialogContent>
            </>
          )}
          <DialogContent dividers={true}>
            <Stack justifyContent="center" alignItems="center">
              <TextField
                autoFocus
                margin="dense"
                color="secondary"
                variant="standard"
                label="Update username to:"
                name="username"
                placeholder="Enter new username"
                fullWidth
                required
                value={props.values.newName}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                error={props.touched.newName && Boolean(props.errors.newName)}
                helperText={props.touched.newName && props.errors.newName}
                sx={{ m: 1 }}
              />
              <FormControl variant="standard" fullWidth required sx={{ m: 1 }}>
                <InputLabel
                  htmlFor="change-username-password"
                  error={
                    props.touched.password && Boolean(props.errors.password)
                  }
                >
                  Password
                </InputLabel>
                <Input
                  value={props.values.password}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  error={
                    props.touched.password && Boolean(props.errors.password)
                  }
                  name="password"
                  placeholder="Enter your password"
                  id="change-username-password"
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
                {props.touched.password && props.errors.password && (
                  <FormHelperText
                    id="change-username-password-helper-text"
                    sx={{ color: "error.main" }}
                  >
                    {props.errors.password}
                  </FormHelperText>
                )}
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={onCloseDialog}
              variant="contained"
              disabled={props.isSubmitting}
              color="secondary"
              size="medium"
              type="button"
              endIcon={<CancelIcon />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="success"
              startIcon={
                props.isSubmitting ? (
                  <CircularProgress color="secondary" size={20} />
                ) : (
                  <PublishedWithChangesIcon />
                )
              }
              variant="contained"
              disabled={
                !props.isValid ||
                props.isSubmitting ||
                Object.values(props.values).every((ele) => ele === "")
              }
              sx={{ m: 1 }}
              fullWidth
            >
              {props.isSubmitting ? "Loading" : "Sign in"}
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};
export default ChangeUsernameForm;
