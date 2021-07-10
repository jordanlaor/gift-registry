import React, { useState } from "react";
import "./iframe.css";

const Iframe = (props) => {
  const { src, onError } = props;
  return <iframe id="gift-list-iframe" src={src} title={src} target="_parent" is="x-frame-bypass"></iframe>;
};

export default Iframe;
