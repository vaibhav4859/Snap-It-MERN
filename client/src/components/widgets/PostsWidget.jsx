import React, { useEffect, useState } from "react";
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
  home,
  state,
  setFlags
}) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const [postsData, setPostsData] = useState([]);
  const [flag, setFlag] = useState(false);
  const token = useSelector((state) => state.token);

  useEffect(() => {
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
    };
    getMorePosts(); // eslint-disable-next-line
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
        dispatch(setPosts({ posts: data }));
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
                setFlags={setFlags}
              />
            )
          )
        : !home && <h1>{name} hasn't posted anything yet!</h1>}
      {/* </InfiniteScroll> */}
    </div>
  );
};

export default React.memo(PostsWidget);
