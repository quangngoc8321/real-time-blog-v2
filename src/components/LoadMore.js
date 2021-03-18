import React, { useState } from "react";
import { firestore } from "../libs/firebaseConfig";
import Loader from "./Loader";

export default function LoadMore({
  posts,
  setPosts,
  type,
  setIsLoadMore,
  userId,
}) {
  const [loading, setLoading] = useState(false);
  // const [nothing, setNothing] = useState(false);
  const loadMorePost = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];
    let query;
    if (type === "POST-FEEDS") {
      query = firestore
        .collection("posts")
        .orderBy("createdAt", "desc")
        .startAfter(last.createdAt)
        .limit(5);
    }
    if (type === "USER-PROFILE") {
      query = firestore
        .collection("posts")
        .where("uid", "==", userId)
        .orderBy("createdAt", "desc")
        .startAfter(last.createdAt)
        .limit(5);
    }
    const newPosts = (await query.get()).docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });

    //Test
    // console.log(newPosts);
    if (newPosts.length < 5) {
      setIsLoadMore(false);
      // setNothing(true);
    }
    setPosts([...posts, ...newPosts]);
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <button className="btn load-more" onClick={loadMorePost}>
          Load More Post
        </button>
      )}
    </>
  );
}
