
// NotFoundPage component displays a 404 error page for undefined routes
import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";


const NotFoundPage: React.FC = () => {
  // Hook to programmatically navigate to other routes
  const navigate = useNavigate();

  return (
    // Outer Box for full viewport height and centering
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        px: 2,
      }}
    >
      {/* Container to limit max width for content */}
      <Container maxWidth="sm">
        {/* Centered content box with vertical padding */}
        <Box
          sx={{
            textAlign: "center",
            py: { xs: 6, sm: 8 },
          }}
        >
          {/* Circular border with 404 text */}
          <Box
            sx={{
              mx: "auto",
              mb: 3,
              width: { xs: 140, sm: 180, md: 200 },
              height: { xs: 140, sm: 180, md: 200 },
              borderRadius: "50%",
              border: "4px solid",
              borderColor: "#C84C0E", // dark orange
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h2"
              component="div"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
              }}
            >
              404
            </Typography>
          </Box>

          {/* Main heading for not found */}
          <Typography
            variant="h5"
            sx={{
              mb: 1.5,
              fontSize: { xs: "1.3rem", sm: "1.5rem" },
              fontWeight: 600,
            }}
          >
            Page not found
          </Typography>

          {/* Description message */}
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 4,
              px: { xs: 1, sm: 4 },
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            The page you are looking for doesn&apos;t exist or may have been
            moved. Please check the URL or return to the Property Tax Portal.
          </Typography>

          {/* Button to navigate back to the portal home */}
          <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={() => navigate("/")}
            sx={{
              px: { xs: 3, sm: 4 },
              py: { xs: 1, sm: 1.2 },
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            Go to Portal
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

// Export the NotFoundPage component as default
export default NotFoundPage;