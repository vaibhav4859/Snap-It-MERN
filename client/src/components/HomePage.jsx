import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "./NavBar";
import UserWidget from "./widgets/UserWidget";
import MyPostWidget from "./widgets/MyPostWidget";
import PostsWidget from "./widgets/PostsWidget";
import AdvertWidget from "./widgets/AdvertWidget";
import FriendListWidget from "./widgets/FriendListWidget";

const HomePage = (props) => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  // const { _id, picturePath } = useSelector((state) => state.user);
  // console.log(_id, picturePath);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget user={props.user} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={props.user.picturePath} />
          <PostsWidget userId={props.user._id} user={props.user}/>
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0" />
            <FriendListWidget userId={props.user._id} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
