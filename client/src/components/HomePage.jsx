import { Box, useMediaQuery } from "@mui/material";
import Navbar from "./NavBar";
import UserWidget from "./widgets/UserWidget";
import MyPostWidget from "./widgets/MyPostWidget";
import PostsWidget from "./widgets/PostsWidget";
import AdvertWidget from "./widgets/AdvertWidget";
import SuggestedWidget from "./widgets/SuggestedWidget";
import { useState } from "react";

const HomePage = (props) => {
  const [reRender, setReRender] = useState(false);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [state, setState] = useState(false);

  function isPageBottom() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );

    return scrollTop + windowHeight >= documentHeight - 30;
  }

  window.addEventListener("scroll", function () {
    if (isPageBottom()) {
      // Reached the bottom of the page
      setState((prev) => !prev);
      console.log("Reached the bottom of the page");
    }
  });

  return (
    <Box>
      <Navbar user={props.user} />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget user={props.user} home={true} />
        </Box>
        {!isNonMobileScreens && (
          <Box flexBasis="26%">
            {/* <Box m="2rem 0" /> */}
            <SuggestedWidget
              userId={props.user._id}
              reRender={reRender}
              setReRender={setReRender}
            />
          </Box>
        )}
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget profilePhoto={props.user.profilePhoto} />
          <PostsWidget
            userId={props.user._id}
            user={props.user}
            reRender={reRender}
            setReRender={setReRender}
            home={true}
            state={state}
          />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0" />
            <SuggestedWidget
              userId={props.user._id}
              reRender={reRender}
              setReRender={setReRender}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
