import { Box, Typography, useTheme } from "@mui/material";
import Friend from "../UI/Friend";
import WidgetWrapper from "../UI/WidgetWrapper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SuggestedWidget = ({ userId, reRender, setReRender }) => {
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const [friends, setFriends] = useState([]);
  console.log(reRender);

  useEffect(() => {
    const getFriends = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/suggested/${userId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setFriends(data);
    };
    getFriends();
  }, [token, userId, reRender]);

  return (
    <WidgetWrapper maxHeight="14rem" friend={true} marginTop="2rem">
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Suggested For You
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends.map((friend, index) => (
          <Friend
            key={index}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
            setReRender={setReRender}
            reRender={reRender}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default SuggestedWidget;
