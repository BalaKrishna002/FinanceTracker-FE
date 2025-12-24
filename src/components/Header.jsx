import { Box, Typography, Toolbar } from "@mui/material";

const Header = () => {
  return (
    <Toolbar
      sx={{
        minHeight: 64,
        px: 3,
      }}
    >
      {/* App Name */}
      <Typography
        variant="h5"
        component="div"
        sx={{
          fontWeight: "bold",
          color: "#000",
          fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
          letterSpacing: 1,
        }}
      >
        FTRACK
      </Typography>
    </Toolbar>
  );
};

export default Header;
