"use client";
import Pantry from "./components/Pantry";
import {
  Button,
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const HomePage = () => {
  return (
    <Container
      sx={{
        mt: 0.25,
        mb: 4,
        p: 1,
      }}
    >
      <Paper
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 0.25,
          p: 1,
          backgroundColor: "#b34cfc",
          color: "white", 
          textAlign: "center", 
          boxShadow: 8, 
          borderRadius: 2, 
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold", 
            letterSpacing: 2, 
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", 
            color: "white", 
          }}
        >
          Welcome to Pantry Tracker
        </Typography>
      </Paper>
      <Pantry />
    </Container>
  );
};

export default HomePage;

