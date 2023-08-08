import { Box, Button, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "./NavBar";
import FriendListWidget from "./widgets/FriendListWidget";
import MyPostWidget from "./widgets/MyPostWidget";
import PostsWidget from "./widgets/PostsWidget";
import UserWidget from "./widgets/UserWidget";
import privateImage from "../assets/private.png";
import { useTheme } from "@emotion/react";
import { setFriends } from "store";

const ProfilePage = (props) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [reRender, setReRender] = useState(false);
  const [flags, setFlags] = useState(false);
  const [followClick, setFollowClick] = useState(false);
  const { _id } = useSelector((state) => state.user);
  const { userID } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${userID}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
    };
    getUser();
  }, [token, userID, reRender, followClick]);

  if (!user) return null;

  const patchFriend = async () => {
    setFollowClick(false);
    setFlags((prev) => !prev);
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/users/${_id}/${userID}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
    setReRender((prev) => !prev);
  };

  if (followClick) patchFriend();

  return (
    <Box>
      <Navbar user={props.user} />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget
            userId={userID}
            profilePhoto={user.profilePhoto}
            user={user}
          />
          <Box m="2rem 0" />
          <FriendListWidget
            userId={userID}
            setFollowClick={setFollowClick}
            profile={true}
            followClick={followClick}
            setReRender={setReRender}
            flags={flags}
          />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {userID === props.id && (
            <MyPostWidget profilePhoto={user.profilePhoto} />
          )}
          <Box m="2rem 0" />
          {user?.friends?.includes(props.user._id) ||
          userID === props.user._id ? (
            <PostsWidget
              userId={userID}
              user={props.user}
              isProfile
              name={`${user.firstName} ${user.lastName}`}
              reRender={reRender}
              setReRender={setReRender}
              setFlags={setFlags}
            />
          ) : (
            <>
              <Button
                fullWidth
                sx={{
                  p: "0.35rem 1rem",
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.background.alt,
                  fontSize: "0.9rem",
                  "&:hover": {
                    color: theme.palette.primary.main,
                  },
                }}
                onClick={() => setFollowClick(true)}
              >
                Follow
              </Button>
              <h1 style={{ textAlign: "center" }}>
                Follow {`${user.firstName} ${user.lastName}`} to see their
                posts!!
              </h1>
              <img
                src={privateImage}
                alt=""
                height="35%"
                style={{
                  margin: "auto",
                  display: "flex",
                  filter: "invert(21%)",
                }}
              />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
