import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends, setPost, setPosts } from "../../store/index";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useState } from "react";

const Friend = ({
  friendId,
  name,
  subtitle,
  userPicturePath,
  postId,
  post,
  showLikes,
  showComments,
  setReRender,
  reRender,
  profile,
  setFlags
}) => {
  const [list, setList] = useState(null);
  const open = Boolean(list);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const handleClick = (e) => setList(e.currentTarget);

  const isFriend = friends.find((friend) => friend._id === friendId);

  const patchFriend = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/users/${_id}/${friendId}`,
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
    setReRender(prev => !prev);
    setFlags(prev => !prev);
  };

  const deletePost = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/posts/${postId}/delete`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const posts = await response.json();
    dispatch(setPosts({ posts: posts }));
    setList(null);
    navigate("/home");
  };

  const hideHandler = async (hide) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/${postId}/hide`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ update: hide }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      {_id !== friendId ? (
        <IconButton
          onClick={() => patchFriend()}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isFriend || post ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      ) : (
        !profile && <>
          <IconButton onClick={handleClick}>
            <MoreHorizIcon />
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={list}
            open={open}
            onClose={() => setList(null)}
            PaperProps={{
              style: {
                width: "20ch",
              },
            }}
          >
            <MenuItem
              onClick={() => {
                hideHandler("like");
              }}
              // sx={{ fontWeight: "700" }}
            >
              {showLikes ? "Hide Likes" : "Show Likes"}
            </MenuItem>
            <MenuItem
              onClick={() => {
                hideHandler("comment");
              }}
              // sx={{ fontWeight: "700" }}
            >
              {showComments ? "Turn Off Commenting" : "Turn On Commenting"}
            </MenuItem>
            <MenuItem
              onClick={deletePost}
              sx={{ color: "rgb(237,73,86)", fontWeight: "700" }}
            >
              Delete Post
            </MenuItem>
          </Menu>
        </>
      )}
    </FlexBetween>
  );
};

export default Friend;
