import React, { useState } from "react";
import "../css/form.css";
import Form from "./Form";
import slugifyString from "slugify";
import { v1 as uuidv1 } from "uuid";
import firebase, { storageRef } from "../libs/firebaseConfig";
import { useHistory } from "react-router";
import { createOnePost } from "../libs/post";

const AddPost = () => {
  const [post, setPost] = useState({ title: "", content: "" });
  let history = useHistory();
  const handleAddPost = (image) => {
    let slugify = slugifyString(post.title.trim().toLowerCase());
    // Test
    // console.log(slugify);
    // console.log(image);

    if (image) {
      const fileName = `${image.name}_${uuidv1()}`;
      post.fileName = fileName;
      var uploadTask = storageRef.child(`images/${fileName}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          if (firebase.storage.TaskState.RUNNING) {
            console.log("Image Uploaded");
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            post.coverImage = downloadURL;
            createOnePost({ ...post, slugify });
            history.push("/dashboard");
          });
        }
      );
    } else {
      createOnePost({ ...post, slugify });
      history.push("/dashboard");
    }
  };
  return (
    <div className="post-form">
      <h3>Add New Post</h3>
      <Form
        post={post}
        setPost={setPost}
        handleFormSubmit={handleAddPost}
        type="Publish"
      />
    </div>
  );
};

export default AddPost;
