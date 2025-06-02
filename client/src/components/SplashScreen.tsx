import { Box, CircularProgress } from "@mui/material";
import Logo from "../assets/generated-image.png";

/**
 * SplashScreen - Tela de splash exibida ao iniciar o app.
 * Mostra o logo e um loading circular.
 */
export default function SplashScreen() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Logo centralizado */}
      <Box
        component="img"
        src={Logo}
        alt="ContAI Logo"
        sx={{ height: 400, mb: 4 }}
      />
      {/* Loading circular */}
      <CircularProgress color="primary" />
    </Box>
  );
}
