import { Box, Typography, useTheme } from "@mui/material";
import Friend from "../UI/Friend";
import WidgetWrapper from "../UI/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../store/index";

const FriendListWidget = ({
  userId,
  reRender,
  setReRender,
  profile,
  followClick,
  flags
}) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const getFriends = async () => {
    dispatch(setFriends({ friends: [] }));
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    console.log(data, userId);
    dispatch(setFriends({ friends: data }));
  };

  useEffect(() => {
    getFriends();
  }, [followClick, flags]);
  console.log(followClick, friends);

  return (
    <WidgetWrapper maxHeight="14rem" friend="true">
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends.map((friend, index) => (
          <Friend
            key={index}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
            reRender={reRender}
            setReRender={setReRender}
            profile={profile}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
