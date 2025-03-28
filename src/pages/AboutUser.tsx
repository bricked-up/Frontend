import React, { useState, useMemo, useCallback, useContext, useEffect } from "react";
import { useUser } from "../hooks/UserContext";
import Style from "../Components/AccountPage/AboutUser.module.css";
import Form from "../Components/AccountPage/Form";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserData } from "../utils/account.utils";
import { User } from "../utils/types";

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
 *
 * TODO: Definitely change some design / ask about adding more things/too simple??
 */
const AboutUser = () => {
  const userId = useParams().userId as string;
  const { user, setUser } = useUser();
  const [isLoaded, setIsLoaded] = useState(false);
  // if the page our user is visiting is their own account page. Used to be able to modify 
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
  }, [user]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setUser({ ...user, avatar: imageUrl });
    }
  };

  if (!isLoaded) { return (<p> Meow meow it is not loaded</p>) } // TODO: change to loading screen

  return (
    <div className={Style.account}>
      <div className={Style.account_info}>
        <h1> Profile Settings</h1>
      </div>

      <div className={Style.account_box}>
        <div className={Style.account_box_img}>
          <img src={user.avatar || "https://via.placeholder.com/150"} />
          <img src={user.avatar || "https://v]ia.placeholder.com/150"} />
          <label className={Style.account_box_img_para}>
            Change Profile
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              hidden
            />
          </label>{" "}
        </div>

        <div className={Style.account_box_form}>
          <Form />
        </div>
      </div>
    </div>
  );
};

export default AboutUser;
