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

import { type ChangePasswordDialogStatusType } from "..";

import {
  PASSWORD_MESSAGE,
  PASSWORD_REGEX,
} from "../../../services/account/authenticationConstraints";
import { AccountContext } from "../../../services/account/AccountContext";

type Props = {
  setDialogStatus: (status: ChangePasswordDialogStatusType) => void;
  onCloseDialog: () => void;
};

const validationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .matches(PASSWORD_REGEX, PASSWORD_MESSAGE)
    .required("Please enter your password"),
  // .test(
  //   "password-hasnt-chaged",
  //   "Your new password is identical to the old one",
  //   function (value) {
  //     return this.parent.previousPassword !== value;
  //   }
  // ),
  newPasswordConfirmation: Yup.string()
    .required("Please confirm your new password")
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.newPassword === value;
    }),
});

const ChangePasswordForm = ({ setDialogStatus, onCloseDialog }: Props) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirmation, setShowNewPasswordConfirmation] =
    useState(false);

  const { authState, updatePassword } = useContext(AccountContext);

  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
  const handleClickShowNewPasswordConfirmation = () =>
    setShowNewPasswordConfirmation((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const initialValues = {
    newPassword: "",
    newPasswordConfirmation: "",
  };

  const handleSubmit = async (
    values: {
      newPassword: string;
      newPasswordConfirmation: string;
    },
    props: FormikHelpers<{
      newPassword: string;
      newPasswordConfirmation: string;
    }>
  ) => {
    props.setSubmitting(true);

    const changePasswordResponseStatus = await updatePassword({
      newPassword: values.newPasswordConfirmation,
    });

    props.resetForm();
    props.setSubmitting(false);

    if (changePasswordResponseStatus.message === "Success") {
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
              <DialogTitle id="change-password-dialog-title">
                Password change process in progress
              </DialogTitle>
              <DialogContent dividers={false}>
                <DialogContentText id="change-password-dialog-description">
                  Please wait a moment, we are processing your request
                </DialogContentText>
                <LinearProgress color="success" />
              </DialogContent>
            </>
          ) : (
            <>
              <DialogTitle id="change-password-dialog-title">
                Change password
              </DialogTitle>
              <DialogContent dividers={false}>
                <DialogContentText>
                  Hello {authState.user?.name}!
                </DialogContentText>
                <DialogContentText id="change-password-dialog-description">
                  To change your password, please enter the the new password and
                  repeat it to avoid mistakes
                </DialogContentText>
              </DialogContent>
            </>
          )}
          <DialogContent dividers={true}>
            <Stack justifyContent="center" alignItems="center">
              <FormControl variant="standard" fullWidth required sx={{ m: 1 }}>
                <InputLabel
                  htmlFor="new-password"
                  error={
                    props.touched.newPassword &&
                    Boolean(props.errors.newPassword)
                  }
                >
                  New password
                </InputLabel>
                <Input
                  value={props.values.newPassword}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  error={
                    props.touched.newPassword &&
                    Boolean(props.errors.newPassword)
                  }
                  name="newPassword"
                  placeholder="Enter your new password"
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowNewPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {props.touched.newPassword && props.errors.newPassword && (
                  <FormHelperText
                    id="new-password-helper-text"
                    sx={{ color: "error.main" }}
                  >
                    {props.errors.newPassword}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl variant="standard" fullWidth required sx={{ m: 1 }}>
                <InputLabel
                  htmlFor="new-password-confirmation"
                  error={
                    props.touched.newPasswordConfirmation &&
                    Boolean(props.errors.newPasswordConfirmation)
                  }
                >
                  Confirm new password
                </InputLabel>
                <Input
                  value={props.values.newPasswordConfirmation}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  error={
                    props.touched.newPasswordConfirmation &&
                    Boolean(props.errors.newPasswordConfirmation)
                  }
                  name="newPasswordConfirmation"
                  placeholder="Repeat new password"
                  id="new-password-confirmation"
                  type={showNewPasswordConfirmation ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowNewPasswordConfirmation}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showNewPasswordConfirmation ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {props.touched.newPasswordConfirmation &&
                  props.errors.newPasswordConfirmation && (
                    <FormHelperText
                      id="new-password-confirmation-helper-text"
                      sx={{ color: "error.main" }}
                    >
                      {props.errors.newPasswordConfirmation}
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
              endIcon={
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
              {props.isSubmitting ? "Loading" : "Change password"}
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};
export default ChangePasswordForm;
