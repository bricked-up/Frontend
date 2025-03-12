import React from "react";
import { UserProvider, useUser } from "../hooks/UserContext";

const AboutUser: React.FC = () => {
  const { user } = useUser(); // Get user data from context

  return (
    <UserProvider>
      <div className="container">
        <div className="main-body">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="main-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="index.html">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href="/">User</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                User Profile
              </li>
            </ol>
          </nav>
          {/* /Breadcrumb */}

          <div className="row gutters-sm">
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex flex-column align-items-center text-center">
                    <img
                      src={user.pfp || "https://via.placeholder.com/150"} // Use user profile picture if available
                      alt="User"
                      className="rounded-circle"
                      width="150"
                    />
                    <div className="mt-3">
                      <h4>{user.displayName || "Logged-in User"}</h4>{" "}
                      {/* Use user's display name */}
                      <p className="text-secondary mb-1">
                        {user.org ? user.org.join(", ") : "Company Inc"}{" "}
                        {/* Display user organization if available */}
                      </p>
                      <p className="text-muted font-size-sm">
                        {user.teams ? user.teams.join(", ") : "No Teams"}{" "}
                        {/* Display user teams if available */}
                      </p>
                      <button className="btn btn-primary">Follow</button>
                      <button className="btn btn-outline-primary">
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Social links card */}
            </div>

            <div className="col-md-8">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Full Name</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {user.displayName || "Logged-in User"}{" "}
                      {/* Default to "Logged-in User" */}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Email</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {user.email || "No email available"}{" "}
                      {/* Display email if available */}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Phone</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">Not Available</div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Address</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {user.org ? user.org.join(", ") : "No address available"}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-12">
                      <a
                        className="btn btn-info"
                        target="__blank"
                        href="https://www.bootdey.com/snippets/view/profile-edit-data-and-skills"
                      >
                        Edit
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Status and other info */}
            </div>
          </div>
        </div>
      </div>
    </UserProvider>
  );
};

export default AboutUser;
