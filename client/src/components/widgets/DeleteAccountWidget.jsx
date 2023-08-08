import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  IconButton,
  InputAdornment,
  TextField,
  useTheme,
  Button,
} from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "store";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function DeleteAccountWidget(props) {
  const [showPassword, setShowPassword] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [clicked, setClicked] = useState(false);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const theme = useTheme();

  const deleteAccountHandler = async () => {
    setClicked(true);
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/users/${props.user._id}/delete`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: enteredPassword,
        }),
      }
    );

    const res = await response.json();
    if (res === "Incorrect Password!") {
      alert(res);
    } else {
      dispatch(setLogout());
    }

    setClicked(false);
    setEnteredPassword("");
  };

  return (
    <div>
      <Modal
        open={true}
        onClose={() => props.setOpenModal((prev) => !prev)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Enter your password to delete this account permanently!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              onChange={(e) => setEnteredPassword(e.target.value)}
              value={enteredPassword}
              name="password" // eslint-disable-next-line
              error={
                enteredPassword && enteredPassword.length < 6 ? true : false
              } // eslint-disable-next-line
              helperText={
                enteredPassword &&
                enteredPassword.length < 6 &&
                "Password must be at least 5 characters"
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Typography>
          <Button
            fullWidth
            type="button"
            sx={{
              m: "1rem 0",
              p: "0.3rem",
              backgroundColor: !clicked
                ? theme.palette.primary.main
                : "#808080",
              color: !clicked ? theme.palette.background.alt : "#101010",
              "&:hover": {
                color: !clicked ? theme.palette.primary.main : null,
                backgroundColor: !clicked ? null : "#808080",
              },
            }}
            disabled={enteredPassword.length < 6 || clicked}
            onClick={deleteAccountHandler}
          >
            {!clicked ? "SUBMIT" : "WAIT"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
}