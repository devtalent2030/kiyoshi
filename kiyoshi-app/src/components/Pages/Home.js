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

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  const handleStartOrder = () => {
    if (isAuthenticated) navigate("/menu");
    else navigate("/login");
  };

  return (
    <Box sx={{ overflowX: "hidden", width: "100%", position: "relative" }}>
      {/* Simple Header */}
      <Box
        sx={{
          height: "60px",
          backgroundColor: "#8B4000",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "#fff", fontFamily: "'Sawarabi Mincho', serif" }}
        >
          Sushi Shop
        </Typography>
      </Box>

      {/* Smaller Sushi Shader in Top-Left Corner */}
      <SushiShaderCanvas />

      {/* 2. Hero Section with Sushi Animation */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "50vh", sm: "60vh", md: "70vh" },
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: "60px", // Offset for header height
          mb: 4,
          background: "linear-gradient(to bottom, #ffcc80, #ff8c00)", // Simple background
        }}
      >
        <SushiAnimation />
        {/* Hero Text */}
        <Box
          component={motion.div}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          sx={{
            position: "absolute",
            textAlign: "center",
            color: "#fff",
            px: { xs: 2, sm: 4 },
            zIndex: 1,
          }}
        >
          <Typography
            variant="h4"
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            sx={{
              fontFamily: "'Sawarabi Mincho', serif",
              fontSize: { xs: "1rem", sm: "1.5rem", md: "2rem" },
              mt: 1,
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
            }}
          >
            Order via Text!
          </Typography>

          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{ display: "inline-block" }}
          >
            <Button
              variant="contained"
              onClick={handleStartOrder}
              startIcon={<Restaurant />}
              sx={{
                mt: 3,
                fontSize: { xs: "1rem", sm: "1.2rem" },
                padding: { xs: "0.5rem 1.5rem", md: "0.75rem 2rem" },
                backgroundColor: "#8B4000",
                "&:hover": { backgroundColor: "#5C2C06" },
                borderRadius: "25px",
                boxShadow: "0 0 10px rgba(255,255,255,0.4)",
              }}
            >
              Start Your Order
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
                  mt: 2,
                  textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
                }}
              >
                New here?{" "}
                <Link
                  to="/signup"
                  style={{ color: "#ffeb3b", textDecoration: "underline" }}
                >
                  Sign Up
                </Link>{" "}
                or{" "}
                <Link
                  to="/login"
                  style={{ color: "#ffeb3b", textDecoration: "underline" }}
                >
                  Log In
                </Link>
              </Typography>
            </motion.div>
          )}
        </Box>
      </Box>

      {/* 3. SMS Ordering Section */}
      <Box
        sx={{
          py: { xs: 4, sm: 6 },
          px: { xs: 2, sm: 4 },
          textAlign: "center",
          background: "linear-gradient(to bottom, #8B4000, #5C2C06)",
          backdropFilter: "blur(8px)",
          position: "relative",
        }}
      >
        {/* New Card for Phone Number */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Sawarabi Mincho', serif",
              fontWeight: "bold",
              fontSize: { xs: "1.5rem", sm: "2rem" },
              color: "#fff",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              padding: "0.5rem 1rem",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              display: "inline-block",
              mb: 4,
            }}
          >
            {SMS_ORDER_NUMBER}
          </Typography>
        </motion.div>

        {/* Existing SMS Ordering Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Sawarabi Mincho', serif",
              fontWeight: "bold",
              fontSize: { xs: "1.5rem", sm: "2rem" },
              color: "#fff",
              backgroundColor: "#388e3c",
              padding: "0.5rem 1rem",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              display: "inline-block",
            }}
          >
            Now Introducing: SMS Ordering!
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#fff",
              mt: 2,
              fontStyle: "italic",
              maxWidth: 600,
              mx: "auto",
              lineHeight: 1.4,
            }}
          >
            Already a customer? Just text us your order and we’ll do the rest!
          </Typography>
        </motion.div>

        <Grid
          container
          spacing={3}
          justifyContent="center"
          sx={{ mt: 4 }}
          component={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {[
            {
              title: "Order via Text!",
              text: `Send a message to: ${SMS_ORDER_NUMBER}`,
              icon: <LocalDining />,
            },
            {
              title: "How it Works",
              text: `Try: "${SMS_ORDER_EXAMPLE}"`,
              icon: <Restaurant />,
            },
            {
              title: "Fastest Takeout",
              text: "Your order is processed instantly for registered users!",
              icon: <LocalDining />,
            },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Card
                  raised
                  sx={{
                    borderRadius: "20px",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    color: "#fff",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                    minHeight: 200,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <CardContent>
                    <Box sx={{ fontSize: 40, mb: 1 }}>{item.icon}</Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", mt: 1, mb: 1 }}
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="body2">{item.text}</Typography>
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