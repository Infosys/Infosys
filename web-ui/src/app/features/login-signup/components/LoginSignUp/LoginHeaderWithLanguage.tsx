
// LoginHeaderWithLanguage displays the login header and a language selection button
import { Box, Typography } from "@mui/material";
import { LanguageButton } from "./LanguageButton"; // adjust path


// Props for LoginHeaderWithLanguage
interface LoginHeaderWithLanguageProps {
  LanguageButtonProp?: React.ComponentProps<typeof LanguageButton>;
}


// Renders a header with the "Log In" title and a language selection button
export const LoginHeaderWithLanguage: React.FC<LoginHeaderWithLanguageProps> = ({
  LanguageButtonProp = {},
}) => (
  <Box
    sx={{
      width: "100%",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      position: "relative",
      mt: { xs: 1, sm: 2 },
      mb: { xs: 3, sm: 4 }
    }}
  >
    {/* Login page title */}
    <Typography
      fontWeight={600}
      fontSize={28}
      color="#111"
      fontFamily="Roboto, sans-serif"
      sx={{ mb: 0 }}
    >
      Log In
    </Typography>
    {/* Language selection button */}
    <LanguageButton {...LanguageButtonProp} />
  </Box>
);