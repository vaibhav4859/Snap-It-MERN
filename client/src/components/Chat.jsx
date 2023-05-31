import {
  Box,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  IconButton,
  InputBase,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiGrid from "@mui/material/Grid";
import { Search } from "@mui/icons-material";
import FlexBetween from "./UI/FlexBetween";
import NavBar from "./NavBar";
import msgImage from "../assets/msg.png";
import ChatWidget from "./widgets/ChatWidget";
import { useState } from "react";

const Grid = styled(MuiGrid)(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  '& [role="separator"]': {
    margin: theme.spacing(0, 2),
  },
}));

const Chat = ({ user }) => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const neutralLight = theme.palette.neutral.light;
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [currentUser, setCurrentUser] = useState(null);

  // console.log(user);

  return (
    <Box>
      <NavBar user={user} />
      <Box
        width="95%"
        height={isNonMobileScreens ? "78vh" : "70vh"}
        p={isNonMobileScreens ? "1.5rem 2rem" : "1.5rem 1rem"}
        m="0 auto"
        mt="2rem"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
        sx={{ display: "flex" }}
      >
        <Grid
          container
          height="100%"
          maxWidth="35rem"
          margin="0"
          sx={{ display: "contents" }}
        >
          <Grid
            item
            xs={true}
            height="100%"
            mr="1rem"
            width={!isNonMobileScreens ? "15% !important" : "100%"}
          >
            <FlexBetween
              backgroundColor={neutralLight}
              borderRadius="9px"
              // gap="3rem"
              padding={isNonMobileScreens ? "0.1rem 1.5rem" : "0 0.4rem"}
              mb="1rem"
            >
              <InputBase placeholder="Search your friends..." />
              <IconButton>
                <Search />
              </IconButton>
            </FlexBetween>
            {/* {content} */}
            <List
              sx={{
                overflowY: "scroll",
                height: "87%",
                paddingRight: "0.7rem",
              }}
            >
              {user.friends.map((user, index) => {
                const name = `${user.firstName} ${user.lastName}`;
                return (
                  <ListItem
                    key={index}
                    sx={{
                      backgroundColor: mode === "dark" ? "#333333" : "#F0F0F0",
                      marginBottom: "0.5rem",
                      borderRadius: "1.2rem",
                      cursor: "pointer",
                      overflowY: "scroll",
                      paddingLeft: !isNonMobileScreens ? "0.4rem" : "",
                    }}
                    onClick={() => setCurrentUser(user)}
                  >
                    <img
                      src={`${process.env.REACT_APP_BACKEND_URL}/assets/${user.picturePath}`}
                      alt={user.name}
                      style={{
                        borderRadius: "50%",
                        width: isNonMobileScreens ? "45px" : "30px",
                        height: isNonMobileScreens ? "45px" : "30px",
                        objectFit:"cover"
                      }}
                    />
                    <div
                      style={{
                        paddingLeft: isNonMobileScreens ? "1rem" : "0.2rem",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          margin: "0",
                          fontSize: "0.9rem",
                          color: mode === "dark" ? "#C2C2C2" : "#666666",
                          wordBreak: "break-word",
                          "&:hover": {
                            color: "#00353F",
                          },
                        }}
                      >
                        {name.length <= 20
                          ? name
                          : `${name.substring(0, 20)}...`}
                      </Typography>
                      {isNonMobileScreens && (
                        <p style={{ margin: 0 }}>Open chat to see messages</p>
                      )}
                    </div>
                  </ListItem>
                );
              })}
            </List>
          </Grid>
          {/* <Divider orientation="vertical" flexItem sx={{ padding: "0 1rem" }} /> */}
          <Box
            // border="1px solid red"
            sx={{ width: isNonMobileScreens ? "74%" : "55%" }}
          >
            {!currentUser ? (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Typography
                  sx={{
                    cursor: "pointer",
                    color: "#00D5FA",
                    fontSize: "1.7rem",
                    textAlign: "center",
                    "&:hover": {
                      color: "#00353F",
                    },
                  }}
                >
                  Open Your Chat Box to communicate with your friend
                </Typography>
                <img
                  src={msgImage}
                  alt=""
                  width="200rem"
                  height="200rem"
                  style={{ filter: "invert(40%)" }}
                />
              </div>
            ) : (
              <ChatWidget user={currentUser} />
            )}
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default Chat;
