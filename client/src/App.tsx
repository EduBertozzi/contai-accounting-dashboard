import React, { useEffect, useState, forwardRef, useMemo } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
  IconButton,
  AppBar,
  Toolbar,
  Slide,
  Divider,
  Tooltip,
  Card,
  useMediaQuery,
  InputAdornment,
  Collapse
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Logo from "./assets/generated-image.png";
import SplashScreen from "./components/SplashScreen";
import SplashScreenLoading from "./components/SplashScreenLoading";
import LoginScreen from "./components/LoginScreen";

// Importações do seletor de data
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import enUS from 'date-fns/locale/en-US';

// Definição do tipo de entrada
type Entry = {
  id: string;
  entryDate: string;
  description: string;
  amount: number;
  entryType: "CREDIT" | "DEBIT";
};

// Initial form state (para resetar o formulário)
const initialForm: Omit<Entry, "id"> = {
  entryDate: "",
  description: "",
  amount: 0,
  entryType: "CREDIT",
};

// Animação para abertura de modais
const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Função utilitária para formatar datas (YYYY-MM-DD → DD/MM/YYYY)
function formatDate(dateString: string) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

// Agrupa lançamentos por mês/ano
function groupEntriesByMonth(entries: Entry[]) {
  return entries.reduce((acc, entry) => {
    const [year, month] = entry.entryDate.split("-");
    const key = `${year}-${month}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {} as Record<string, Entry[]>);
}

// Retorna o nome do mês em inglês
function getMonthName(yearMonth: string) {
  const [year, month] = yearMonth.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString("en-US", { month: "long" });
}

function App() {
  // Estados globais de tela e autenticação
  const [showSplash, setShowSplash] = useState(true);
  const [showLoadingSplash, setShowLoadingSplash] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  // Estados de lançamentos e formulário
  const [entries, setEntries] = useState<Entry[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Filtro por período
  const [dateStart, setDateStart] = useState<Date | null>(null);
  const [dateEnd, setDateEnd] = useState<Date | null>(null);

  // Responsividade
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  // Splash inicial
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  // Busca lançamentos ao logar
  useEffect(() => {
    if (loggedIn) fetchEntries();
  }, [loggedIn]);

  // Busca lançamentos da API
  const fetchEntries = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/entries");
      setEntries(response.data);
      setErrorMsg("");
    } catch {
      setErrorMsg("Error fetching entries");
    }
  };

  // Abre modal de novo lançamento
  const handleOpen = () => {
    setForm(initialForm);
    setFormError("");
    setEditId(null);
    setOpen(true);
  };

  // Fecha modal de lançamento
  const handleClose = () => {
    setOpen(false);
    setFormError("");
    setEditId(null);
  };

  // Atualiza data do formulário (DatePicker)
  const handleFormDateChange = (newValue: Date | null) => {
    setForm((prev) => ({
      ...prev,
      entryDate: newValue ? newValue.toISOString().slice(0, 10) : "",
    }));
  };

  // Atualiza campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  // Validação dos campos do formulário
  const validateForm = () => {
    if (!form.entryDate) return "Please provide the date.";
    if (!form.description.trim()) return "Please provide the description.";
    if (isNaN(form.amount) || form.amount <= 0) return "The amount must be greater than zero.";
    if (!["CREDIT", "DEBIT"].includes(form.entryType)) return "Invalid entry type.";
    return "";
  };

  // Envia formulário (cria ou edita lançamento)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }
    setLoading(true);
    setFormError("");
    setSuccessMsg("");
    setErrorMsg("");
    try {
      if (editId) {
        await axios.put(`http://localhost:3001/api/entries/${editId}`, form);
      } else {
        await axios.post("http://localhost:3001/api/entries", form);
      }
      await fetchEntries();
      setSuccessMsg(editId ? "Entry updated successfully!" : "Entry created successfully!");
      setOpen(false);
      setEditId(null);
    } catch {
      setErrorMsg("Error saving entry.");
    } finally {
      setLoading(false);
    }
  };

  // Preenche formulário para edição
  const handleEdit = (entry: Entry) => {
    setForm({
      entryDate: entry.entryDate,
      description: entry.description,
      amount: entry.amount,
      entryType: entry.entryType,
    });
    setEditId(entry.id);
    setFormError("");
    setOpen(true);
  };

  // Exclui lançamento
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await axios.delete(`http://localhost:3001/api/entries/${id}`);
        await fetchEntries();
        setSuccessMsg("Entry deleted successfully!");
      } catch {
        setErrorMsg("Error deleting entry.");
      }
    }
  };

  // Filtro por período aplicado aos lançamentos
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      if (dateStart && entry.entryDate < dateStart.toISOString().slice(0, 10)) return false;
      if (dateEnd && entry.entryDate > dateEnd.toISOString().slice(0, 10)) return false;
      return true;
    });
  }, [entries, dateStart, dateEnd]);

  // Cálculo do saldo atual
  const currentBalance = filteredEntries.reduce(
    (acc, e) => (e.entryType === "CREDIT" ? acc + e.amount : acc - e.amount),
    0
  );

  // Agrupamento dos lançamentos por mês/ano
  const groupedEntries = groupEntriesByMonth(filteredEntries);
  const sortedKeys = Object.keys(groupedEntries).sort((a, b) => b.localeCompare(a));

  // Fluxo de telas (splash, loading, login)
  if (showSplash) return <SplashScreen />;
  if (showLoadingSplash) return <SplashScreenLoading name={userName} />;
  if (!loggedIn) return (
    <LoginScreen
      onLogin={(name: string) => {
        setUserName(name);
        setShowLoadingSplash(true);
        setTimeout(() => {
          setShowLoadingSplash(false);
          setLoggedIn(true);
        }, 1200);
      }}
    />
  );

  // Renderização principal
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{
          boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
          background: 'linear-gradient(90deg, #4F8EF7 0%,rgb(59, 35, 54) 100%)',
        }}
      >
        <Toolbar>
          <Box
            component="img"
            src={Logo}
            alt="ContAI Logo"
            sx={{ height: 100, mr: 2 }}
          />
          <Typography
            variant="h6"
            color="inherit"
            sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}
          >
            ContAI {userName && `| Hey, ${userName}!`}
          </Typography>
          <Button
            color="inherit"
            startIcon={<AccountCircleIcon />}
            variant="outlined"
            sx={{ ml: 2 }}
            onClick={() => {
              setLoggedIn(false);
              setUserName("");
            }}
          >
            Change user
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {/* Filtro por período com DatePicker */}
        <Stack direction="row" spacing={2} mb={3} alignItems="center">
          <DatePicker
            label="Start date"
            value={dateStart}
            onChange={setDateStart}
            format="dd/MM/yyyy"
            slotProps={{
              textField: {
                size: "small",
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthIcon color="primary" />
                    </InputAdornment>
                  )
                }
              }
            }}
            localeText={{ cancelButtonLabel: 'Cancel', okButtonLabel: 'OK' }}
          />
          <DatePicker
            label="End date"
            value={dateEnd}
            onChange={setDateEnd}
            format="dd/MM/yyyy"
            slotProps={{
              textField: {
                size: "small",
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthIcon color="primary" />
                    </InputAdornment>
                  )
                }
              }
            }}
            localeText={{ cancelButtonLabel: 'Cancel', okButtonLabel: 'OK' }}
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setDateStart(null);
              setDateEnd(null);
            }}
            sx={{ height: 40, minWidth: 120 }}
          >
            Clear Filters
          </Button>
        </Stack>

        {/* Card de saldo e botão de novo lançamento */}
        <Stack direction={isSmallScreen ? "column" : "row"} spacing={3} alignItems={isSmallScreen ? "stretch" : "center"} mb={3}>
          <Card
            sx={{
              minWidth: 220,
              maxWidth: 320,
              flex: 1,
              background: "linear-gradient(90deg, #4F8EF7 0%, #23283B 100%)",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(79,142,247,0.18)",
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              p: 2,
            }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: 36, mr: 1.5 }} />
            <Box
              sx={{
                ml: 1,
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.8,
                  textAlign: "left",
                  width: "100%",
                  fontWeight: 400,
                  fontSize: 15,
                  mb: 0.5,
                }}
              >
                Current balance
              </Typography>
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  color: currentBalance < 0 ? "#FF3B3B" : "#fff",
                  letterSpacing: 0.5,
                  fontSize: 22,
                  textAlign: "left",
                  width: "100%",
                  lineHeight: 1.2,
                }}
              >
                {currentBalance.toLocaleString("en-US", { style: "currency", currency: "USD" })}
              </Typography>
            </Box>
          </Card>
          <Box flex={2}>
            <Typography variant="h4" fontWeight={700} mb={1}>
              ENTRIES
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" mb={1}>
              Welcome to ContAI's financial dashboard!
            </Typography>
          </Box>
          <Button
            variant="contained"
            fullWidth={isSmallScreen}
            startIcon={<AddIcon />}
            onClick={handleOpen}
            sx={{
              background: "linear-gradient(90deg, #4F8EF7 0%, rgb(138, 23, 115) 100%)",
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(79,142,247,0.15)',
              '&:hover': {
                background: "linear-gradient(90deg, #3a6fd8 0%, rgb(138, 23, 115) 100%)",
                filter: 'brightness(1.07)'
              },
              minWidth: isSmallScreen ? "100%" : 200,
            }}
          >
            New entry
          </Button>
        </Stack>

        {/* Alerta de saldo negativo */}
        {currentBalance < 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Warning: Your balance is negative!
          </Alert>
        )}

        <Divider sx={{ mb: 3 }} />

        {/* Tabela de lançamentos agrupados por mês */}
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            borderRadius: 3,
          }}
        >
          <Table sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 100 }}>Date</TableCell>
                <TableCell sx={{ minWidth: 180 }}>Description</TableCell>
                <TableCell align="right" sx={{ minWidth: 90 }}>Amount</TableCell>
                <TableCell align="center" sx={{ minWidth: 90 }}>Type</TableCell>
                <TableCell align="center" sx={{ minWidth: 120 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedKeys.map(key => {
                const [year] = key.split("-");
                const monthName = getMonthName(key);

                const creditTotal = groupedEntries[key]
                  .filter(e => e.entryType === "CREDIT")
                  .reduce((sum, e) => sum + e.amount, 0);

                const debitTotal = groupedEntries[key]
                  .filter(e => e.entryType === "DEBIT")
                  .reduce((sum, e) => sum + e.amount, 0);

                return (
                  <React.Fragment key={key}>
                    {/* Cabeçalho do mês */}
                    <TableRow>
                      <TableCell colSpan={5} sx={{
                        background: "#23283B",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 18,
                        borderTop: "2px solid #4F8EF7"
                      }}>
                        {monthName.charAt(0).toUpperCase() + monthName.slice(1)} - {year}
                      </TableCell>
                    </TableRow>
                    {/* Lançamentos do mês */}
                    {groupedEntries[key].map((entry, idx) => (
                      <TableRow
                        key={entry.id}
                        hover
                        sx={{
                          backgroundColor: idx % 2 === 0 ? "rgba(79,142,247,0.04)" : "inherit",
                          '&:hover': { backgroundColor: "rgba(79,142,247,0.13)" }
                        }}
                      >
                        <TableCell sx={{ minWidth: 100 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarMonthIcon color="primary" fontSize="small" />
                            <span>{formatDate(entry.entryDate)}</span>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ minWidth: 180 }}>
                          {entry.description}
                        </TableCell>
                        <TableCell align="right" sx={{ minWidth: 90 }}>
                          {entry.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                        </TableCell>
                        <TableCell align="center" sx={{ minWidth: 90 }}>
                          <Chip
                            icon={
                              entry.entryType === "CREDIT" ? (
                                <ArrowUpwardIcon color="success" />
                              ) : (
                                <ArrowDownwardIcon color="error" />
                              )
                            }
                            label={entry.entryType === "CREDIT" ? "Credit" : "Debit"}
                            color={entry.entryType === "CREDIT" ? "success" : "error"}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center" sx={{ minWidth: 120 }}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Edit entry">
                              <IconButton
                                aria-label="Edit"
                                color="primary"
                                onClick={() => handleEdit(entry)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete entry">
                              <IconButton
                                aria-label="Delete"
                                color="error"
                                onClick={() => handleDelete(entry.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Totais do mês */}
                    <TableRow>
                      <TableCell />
                      <TableCell sx={{ fontWeight: 700, color: "#4F8EF7" }}>Monthly totals:</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: "#388e3c" }}>
                        +{creditTotal.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: "#d32f2f" }}>
                        -{debitTotal.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal de novo/editar lançamento */}
        <Dialog
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
          PaperProps={{
            sx: {
              background: "#363946",
              borderRadius: 4,
              p: 2,
              boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
              minWidth: 370,
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, fontSize: 22, color: "#fff", pb: 1 }}>
            {editId ? "Edit entry" : "New entry"}
            <Divider sx={{ bgcolor: "#fff", height: 2, mt: 1, borderRadius: 1 }} />
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ pt: 3 }}>
              <DatePicker
                label="Date"
                value={form.entryDate ? new Date(form.entryDate) : null}
                onChange={handleFormDateChange}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    margin: "dense",
                    fullWidth: true,
                    required: true,
                    InputLabelProps: { shrink: true },
                    sx: { mb: 3 },
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon color="primary" />
                        </InputAdornment>
                      )
                    }
                  }
                }}
                localeText={{ cancelButtonLabel: 'Cancel', okButtonLabel: 'OK' }}
              />
              <TextField
                margin="dense"
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 3 }}
              />
              <TextField
                margin="dense"
                label="Amount"
                name="amount"
                value={form.amount === 0 ? "" : form.amount}
                onChange={e => {
                  const raw = e.target.value.replace(/[^\d,]/g, "").replace(",", ".");
                  setForm(prev => ({
                    ...prev,
                    amount: raw ? Number(raw) : 0
                  }));
                }}
                fullWidth
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputMode: "decimal"
                }}
                sx={{ mb: 3 }}
              />
              <TextField
                margin="dense"
                label="Type"
                name="entryType"
                value={form.entryType}
                onChange={handleChange}
                select
                fullWidth
                required
                sx={{ mb: 1 }}
              >
                <MenuItem value="CREDIT">Credit</MenuItem>
                <MenuItem value="DEBIT">Debit</MenuItem>
              </TextField>
              {formError && (
                <Box mt={1}>
                  <Alert severity="error">{formError}</Alert>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={handleClose}
                sx={{
                  fontWeight: 700,
                  color: "#fff",
                  minWidth: 110,
                  background: "transparent",
                  boxShadow: "none",
                  '&:hover': {
                    background: "rgba(255,255,255,0.07)"
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  background: "#4F8EF7",
                  color: "#fff",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  boxShadow: "none",
                  minWidth: 110,
                  '&:hover': { background: "#3769b5" }
                }}
              >
                {loading ? <CircularProgress size={22} /> : (editId ? "Update" : "Save")}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Feedback visual com animação */}
        <Collapse in={!!successMsg}>
          <Snackbar
            open={!!successMsg}
            autoHideDuration={3000}
            onClose={() => setSuccessMsg("")}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity="success" onClose={() => setSuccessMsg("")}>
              {successMsg}
            </Alert>
          </Snackbar>
        </Collapse>
        <Collapse in={!!errorMsg}>
          <Snackbar
            open={!!errorMsg}
            autoHideDuration={4000}
            onClose={() => setErrorMsg("")}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity="error" onClose={() => setErrorMsg("")}>
              {errorMsg}
            </Alert>
          </Snackbar>
        </Collapse>
      </Container>
    </LocalizationProvider>
  );
}

export default App;
