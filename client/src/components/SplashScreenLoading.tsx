import { Box, CircularProgress, Typography } from "@mui/material";
import Logo from "../assets/generated-image.png";

type SplashScreenLoadingProps = { name: string };

/**
 * SplashScreenLoading - Tela de splash exibida após login.
 * Mostra mensagem personalizada e loading.
 */
export default function SplashScreenLoading({ name }: SplashScreenLoadingProps) {
  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Logo centralizado */}
      <Box component="img" src={Logo} alt="ContAI Logo" sx={{ height: 350, mb: 3 }} />
      {/* Mensagem personalizada */}
      <Typography variant="h4" fontWeight={700} mb={1} color="text.primary">
        Hey, {name}!
      </Typography>
      <Typography variant="h6" color="text.secondary" mb={3}>
        We're getting everything ready for you!
      </Typography>
      {/* Loading circular */}
      <CircularProgress color="primary" />
    </Box>
  );
}
