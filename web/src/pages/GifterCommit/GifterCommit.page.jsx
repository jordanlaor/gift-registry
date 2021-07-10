import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Backdrop, CircularProgress, Link, Button, Avatar } from "@material-ui/core";
import axios from "axios";
import SignIn from "../../components/SignIn/SignIn.component";
import AppContext from "../../contexts/AppContext";
import functions from "../../functions/functions";
import GiftButton from "../../components/GiftButton/GiftButton.component";
import Nav from "../../components/Nav/Nav.component";
import image from "../../images/giftGiving.png";

import "./giftCommit.css";
import { isMobileOnly, withOrientationChange } from "react-device-detect";

const GifterCommit = withOrientationChange((props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [itemTaken, setItemTaken] = useState(false);
  const [itemName, setItemName] = useState(null);
  const appContext = useContext(AppContext);
  const params = useParams();
  const { isLandscape, isPortrait } = props;

  const giftItem = async () => {
    setIsLoading(true);
    try {
      const res = await functions.giftItem(appContext.userId, params.listId, params.itemId);
      setItemName(() => res.itemName);
      setItemTaken(() => true);
    } catch (error) {
      console.dir(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (appContext.userId) giftItem();
  }, [appContext.userId]);

  useEffect(() => {
    const setOwner = async () => {
      const { data } = await axios.get(`/api/lists/${params.listId}`);
      appContext.setOwnerName(() => data.owner.name);
      appContext.setOwnerAvatar(() => data.owner.image);
    };
    if (appContext.userName && appContext.userAvatar) setOwner();
  }, [appContext.userName, appContext.userAvatar]);

  return (
    <>
      <Nav>
        <Button underline="none" color="inherit" component={Link} href={window.location.origin}>
          My Lists
        </Button>
        <div className="nav-list-section nav-gifter nav-user-info">
          {appContext.userId !== appContext.ownerId && (!isMobileOnly || isLandscape) && (
            <Avatar alt={appContext.ownerName} src={appContext.ownerAvatar} />
          )}
          <div className="listNameGifter">{appContext.listName}</div>
        </div>
      </Nav>
      {!appContext.token ? (
        <div className="gift-btn-wrapper">
          <GiftButton>
            <SignIn />
          </GiftButton>
        </div>
      ) : appContext.userId && appContext.ownerName && appContext.ownerAvatar && itemTaken ? (
        <div className="gifter-commit-page">
          <div>
            <h2>You Successfully Commited to a Gift!</h2>
            <span className="item-name">{itemName || ""}</span>
          </div>
          <img className="giving-a-gift-img" src={image} alt="" />
          <Button
            variant="contained"
            underline="none"
            component={Link}
            href={`${window.location.origin.replace(/\/$/, "")}/list/${appContext.listId}`}
          >
            Go Back to the List
          </Button>
        </div>
      ) : (
        <Backdrop open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </>
  );
});

export default GifterCommit;
