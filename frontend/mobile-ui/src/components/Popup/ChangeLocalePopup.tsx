// ChangeLocalePopup.tsx
// Renders a dialog to prompt the user to switch their home page language to match their login language.
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface Props {
// Props for ChangeLocalePopup component
  open: boolean;
  currentLang: string;
  loginLocale: string;
  onAccept: () => void;
  onClose: () => void;
}

// Mapping of locale codes to display names
const LOCALE_MAP: any = { en: "English", hi: "हिन्दी", kn: "ಕನ್ನಡ" };

export default function ChangeLocalePopup({ open, currentLang, loginLocale, onAccept, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Language Preference</DialogTitle>
      <DialogContent>
        <Typography>
          {/* Show current and login language, and ask if user wants to switch */}
          Your home page language is <b>{LOCALE_MAP[currentLang] || currentLang}</b>, but your login was in <b>{LOCALE_MAP[loginLocale] || loginLocale}</b>.<br/>
          Do you want to switch home page language to <b>{LOCALE_MAP[loginLocale] || loginLocale}</b>?
        </Typography>
      </DialogContent>
      <DialogActions>
        {/* Accept and decline buttons */}
        <Button onClick={onAccept} color="primary">Yes, Switch</Button>
        <Button onClick={onClose} color="secondary" autoFocus>No, Keep Current</Button>
      </DialogActions>
    </Dialog>
  );
}