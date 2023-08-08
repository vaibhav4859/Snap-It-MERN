import HomePage from "components/HomePage";
import LoginPage from "components/LoginPage";
import ProfilePage from "components/ProfilePage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import UpdateProfile from "components/UpdateProfile";
import UpdatePassword from "components/UpdatePassword";
import Chat from 'components/Chat';
import ForgotPassword from "components/ForgotPassword";

function App() {
  const mode = useSelector((state) => state.mode);
  const user = useSelector((state) => state.user);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));
  // console.log(user);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={isAuth ? <HomePage user={user} /> : <Navigate to="/" />} />
            <Route path="/profile/:userID" element={isAuth ? <ProfilePage user={user} id={user._id} /> : <Navigate to="/" />} />
            <Route path="/update/:id" element={isAuth ? <UpdateProfile user={user} /> : <Navigate to="/" />} />
            <Route path="/forgot/password" element={<ForgotPassword />} />
            <Route path="/update/:id/password" element={isAuth ? <UpdatePassword user={user} /> : <Navigate to="/" />} />
            <Route path="/chat" element={isAuth ? <Chat user={user} /> : <Navigate to="/" />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;