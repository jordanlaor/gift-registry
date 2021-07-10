import React, { useEffect } from "react";
import { Button } from "@material-ui/core";

import "./signIn.css";

const SignIn = (props) => {
  const { text, page, disabled, classes, color } = props;
  return (
    <Button
      color={color || "inherit"}
      className={classes || ""}
      onClick={() => {
        window._oneall.push([
          "social_login",
          "set_callback_uri",
          `https://final-project-gift-registry.herokuapp.com/api/callback?redirect=${window.location.origin}&page=${
            page || window.location.pathname
          }`,
        ]);
        window._oneall.push(["social_login", "do_popup_ui"]);
      }}
      disabled={disabled}
    >
      {text || "Sign In"}
    </Button>
  );
};

export default SignIn;
