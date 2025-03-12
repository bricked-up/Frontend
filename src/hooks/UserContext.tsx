import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
/**
 * User is the way we will model users for the profile page.
 * All of the data will be fetched by the db based apart from the emial.
 * When the user succsefully logs in a new instance should be created
 */
export type User = {
  email?: string | null;
  displayName?: string | null;
  pfp?: string | null;
  org?: string[] | null;
  teams?: string[] | null;
  teamMembers?: string[] | null;
  orgMemmbers?: string[] | null;
};

// Default user object
const DEFAULT_USER: User = {
  email: null,
  displayName: "Logged-in User",
  pfp: "https://via.placeholder.com/150",
  org: ["Company Inc"],
  teams: ["Engineering", "Product"],
};

// create the UserContext
const UserContext = createContext<
  { user: User; setUser: (user: User) => void } | undefined
>(undefined);

// provider component to wrap our App
// this stores the variables in local storage with the key value of 'user'
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : DEFAULT_USER;
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * This variable is going to be the persitent user. The data will be obtained from the server and then
 * stored. if email is null, this means that the user is not logged in. Note that everytime you do
 * a change to the user, the data is saved locally and not sent to the server. For that please use
 * sendUserData and to fetch most recent data from the server do getUserData
 *
 * @example
 * // initialise the variable. Must be done for every page that needs it.
 * const {user, setUser} = useUser();
 *
 * // to Modidy the user's name
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

//TODO: get and send user data to the server
