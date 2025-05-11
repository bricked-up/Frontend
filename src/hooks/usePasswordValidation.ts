import { error } from 'console';
import { useState, useEffect } from 'react';

interface PasswordValidationOptions {
  password: string;
  confirmpwd?: string;
  minLength?: number;
  uppercase?: boolean;
  lowercase?: boolean;
  number?: boolean;
  specialChar?: boolean;
}

const usePasswordValidation = ({
  password,
  confirmpwd,
  minLength = 8,
  uppercase = true,
  lowercase = true,
  number = true,
  specialChar = true
}: PasswordValidationOptions) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState<boolean>(false);

  useEffect(() => {
    let errorList: string[] = [];

    if (minLength && password.length < minLength) {
      errorList.push(`Password must be at least ${minLength} characters`);
    }
    if (uppercase && !/[A-Z]/.test(password)) {
      errorList.push('Password must contain at least one uppercase letter');
    }
    if (lowercase && !/[a-z]/.test(password)) {
      errorList.push('Password must contain at least one lowercase letter');
    }
    if (number && !/[0-9]/.test(password)) {
      errorList.push('Password must contain at least one number');
    }
    if (specialChar && !/[-_/!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errorList.push('Password must contain at least one special character');
    }
    if (password!==confirmpwd) {
        errorList.push('Passwords do not match');
    }

    setErrors(errorList);
    setIsValid(errorList.length === 0);
  }, [password, confirmpwd, minLength, uppercase, lowercase, number, specialChar]);

  return { errors, isValid };
};

export default usePasswordValidation;
