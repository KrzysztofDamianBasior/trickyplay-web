import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";

import {
  Stack,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  Link,
  Input,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment,
  FormHelperText,
  CircularProgress,
} from "@mui/material";

import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { AccountContext } from "../../../shared/services/account/AccountContext";
import {
  USERNAME_REGEX,
  PASSWORD_REGEX,
  USERNAME_MESSAGE,
  PASSWORD_MESSAGE,
} from "../../../shared/services/account/authenticationConstraints";

const SignIn = ({
  handleChange,
}: {
  handleChange: (event: any, newValue: any) => void;
}) => {
  const { signIn } = useContext(AccountContext);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

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
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .matches(USERNAME_REGEX, USERNAME_MESSAGE)
      .required("Required"),
    password: Yup.string()
      .matches(PASSWORD_REGEX, PASSWORD_MESSAGE)
      .required("Required"),
    // Allowed special characters:
    // <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
  });

  const handleSubmit = async (
    values: {
      username: string;
      password: string;
    },
    props: FormikHelpers<{
      username: string;
      password: string;
    }>
  ) => {
    props.setSubmitting(true);
    const status = await signIn({
      username: values.username,
      password: values.password,
    });
    props.resetForm();
    props.setSubmitting(false);
    navigate(from, { replace: true });
  };

  return (
    <Paper
      sx={{
        p: { xs: 1, sm: 2, md: 3, lg: 4 },
        margin: "0 auto",
        overflow: "auto",
      }}
    >
      <Stack justifyContent="center" alignItems="center">
        <Avatar sx={{ backgroundColor: "primary.main" }}>
          <LockIcon />
        </Avatar>
        <h2>Sign In</h2>
        <Typography variant="caption" gutterBottom>
          Please fill this form to sign in!
        </Typography>
      </Stack>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {(props) => (
          <Form style={{ marginTop: "10px" }}>
            <Stack justifyContent="center" alignItems="center">
              <TextField
                variant="standard"
                label="Username"
                name="username"
                placeholder="Enter username"
                fullWidth
                required
                value={props.values.username}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                error={props.touched.username && Boolean(props.errors.username)}
                helperText={props.touched.username && props.errors.username}
                sx={{ m: 1 }}
              />
              <FormControl variant="standard" fullWidth required sx={{ m: 1 }}>
                <InputLabel
                  htmlFor="sign-in-password"
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
                  placeholder="Enter password"
                  id="sign-in-password"
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
                    id="sign-in-password-helper-text"
                    sx={{ color: "error.main" }}
                  >
                    {props.errors.password}
                  </FormHelperText>
                )}
              </FormControl>
              <Button
                type="submit"
                color="success"
                startIcon={
                  props.isSubmitting ? (
                    <CircularProgress color="secondary" size={20} />
                  ) : (
                    <LoginIcon />
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
            </Stack>
          </Form>
        )}
      </Formik>
      <Typography sx={{ m: { xs: 1, sm: 2, md: 3 } }}>
        Need an Account?{" "}
        <Link href="#" onClick={() => handleChange("event", 1)}>
          Sign Up
        </Link>
      </Typography>
    </Paper>
  );
};

export default SignIn;
