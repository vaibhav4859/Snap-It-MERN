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

// auro ki profile visit kro toh mypost widget na dikhe khudki pr dikhe - done
// 3 friends ke baad scrollbar aa jayega - done
// naam leak kr rha h in navbar if long - done
// jaha bhi use krna h user ko as a prop kro - done
// picture naayi pr picture aur picturepath dono aa rha h but purani pr picture as a file ni jaari -done
// profile photo update ni hori baaki sab hora h -done
// insert comments with scrollbar customized - done
// delete post - done
// email ko tolower while saving  - done
// profile pr visit krkr comment ni hora - done
// stop from uploading anything else except image - done
// friends update in user widget - done
// update krte time comment mei bhi update kro image - done
// password update problem via otp - done
// emoji in add new post  - done
// update profile/password ka button in user widget - done
// show/ hide likes and comments - done
// twitter aur linkedin ka url - done
// suggested for you - done
// close input field for social profiles bug - resolved 
// friend request accept tabhi ho jab accept kri via notification in navbar
// otp while registering - done
// infinite scrolling implement kro - done
// chatting - done
// add images in chatting using firebase
// lock if folow ni krta aur button
// delete account

function App() {
  const mode = useSelector((state) => state.mode);
  const user = useSelector((state) => state.user);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));
  // console.log(user);

  // document.addEventListener('contextmenu', function (event) {
  //   event.preventDefault();
  // });


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
            <Route path="/update/:id/password" element={isAuth ? <UpdatePassword user={user} /> : <Navigate to="/" />} />
            <Route path="/chat" element={isAuth ? <Chat user={user} /> : <Navigate to="/" />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
