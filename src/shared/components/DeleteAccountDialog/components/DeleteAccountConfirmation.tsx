import { useContext } from "react";

import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";

import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";

import CancelIcon from "@mui/icons-material/Cancel";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";

import { type DeleteAccountDialogStatusType } from "..";
import {
  AccountContext,
  type DeleteAccountResultType,
} from "../../../services/account/AccountContext";

type Props = {
  setDeleteAccountDialogStatus: (
    newStatus: DeleteAccountDialogStatusType
  ) => void;
  setDeleteAccountResult: (result: Awaited<DeleteAccountResultType>) => void;
  onCloseDialog: () => void;
};

const validationSchema = Yup.object().shape({
  confirmation: Yup.boolean()
    .oneOf([true], "You need to confirm account deletion")
    .required("Required"),
});

const initialValues = {
  confirmation: false,
};

const DeleteEntitiesConfirmation = ({
  setDeleteAccountDialogStatus,
  setDeleteAccountResult,
  onCloseDialog,
}: Props) => {
  const { deleteAccount } = useContext(AccountContext);

  const handleSubmit = async (
    values: {
      confirmation: boolean;
    },
    props: FormikHelpers<{
      confirmation: boolean;
    }>
  ) => {
    props.setSubmitting(true);

    const deleteAccountResult = await deleteAccount();
    setDeleteAccountResult(deleteAccountResult);

    props.resetForm();
    props.setSubmitting(false);

    if (deleteAccountResult.message === "Success") {
      setDeleteAccountDialogStatus("OPERATION_SUCCEEDED");
      setDeleteAccountResult(deleteAccountResult);
    } else {
      setDeleteAccountDialogStatus("OPERATION_FAILED");
      setDeleteAccountResult(deleteAccountResult);
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
                  Object.values(props.values).every((ele) => ele === false)
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
