import React, { useRef } from "react";
import "./giftButton.css";

const GiftButton = (props) => {
  const { children } = props;
  const childrenRef = useRef(null);
  return (
    <div class="col-12 mt-5 d-flex justify-content-center">
      <div class="box" onClick={() => childrenRef.current.firstElementChild.click()}>
        <div class="box-body">
          <span ref={childrenRef} className="childrenWrapper">
            {children}
          </span>
          <div class="box-lid">
            <div class="box-bowtie"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftButton;
