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
  Modal,
} from "@mui/material";
import { ImageOutlined } from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import EmojiPicker from "emoji-picker-react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import FlexBetween from "components/UI/FlexBetween";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const ChatWidget = ({ user }) => {
  const myself = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const theme = useTheme();
  const mode = theme.palette.mode;
  const mediumMain = theme.palette.neutral.mediumMain;
  // const medium = theme.palette.neutral.medium;
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const name = `${user.firstName} ${user.lastName}`;
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [image, setImage] = useState(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  const socket = useRef();
  const fileInputRef = useRef(null);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    // Perform further actions with the selected file
    console.log("Selected file:", file);
    setImage(file);
    setOpenModal(true);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const getMessage = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/message/get`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/JSON",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              sender: myself._id,
              reciever: user._id,
            }),
          }
        );
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
    const bottomAnchor = document.getElementById("bottomAnchor");
    bottomAnchor.scrollIntoView();
    setTimeout(() => {
      setChatMessages(prev => [...prev]);
    }, 2500);
  }, [chatMessages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [message]);

  useEffect(() => {
    if (user) {
      socket.current = io(`${process.env.REACT_APP_BACKEND_URL}`);
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
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/message/post`, {
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

  const handlePost = (e) => {
    e.preventDefault();
    if (image !== null) {
      const fileName = new Date().getTime() + image?.name;
      const storage = getStorage(app);
      const StorageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(StorageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
          // Handle unsuccessful uploads
          console.log(error);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log(downloadURL);
            const currMessage = {
              myself: true,
              message: downloadURL,
            };
            await socket.current.emit("send-msg", {
              to: user._id,
              from: myself._id,
              message: downloadURL,
            });
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/message/post`, {
              method: "POST",
              headers: {
                "Content-Type": "application/JSON",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                message: downloadURL,
                sender: myself._id,
                reciever: user._id,
              }),
            });

            setChatMessages(chatMessages.concat(currMessage));
            setMessage("");
          });
        }
      );
      setImage(null);
      setOpenModal(false);
    }
  };

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
        id="chats"
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
                {message.message.length > 40 &&
                message.message.slice(0, 39) ===
                  "https://firebasestorage.googleapis.com/" ? (
                  <img
                    src={message.message}
                    alt=""
                    height="auto"
                    // width={isNonMobileScreens ? "350rem" : "70rem"}
                    width="69%"
                    style={{ objectFit: "cover", margin: "auto", borderRadius:"1rem" }}
                  />
                ) : (
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
                )}
              </ListItem>
            );
          })}
        </List>
        <div id="bottomAnchor"></div>
      </Box>
      <Box>
        <form
          style={{ display: "flex", alignItems: "center" }}
          onSubmit={sendMsg}
        >
          <FlexBetween gap="0.25rem">
            <input
              type="file"
              accept="image/*"
              id="file-input"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileInputChange}
            />
            <ImageOutlined
              sx={{ color: mediumMain }}
              style={{ fontSize: "45px", cursor: "pointer" }}
              onClick={handleImageClick}
            />
          </FlexBetween>

          <Modal
            open={openModal}
            onClose={() => {
              setImage(null);
              setOpenModal(false);
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  alt={image.name}
                  style={{ objectFit: "cover", borderRadius: "1rem" }}
                  width="350rem"
                  height="300rem"
                />
              )}
              <div style={{ display: "flex" }}>
                <Button
                  // type="submit"
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
                  onClick={() => {
                    setImage(null);
                    setOpenModal(false);
                  }}
                >
                  Close
                </Button>
                <Button
                  // type="submit"
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
                  onClick={handlePost}
                >
                  Send
                </Button>
              </div>
            </Box>
          </Modal>

          <TextField
            size="small"
            label="Type your message..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            name="message"
            error={message.length >= 240}
            helperText={
              message.length >= 240
                ? "Length of your message can not be more than 240 characters!"
                : ""
            }
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
            disabled={message.trim().length === 0 || message.length >= 240}
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
