import React, { useState, useEffect } from "react";
import { useUser } from "../hooks/UserContext";
import Style from "../Components/AccountPage/AboutUser.module.css";
import Form from "../Components/AccountPage/Form";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserData, deleteUserData } from "../utils/account.utils"; 
import { User } from "../utils/types";
import LoadingPage from "./LoadingPage";

/**
 * AboutUser Component
 *
 * This component represents the profile settings page where users can:
 * - View and change their profile picture.
 * - Modify account details through a form.
 *
 * @component
 * @example
 * <AboutUser />
 *
 * @returns {JSX.Element} The AboutUser profile settings component.
 */
const AboutUser = () => {
  const userId = useParams().userId as string; // obtained from the URL
  const { user, setUser } = useUser();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCurrentViewed, setIsCurrentViewed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndSetUser = async () => {
      const fetchedUser = await fetchUserData(userId, "update");

      if (fetchedUser === null) {
        window.alert("User does not exist");
        navigate("/login");
        return;
      }

      if (fetchedUser.email === user.email) {
        setIsCurrentViewed(true);
      }

      setIsLoaded(true);
    };

    fetchAndSetUser();
  }, [user, userId, navigate]); // Added missing dependencies

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setUser({ ...user, avatar: imageUrl });
    }
  };

  const handleDeleteUser = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;

    const status = await deleteUserData(userId);

    if (status === 200) {
      alert("Account deleted successfully.");
      navigate("/login");
    } else {
      alert("Failed to delete account.");
    }
  };

  if (!isLoaded) {
    return <LoadingPage />;
  }

  return (
    <div className={Style.account}>
      <div className={Style.account_info}>
        <h1>Profile Settings</h1>
      </div>

      <div className={Style.account_box}>
        <div className={Style.account_box_img}>
          <img src={user.avatar || "https://via.placeholder.com/150"} alt="Profile" />
          <label className={Style.account_box_img_para}>
            Change Profile
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              hidden
            />
          </label>
        </div>

        <div className={Style.account_box_form}>
          <Form />

          {/* Show delete button only if the user is viewing their own profile */}
          {isCurrentViewed && (
            <button
              onClick={handleDeleteUser}
              className={Style.delete_button}
            >
              Delete Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutUser;
