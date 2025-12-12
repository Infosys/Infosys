import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { SignUpFormValues, SignUpFormErrors, SignUpResponseData } from "../models/signUpFormModel";
import type { LoginResponseData } from "../models/LoginFormModel";

// Context value type for SignUpFormContext
interface SignUpFormContextType {
  signupType: "CITIZEN" | "AGENT";
  setSignupType: React.Dispatch<React.SetStateAction<"CITIZEN" | "AGENT">>;
  form: SignUpFormValues;
  setForm: React.Dispatch<React.SetStateAction<SignUpFormValues>>;
  errors: SignUpFormErrors;
  setErrors: React.Dispatch<React.SetStateAction<SignUpFormErrors>>;
  touched: { [K in keyof SignUpFormValues]?: boolean };
  setTouched: React.Dispatch<React.SetStateAction<{ [K in keyof SignUpFormValues]?: boolean }>>;
  resetForm: () => void;
  userInfo: SignUpResponseData | null;
  setUserInfo: React.Dispatch<React.SetStateAction<SignUpResponseData | null>>;
  loginInfo: LoginResponseData | null;
  setLoginInfo: React.Dispatch<React.SetStateAction<LoginResponseData | null>>;
  otp: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  username: string; // <-- Add this line
  setUsername: React.Dispatch<React.SetStateAction<string>>; // <-- Add this line
}

// Default/initial values for the sign-up form
const defaultForm: SignUpFormValues = {
  username: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  password: "",
  passwordConfirm: "",
  role: "",
};

// Create SignUpFormContext for sharing sign-up form state
const SignUpFormContext = createContext<SignUpFormContextType | undefined>(undefined);

// Provider component for SignUpFormContext
export const SignUpFormProvider = ({ children }: { children: ReactNode }) => {
  // State for sign-up type (CITIZEN or AGENT)
  const [signupType, setSignupType] = useState<"CITIZEN" | "AGENT">("AGENT");
  // State for form values
  const [form, setForm] = useState<SignUpFormValues>(defaultForm);
  // State for form validation errors
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  // State for touched fields (for validation UI)
  const [touched, setTouched] = useState<{ [K in keyof SignUpFormValues]?: boolean }>({});
  // State for user info after sign-up
  const [userInfo, setUserInfo] = useState<SignUpResponseData | null>(null);
  // State for login info after sign-up
  const [loginInfo, setLoginInfo] = useState<LoginResponseData | null>(null);
  // State for OTP value
  const [otp, setOtp] = useState<string>("");
  // State for username (used in OTP flow)
  const [username, setUsername] = useState<string>("");

  // Reset all form state to initial values
  const resetForm = () => {
    setSignupType("AGENT");
    setForm(defaultForm);
    setErrors({});
    setTouched({});
    setUserInfo(null);
    setLoginInfo(null);
    setOtp("");
    setUsername("");
  };

  // Provide sign-up form state and handlers to children
  return (
    <SignUpFormContext.Provider
      value={{
        signupType,
        setSignupType,
        form,
        setForm,
        errors,
        setErrors,
        touched,
        setTouched,
        resetForm,
        userInfo,
        setUserInfo,
        loginInfo,
        setLoginInfo,
        otp,
        setOtp,
        username,      // <-- include in context value
        setUsername,   // <-- include in context value
      }}
    >
      {children}
    </SignUpFormContext.Provider>
  );
};

// Custom hook to access SignUpFormContext
export function useSignUpForm() {
  const ctx = useContext(SignUpFormContext);
  if (!ctx) throw new Error("useSignUpForm must be used within a SignUpFormProvider");
  return ctx;
}