import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  Button,
  TextField,
} from "@mui/material";
import UserImage from "../UI/UserImage";
import FlexBetween from "../UI/FlexBetween";
import WidgetWrapper from "../UI/WidgetWrapper";
import { useNavigate } from "react-router-dom";
import LinkedInImg from "../../assets/linkedin.png";
import TwitterImg from "../../assets/twitter.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "store";
import DeleteAccountWidget from "./DeleteAccountWidget";

function isValidTwitterUrl(twitterUrl) {
  const regex = /^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?$/;
  return regex.test(twitterUrl) || !twitterUrl.length;
}

function isValidLinkedInUrl(linkedinUrl) {
  const regex = /^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
  return regex.test(linkedinUrl) || !linkedinUrl.length;
}

const UserWidget = (props) => {
  const [showLinkedin, setShowLinkedin] = useState(false);
  const [linkedinValue, setLinkedinValue] = useState(props.user.linkedinUrl);
  const [showTwitter, setShowTwitter] = useState(false);
  const [twitterValue, setTwitterValue] = useState(props.user.twitterUrl);
  const [clicked, setClicked] = useState(false);
  const [update, setUpdate] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const token = useSelector((state) => state.token);
  const myself = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const dark = theme.palette.neutral.dark;
  const medium = theme.palette.neutral.medium;
  const main = theme.palette.neutral.main;
  useEffect(() => {}, [props.user]);

  if (!props.user) return null;

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = props.user;

  const addProfiles = async (e) => {
    e.preventDefault();
    setClicked(true);
    setLinkedinValue("");
    setTwitterValue("");

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/users/${props.user._id}/update/socialprofile`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          linkedinURL:
            update === "linkedin" ? linkedinValue : props.user.linkedinUrl,
          twitterURL:
            update === "twitter" ? twitterValue : props.user.twitterUrl,
        }),
      }
    );

    const updatedUser = await response.json();

    if (updatedUser.error) {
      setClicked(false);
      return;
    }

    if (updatedUser) {
      if (update === "linkedin") setShowLinkedin(false);
      else if (update === "twitter") setShowTwitter(false);
      setClicked(false);
      dispatch(setLogin({ user: updatedUser, token: token }));
    }
  };

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${props.user._id}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={props.user.profilePhoto} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: theme.palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography color={medium}>{friends?.length} friends</Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined />
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {impressions}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <FlexBetween gap="1rem" mb="0.5rem">
          {!showTwitter && (
            <>
              <FlexBetween gap="1rem">
                <img src={TwitterImg} alt="twitter" />
                <Box>
                  <Typography fontWeight="500" color={main}>
                    {!props.user.twitterUrl ? (
                      "Twitter"
                    ) : (
                      <a
                        href={`//:${props.user.twitterUrl}`}
                        target="_blank"
                        style={{ textDecoration: "none", color: "#00D5FA" }}
                        rel="noreferrer"
                      >
                        Twitter
                      </a>
                    )}
                  </Typography>
                  <Typography color={medium}>Social Network</Typography>
                </Box>
              </FlexBetween>
              {(props.userId === myself._id || props.home) && (
                <EditOutlined
                  sx={{ color: main }}
                  onClick={() => setShowTwitter(true)}
                />
              )}
            </>
          )}
          {showTwitter && (
            <FlexBetween gap="1rem">
              <img src={TwitterImg} alt="twitter" />
              <form onSubmit={addProfiles}>
                <TextField
                  label="Enter your Twitter url"
                  onChange={(e) => setTwitterValue(e.target.value.trimStart())}
                  value={twitterValue}
                  name="twitter"
                  error={!isValidTwitterUrl(twitterValue)}
                  helperText={
                    !isValidTwitterUrl(twitterValue)
                      ? "Enter valid twitter url"
                      : !twitterValue.length && props.user.twitterUrl
                      ? "Wanna remove your twitter handle? Add empty field"
                      : ""
                  }
                  sx={{ gridColumn: "span 2", width: "67%" }}
                  size="small"
                />
                <Button
                  type="submit"
                  sx={{
                    mt: "0.15rem",
                    ml: "0.5rem",
                    p: "0.4rem 0",
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
                  disabled={clicked || !isValidTwitterUrl(twitterValue)}
                  onClick={() => setUpdate("twitter")}
                >
                  ADD
                </Button>
              </form>
            </FlexBetween>
          )}
        </FlexBetween>

        <FlexBetween gap="1rem" mb="1rem">
          {!showLinkedin && (
            <>
              <FlexBetween gap="1rem">
                <img src={LinkedInImg} alt="linkedin" />
                <Box>
                  <Typography color={main} fontWeight="500">
                    {!props.user.linkedinUrl ? (
                      "Linkedin"
                    ) : (
                      <a
                        href={`//:${props.user.linkedinUrl}`}
                        target="_blank"
                        style={{ textDecoration: "none", color: "#00D5FA" }}
                        rel="noreferrer"
                      >
                        Linkedin
                      </a>
                    )}
                  </Typography>
                  <Typography color={medium}>Network Platform</Typography>
                </Box>
              </FlexBetween>
              {(props.userId === myself._id || props.home) && (
                <EditOutlined
                  sx={{ color: main }}
                  onClick={() => setShowLinkedin(true)}
                />
              )}
            </>
          )}
          {showLinkedin && (
            <FlexBetween gap="1rem">
              <img src={LinkedInImg} alt="linkedin" />
              <form onSubmit={addProfiles}>
                <TextField
                  label="Enter your Linkedin url"
                  onChange={(e) => setLinkedinValue(e.target.value.trimStart())}
                  value={linkedinValue}
                  name="linkedin"
                  error={
                    !isValidLinkedInUrl(linkedinValue) && linkedinValue.length
                  }
                  helperText={
                    !isValidLinkedInUrl(linkedinValue)
                      ? "Enter valid linkedin url"
                      : !linkedinValue.length && props.user.linkedinUrl
                      ? "Wanna remove your linkedin handle? Add empty field"
                      : ""
                  }
                  sx={{ gridColumn: "span 2", width: "67%" }}
                  size="small"
                />
                <Button
                  type="submit"
                  sx={{
                    mt: "0.15rem",
                    ml: "0.5rem",
                    p: "0.4rem 0",
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
                  disabled={clicked || !isValidLinkedInUrl(linkedinValue)}
                  onClick={() => setUpdate("linkedin")}
                >
                  ADD
                </Button>
              </form>
            </FlexBetween>
          )}
        </FlexBetween>

        {(props.userId === myself._id || props.home) && (
          <div>
            <Divider />
            <Button
              fullWidth
              type="button"
              sx={{
                m: "1rem 0",
                p: "0.3rem",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.background.alt,
                "&:hover": {
                  color: theme.palette.primary.main,
                },
              }}
              onClick={() => navigate(`/update/${props.user._id}`)}
            >
              UPDATE PROFILE
            </Button>
            <Typography
              color={main}
              fontWeight="500"
              textAlign="center"
              margin="-0.6rem 0"
            >
              OR
            </Typography>
            <Button
              fullWidth
              type="button"
              sx={{
                m: "1rem 0",
                p: "0.3rem",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.background.alt,
                "&:hover": {
                  color: theme.palette.primary.main,
                },
              }}
              onClick={() => navigate(`/update/${props.user._id}/password`)}
            >
              UPDATE PASSWORD
            </Button>
            <Typography
              color={main}
              fontWeight="500"
              textAlign="center"
              margin="-0.6rem 0"
            >
              OR
            </Typography>
            <Button
              fullWidth
              type="button"
              sx={{
                m: "1rem 0",
                p: "0.3rem",
                backgroundColor: "#f43636",
                color: theme.palette.background.alt,
                "&:hover": {
                  color: "#f43636",
                  backgroundColor: "rgba(213, 0, 0, 0.08)",
                },
              }}
              onClick={() => setOpenModal((prev) => !prev)}
            >
              DELETE ACCOUNT
            </Button>
          </div>
        )}
        {openModal && (
          <DeleteAccountWidget setOpenModal={setOpenModal} user={myself} />
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
