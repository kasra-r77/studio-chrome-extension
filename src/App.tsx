import React, { useEffect, useState, useRef } from "react";
import Login from "./components/Login";
import MyLibrary from "./components/MyLibrary";
import axios from "axios";

import "./global.css";

const App = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  let userDisplayName = useRef<string>();
  let userAvatarUrl = useRef<string>();

  useEffect(() => {
    chrome.storage.local
      .get([
        "authToken",
        "userID",
        "userDisplayName",
        "userAvatarUrl",
        "studioDomain",
      ])
      .then((result) => {
        if (result.authToken && result.userID) {
          userDisplayName.current = result.userDisplayName;
          userAvatarUrl.current = result.userAvatarUrl;
          axios.defaults.headers.common = {
            Authorization: `Bearer user_id="${result.userID}",token="${result.authToken}"`,
          };
          axios.defaults.baseURL = result.studioDomain;
          setIsAuthorized(true);
        }
      });
  }, []);

  return (
    <div className="Container">
      {isAuthorized ? (
        <MyLibrary
          userAvatarUrl={userAvatarUrl.current}
          userDisplayName={userDisplayName.current}
        />
      ) : (
        <Login setIsAuthorized={setIsAuthorized} />
      )}
    </div>
  );
};

export default App;
