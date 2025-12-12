import type { AlertType } from "./AlertType.model";

export type PopupProps = {
  type: AlertType;
  title: string;
  message: string;
  open: boolean;
  duration?: number;
  onClose?: () => void;
};
