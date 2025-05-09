// src/hooks/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect, Dispatch, SetStateAction } from "react";
import { User } from "../utils/types"; // Ensure this path is correct for your User type

// 1. Define the shape of your context data
// User can be User object or null (when logged out)
// setUser can accept a User object or null
export interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

// 2. Create the UserContext and EXPORT it.
// Provide an initial undefined value, the custom hook `useUser` will handle this.
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

// 3. Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state: user can be User or null
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Basic check to ensure it's an object and not just the string "null"
        if (typeof parsedUser === 'object' && parsedUser !== null) {
          // You might want to add more validation here to ensure parsedUser actually conforms to the User type
          return parsedUser as User;
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
      }
    }
    return null; // Default to null if not found or parsing fails
  });

  // Effect to update localStorage when user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      // If user is null (logged out), remove the item from localStorage
      localStorage.removeItem("user");
    }
  }, [user]);

  // The value provided to the context now matches UserContextType
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

// 4. Custom hook to consume the context (recommended)
/**
 * This hook provides access to the user state and setUser function.
 * It ensures that the context is used within a UserProvider.
 *
 * @example
 * const { user, setUser } = useUser();
 * if (user) {
 * console.log(user.displayName);
 * setUser({ ...user, displayName: "New Name" });
 * }
 * // To log out:
 * // setUser(null);
 *
 * @returns {UserContextType} The user context value.
 * @throws {Error} If used outside of a UserProvider.
 */
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) { // Check for undefined, as that's the default in createContext
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};