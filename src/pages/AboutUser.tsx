import React, { useState, useMemo, useCallback, useContext } from "react";
// import Image from "next/image"
import { useUser } from "../hooks/UserContext";
//import { useDropzone } from "react-dropzone";
import Style from "../AccountPage/AboutUser.module.css";
import Form from "../AccountPage/Form";

const AboutUser = () => {
  const { user, setUser } = useUser();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setUser({ ...user, pfp: imageUrl });
    }
  };
  return (
    <div className={Style.account}>
      <div className={Style.account_info}>
        <h1> Profile Settings</h1>
        <p>
          You can set preferred display name, create your profile URL and manage
          other personal settings.
        </p>
      </div>

      <div className={Style.account_box}>
        <div className={Style.account_box_img}>
          <img src={user.pfp || "https://via.placeholder.com/150"} />
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
