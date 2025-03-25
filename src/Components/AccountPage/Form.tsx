import React from "react";
import { useUser } from "../../hooks/UserContext";
import { EmailOutlined } from "@mui/icons-material";
import Style from "./Form.module.css";

interface OrgMember {
  image: string;
  name: string;
  position: string;
}

/**
 * Form Component
 *
 * This component allows users to update their profile information.
 * - Users can change their display name.
 * - Email is displayed as read-only.
 * - Profile data is stored in `localStorage` when saved.
 *
 * @component
 * @example
 * <Form />
 *
 * @returns {JSX.Element} The profile update form.
 */

const Form = () => {
  const { user, setUser } = useUser(); // getting user from UserContext

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setUser({ ...user, pfp: imageUrl });
    }
  };

  /**
   * Handles username change.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleSaveChanges = () => {
    localStorage.setItem("user", JSON.stringify(user)); // Save to localStorage
    alert("Changes saved successfully!");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, displayName: e.target.value });
  };

  return (
    <div className={Style.Form}>
      <div className={Style.Form_box}>
        <form>
          <div className={Style.Form_box_input}>
            <label htmlFor="name">Username</label>
            <input
              type="text"
              value={user.displayName || "Logged-in User"}
              onChange={handleChange}
            />
          </div>

          <div className={Style.Form_box_input}>
            <label htmlFor="email">Email</label>

            <div className={Style.Form_box_input_box}>
              <div className={Style.Form_box_input_box_icon}>
                <EmailOutlined />
              </div>
              <input type="text" value={user.email || "Email*"} readOnly />
            </div>
          </div>

          <button className={Style.save_btn} onClick={handleSaveChanges}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
