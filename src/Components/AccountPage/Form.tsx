// src/Components/AccountPage/Form.tsx
import React from "react";
import { useUser } from "../../hooks/UserContext"; // Ensure this path is correct
import { EmailOutlined } from "@mui/icons-material";
import Style from "./Form.module.css"; // Ensure this path is correct
import { User } from "../../utils/types"; // Import User type

// OrgMember interface was marked as unused by ESLint.
// If it's not used in this file, it can be removed.
// interface OrgMember {
//   image: string;
//   name: string;
//   position: string;
// }

const Form = () => {
  const { user, setUser } = useUser(); // user is User | null

  // handleFileUpload was marked as unused by ESLint in your latest error output.
  // If you have an input for this, ensure it's connected.
  // Otherwise, this function can be removed.
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      if (user) { // Check if user is not null
        // Create a new object that strictly matches the User type
        const updatedUser: User = {
          ...user, // Spread existing user properties
          avatar: imageUrl, // Update avatar
          // Ensure all other required fields from 'User' type are present and correctly typed
          // If ...user might not have them (e.g. if user object in state was partial),
          // you would need to provide defaults here for required fields.
          // However, 'user' from context should ideally be a complete User object if not null.
        };
        setUser(updatedUser);
      } else {
        console.warn("Cannot update avatar: User is not logged in.");
      }
    }
  };

  const handleSaveChanges = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // UserProvider already handles saving to localStorage.
    // Add backend save logic here if needed.
    if (user) {
      alert("Current changes are reflected in context and local storage!");
      // Example: await sendUserData(user, "your_update_endpoint");
    } else {
      alert("No user data to save.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (user) { // Check if user is not null
      // Create a new object that strictly matches the User type
      const updatedUser: User = {
        ...user, // Spread existing user properties
        displayName: value, // Update displayName (User type requires displayName: string)
      };
      setUser(updatedUser);
    } else {
      console.warn("Cannot update display name: User is not logged in.");
    }
  };

  // If user is null, render a message or redirect
  // This Form component is likely used within AboutUser where isOwnProfile is true,
  // and AboutUser itself should handle the case where loggedInUser is null.
  // However, adding a check here makes the Form component more robust if used elsewhere.
  if (!user) {
    return (
      <div className={Style.Form}>
        <p>Loading user information or user not logged in.</p>
      </div>
    );
  }

  // user is guaranteed to be non-null here
  return (
    <div className={Style.Form}>
      <div className={Style.Form_box}>
        <form onSubmit={(e) => e.preventDefault()}>
          {/*
            If you want a file upload for avatar within this form,
            you'd add an <input type="file" onChange={handleFileUpload} /> here.
            The AboutUser page already has an avatar upload mechanism.
            If this Form is only for displayName/email, handleFileUpload might be redundant here.
          */}
          <div className={Style.Form_box_input}>
            <label htmlFor="form-username">Username</label> {/* Changed htmlFor for uniqueness */}
            <input
              id="form-username"
              type="text"
              // user is non-null here, and user.displayName is string as per User type.
              value={user.displayName}
              onChange={handleChange}
            />
          </div>

          <div className={Style.Form_box_input}>
            <label htmlFor="form-email">Email</label> {/* Changed htmlFor for uniqueness */}
            <div className={Style.Form_box_input_box}>
              <div className={Style.Form_box_input_box_icon}>
                <EmailOutlined />
              </div>
              <input
                id="form-email"
                type="text"
                // user is non-null here, and user.email is string as per User type.
                value={user.email}
                readOnly
              />
            </div>
          </div>

          <button
            type="button"
            className={Style.save_btn}
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
