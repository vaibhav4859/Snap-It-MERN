import {
  Box,
  List,
  ListItem,
  Typography,
  Button,
  useTheme,
  TextField,
  Dialog,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import EmojiPicker from "emoji-picker-react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
// max-240

const ChatWidget = ({ user }) => {
  const myself = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const theme = useTheme();
  const mode = theme.palette.mode;
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const name = `${user.firstName} ${user.lastName}`;
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  const socket = useRef();

  useEffect(() => {
    const getMessage = async () => {
      try {
        const res = await fetch("http://localhost:5000/message/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/JSON",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sender: myself._id,
            reciever: user._id,
          }),
        });
        const response = await res.json();
        // console.log(response);
        setChatMessages(response);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [user, token, myself._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [message]);

  useEffect(() => {
    if (user) {
      socket.current = io(`http://localhost:5000`);
      socket.current.emit("addUser", myself._id);
    }
  }, [myself._id]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const sendMsg = async (e) => {
    e.preventDefault();
    const currMessage = {
      myself: true,
      message: message,
    };
    await socket.current.emit("send-msg", {
      to: user._id,
      from: myself._id,
      message: message,
    });
    await fetch("http://localhost:5000/message/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/JSON",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: message,
        sender: myself._id,
        reciever: user._id,
      }),
    });

    setChatMessages(chatMessages.concat(currMessage));
    setMessage("");
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        console.log(msg);
        setArrivalMessage({
          myself: false,
          message: msg,
        });
      });
    }
  }, [arrivalMessage]);

  useEffect(() => {
    arrivalMessage && setChatMessages((pre) => [...pre, arrivalMessage]);
  }, [arrivalMessage]);

  return (
    <Box sx={{ height: "100%" }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: mode === "dark" ? "#333333" : "#F0F0F0",
          padding: "0.6rem 1rem",
          borderRadius: "1.5rem",
          border: mode === "dark" ? "1px solid #C2C2C2" : "1px solid black",
        }}
      >
        <img
          src={`${process.env.REACT_APP_BACKEND_URL}/assets/${user.picturePath}`}
          alt=""
          width={isNonMobileScreens ? "45px" : "35px"}
          height={isNonMobileScreens ? "45px" : "35px"}
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
        <Typography
          sx={{
            paddingLeft: "1rem",
            fontWeight: "bold",
            fontSize: "1.3rem",
            color: mode === "dark" ? "#C2C2C2" : "#666666",
            wordBreak: "break-word",
            "&:hover": {
              color: "#00353F",
            },
            cursor: "pointer",
          }}
        >
          {name.length <= 20 ? name : `${name.substring(0, 20)}...`}
        </Typography>
      </Box>
      <Box
        sx={{
          height: isNonMobileScreens ? "71%" : "60%",
          overflowY: "scroll",
        }}
      >
        <List style={{ display: "flex", flexDirection: "column" }}>
          {chatMessages.map((message, index) => {
            return (
              <ListItem
                key={index}
                style={{
                  backgroundColor: mode === "dark" ? "#333333" : "#F0F0F0",
                  marginBottom: "1rem",
                  borderRadius: "1.5rem",
                  width: isNonMobileScreens ? "50%" : "80%",
                  alignSelf: message.myself ? "end" : "",
                }}
                ref={scrollRef}
              >
                {!message.myself && (
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}/assets/${user.picturePath}`}
                    alt=""
                    width={isNonMobileScreens ? "40px" : "30px"}
                    height={isNonMobileScreens ? "40px" : "30px"}
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                  />
                )}
                <Typography
                  sx={{
                    minHeight: "2.3rem",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: !message.myself ? "0.8rem" : "",
                    color: mode === "dark" ? "#C2C2C2" : "#666666",
                    wordBreak: "break-word",
                  }}
                >
                  {message.message}
                </Typography>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Box>
        <form
          style={{ display: "flex", alignItems: "center" }}
          onSubmit={sendMsg}
        >
          <TextField
            size="small"
            label="Type your message..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            name="message"
              error={message.length >= 240}
              helperText={message.length >= 240 ? "Length of your message can not be more than 240 characters!" : ""}
            sx={{ width: "85%", marginRight: "0.5rem" }}
          />
          {isNonMobileScreens && (
            <Button
              variant="outlined"
              onClick={handleOpen}
              sx={{ height: "2.3rem", minWidth: "6%", padding: 0 }}
            >
              <EmojiEmotionsIcon />
            </Button>
          )}
          <Dialog
            open={open}
            onClose={handleClose}
            sx={{ top: 0, left: 0, position: "fixed" }}
          >
            <EmojiPicker
              onEmojiClick={(e) => {
                setMessage(`${message} ${e.emoji}`);
                handleClose();
              }}
              height="350px"
            />
          </Dialog>
          <Button
            type="submit"
            sx={{
              m: "1rem 0",
              p: "0.35rem 1rem",
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.background.alt,
              marginLeft: "0.5rem",
              fontSize: "0.9rem",
              "&:hover": {
                color: theme.palette.primary.main,
              },
            }}
            disabled={message.length >= 240}
          >
            Send
          </Button>
        </form>
        {/* </Box> */}
      </Box>
    </Box>
  );
};

export default ChatWidget;
