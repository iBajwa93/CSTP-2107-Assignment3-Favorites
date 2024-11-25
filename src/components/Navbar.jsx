import { AppBar, Box, Button, Toolbar } from "@mui/material";
import { signOut } from "firebase/auth";
import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleSignout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AppBar style={{ display: "flex", alignItems: "flex-end" }}>
      <Toolbar>
        <Box display="flex" gap="10px" alignItems="center">
          <Button
            component={Link}
            to="/home"
            variant="outlined"
            style={{ color: "white", border: "1px solid white" }}
          >
            Create Blog
          </Button>
          <Button
            component={Link}
            to="/viewblogs"
            variant="outlined"
            style={{ color: "white", border: "1px solid white" }}
          >
            View Blogs
          </Button>
          <Button
            onClick={() => navigate("/favorites")}
            variant="outlined"
            style={{ color: "white", border: "1px solid white" }}
          >
            View Favorites
          </Button>
          <Button
            onClick={handleSignout}
            variant="outlined"
            style={{ color: "white", border: "1px solid white" }}
          >
            Signout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
