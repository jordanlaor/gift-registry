import React from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

const SwitchShow = (props) => {
  const { showIframe, setShowIframe, isMobileOnly } = props;
  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <Switch
            checked={showIframe && !isMobileOnly}
            disabled={isMobileOnly}
            onChange={() => setShowIframe((prev) => !prev)}
            name="showIframe"
          />
        }
        label={showIframe ? "expand list width" : "minimize list width"}
      />
    </FormGroup>
  );
};

export default SwitchShow;
