import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../store/index";
import PostWidget from "./PostWidget";

const PostsWidget = ({
  userId,
  user,
  isProfile = false,
  name,
  reRender,
  setReRender,
}) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  if (user) name = `${user.firstName} ${user.lastName}`;
  // console.log(name);

  useEffect(() => {
    if (isProfile) {
      const getUserPosts = async () => {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/posts/${userId}/posts`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        dispatch(setPosts({ posts: data }));
      };
      getUserPosts();
    } else {
      const getPosts = async () => {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/posts`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        dispatch(setPosts({ posts: data }));
      };
      getPosts();
    }
  }, [dispatch, token, userId, isProfile, reRender]);

  return (
    <>
      {posts.length ? (
        posts.map(
          ({
            _id,
            userId,
            firstName,
            lastName,
            description,
            location,
            picturePath,
            userPicturePath,
            likes,
            comments,
            showLikes,
            showComments,
          }) => (
            <PostWidget
              key={_id}
              postId={_id}
              postUserId={userId}
              user={user}
              name={`${firstName} ${lastName}`}
              description={description}
              location={location}
              picturePath={picturePath}
              userPicturePath={userPicturePath}
              likes={likes}
              comments={comments}
              showLikes={showLikes}
              showComments={showComments}
              reRender={reRender}
              setReRender={setReRender}
            />
          )
        )
      ) : (
        <h1>{name} hasn't posted anything yet!</h1>
      )}
    </>
  );
};

export default React.memo(PostsWidget);
