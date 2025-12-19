// LoginHeaderWithLanguage.tsx
// Renders the login page header with a localized title and a language selection button.
import { Box, Typography } from "@mui/material";
import { LanguageButton } from "./LanguageButton"; 

interface LoginHeaderWithLanguageProps {
// Props for LoginHeaderWithLanguage component
  LanguageButtonProp?: React.ComponentProps<typeof LanguageButton>;
  t : (code: string, fallback?: string) => string;
}

export const LoginHeaderWithLanguage: React.FC<LoginHeaderWithLanguageProps> = ({
  LanguageButtonProp = {},
  t
}) => {
  return (
  <Box
    sx={{
      width: "100%", // always matches Paper width
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      position: "relative",
      mt: { xs: 1, sm: 2 }, // responsive top margin
      mb: { xs: 3, sm: 4 }
    }}
  >
    {/* Localized login title */}
    <Typography
      fontWeight={600}
      fontSize={28}
      color="#111"
      fontFamily="Roboto, sans-serif"
      sx={{ mb: 0 }} // Remove margin so flex stays tight
    >
      {t("log-in", "Log In")}
    </Typography>
    {/* Language selection button */}
    <LanguageButton {...LanguageButtonProp} t={t} />
  </Box>
);
}