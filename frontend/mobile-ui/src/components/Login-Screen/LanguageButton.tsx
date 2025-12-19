// LanguageButton.tsx
// Renders a button for language selection on the login screen.
// Shows a translate icon and localized label, and supports pressed state styling.
import React from "react";
import { Button, Typography } from "@mui/material";
import translateIndicSvg from '../../assets/LoginPageAssets/translate_indic.svg';

/**
 * LanguageButton component
 * Renders a styled button with a translate icon and localized label for language selection.
 * Handles pressed state for visual feedback.
 */
export const LanguageButton: React.FC<{ onClick?: () => void, t : (code: string, fallback?: string) => string }> = ({ onClick, t }) => {
    // State for pressed (active) button styling
    const [pressed, setPressed] = React.useState(false);

    return (
        // Main button for language selection
        <Button
            variant="contained"
            disableElevation
            onClick={onClick}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            onMouseLeave={() => setPressed(false)}
            sx={{
                minWidth: 0,
                px: 1.5,
                py: 0.8,
                top: "-15px",
                background: pressed ? "#0B4B66" : "#91B6C5",
                color: "#fff",
                borderRadius: "12px",
                boxShadow: "none",
                fontWeight: 700,
                fontSize: 16,
                gap: 1.1,
                alignItems: "center",
                transition: "background 0.1s",
                "&:hover": {
                    background: "#8ca9bc",
                },
            }}
        >
            {/* Translate icon */}
            <img
                src={translateIndicSvg}
                alt="Language"
                width={24}
                height={24}
                style={{ display: 'block', margin: '0 auto' }}
            />
            {/* Localized label for language */}
            <Typography
                sx={{
                    color: "#fff",
                    fontWeight: 500,
                    fontFamily: "Roboto, sans-serif",
                    fontSize: 16,
                    ml: 0.5,
                    userSelect: "none"
                }}
            >
                {t("language", "Language")}
            </Typography>
        </Button>
    );
};