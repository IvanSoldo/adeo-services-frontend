import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Authentication from "../adapters/Authentication";
import React from "react";
import { useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import CustomSnackBar from "../components/CustomSnackBar";

const theme = createTheme();
export default function SignIn() {
  const navigate = useNavigate();
  const [isLoginError, setIsLoginError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    login(data.get("email"), data.get("password"));
  };

  const onClickHandleSnackBar = () => {
    setIsLoginError(false);
  };

  const login = (email, password) => {
    axios
      .post("api/v1/authentication/token-create", {
        username: email,
        password: password,
      })
      .then((response) => {
        Authentication.setToken(response.data.authenticationToken);
        setIsLoginError(false);
        navigate("/admin/dashboard");
      })
      .catch((error) => {
        setIsLoginError(true);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
        <CustomSnackBar
          showSnackBar={isLoginError}
          message={"Wrong username or password, please try again."}
          severity={"error"}
          onClick={onClickHandleSnackBar}
        />
      </Container>
    </ThemeProvider>
  );
}
