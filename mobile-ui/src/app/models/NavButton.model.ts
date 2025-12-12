import type { ReactNode } from "react";

export interface NavButtonProps {
    icon: ReactNode;
    message: string;
    onClick: () => void;
}