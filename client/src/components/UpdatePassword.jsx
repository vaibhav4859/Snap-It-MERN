import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  Collapse,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "./NavBar";
import { setLogin } from "store";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const validationSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required").max(50),
  otp: yup.string().required("required").length(4),
  newPassword: yup.string().required("required").min(5),
  confirmPassword: yup
    .string()
    .required("required")
    .min(5)
    .oneOf([yup.ref("newPassword"), null], "Password does not match"),
});

const UpdatePassword = (props) => {
  const [clicked, setClicked] = useState(false);
  const [otpClick, setOtpClick] = useState(false);
  const [otpVerify, setOtpVerify] = useState(false);
  const [otpError, setOtpError] = useState(false); // eslint-disable-next-line
  const [reRender, setReRender] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const otpRef = useRef(null);
  const token = useSelector((state) => state.token);
  let { id } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const initialValues = {
    email: props.user.email,
    otp: "",
    newPassword: "",
    confirmPassword: "",
  };

  if (otpError) {
    setTimeout(() => {
      setOtpClick(false);
      setOtpVerify(false);
      setOtpError(false);
    }, 2500);
  }

  const handleFormSubmit = async (values, onSubmitProps) => {
    setClicked(true);
    onSubmitProps.resetForm();
    const savedUserResponse = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/users/${id}/update/password`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: otpRef.current.values.email,
          newPassword: otpRef.current.values.newPassword,
        }),
      }
    );
    const newUser = await savedUserResponse.json();

    if (newUser.error) {
      setClicked(false);
      return;
    }
    if (newUser) {
      setClicked(false);
      dispatch(setLogin({ user: newUser, token: token }));
      if (props.forgot) navigate("/");
      else navigate("/home");
    }
  };

  const sendOtp = async (values, onSubmitProps) => {
    let user;
    if (props.forgot) {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/forgot/password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: otpRef.current.values.email,
          }),
        }
      );

      user = await response.json();

      if (user.length === 0) {
        alert("User with this email id doesn't exist");
        otpRef.current.values.email = "";
        setReRender((prev) => !prev);
        return;
      }
    }
    setClicked(true);
    if (user) id = user[0]._id;
    console.log(id);
    const otpResponse = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/users/${id}/update/password/sendotp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${otpRef.current.values.firstName} ${otpRef.current.values.lastName}`,
          email: otpRef.current.values.email,
        }),
      }
    );
    const newUserWithOtp = await otpResponse.json();
    if (newUserWithOtp.error) {
      setClicked(false);
      return;
    }
    if (newUserWithOtp) {
      otpRef.current.values.otp = "";
      setOtpClick(true);
      setClicked(false);
      dispatch(setLogin({ user: newUserWithOtp, token: token }));
    }
  };

  const verifyOtp = async (values, onSubmitProps) => {
    setClicked(true);
    setOtpVerify(true);
    const otpResponse = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/users/${id}/update/password/verifyotp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enteredOtp: otpRef.current.values.otp,
          email: otpRef.current.values.email,
        }),
      }
    );
    const verified = await otpResponse.json();
    if (verified.error) {
      setClicked(false);
      return;
    }

    if (verified) {
      setOtpVerify(true);
    } else setOtpError(true);
    setClicked(false);
  };

  return (
    <Box>
      {!props.forgot && <NavBar user={props.user} />}
      <Box
        width={props.forgot ? "100%" : isNonMobileScreens ? "50%" : "93%"}
        p={props.forgot ? "" : "2rem"}
        m={props.forgot ? "" : "2rem auto"}
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        {!props.forgot && (
          <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
            Welcome to Snap-It, update your password!
          </Typography>
        )}
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
          innerRef={otpRef}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                {!otpError && otpClick && !otpVerify && (
                  <TextField
                    label="Enter your OTP"
                    type="text"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.otp}
                    name="otp"
                    error={Boolean(touched.otp) && Boolean(errors.otp)}
                    helperText={touched.otp && errors.otp}
                    sx={{ gridColumn: "span 4" }}
                  />
                )}
                {otpClick && !otpVerify && (
                  <Typography
                    fontWeight="400"
                    variant="h5"
                    sx={{
                      width: "20rem",
                      color: theme.palette.primary.main,
                      mt: "-1.3rem",
                      ml: "0.4rem",
                    }}
                  >
                    Check your e-mail and enter the otp
                  </Typography>
                )}
                {!otpError && otpVerify && otpClick && (
                  <TextField
                    label="Enter new Password"
                    type={showPassword ? "text" : "password"} 
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.newPassword}
                    name="newPassword"
                    error={
                      Boolean(touched.newPassword) &&
                      Boolean(errors.newPassword)
                    }
                    helperText={touched.newPassword && errors.newPassword}
                    sx={{ gridColumn: "span 4" }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(prev => !prev)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
                {!otpError && otpVerify && otpClick && (
                  <TextField
                    label="Confirm new password"
                    type={showConfirmPassword ? "text" : "password"} 
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.confirmPassword}
                    name="confirmPassword"
                    error={
                      Boolean(touched.confirmPassword) &&
                      Boolean(errors.confirmPassword)
                    }
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                    sx={{ gridColumn: "span 4" }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowConfirmPassword(prev => !prev)}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              </Box>

              {/* ALERT */}
              {otpError && (
                <Box sx={{ width: "100%", pt: "2%" }}>
                  <Collapse in={otpError}>
                    <Alert
                      severity="error"
                      action={
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() => {
                            setOtpError(false);
                          }}
                        >
                          <CloseIcon fontSize="inherit" />
                        </IconButton>
                      }
                      sx={{ fontSize: "0.95rem" }}
                    >
                      Incorrect Otp
                    </Alert>
                  </Collapse>
                </Box>
              )}

              {/* BUTTONS */}
              <Box>
                <Button
                  fullWidth
                  type={otpClick && otpVerify ? "submit" : "button"}
                  sx={{
                    m: "2rem 0",
                    p: "1rem",
                    backgroundColor: !clicked
                      ? theme.palette.primary.main
                      : "#808080",
                    color: !clicked ? theme.palette.background.alt : "#101010",
                    "&:hover": {
                      color: !clicked ? theme.palette.primary.main : null,
                      backgroundColor: !clicked ? null : "#808080",
                    },
                    "&:disabled": {
                      color: !clicked
                        ? theme.palette.background.alt
                        : "#101010",
                    },
                  }}
                  // disabled={Object.keys(errors).length !== 0}
                  disabled={
                    (otpClick && (values.otp.length === 0 || errors.otp)) ||
                    (otpClick &&
                      otpVerify &&
                      (errors.newPassword || errors.confirmPassword))
                  }
                  onClick={!otpClick ? sendOtp : verifyOtp}
                >
                  {clicked
                    ? "WAIT..."
                    : !otpClick || otpError
                    ? "SEND OTP"
                    : !otpVerify
                    ? "VERIFY OTP"
                    : "UPDATE PASSWORD"}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default UpdatePassword;
