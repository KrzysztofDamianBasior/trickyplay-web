import { useContext, useState } from "react";

import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";

import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";

import CancelIcon from "@mui/icons-material/Cancel";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

import { DialogsContext } from "../../../services/dialogs/DialogsContext";

import { DeleteAccountDialogStatusType } from "..";
import {
  AccountContext,
  DeleteAccountResultType,
} from "../../../services/account/AccountContext";
import {
  PASSWORD_MESSAGE,
  PASSWORD_REGEX,
} from "../../../services/account/authenticationConstraints";

type Props = {
  setDeleteAccountDialogStatus: (
    newStatus: DeleteAccountDialogStatusType
  ) => void;
  setDeleteAccountResult: (result: Awaited<DeleteAccountResultType>) => void;
};

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .matches(PASSWORD_REGEX, PASSWORD_MESSAGE)
    .required("Required"),
  confirmation: Yup.boolean()
    .oneOf([true], "You need to confirm account deletion")
    .required("Required"),
});

const initialValues = {
  password: "",
  confirmation: false,
};

const DeleteEntitiesConfirmation = ({
  setDeleteAccountDialogStatus,
  setDeleteAccountResult,
}: Props) => {
  const { deleteAccountConfirmationDialogManager } = useContext(DialogsContext);
  const { deleteMyAccount } = useContext(AccountContext);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const { closeDialog } = deleteAccountConfirmationDialogManager;

  const handleCancel = () => {
    closeDialog();
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSubmit = async (
    values: {
      password: string;
      confirmation: boolean;
    },
    props: FormikHelpers<{
      password: string;
      confirmation: boolean;
    }>
  ) => {
    props.setSubmitting(true);

    const deleteAccountResult = await deleteMyAccount({
      password: values.password,
    });
    setDeleteAccountResult(deleteAccountResult);

    console.log(deleteAccountResult);

    props.resetForm();
    props.setSubmitting(false);

    if (deleteAccountResult.message === "Success") {
      setDeleteAccountDialogStatus("OPERATION_FAILED");
      setDeleteAccountResult(deleteAccountResult);
    } else {
      setDeleteAccountDialogStatus("OPERATION_SUCCEEDED");
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {(props) => (
          <Form>
            {props.isSubmitting ? (
              <>
                <DialogTitle id="delete-account-dialog-title">
                  Account deletion process in progress
                </DialogTitle>
                <DialogContent
                  dividers={false}
                  id="delete-account-dialog-description"
                >
                  <DialogContentText>
                    Please wait a moment, we are processing your request
                  </DialogContentText>
                  <LinearProgress color="success" />
                </DialogContent>
              </>
            ) : (
              <>
                <DialogTitle id="delete-account-dialog-title">
                  Delete your TickyPlay account
                </DialogTitle>
                <DialogContent
                  dividers={true}
                  id="delete-account-dialog-description"
                >
                  <DialogContentText>
                    Are you sure you want to delete your account? The operation
                    is irreversible. All your activity, comments and replies
                    will be deleted.
                  </DialogContentText>
                </DialogContent>
              </>
            )}
            <DialogContent dividers={true}>
              <Stack justifyContent="center" alignItems="center">
                <FormControl
                  variant="standard"
                  fullWidth
                  required
                  sx={{ m: 1 }}
                >
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
                    id="confirmation-password"
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
                <FormControlLabel
                  value={props.values.confirmation}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  name="confirmation"
                  id="confirmation-checkbox"
                  required
                  control={<Checkbox />}
                  label="I confirm that I want to delete my account"
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCancel}
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
                {props.isSubmitting ? "Loading" : "Delete account"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </>
  );
};
export default DeleteEntitiesConfirmation;
