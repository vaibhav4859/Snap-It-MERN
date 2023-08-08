import React, { useEffect, useState } from "react";
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
import { setPosts } from "store";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";

const validationSchema = yup.object().shape({
  firstName: yup.string().required("required").min(2).max(12),
  lastName: yup.string().required("required").min(2).max(12),
  email: yup.string().email("invalid email").required("required").max(50),
  password: yup.string().required("required").min(5),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  profilePhoto: yup.string().required("required"),
});

const UpdateProfile = (props) => {
  const [clicked, setClicked] = useState(false);
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
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
    profilePhoto: "Click here to change your profile photo",
  };

  const uploadImage = async () => {
    if (image !== null) {
      const fileName = new Date().getTime() + image?.name;
      const storage = getStorage(app);
      const StorageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(StorageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            setImageUrl(downloadURL);
          });
        }
      );
    }
  };

  useEffect(() => {
    uploadImage(); // eslint-disable-next-line
  }, [image]);

  const handleFormSubmit = async (values, onSubmitProps) => {
    setClicked(true);
    const formData = {
      ...values,
    };

    if (values.profilePhoto !== "Click here to change your profile photo") {
      formData.profilePhoto = imageUrl;
    } else formData.profilePhoto = props.user.profilePhoto;

    onSubmitProps.resetForm();
    const savedUserResponse = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/auth/update/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
    const { updatedUser: savedUser, updatedPosts } =
      await savedUserResponse.json();
    if (savedUser.msg === "Incorrect Password") {
      values.password = "";
      setError(true);
      setClicked(false);
      return;
    }
    if (savedUser) {
      dispatch(setLogin({ user: savedUser, token }));
    }
    if (updatedPosts) {
      dispatch(setPosts({ posts: updatedPosts }));
    }
    setClicked(false);
    navigate("/home");
  };

  if (error) {
    setTimeout(() => {
      setError(false);
    }, 5000);
  }

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
            resetForm,
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
                      accept={{
                        "image/png": [".png"],
                        "image/jpg": [".jpg"],
                        "image/jpeg": [".jpeg"],
                      }}
                      multiple={false}
                      onDrop={(acceptedFiles) => {
                        setFieldValue("profilePhoto", acceptedFiles[0]);
                        setImage(acceptedFiles[0]);
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
                            name="profilePhoto"
                          />
                          <FlexBetween>
                            <Typography>
                              {values.profilePhoto !==
                              "Click here to change your profile photo"
                                ? values.profilePhoto.name
                                : "Click here to change your profile photo"}
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
                  type={showPassword ? "text" : "password"}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Forgot Password */}
              <Typography
                onClick={() => {
                  resetForm();
                  navigate(`/update/${id}/password`);
                }}
                sx={{
                  mt: "1rem",
                  ml: "0.5rem",
                  fontWeight: "bold",
                  width: "8rem",
                  textDecoration: "underline",
                  color: theme.palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: theme.palette.primary.light,
                  },
                }}
              >
                Forgot Password?
              </Typography>

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
