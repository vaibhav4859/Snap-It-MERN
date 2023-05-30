import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "./NavBar";
import FriendListWidget from "./widgets/FriendListWidget";
import MyPostWidget from "./widgets/MyPostWidget";
import PostsWidget from "./widgets/PostsWidget";
import UserWidget from "./widgets/UserWidget";

const ProfilePage = (props) => {
  const [user, setUser] = useState(null);
  const [reRender, setReRender] = useState(null);
  const { userID } = useParams();
  // const params = useParams();
  const token = useSelector((state) => state.token);
  // const myself = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/${userID}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setUser(data);
    };
    getUser();
  }, [token, userID, reRender]);

  if (!user) return null;

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
            picturePath={user.picturePath}
            user={user}
          />
          <Box m="2rem 0" />
          <FriendListWidget userId={userID} profile={true} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {userID === props.id && (
            <MyPostWidget picturePath={user.picturePath} />
          )}
          <Box m="2rem 0" />
          {user.friends.includes(props.user._id) ||
          userID === props.user._id ? (
            <PostsWidget
              userId={userID}
              user={props.user}
              isProfile
              name={`${user.firstName} ${user.lastName}`}
              reRender={reRender}
              setReRender={setReRender}
            />
          ) : (
            <h1 style={{textAlign: "center"}}>
              Follow {`${user.firstName} ${user.lastName}`} to see their posts!!
            </h1>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
