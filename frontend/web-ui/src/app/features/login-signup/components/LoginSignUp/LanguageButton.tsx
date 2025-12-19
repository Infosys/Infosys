
// LanguageButton displays a button for language selection with an icon and label
import React from "react";
import { Button, Typography } from "@mui/material";
import translateIndicSvg from '../../assets/LoginPageAssets/translate_indic.svg';


// Props: optional onClick handler for button
export const LanguageButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
    // State to track if the button is pressed (for visual feedback)
    const [pressed, setPressed] = React.useState(false);

    return (
        <Button
            variant="contained"
            disableElevation
            onClick={onClick}
            // Set pressed state for background color effect
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
            {/* Language icon */}
            <img
                src={translateIndicSvg}
                alt="Language"
                width={24}
                height={24}
                style={{ display: 'block', margin: '0 auto' }}
            />
            {/* Button label */}
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
                Language
            </Typography>
        </Button>
    );
};