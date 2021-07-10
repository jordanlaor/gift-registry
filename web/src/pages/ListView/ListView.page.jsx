import React, { useContext, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useHistory } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { ListItemText } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import TextClamp from "react-string-clamp";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import ListSubheader from "@material-ui/core/ListSubheader";
import { isMobileOnly, withOrientationChange } from "react-device-detect";

import AppContext from "../../contexts/AppContext";
import Nav from "../../components/Nav/Nav.component";
import Iframe from "../../components/Iframe/Iframe.component";
import functions from "../../functions/functions";
import SocialMediaShare from "../../components/SocialMediaShare/SocialMediaShare.component";
import Switch from "../../components/Switch/SwitchShow.component";
import "./listView.css";

const ListView = withOrientationChange((props) => {
  const { isLandscape, isPortrait } = props;
  const appContext = useContext(AppContext);
  const iframeRef = useRef(null);
  const [src, setSrc] = useState("https://www.amazon.com/");
  const [srcInput, setSrcInput] = useState(src);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const iframeContainerRef = useRef(null);
  const listWrapperRef = useRef(null);
  const [listHeight, setListHeight] = useState(0);
  const [showIframe, setShowIframe] = useState(!isMobileOnly);
  const [listProps, setListProps] = useState({});

  const history = useHistory();

  const useStyles = makeStyles((theme) => ({
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      margin: 0,
    },
    avatarCenter: {
      margin: 0,
    },
    gifter: {
      display: "flex",
      alignItems: "center",
    },
    listTop: {
      background: "white",
    },
    list: {
      position: "relative",
    },
    searchIcon: {
      transition: "0.3s",
      "&:hover": {
        backgroundColor: "inherit",
        color: "rgba(54, 143, 139,0.9)",
      },
    },
  }));

  const classes = useStyles();

  // Adjust to both view and edit

  const renderListItems = () => {
    return items.map((item) => (
      <List key={item._id}>
        <ListItem
          button
          alignItems="flex-start"
          onClick={(e) => {
            if (!e.target.classList.contains("btn")) setSrc(item.link);
            // setSrc(item.link);
          }}
          className={classes.gifter}
        >
          <ListItemAvatar>
            <Avatar variant="rounded" alt={item.itemName} src={item.imageLink} />
          </ListItemAvatar>
          <TextClamp lines={2} text={item.itemName} className="gift-list-item-text" />
        </ListItem>
        {item.taker?._id && (
          <ListItem alignItems="flex-start" className={classes.gifter}>
            <ListItemAvatar className={classes.avatarCenter}>
              <Avatar variant="rounded" alt={item.taker.firstName} src={item.taker.image} className={classes.small} />
            </ListItemAvatar>
            <ListItemText secondary={`Gifter: ${item.taker.firstName}`} />
          </ListItem>
        )}
        <ListItem>
          <Button onClick={() => deleteItem(item._id)} className="btn">
            Delete Item
          </Button>
        </ListItem>
        <Divider />
      </List>
    ));
  };

  const switchList = () => history.push("/");

  const deleteList = async () => {
    try {
      const lists = await functions.deleteList(appContext.listId);
      switchList();
    } catch (error) {
      console.log(error);
    }
  };

  const getListItems = async () => {
    setIsLoading(true);
    try {
      const data = await functions.getListItems(appContext.listId);
      setItems(data.listItems);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async () => {
    setIsLoading(true);
    try {
      const item = await functions.createItem(iframeRef.current?.firstElementChild?.dataset?.actualurl || srcInput);
      const items = await functions.addItemToList(appContext.listId, item);
      await getListItems();
    } catch (error) {
      console.dir(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      const res = await functions.deleteItem(appContext.listId, itemId);

      await getListItems();
    } catch (error) {
      console.log(error);
    }
  };

  const setIframeHeightFunc = () => {
    resetListHeight();
    const iframeDomNode = ReactDOM.findDOMNode(iframeContainerRef.current);
    const height = window.getComputedStyle(iframeDomNode).height;
    setListHeight(() => height);
  };

  const resetListHeight = () => setListHeight(() => 0);

  const setSrcToBeInputSrc = () => setSrc(() => srcInput);

  useEffect(() => {
    getListItems();
  }, []);

  useEffect(() => setSrcInput(src), [src]);

  useEffect(() => {
    window.addEventListener("resize", setIframeHeightFunc);
  }, []);

  useEffect(() => setIframeHeightFunc(), [iframeContainerRef]);

  useEffect(
    () =>
      setListProps(() => {
        return showIframe ? {} : { gridColumn: "1 / span 2" };
      }),
    [showIframe]
  );

  const shareLink = `${window.location.origin.replace(/\/$/, "")}/list/${appContext.listId}`;
  const shareText = `Want to give me a gift? Buy me a gift from the gift list.`;
  return (
    <>
      <Nav>
        <Button underline="none" color="inherit" component={Link} href={window.location.origin}>
          My Lists
        </Button>
        <div className={"nav-list-section"}>
          <div className="listName">{appContext.listName}</div>
          {
            <div>
              <Button color="inherit" onClick={deleteList}>
                Delete List
              </Button>
            </div>
          }
        </div>
      </Nav>
      <div className="page page-list-view">
        <Box className="url-box">
          <TextField
            id="urlBar"
            label="url"
            style={{ margin: 8 }}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={srcInput}
            onChange={(e) => setSrcInput(() => e.target.value)}
          />
          {isMobileOnly || !showIframe ? (
            <div></div>
          ) : (
            <IconButton
              className={classes.searchIcon}
              aria-label="search"
              onClick={() => setSrc(() => (srcInput.length ? srcInput : "https://www.amazon.com/"))}
            >
              <i class="fas fa-search"></i>
            </IconButton>
          )}

          <IconButton
            className={classes.searchIcon}
            aria-label="add"
            onClick={() => {
              setSrcToBeInputSrc();
              addItem();
            }}
          >
            <i class="fas fa-plus"></i>
          </IconButton>
        </Box>
        <div className="iframe-container" ref={iframeContainerRef}>
          {showIframe && (
            <div ref={iframeRef} className="iframe-wrapper">
              <Iframe src={src} />
              {/* <div data-actualURL="https://ksp.co.il/web/item/97638">DIVVVVVV</div> */}
            </div>
          )}
          {showIframe && (
            <div className="iframe-add-nav-btn-wrap">
              <button className="iframe-add-nav-btn" onClick={addItem} disabled={isLoading}>
                <i class="fas fa-plus"></i>
                Add to List
              </button>
            </div>
          )}
          <div className={`list-view-list-wrapper`} style={{ height: listHeight, ...listProps }} ref={listWrapperRef}>
            <List component="nav" className={classes.list}>
              <ListSubheader className={classes.listTop}>
                {!isMobileOnly && <Switch showIframe={showIframe} setShowIframe={setShowIframe} isMobileOnly={isMobileOnly} />}
                <SocialMediaShare
                  shareLink={shareLink}
                  shareText={shareText}
                  style={showIframe ? {} : isMobileOnly && isPortrait ? {} : { flexDirection: "row" }}
                />
                <Divider />
              </ListSubheader>
              {renderListItems()}
            </List>
          </div>
        </div>
      </div>
    </>
  );
});

export default ListView;
