import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CSSBaseline from "@mui/material/CssBaseline";
import React from "react";

const Navbar = () => {
  return (
    <AppBar position="static">
      <CSSBaseline />
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Task Manager
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;
