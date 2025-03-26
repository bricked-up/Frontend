import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User } from "../utils/types"

// create the UserContext
const UserContext = createContext<{ user: User; setUser: (user: User) => void } | undefined>(
  undefined
);

// provider component to wrap our App
// this stores the variables in local storage with the key value of 'user'
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

/**
 * This variable is going to be the persistent user. The data will be obtained from the server and then
 * stored. if email is null, this means that the user is not logged in. Note that every time you do 
 * a change to the user, the data is saved locally and not sent to the server. For that please use
 * sendUserData and to fetch most recent data from the server do getUserData
 * 
 * @example
 * // initialize the variable. Must be done for every page that needs it.
 * const {user, setUser} = useUser();
 * 
 * // to Modify the user's name
 * setUser(...user, displayName: newDisplayName)
 * 
 * // to change the whole user
 * setUser{... user, email: newEmail, displayName: newDisplayName, ....}
 *
 * @returns {UserContext} 
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
