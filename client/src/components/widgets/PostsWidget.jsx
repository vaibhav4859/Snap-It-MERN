import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../store/index";
import PostWidget from "./PostWidget";
// import CircularProgress from "@mui/material/CircularProgress";
// import { Box } from "@mui/material";

const PostsWidget = ({
  userId,
  user,
  isProfile = false,
  name,
  reRender,
  setReRender,
  home,
  state,
}) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const [postsData, setPostsData] = useState([]);
  const [flag, setFlag] = useState(false);
  const token = useSelector((state) => state.token);
  if (user) name = `${user.firstName} ${user.lastName}`;
  console.log(postsData, posts, state);

  useEffect(() => {
    console.log("before", postsData);
    const getMorePosts = async () => {
      let arr = [...postsData];
      for (
        let i = postsData.length;
        i < postsData.length + 1 && i < posts.length;
        i++
      ) {
        arr.push(posts[i]);
      }
      setPostsData(arr);
      // setFlag((prev) => !prev);
    };
    getMorePosts();
    console.log("effect", postsData);
  }, [state, reRender, flag]);

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
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/${userId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        // console.log(data);
        dispatch(setPosts({ posts: data }));
        // window.location.reload();
        setPostsData([]);
        setFlag((prev) => !prev);
      };
      getPosts();
    }
  }, [dispatch, token, userId, isProfile, reRender]);

  return (
    <div className="main-container">
      {home && posts.length === 0 && (
        <h1 style={{ textAlign: "center" }}>
          Follow other user's to see their posts!!
        </h1>
      )}
      {/* <InfiniteScroll
        dataLength={postsData.length}
        next={getMorePosts}
        loader={
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        }
        hasMore={postsData.length < posts.length}
        height={650}
      > */}
      {posts.length
        ? postsData &&
          postsData.map(
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
        : !home && <h1>{name} hasn't posted anything yet!</h1>}
      {/* </InfiniteScroll> */}
    </div>
  );
};

export default React.memo(PostsWidget);
