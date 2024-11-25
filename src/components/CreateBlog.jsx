import { Box, Button, Chip, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Alert from "./Alert";
import useLocalStorage from "../hooks/useLocalStorage";
import { Link } from "react-router-dom";

const categories = ["Tech", "News", "Sports", "Science"];

const CreateBlog = () => {
  const [currentUser] = useLocalStorage("current_user", null);
  const [blogInfo, setBlogInfo] = useState({
    title: "",
    description: "",
    image: "",
    category: "",
    userId: currentUser?.uid || "",
  });

  const blogCollectionReference = collection(db, "blogs");
  const [alertConfig, setAlertConfig] = useState({});

  const handleCreateBlog = async () => {
    console.log(blogInfo);

    if (
      !blogInfo.title.trim() ||
      !blogInfo.description.trim() ||
      !blogInfo.image.trim() ||
      !blogInfo.category
    ) {
      setAlertConfig({
        message: "All fields are required!",
        color: "error",
        isOpen: true,
      });
      return;
    }

    // Add blogs to Firestore
    try {
      await addDoc(blogCollectionReference, blogInfo);
      setAlertConfig({
        message: "Successfully created a blog!",
        color: "success",
        isOpen: true,
      });
      setBlogInfo({
        title: "",
        description: "",
        image: "",
        category: "",
        userId: currentUser?.uid || "",
      });
    } catch (error) {
      setAlertConfig({
        message: "Error creating blog",
        color: "error",
        isOpen: true,
      });
    }
  };

  const handleCategoryClick = (category) => {
    setBlogInfo((prev) => ({ ...prev, category }));
  };

  return (
    <Box
      border="1px solid black"
      padding="50px"
      borderRadius="12px"
      display="flex"
      flexDirection="column"
      gap="20px"
    >
      <Typography variant="h3">Create your own Blogs</Typography>

      <TextField
        type="text"
        placeholder="Enter Blog Title here!"
        value={blogInfo.title}
        onChange={(e) => setBlogInfo({ ...blogInfo, title: e.target.value })}
        sx={{ input: { color: "black" } }}
      />

      <TextField
        type="text"
        placeholder="Enter Blog Description here!"
        value={blogInfo.description}
        onChange={(e) =>
          setBlogInfo({ ...blogInfo, description: e.target.value })
        }
        sx={{ input: { color: "black" } }}
      />

      <Box display="flex" gap="4px">
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            variant={blogInfo.category === category ? "filled" : "outlined"}
            color={blogInfo.category === category ? "primary" : "default"}
            sx={{
              color: blogInfo.category === category ? "white" : "black",
              backgroundColor:
                blogInfo.category === category ? "primary.main" : "black",
              "&:hover": {
                backgroundColor:
                  blogInfo.category === category ? "primary.dark" : "grey.200",
              },
            }}
            onClick={() => handleCategoryClick(category)}
          />
        ))}
      </Box>
      <TextField
        type="text"
        placeholder="Please paste URL of the image"
        value={blogInfo.image}
        onChange={(e) => setBlogInfo({ ...blogInfo, image: e.target.value })}
        sx={{ input: { color: "black" } }}
      />

      <Button variant="contained" onClick={handleCreateBlog}>
        Create Blog
      </Button>

      <Alert alertConfig={alertConfig} />

      <Link to="/viewblogs">View Blogs</Link>
    </Box>
  );
};

export default CreateBlog;
