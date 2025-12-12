// Login and Sign-Up page for the property tax web UI
// Handles user authentication, language selection, and error display

import { useState } from "react";
import { LanguageSettingsModal } from "../../features/login-signup/components/LoginSignUp/LanguageSettingsModal";
import { LoginHeaderWithLanguage } from "../../features/login-signup/components/LoginSignUp/LoginHeaderWithLanguage";
import { Box, Container, IconButton, Paper, Typography, Link as MuiLink, Alert, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import "../../styles/Login-SignUpStyle/login-signup.css"
import authService from "../../features/login-signup/services/AuthService";

import loginBG from '../../features/login-signup/assets/LoginPageAssets/LoginBG.svg';
import propertyTaxLogo from '../../features/login-signup/assets/LoginPageAssets/LoginPropertyTaxText.svg';
import { getUserByUsername } from "../../features/login-signup/models/ProfileService";
import { setUser } from "../../../store/userSlice";
import { useDispatch } from "react-redux";

const PRIMARY_ORANGE = "#C84C0E";
const PAGE_BG = "#E5E5E5";
const CONTAINER_BG = "#FFFFFF";

// Props for the login form (callback on successful login)
interface LoginFormProps {
    onLoginSuccess: () => void;
}

// Utility function to validate username format
function isValidUsername(username: string) {
    if (username.length < 2) return false;
    return /^[A-Za-z][A-Za-z0-9._-]*[A-Za-z0-9]$/.test(username);
}

// Main login screen component
export default function LoginScreen(onLoginSuccess: LoginFormProps) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // State for username and password inputs
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // State for error and UI feedback
    const [error, setError] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [langModalOpen, setLangModalOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [showPassword, setShowPassword] = useState(false);
    const [showUsernameError, setShowUsernameError] = useState(false);

    // Handler for login button click
    const handleLogin = async () => {
        try {
            const credentials = {
                username: username,
                password: password,
            };
            const success = await authService.loginWithPassword(credentials);
            console.log("Login success status:", success);

            if (success) {
                try {
                    const user = await getUserByUsername(username);
                    // console.log(user);
                    if (user) {
                        dispatch(setUser(user));
                    }
                } catch (userError) {
                    console.error("Failed to fetch user profile:", userError);
                }

                // Redirect based on user role
                const userRole = authService.getPrimaryRole();
                if (userRole === 'SERVICE_MANAGER') {
                    navigate("/service-manager/home");
                } else if (userRole === 'COMMISSIONER') {
                    navigate("/commissioner/home");
                } else if (userRole === 'ADMIN') {
                    navigate("/admin/home");
                }
                else {
                    navigate("/login");
                }

                setShowAlert(false);
                setError("");
                onLoginSuccess.onLoginSuccess();
            } else {
                setError("Login failed. Please check your credentials.");
                setShowAlert(true);
            }
        } catch {
            setError("An error occurred during login.");
            setShowAlert(true);
        }
    };

    return (
        <Box sx={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: PAGE_BG }}>
            {/* SVG Background image for the login page */}
            <Box
                component="img"
                src={loginBG}
                alt="Login Background"
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    objectFit: "cover",
                    zIndex: 0,
                    pointerEvents: "none",

                }}
            />

            {/* Logo at top right corner */}
            <Box
                sx={{
                    position: "absolute",
                    top: { xs: 20, sm: 32 },
                    right: { xs: 40, sm: 70 },
                    zIndex: 2,
                    width: 280,
                    height: 250,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-end",
                }}
            >
                <Box
                    component="img"
                    src={propertyTaxLogo}
                    alt="Property Tax Logo"
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain"
                    }}
                />
            </Box>

            <Container
                sx={{
                    background: "transparent",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    zIndex: 5, // ensure card is above backdrop/logo
                }}>
                {/* Log In - Sign Up Container */}
                <Paper
                    sx={{
                        width: "92vw",
                        maxWidth: 370,
                        background: CONTAINER_BG,
                        borderRadius: "32px",
                        p: "32px 25px",
                        mx: "35px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                        position: "relative",
                        zIndex: 10,
                    }}
                >
                    <Box sx={{ mt: 1 }}>
                        {/* Log In Header with language selection */}
                        <LoginHeaderWithLanguage LanguageButtonProp={{ onClick: () => setLangModalOpen(true) }} />
                        <LanguageSettingsModal
                            open={langModalOpen}
                            selected={selectedLanguage}
                            onSelect={setSelectedLanguage}
                            onClose={() => setLangModalOpen(false)}
                            onConfirm={() => setLangModalOpen(false)}
                        />

                        <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                            <Typography fontWeight={500} fontSize={16} fontFamily="Roboto, sans-serif">
                                User Name
                            </Typography>
                            <Typography color={PRIMARY_ORANGE} sx={{ fontWeight: 700, mx: 0.5 }}>
                                *
                            </Typography>
                            <IconButton size="small" sx={{ p: 0, ml: "2px" }}>
                                <InfoOutlinedIcon sx={{ fontSize: 18, color: "#656565" }} />
                            </IconButton>
                        </Box>
                        {/* Username Input field */}
                        <input
                            type="text"
                            value={username}
                            placeholder="Enter Username"
                            onChange={e => {
                                setUsername(e.target.value);
                                setShowUsernameError(false);
                            }}
                            onBlur={e => {
                                if (e.target.value && !isValidUsername(e.target.value)) {
                                    setShowUsernameError(true);
                                }
                            }}
                            style={{
                                width: '100%',
                                padding: '8.5px 14px',
                                marginBottom: '2px',
                                fontFamily: 'Roboto, sans-serif',
                                fontSize: '14px',
                                borderRadius: '15px',
                                minHeight: '48px',
                                border: showUsernameError ? '1px solid #D32F2F' : '1px solid rgba(0, 0, 0, 0.23)',
                                outline: 'none',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.2s',
                            }}
                            onFocus={e => {
                                if (!showUsernameError) {
                                    e.target.style.borderColor = '#C84C0E';
                                }
                            }}
                            onBlurCapture={e => {
                                if (!showUsernameError) {
                                    e.target.style.borderColor = 'rgba(0, 0, 0, 0.23)';
                                }
                            }}
                        />
                        <Typography
                            fontSize={11.5}
                            fontFamily="Roboto, sans-serif"
                            sx={{
                                ml: 1,
                                mt: 0.1,
                                mb: 0.5,
                                color: showUsernameError ? "#D32F2F" : "#636363",
                                fontWeight: showUsernameError ? 500 : 400,
                            }}
                        >
                            {showUsernameError
                                ? "Username must start with an alphabet and end with a letter/number."
                                : "Enter username to login"}
                        </Typography>

                        {/* Password input section */}
                        <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                            <Typography fontWeight={500} fontSize={16} fontFamily="Roboto, sans-serif">
                                Password
                            </Typography>
                            <Typography color={PRIMARY_ORANGE} sx={{ fontWeight: 700, mx: 0.5 }}>
                                *
                            </Typography>
                        </Box>
                        
                        {/* Password Input with visibility toggle */}
                        <div style={{ position: 'relative', width: '100%', marginBottom: '2px' }}>
                            <input
                                id="login-password-input"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                placeholder="Enter Password"
                                onChange={e => setPassword(e.target.value)}
                                className="no-password-reveal"  
                                style={{
                                    width: '100%',
                                    padding: '8.5px 40px 8.5px 14px',
                                    fontFamily: 'Roboto, sans-serif',
                                    fontSize: '14px',
                                    borderRadius: '15px',
                                    minHeight: '48px',
                                    border: '1px solid rgba(0, 0, 0, 0.23)',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={e => {
                                    e.target.style.borderColor = '#C84C0E';
                                }}
                                onBlur={e => {
                                    e.target.style.borderColor = 'rgba(0, 0, 0, 0.23)';
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'rgba(0, 0, 0, 0.54)',
                                }}
                            >
                                {showPassword ? (
                                    // Eye open icon (password visible)
                                    <VisibilityOutlinedIcon />
                                ) : (
                                    // Eye closed icon (password hidden)
                                    <VisibilityOffOutlinedIcon />
                                )}
                            </button>
                        </div>

                        {/* Forgot password link */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                pt: 2,
                                pb: 1,
                            }}
                        >
                            <MuiLink
                                underline="hover"
                                sx={{ color: '#000', fontWeight: 500 }}
                            >
                                Forgot Password
                            </MuiLink>
                        </Box>

                        {/* Error or warning alert for login issues */}
                        {showAlert && (
                            <Alert
                                icon={
                                    <Box
                                        sx={{
                                            background: "#FFCE8B",
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 26,
                                            height: 26,
                                        }}
                                    >
                                        <InfoOutlinedIcon sx={{ color: "#111", fontSize: 20 }} />
                                    </Box>
                                }
                                severity="warning"
                                sx={{
                                    background: "#FFEFD8",
                                    color: "#444",
                                    mt: 2,
                                    mb: 2,
                                    fontFamily: "Roboto, sans-serif",
                                    borderRadius: "12px",
                                    px: 2,
                                    py: 1,
                                    fontSize: 15,
                                    alignItems: "center",
                                }}
                            >
                                {error ? error
                                    : "Incorrect Username or Password. Please try again."}
                            </Alert>
                        )}

                        {/* Login button */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: '60px',
                                width: '100%',
                            }}
                        >
                            <Button
                                variant="contained"
                                disableElevation
                                sx={{
                                    background: PRIMARY_ORANGE,
                                    width: "150px",
                                    height: "38px",
                                    color: "#fff",
                                    borderRadius: "12px",
                                    fontWeight: 700,
                                    textTransform: "none",
                                    fontSize: 16,
                                    fontFamily: "Roboto, sans-serif",
                                    boxShadow: "none",
                                    "&:hover": { background: PRIMARY_ORANGE, boxShadow: "none" },
                                    '&:focus': {
                                        outline: 'none',
                                        boxShadow: 'none',
                                        border: 'none',
                                    },
                                    '&:active': {
                                        outline: 'none',
                                        boxShadow: 'none',
                                        border: 'none',
                                    }
                                }}
                                onClick={handleLogin}
                            >
                                Log In
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}