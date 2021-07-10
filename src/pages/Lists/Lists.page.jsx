import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import CreateList from "../../components/CreateList/CreateList.component";
import functions from "../../functions/functions";
import AppContext from "../../contexts/AppContext";
import Nav from "../../components/Nav/Nav.component";
import SignIn from "../../components/SignIn/SignIn.component";
import GiftButton from "../../components/GiftButton/GiftButton.component";

import "./lists.css";

const Lists = () => {
  const [open, setOpen] = useState(false);
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const appContext = useContext(AppContext);
  const history = useHistory();
  const search = new URLSearchParams(useLocation().search);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteList = async (listId) => {
    try {
      const lists = await functions.deleteList(listId);
      getLists();
    } catch (error) {
      console.log(error);
    }
  };

  const renderLists = () => {
    return lists.map((list) => (
      <ListItem
        button
        key={list._id}
        component={Link}
        to={"/list"}
        onClick={() => {
          appContext.setListId(list._id);
          appContext.setListName(list.listName);
          functions.saveListToLocalstorage(list._id, list.listName);
        }}
      >
        <ListItemText primary={list.listName} />
        <ListItemSecondaryAction>
          <Button variant="contained" onClick={() => deleteList(list._id)}>
            Delete
          </Button>
        </ListItemSecondaryAction>
      </ListItem>
    ));
  };

  const getLists = async () => {
    setIsLoading(true);
    try {
      const data = await functions.getOwnerLists(appContext.ownerId);
      setLists(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getOwnerData = async () => {
    try {
      appContext.setOwnerId(appContext.userId);
      appContext.setOwnerAvatar(appContext.userAvatar);
      appContext.setOwnerName(appContext.userName);
      appContext.setOwnerFirstName(appContext.userFirstName);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (appContext.ownerId) getLists();
  }, [appContext.ownerId]);

  useEffect(() => {
    const token = search.get("token");
    if (token) {
      try {
        functions.getUserData(token, appContext);
        functions.setCookie("user_token", token, 1);
        history.push(search.get("page"));
      } catch (error) {
        console.log(error);
      }
    }
  }, [history.location]);

  useEffect(() => {
    if (appContext.userId && appContext.userAvatar && appContext.userName) getOwnerData();
  }, [appContext.userId, appContext.userAvatar, appContext.userName]);

  return (
    <div className={appContext.userId ? "" : "listsPageSignInMode"}>
      {appContext.userId && <Nav />}
      {isLoading ? (
        <Backdrop open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : appContext.userId ? (
        <>
          <List component="nav">
            {lists.length ? renderLists() : ""}
            <ListItem button onClick={handleClickOpen}>
              <ListItemText primary="Create a New Gift List" />
            </ListItem>
          </List>
          <CreateList open={open} onClose={handleClose} />
        </>
      ) : (
        <GiftButton>
          <SignIn />
        </GiftButton>
      )}
    </div>
  );
};

export default Lists;
