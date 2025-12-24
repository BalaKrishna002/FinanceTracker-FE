import { Box, Typography, Toolbar } from "@mui/material";

const Header = () => {
  return (
    <Toolbar
      sx={{
        minHeight: 64,
        px: 4, // horizontal padding to move away from the edge
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* App Name */}
      <Typography
        variant="h5"
        component="div"
        sx={{
          fontWeight: "bold",
          color: "#000",
          fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
          letterSpacing: 1,
          mt: 0.5, // slight top margin for vertical alignment
        }}
      >
        FTRACK
      </Typography>
    </Toolbar>
  );
};

export default Header;
