/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import { collection, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import useLocalStorage from "../hooks/useLocalStorage";
import PropTypes from "prop-types";

const BlogCard = (props) => {
  const { blog, deleteBlog = () => {}, showDeleteIcon = true } = props;
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentUser] = useLocalStorage("current_user", null);

  // Memoized Firebase collection reference
  const favoritesCollection = useMemo(() => collection(db, "favorites"), []);

  // Check if the blog is favorited
  useEffect(() => {
    if (currentUser) {
      const checkFavoriteStatus = async () => {
        const favoriteDoc = doc(
          favoritesCollection,
          `${currentUser.uid}_${blog.id}`
        );
        const snapshot = await getDoc(favoriteDoc);
        setIsFavorited(snapshot.exists());
      };
      checkFavoriteStatus();
    }
  }, [currentUser, blog.id, favoritesCollection]);

  // Toggle favorite status
  const toggleFavorite = async () => {
    if (!currentUser) return;

    const favoriteDocRef = doc(
      favoritesCollection,
      `${currentUser.uid}_${blog.id}`
    );
    const docSnapshot = await getDoc(favoriteDocRef);

    if (docSnapshot.exists()) {
      // Remove from favorites
      await deleteDoc(favoriteDocRef);
    } else {
      // Add to favorites
      await setDoc(favoriteDocRef, {
        userId: currentUser.uid,
        blogId: blog.id,
        blogTitle: blog.title,
        blogDescription: blog.description,
        blogImage: blog.image,
        blogCategory: blog.category,
        createdAt: new Date(), // Optional: Add a timestamp
      });
    }
    setIsFavorited(!isFavorited); // Toggle favorite state
  };

  return (
    <Card style={{ position: "relative" }}>
      <CardMedia sx={{ height: 140 }} image={blog.image} title="Blog Image" />
      {showDeleteIcon && (
        <IconButton
          style={{ position: "absolute", right: "10px", top: "5px" }}
          aria-label="delete"
          size="small"
          onClick={() => deleteBlog(blog.id)}
        >
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {blog.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {blog.description}
        </Typography>
        <Chip label={blog.category} variant="outlined" />
      </CardContent>
      <CardActions>
        <IconButton onClick={toggleFavorite} color="secondary">
          {isFavorited ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => navigate(`/viewblogs/${blog.id}`)}
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
};

BlogCard.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
  deleteBlog: PropTypes.func,
  showDeleteIcon: PropTypes.bool,
};

export default BlogCard;
