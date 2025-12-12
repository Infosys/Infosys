import React from "react";
import { Box, Modal, Typography, IconButton, Button } from "@mui/material";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

// Sample language data: English, Hindi, Kannada as top priority, no Gujarati
const LANGUAGES = [
    {
        code: "en",
        label: "English",
        script: "Aa",
        scriptFont: "inherit",
        subtitle: "English",
        available: true,
    },
    {
        code: "hi",
        label: "Hindi",
        script: "आ",
        scriptFont: "Noto Serif, serif",
        subtitle: "हिन्दी Hindi",
        available: true,
    },
    {
        code: "kn",
        label: "Kannada",
        script: "ಅ",
        scriptFont: "'Noto Sans Kannada', sans-serif",
        subtitle: "ಕನ್ನಡ Kannada",
        available: true,
    },
    {
        code: "te",
        label: "Telugu",
        script: "అ",
        scriptFont: "'Noto Sans Telugu', sans-serif",
        subtitle: "తెలుగు Telugu",
        available: true,
    },
    {
        code: "ta",
        label: "Tamil",
        script: "அ",
        scriptFont: "'Noto Sans Tamil', sans-serif",
        subtitle: "தமிழ் Tamil",
        available: true,
    },
];

export interface LanguageSettingsModalProps {
    open: boolean;
    selected?: string;
    onSelect: (code: string) => void;
    onClose: () => void;
    onConfirm: () => void;
}

export const LanguageSettingsModal: React.FC<LanguageSettingsModalProps> = ({
    open,
    selected = "en",
    onSelect,
    onClose,
    onConfirm,
}) => (
    <Modal
        open={open}
        onClose={onClose}
        sx={{
            zIndex: 300,
            display: "flex",
            alignItems: "end",
            justifyContent: "center"
        }}
        disableAutoFocus
    >
        <Box
            sx={{
                width: "100vw",
                maxWidth: 768,
                minHeight: 640,
                height: "90vh",
                bgcolor: "#fff",
                borderRadius: "32px 32px 0 0",
                mx: "auto",
                p: 0,
                boxShadow: 2,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
            }}
        >
            {/* Header row */}
            <Box
                sx={{
                    px: 3,
                    pt: 3,
                    pb: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {/* Title box and Close button properly aligned */}
                <Box sx={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-between" }}>
                    <Box>
                        <Typography fontWeight={700} fontSize={24} color="#111">
                            Language Settings
                        </Typography>
                        <Typography fontWeight={400} fontSize={15} color="#636363" sx={{ mt: 0.5 }}>
                            Please confirm your language.
                        </Typography>
                    </Box>
                    <IconButton aria-label="close" sx={{ p: 1.1 }} onClick={onClose}>
                        <CloseRoundedIcon sx={{ color: "#222", fontSize: 26 }} />
                    </IconButton>
                </Box>
            </Box>

            <Box
                display={"flex"}
                flexDirection={"column"}
                sx={{
                    justifyItems: "space-between",
                }}>
                {/* Language grid */}
                <Box
                    sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: "1fr 1fr",
                        px: 3,
                        pb: 0,
                    }}
                >
                    {LANGUAGES.map(lang => (
                        <Box
                            key={lang.code}
                            sx={{
                                height: 110,
                                bgcolor: selected === lang.code ? "#FFF7F1" : "#f5f6f7",
                                borderRadius: "12px",
                                boxShadow: selected === lang.code ? "0 0 0 2px #C84C0E inset" : "none",
                                cursor: lang.available ? "pointer" : "not-allowed",
                                border: selected === lang.code ? "1.5px solid #C84C0E" : "none",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                px: 2.5,
                                pt: 2,
                                pb: 1.2,
                                position: "relative",
                                transition: "box-shadow .2s, border .2s, background .2s",
                            }}
                            onClick={() => lang.available && onSelect(lang.code)}
                        >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography
                                    fontSize={32}
                                    fontWeight={500}
                                    sx={{
                                        fontFamily: lang.scriptFont,
                                        color: "#111",
                                        letterSpacing: 1,
                                        mr: 0.5,
                                    }}
                                >
                                    {lang.script}
                                </Typography>
                                {selected === lang.code && (
                                    <CheckCircleRoundedIcon sx={{ color: "#21713c", fontSize: 22, ml: 8, mt: -1.5 }} />
                                )}
                            </Box>
                            <Box sx={{ mt: 1.2 }}>
                                <Typography fontWeight={400} fontSize={15} color="#222">
                                    {lang.subtitle}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* Confirm button */}
                <Box sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    px: 3,
                    pt: 6,
                    pb: 8,
                    width: "100vw",
                    zIndex: 350,
                }}>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            height: 46,
                            background: "#C84C0E",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 18,
                            borderRadius: "11px",
                            textTransform: "none",
                            boxShadow: "none",
                            "&:hover": {
                                background: "#C84C0E",
                                boxShadow: "none"
                            }
                        }}
                        onClick={onConfirm}
                    >
                        Confirm
                    </Button>
                </Box>
            </Box>
        </Box>
    </Modal>
);