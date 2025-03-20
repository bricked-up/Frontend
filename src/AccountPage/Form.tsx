import React from "react";
import { useUser } from "../hooks/UserContext";
import { EmailOutlined } from "@mui/icons-material";
import Style from "./Form.module.css";

interface OrgMember {
  image: string;
  name: string;
  position: string;
}

const Form = () => {
  const { user, setUser } = useUser(); // getting user from UserContext

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setUser({ ...user, pfp: imageUrl });
    }
  };

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

          <div className={Style.Form_box_input}>
            <label htmlFor="org">Organisations</label>
            <div className={Style.org_banner}>
              <ul className="org-list">
                {(user.org && user.org.length > 0
                  ? user.org
                  : ["No current organisation"]
                ).map((org, index) => (
                  <li key={index} className="org-item copy">
                    {org}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={Style.Form_box_input}>
            <label htmlFor="projects">Projects</label>
            <div className={Style.org_banner}>
              <ul className="org-list">
                {(user.teams && user.teams.length > 0
                  ? user.teams
                  : ["No current projects"]
                ).map((project, index) => (
                  <li key={index} className="org-item copy">
                    {project}
                  </li>
                ))}
              </ul>
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
