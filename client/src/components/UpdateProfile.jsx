import React, { useState } from "react";
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
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Dropzone from "react-dropzone";
import FlexBetween from "./UI/FlexBetween";
import NavBar from "./NavBar";
import { setLogin } from "store";

const validationSchema = yup.object().shape({
  firstName: yup.string().required("required").min(2).max(12),
  lastName: yup.string().required("required").min(2).max(12),
  email: yup.string().email("invalid email").required("required").max(50),
  password: yup.string().required("required").min(5),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const UpdateProfile = (props) => {
  const [clicked, setCliked] = useState(false);
  const [error, setError] = useState(false);
  const token = useSelector((state) => state.token);
  const { id } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const initialValues = {
    firstName: props.user.firstName,
    lastName: props.user.lastName,
    email: props.user.email,
    password: "",
    location: props.user.location,
    occupation: props.user.occupation,
    picture: props.user.picturePath,
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    setCliked(true);
    // values.picturePath = values.picture.name;
    // console.log(values.picture, values.picture.name);
    // delete values.picture;
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    if (values.picture.name) {
      formData.append("picturePath", values.picture.name);
    }
    // formData["picture"] = values.picture;
    for (var key of formData.entries()) {
      console.log(key[0] + ", " + key[1]);
    }
    onSubmitProps.resetForm();
    const savedUserResponse = await fetch(
      `https://snap-it-backend.onrender.com/auth/update/${id}`,
      {
        method: "PATCH",
        // headers: { "Content-Type": "application/json" },
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json();
    console.log(savedUser);
    if (savedUser.msg === "Incorrect Password") {
      values.password = "";
      setError(true);
      setCliked(false);
      return;
    }
    if (savedUser) {
      dispatch(setLogin({ user: savedUser.updatedUser, token }));
    }
    setCliked(false);
    navigate("/home");
  };

  if (error) {
    setTimeout(() => {
      setError(false);
    }, 5000);
  }

  return (
    <Box>
      <NavBar />
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to Snap-It, update your profile!
        </Typography>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
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
                <React.Fragment>
                  <TextField
                    label="First Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name="firstName"
                    error={
                      Boolean(touched.firstName) && Boolean(errors.firstName)
                    }
                    helperText={touched.firstName && errors.firstName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    label="Last Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    name="lastName"
                    error={
                      Boolean(touched.lastName) && Boolean(errors.lastName)
                    }
                    helperText={touched.lastName && errors.lastName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    label="Location"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.location}
                    name="location"
                    error={
                      Boolean(touched.location) && Boolean(errors.location)
                    }
                    helperText={touched.location && errors.location}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    label="Occupation"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.occupation}
                    name="occupation"
                    error={
                      Boolean(touched.occupation) && Boolean(errors.occupation)
                    }
                    helperText={touched.occupation && errors.occupation}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <Box
                    gridColumn="span 4"
                    border={`1px solid ${theme.palette.neutral.medium}`}
                    borderRadius="5px"
                    p="1rem"
                  >
                    <Dropzone
                      acceptedFiles=".jpg,.jpeg,.png"
                      multiple={false}
                      onDrop={(acceptedFiles) => {
                        setFieldValue("picture", acceptedFiles[0]);
                        console.log(acceptedFiles, values.pic);
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <Box
                          {...getRootProps()}
                          border={`2px dashed ${theme.palette.primary.main}`}
                          p="1rem"
                          sx={{ "&:hover": { cursor: "pointer" } }}
                        >
                          <input
                            type="file"
                            {...getInputProps()}
                            name="picture"
                          />
                          <FlexBetween>
                            <Typography>
                              {values.picture.name
                                ? values.picture.name
                                : values.picture}
                            </Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        </Box>
                      )}
                    </Dropzone>
                  </Box>
                </React.Fragment>

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
                <TextField
                  label="Confirm Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
              </Box>

              {/* ALERT */}
              {error && (
                <Box sx={{ width: "100%", pt: "2%" }}>
                  <Collapse in={error}>
                    <Alert
                      severity="error"
                      action={
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() => {
                            setError(false);
                          }}
                        >
                          <CloseIcon fontSize="inherit" />
                        </IconButton>
                      }
                      sx={{ fontSize: "0.95rem" }}
                    >
                      Incorrect Password
                    </Alert>
                  </Collapse>
                </Box>
              )}

              {/* BUTTONS */}
              <Box>
                <Button
                  fullWidth
                  type="submit"
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
                  disabled={
                    clicked ||
                    Object.keys(errors).length !== 0 ||
                    !values.password
                  }
                >
                  {!clicked ? "UPDATE" : "WAIT..."}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default UpdateProfile;
