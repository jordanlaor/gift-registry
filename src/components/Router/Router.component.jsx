import React, { useContext, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import GifterListPage from "../../pages/GifterList/GifterList.page";
import AppContext from "../../contexts/AppContext";
import ListsPage from "../../pages/Lists/Lists.page";
import ListView from "../../pages/ListView/ListView.page";
import functions from "../../functions/functions";
import GifterCommit from "../../pages/GifterCommit/GifterCommit.page";

const Router = () => {
  const appContext = useContext(AppContext);

  const getUserData = async (cookieToken) => {
    await functions.getUserData(cookieToken, appContext);
  };

  useEffect(() => {
    const cookieHandle = async () => {
      const cookieToken = functions.getCookie("user_token");
      if (cookieToken.length) {
        try {
          await getUserData(cookieToken);
          appContext.setToken(cookieToken);
        } catch (error) {
          console.log(error);
        }
      }
    };
    if (!appContext.token) {
      cookieHandle();
    }
  }, []);

  useEffect(() => {
    try {
      const { listId, listName } = functions.getListFromLocalstorage();
      appContext.setListId(listId);
      appContext.setListName(listName);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // useEffect(() => affCreate());
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <ListsPage />
        </Route>
        <Route path="/list" exact>
          {appContext.userId && appContext.listId ? <ListView /> : <Redirect path="/" />}
        </Route>
        <Route path="/list/:id" exact>
          {appContext.userId && appContext.userId === appContext.ownerId ? <Redirect path="/list" /> : <GifterListPage />}
        </Route>
        <Route path="/gift/:listId/:itemId" exact>
          {appContext.userId && appContext.userId === appContext.ownerId ? <Redirect path="/list" /> : <GifterCommit />}
        </Route>
        <Redirect path="/" />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
