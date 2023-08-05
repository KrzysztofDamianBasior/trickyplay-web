import { FormikValues } from "formik";

import { Button, CircularProgress } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { useMediaQuery, useTheme } from "@mui/material";

interface Props {
  hasPrevious?: boolean;
  onBackClick: (values: FormikValues) => void;
  isLastStep: boolean;
  isDisabled: boolean;
  isSubmitting: boolean;
}
const FormNavigation = (props: Props) => {
  const theme = useTheme();
  const isMatchXS = useMediaQuery(theme.breakpoints.down("xs"));
  const isMatchSM = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div
      style={{
        display: "flex",
        marginTop: 50,
        justifyContent: "space-between",
      }}
    >
      {props.hasPrevious && (
        <Button
          variant="contained"
          type="button"
          onClick={props.onBackClick}
          size={isMatchXS ? "small" : isMatchSM ? "medium" : "large"}
        >
          Back
        </Button>
      )}
      <Button
        type="submit"
        variant="contained"
        size={isMatchXS ? "small" : isMatchSM ? "medium" : "large"}
        color={props.isLastStep ? "success" : "primary"}
        startIcon={
          props.isLastStep ? (
            props.isSubmitting ? (
              <CircularProgress color="secondary" size={20} />
            ) : (
              <LoginIcon />
            )
          ) : null
        }
        disabled={props.isDisabled}
      >
        {props.isLastStep
          ? props.isSubmitting
            ? "Loading"
            : "Submit"
          : "Next"}
      </Button>
    </div>
  );
};

export default FormNavigation;
