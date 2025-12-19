
// SuccessPopup is a wrapper for the Popup component, used to display success messages
import type { PopupProps } from "../../models/Popup.model";
import Popup from "./Popup";


// Functional component for success popups
export const SuccessPopup = ({ title, message, type, open, onClose }: PopupProps) => (
  <Popup
    type={type}
    title={title}
    message={message}
    open={open}
    onClose={onClose}
  />
);