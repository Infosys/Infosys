
// WarningPopup is a wrapper for the Popup component, used to display warning messages
import type { PopupProps } from "../../models/Popup.model";
import Popup from "./Popup";


// Functional component for warning popups
export const WarningPopup = ({ title, message, type, open, onClose }: PopupProps) => (
  <Popup
    type={type}
    title={title}
    message={message}
    open={open}
    onClose={onClose}
  />
);