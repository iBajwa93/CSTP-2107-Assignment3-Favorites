import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import useLocalStorage from "../hooks/useLocalStorage";
import BlogCard from "../components/BlogCard";

const ViewFavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [currentUser] = useLocalStorage("current_user", null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser) return;

      try {
        const favoritesCollection = collection(db, "favorites");
        const q = query(
          favoritesCollection,
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);

        const favoriteBlogs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFavorites(favoriteBlogs);
      } catch (error) {
        console.error("Error fetching favorite blogs:", error);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  if (!currentUser) {
    return <p>Please log in to view your favorite blogs.</p>;
  }

  return (
    <div>
      <h1>Your Favorite Blogs</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {favorites.length > 0 ? (
          favorites.map((favorite) => (
            <BlogCard
              key={favorite.id}
              blog={{
                id: favorite.blogId,
                title: favorite.blogTitle,
                description: favorite.blogDescription,
                image: favorite.blogImage,
                category: favorite.blogCategory,
              }}
              showDeleteIcon={false}
            />
          ))
        ) : (
          <p>No favorites added yet!</p>
        )}
      </div>
    </div>
  );
};

export default ViewFavoritesPage;
