// Validation logic for user sign-up form fields
import type { SignUpFormValues, SignUpFormErrors } from "../models/signUpFormModel";

// Validate all sign-up form fields and return error messages for each
export function validateSignUpForm(values: SignUpFormValues): SignUpFormErrors {
  const errors: SignUpFormErrors = {};

  // First Name: required, only letters and spaces
  if (!values.firstName.trim()) {
    errors.firstName = "First name is required.";
  } else if (!/^[A-Za-z\s]+$/.test(values.firstName.trim())) {
    errors.firstName = "First name must contain only letters.";
  }

  // Last Name: required, only letters and spaces
  if (!values.lastName.trim()) {
    errors.lastName = "Last name is required.";
  } else if (!/^[A-Za-z\s]+$/.test(values.lastName.trim())) {
    errors.lastName = "Last name must contain only letters.";
  }

  // Phone Number: required, must be exactly 10 digits
  if (!values.phoneNumber.trim()) {
    errors.phoneNumber = "Phone number is required.";
  } else if (!/^\d{10}$/.test(values.phoneNumber.trim())) {
    errors.phoneNumber = "Phone number must be exactly 10 digits.";
  }

  // Email Address: required, valid format
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (
    !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(values.email.trim())
  ) {
    errors.email = "Email is not valid.";
  }

  // Password: required, min 8 chars, upper & lower letter, number, special char
  // if (!values.password) {
  //   errors.password = "Password is required.";
  // } else {
  //   if (values.password.length < 8)
  //     errors.password = "Password must be at least 8 characters.";
  //   else if (!/[A-Z]/.test(values.password))
  //     errors.password = "Password must contain an uppercase letter.";
  //   else if (!/[0-9]/.test(values.password))
  //     errors.password = "Password must contain a number.";
  //   else if (!/[!@#$%^&*(),.?":{}|<>]/.test(values.password))
  //     errors.password = "Password must contain a special character.";
  // }

  // Password Confirmation: required, matches password
  // if (!values.passwordConfirm) {
  //   errors.passwordConfirm = "Password confirmation is required.";
  // } else if (values.passwordConfirm !== values.password) {
  //   errors.passwordConfirm = "Passwords do not match.";
  // }

  return errors;
}