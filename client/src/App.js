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

// auro ki profile visit kro toh mypost widget na dikhe khudki pr dikhe
// freind request accept tabhi ho jab accept kri via notification in navbar
// insert comments with scrollbar customized
// chatting
// twitter aur linkedin ka url
// 5 friends ke baad scrollbar aa jayega
// jaha bhi use krna h user ko as a prop kro
// naam leak kr rha h in navbar if long
// profile photo update ni hori baaki sab hora h

function App() {
  const mode = useSelector((state) => state.mode);
  const user = useSelector((state) => state.user);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/" />} />
            <Route path="/profile/:userID" element={isAuth ? <ProfilePage /> : <Navigate to="/" />} />
            <Route path="/update/:id" element={isAuth ? <UpdateProfile user={user} /> : <Navigate to="/" />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
