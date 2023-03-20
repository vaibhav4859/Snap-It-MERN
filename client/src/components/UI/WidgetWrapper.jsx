import { Box } from "@mui/material";
import { styled } from "@mui/system";

const WidgetWrapper = styled(Box)(({ theme, friend }) => ({
  padding: "1.5rem 1.5rem 0.75rem 1.5rem",
  backgroundColor: theme.palette.background.alt,
  borderRadius: "0.75rem",
  overflowY: friend ? "scroll" : null,
}));

export default WidgetWrapper;

// styled component when u want to reuse some basic css among multiple components
