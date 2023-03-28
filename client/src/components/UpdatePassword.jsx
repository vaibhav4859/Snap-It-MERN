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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "./NavBar";
import { setLogin } from "store";

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
  const [otpError, setOtpError] = useState(false);
  const otpRef = useRef(null);
  const token = useSelector((state) => state.token);
  const { id } = useParams();
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
      `https://snap-it-backend.onrender.com/users/${id}/update/password`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: props.user.email,
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
      navigate("/home");
    }
  };

  const sendOtp = async (values, onSubmitProps) => {
    setClicked(true);
    const otpResponse = await fetch(
      `https://snap-it-backend.onrender.com/users/${id}/update/password/sendotp`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${props.user.firstName} ${props.user.lastName}`,
          email: props.user.email,
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
      `https://snap-it-backend.onrender.com/users/${id}/update/password/verifyotp`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enteredOtp: otpRef.current.values.otp,
          email: props.user.email,
        }),
      }
    );
    // values.otp = "";
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
      <NavBar user={props.user} />
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to Snap-It, update your password!
        </Typography>
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
                    type="password"
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
                  />
                )}
                {!otpError && otpVerify && otpClick && (
                  <TextField
                    label="Confirm new password"
                    type="password"
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
