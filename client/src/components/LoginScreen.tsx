import { useState } from "react";
import { Box, Paper, Typography, TextField, Button, Fade } from "@mui/material";
import Logo from "../assets/generated-image.png";

type Props = { onLogin: (name: string) => void };

/**
 * LoginScreen - Tela de login inicial do sistema.
 * Permite o usuário digitar seu nome para acessar o painel.
 */
export default function LoginScreen({ onLogin }: Props) {
  // Estado para armazenar o nome digitado
  const [name, setName] = useState("");

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "#181C25",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Fade in timeout={700}>
        <Paper
          elevation={8}
          sx={{
            p: 5,
            minWidth: 350,
            maxWidth: 380,
            textAlign: "center",
            borderRadius: 5,
            background: "rgba(44, 48, 61, 0.96)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
            backdropFilter: "blur(2px)",
          }}
        >
          {/* Logo do sistema */}
          <Box
            component="img"
            src={Logo}
            alt="ContAI Logo"
            sx={{
              height: 240,
              mb: 2,
              mt: 1,
              mx: "auto"
            }}
          />
          <Typography
            variant="h5"
            fontWeight={700}
            mb={1}
            color="text.primary"
            sx={{ letterSpacing: 0.8 }}
          >
            Welcome to ContAI!
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            mb={3}
            sx={{ fontWeight: 400 }}
          >
            Access our financial dashboard:
          </Typography>
          {/* Campo para digitar o nome */}
          <TextField
            label="Your Name"
            fullWidth
            value={name}
            onChange={e => setName(e.target.value)}
            sx={{
              mb: 2,
              input: { color: "#fff" },
              label: { color: "#bbb" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#4F8EF7" },
                "&:hover fieldset": { borderColor: "#FFB300" },
                "&.Mui-focused fieldset": { borderColor: "#4F8EF7" },
              },
            }}
            InputLabelProps={{ style: { color: "#bbb" } }}
          />
          {/* Botão para entrar */}
          <Button
            variant="contained"
            fullWidth
            disabled={!name}
            onClick={() => onLogin(name)}
            sx={{
              py: 1.2,
              fontWeight: 700,
              fontSize: 16,
              background: "linear-gradient(90deg, #4F8EF7 0%, #FFB300 100%)",
              color: "#fff",
              boxShadow: "0 2px 8px rgba(79,142,247,0.18)",
              letterSpacing: 1,
              mb: 1,
              "&:hover": {
                background: "linear-gradient(90deg, #3a6fd8 0%, #e09e00 100%)",
                filter: "brightness(1.08)",
              },
            }}
          >
            ENTER
          </Button>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 2, display: "block", opacity: 0.7 }}
          >
            © {new Date().getFullYear()} ContAI. All Rights Reserved.
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
}