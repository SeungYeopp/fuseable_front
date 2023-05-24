import React from "react";
import GoogleLogin from "../GoogleLogin";

function GoogleRedirect () {
  
  GoogleLogin();

  return (
    <div>
      Waiting Login
    </div>
  );
}

export default GoogleRedirect;