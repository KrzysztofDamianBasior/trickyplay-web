import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Stack, Paper, Avatar, Typography } from "@mui/material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

import { FormikHelpers } from "formik";
import * as Yup from "yup";

import { AuthContext } from "../../../shared/auth/useAuth";
import {
  USERNAME_REGEX,
  PASSWORD_REGEX,
  PASSWORD_MESSAGE,
  USERNAME_MESSAGE,
} from "../../../shared/data/auth";
import MultiStepForm from "./MultiStepForm";
import UsernameField from "./UsernameField";
import PasswordField from "./PasswordField";
import ToSCheckboxField from "./ToSCheckboxField";
import ToSAccordion from "./ToSAccordion";

export type SignUpFormFieldsType = {
  username: string;
  password: string;
  passwordConfirmation: string;
  termsAndConditions: boolean;
};

const SignUp = () => {
  const { signUp } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  interface LocationState {
    from: {
      pathname: string;
    };
  }
  const from = (location.state as LocationState)?.from?.pathname || "/";

  const initialValues = {
    username: "",
    password: "",
    passwordConfirmation: "",
    termsAndConditions: false,
  };

  const loginCredentialsValidationSchema = Yup.object().shape({
    username: Yup.string()
      .matches(USERNAME_REGEX, USERNAME_MESSAGE)
      .required("Please enter your username"),
    password: Yup.string()
      .matches(PASSWORD_REGEX, PASSWORD_MESSAGE)
      .required("Please enter your password"),
    passwordConfirmation: Yup.string()
      .required("Please confirm your password")
      .test("passwords-match", "Passwords must match", function (value) {
        return this.parent.password === value;
      }),
    // Allowed special characters:
    // <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
  });

  const termsOfServiceValidationSchema = Yup.object().shape({
    termsAndConditions: Yup.bool().oneOf(
      [true],
      "You need to accept the terms and conditions"
    ),
  });

  const handleSubmit = async (
    values: {
      username: string;
      password: string;
      passwordConfirmation: string;
      termsAndConditions: boolean;
    },
    props: FormikHelpers<{
      username: string;
      password: string;
      passwordConfirmation: string;
      termsAndConditions: boolean;
    }>
  ) => {
    props.setSubmitting(true);
    const status = await signUp({
      username: values.username,
      password: values.password,
    });
    console.log(status);
    console.log({
      username: values.username,
      password: values.password,
      passwordConfirmation: values.passwordConfirmation,
      tos: values.termsAndConditions,
    });
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(2000);
    props.setSubmitting(false);
    navigate(from, { replace: true });
    props.resetForm();
  };

  return (
    <Paper
      sx={{
        padding: 2,
        height: "600px",
        margin: "0 auto",
        overflow: "auto",
      }}
    >
      <Stack justifyContent="center" alignItems="center">
        <Stack justifyContent="center" alignItems="center">
          <Avatar sx={{ backgroundColor: "primary.main" }}>
            <AppRegistrationIcon />
          </Avatar>
          <h2 style={{ margin: 0 }}>Sign Up</h2>
          <Typography variant="caption" gutterBottom>
            Please fill this form to create an account!
          </Typography>
        </Stack>
        <MultiStepForm initialValues={initialValues} onSubmit={handleSubmit}>
          <FormStep
            stepName="Login credentials"
            onSubmit={() => console.log("Step1 onSubmit")}
            validationSchema={loginCredentialsValidationSchema}
          >
            <UsernameField
              label="Username"
              name="username"
              placeholder="Enter username"
            />
            <PasswordField
              label="Password"
              name="password"
              placeholder="Enter password"
              id="password-field"
            />
            <PasswordField
              label="Password Confirmation"
              name="passwordConfirmation"
              placeholder="Confirm password"
              id="password-confirmation-field"
            />
          </FormStep>
          <FormStep
            stepName="Terms of service"
            onSubmit={() => console.log("Step2 submit")}
            validationSchema={termsOfServiceValidationSchema}
          >
            <ToSAccordion />
            <ToSCheckboxField
              label="I accept the terms and conditions"
              name="termsAndConditions"
            />
          </FormStep>
        </MultiStepForm>
      </Stack>
    </Paper>
  );
};

export default SignUp;

const FormStep = ({ stepName = "", children }: any) => children;
