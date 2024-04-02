import { FormikValues } from "formik";

import {
  Box,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

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
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        m: { xs: 1, sm: 2, md: 3 },
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
    </Box>
  );
};

export default FormNavigation;
