import React from "react";
import { Box, Typography, Button, Card, CardContent, Grid } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SushiAnimation from "../../components/UI/SushiAnimation";
import SushiShaderCanvas from "../../components/SushiShaderCanvas";
import "../../assets/animations.css";
import { Restaurant, LocalDining } from "@mui/icons-material";

const SMS_ORDER_NUMBER = "+1 682 343 8742";
const SMS_ORDER_EXAMPLE = "2 Sushi Rolls, 1 Bento Box";

// Animation variants
const heroVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
  hover: { scale: 1.05, rotate: 1, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.5)" },
};

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  const handleStartOrder = () => {
    if (isAuthenticated) navigate("/menu");
    else navigate("/login");
  };

  return (
    <Box
      sx={{
        overflowX: "hidden",
        width: "100%",
        position: "relative",
        background: "linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)", // Premium base gradient
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: "80px",
          background: "linear-gradient(90deg, #ff5722 0%, #ffeb3b 100%)", // Gold-orange gradient
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 3,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          borderBottom: "2px solid rgba(255, 235, 59, 0.5)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Sawarabi Mincho', serif",
            fontWeight: "bold",
            color: "#fff",
            textShadow: "2px 2px 6px rgba(0, 0, 0, 0.8)",
          }}
        >
          Sushi Elite
        </Typography>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outlined"
            sx={{
              color: "#fff",
              borderColor: "#ffeb3b",
              borderRadius: "20px",
              "&:hover": { backgroundColor: "rgba(255, 235, 59, 0.2)", borderColor: "#fff" },
            }}
            onClick={() => navigate(isAuthenticated ? "/portal" : "/signup")}
          >
            {isAuthenticated ? "Portal" : "Join Us"}
          </Button>
        </motion.div>
      </Box>

      {/* Sushi Shader Background - Moved to Foreground */}
      <Box
        sx={{
          position: "absolute",
          top: "80px", // Offset below header
          left: 0,
          width: "100%",
          height: "calc(100% - 80px)", // Fill remaining space below header
          zIndex: 2, // Above hero background but below content
          opacity: 0.4, // Slightly increased for visibility
          pointerEvents: "none", // Ensures it doesn’t block interactions
        }}
      >
        <SushiShaderCanvas />
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "60vh", sm: "70vh", md: "80vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: "80px", // Offset for header
          background: "linear-gradient(135deg, rgba(255, 87, 34, 0.2), rgba(255, 235, 59, 0.2))", // Subtle overlay
          backdropFilter: "blur(10px)",
          zIndex: 1, // Below shader but above base background
        }}
      >
        <SushiAnimation />
        <Box
          component={motion.div}
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          sx={{
            position: "absolute",
            textAlign: "center",
            color: "#fff",
            px: { xs: 2, sm: 4, md: 6 },
            zIndex: 3, // Above shader and hero background
          }}
        >
          <Typography
            variant="h2"
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            sx={{
              fontFamily: "'Sawarabi Mincho', serif",
              fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
              fontWeight: "bold",
              textShadow: "3px 3px 8px rgba(0, 0, 0, 0.8)",
              background: "linear-gradient(45deg, #ff5722, #ffeb3b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Sushi Perfection Awaits
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              fontFamily: "'Sawarabi Mincho', serif",
              color: "#ddd",
              textShadow: "1px 1px 4px rgba(0, 0, 0, 0.7)",
            }}
          >
            Order via Text for an Exquisite Experience
          </Typography>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button
              variant="contained"
              onClick={handleStartOrder}
              startIcon={<Restaurant />}
              sx={{
                mt: 4,
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                padding: { xs: "0.75rem 2rem", md: "1rem 3rem" },
                background: "linear-gradient(45deg, #ff5722, #ffeb3b)",
                borderRadius: "30px",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.5)",
                "&:hover": { background: "linear-gradient(45deg, #e64a19, #ffd700)" },
                textTransform: "none",
              }}
            >
              Begin Your Journey
            </Button>
          </motion.div>
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 1 }}
            >
              <Typography
                variant="body1"
                sx={{
                  mt: 3,
                  color: "#ffeb3b",
                  textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
                }}
              >
                Exclusive Access Awaits:{" "}
                <Link to="/signup" style={{ color: "#fff", textDecoration: "underline" }}>
                  Sign Up
                </Link>{" "}
                or{" "}
                <Link to="/login" style={{ color: "#fff", textDecoration: "underline" }}>
                  Log In
                </Link>
              </Typography>
            </motion.div>
          )}
        </Box>
      </Box>

      {/* SMS Ordering Section */}
      <Box
        sx={{
          py: { xs: 6, sm: 8 },
          px: { xs: 2, sm: 4, md: 6 },
          textAlign: "center",
          background: "linear-gradient(135deg, rgba(56, 142, 60, 0.2), rgba(255, 235, 59, 0.2))", // Green-gold gradient
          backdropFilter: "blur(12px)",
          position: "relative",
          zIndex: 1, // Below shader
          borderTop: "2px solid rgba(255, 235, 59, 0.5)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Sawarabi Mincho', serif",
              fontWeight: "bold",
              fontSize: { xs: "2rem", sm: "3rem" },
              color: "#ffeb3b",
              textShadow: "2px 2px 6px rgba(0, 0, 0, 0.8)",
              background: "linear-gradient(45deg, #388e3c, #ffeb3b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 4,
            }}
          >
            {SMS_ORDER_NUMBER}
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Sawarabi Mincho', serif",
              fontWeight: "bold",
              fontSize: { xs: "1.5rem", sm: "2.5rem" },
              color: "#fff",
              textShadow: "2px 2px 6px rgba(0, 0, 0, 0.7)",
              mb: 2,
            }}
          >
            SMS Ordering: Elevated
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#ddd",
              mt: 2,
              fontStyle: "italic",
              maxWidth: 700,
              mx: "auto",
              lineHeight: 1.5,
              textShadow: "1px 1px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            If you are already a customer: Text your order and savor the elite sushi experience.
          </Typography>
        </motion.div>

        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{ mt: 6 }}
          component={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {[
            {
              title: "Order via Text",
              text: `Text: ${SMS_ORDER_NUMBER}`,
              icon: <LocalDining sx={{ fontSize: 50 }} />,
            },
            {
              title: "How It Works",
              text: `Example: "${SMS_ORDER_EXAMPLE}"`,
              icon: <Restaurant sx={{ fontSize: 50 }} />,
            },
            {
              title: "Instant Elegance",
              text: "Processed instantly for our elite members. and Get Confirmation",
              icon: <LocalDining sx={{ fontSize: 50 }} />,
            },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
                <Card
                  sx={{
                    borderRadius: "25px",
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 235, 59, 0.05))",
                    backdropFilter: "blur(12px)",
                    color: "#fff",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                    border: "1px solid rgba(255, 235, 59, 0.3)",
                    minHeight: 220,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    p: 2,
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>{item.icon}</Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        fontFamily: "'Sawarabi Mincho', serif",
                        textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, color: "#ddd", fontFamily: "'Sawarabi Mincho', serif" }}
                    >
                      {item.text}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;