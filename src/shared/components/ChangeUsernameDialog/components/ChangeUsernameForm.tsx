import { useContext } from "react";

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
import Stack from "@mui/material/Stack";

import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import CancelIcon from "@mui/icons-material/Cancel";

import { type ChangeUsernameDialogStatusType } from "..";
import {
  USERNAME_MESSAGE,
  USERNAME_REGEX,
} from "../../../services/account/authenticationConstraints";
import { AccountContext } from "../../../services/account/AccountContext";

type Props = {
  setDialogStatus: (status: ChangeUsernameDialogStatusType) => void;
  onCloseDialog: () => void;
};

const validationSchema = Yup.object().shape({
  newUsername: Yup.string()
    .matches(USERNAME_REGEX, USERNAME_MESSAGE)
    .required("Required"),
});

const ChangeUsernameForm = ({ setDialogStatus, onCloseDialog }: Props) => {
  const { authState, updateUsername } = useContext(AccountContext);

  const initialValues = {
    newUsername: "",
  };

  const handleSubmit = async (
    values: {
      newUsername: string;
    },
    props: FormikHelpers<{
      newUsername: string;
    }>
  ) => {
    props.setSubmitting(true);

    const changeUsernameResponseStatus = await updateUsername({
      newUsername: values.newUsername,
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
                  Hello {authState.user?.name}!
                </DialogContentText>
                <DialogContentText id="change-username-dialog-description">
                  To change your username, please enter your new name
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
                name="newUsername"
                placeholder="Enter new username"
                fullWidth
                required
                value={props.values.newUsername}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                error={
                  props.touched.newUsername && Boolean(props.errors.newUsername)
                }
                helperText={
                  props.touched.newUsername && props.errors.newUsername
                }
                sx={{ m: 1 }}
              />
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
              {props.isSubmitting ? "Loading" : "Change username"}
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};
export default ChangeUsernameForm;
