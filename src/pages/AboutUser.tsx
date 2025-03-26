import React, { useState, useMemo, useCallback, useContext } from "react";
import { useUser } from "../hooks/UserContext";
import Style from "../Components/AccountPage/AboutUser.module.css";
import Form from "../Components/AccountPage/Form";
import { useParams } from "react-router-dom";

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
 * TO D0: Definitely change some design / ask about adding more things/too simple??
 */

const AboutUser = () => {
  const { user, setUser } = useUser();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setUser({ ...user, avatar: imageUrl });
    }
  };
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
