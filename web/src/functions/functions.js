import axios from "axios";
import { AllHtmlEntities } from "html-entities";

const functions = {
  getListItems: async (listId) => {
    try {
      const { data } = await axios.get(`/api/lists/${listId}`);
      return data;
    } catch (error) {
      throw error;
    }
  },
  deleteList: async (listId) => {
    try {
      const { data } = await axios.delete(`/api/lists/${listId}`);
      return data;
    } catch (error) {
      throw error;
    }
  },
  deleteItem: async (listId, itemId) => {
    try {
      const { data } = await axios.delete(`/api/lists/${listId}/${itemId}`);
      return data;
    } catch (error) {
      throw error;
    }
  },
  getOwnerLists: async (ownerId) => {
    try {
      const { data } = await axios.get(`/api/lists/`, { headers: { Authorization: `Bearer ${ownerId}` } });
      return data;
    } catch (error) {
      throw error;
    }
  },
  addItemToList: async (listId, item) => {
    try {
      const { data } = await axios.put(`/api/lists/${listId}`, { ...item });
      return data;
    } catch (error) {
      throw error;
    }
  },
  createItem: async (src) => {
    const { data } = await axios.get(`https://jordans-cors-anywhere.herokuapp.com/${src}`);
    let imgHTML;
    const asin = data.match(/(?:dp|o|gp|-|product)\/(B[0-9]{2}[0-9A-Z]{7}|[0-9]{9}(?:X|[0-9]))/im);
    if (asin) {
      imgHTML = [
        "amazon",
        `https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=SL500&ASIN=${asin[1]}`,
      ];
      // const img = await axios.head(imgHTML[1]);

      await new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imgHTML[1];
        img.onerror = () => {
          imgHTML = ["amazon", `http://images.amazon.com/images/P/${asin[1]}.01.SCLZZZZZZZ.jpg`];
          resolve();
        };
        img.onload = () => {
          resolve();
        };
      });
    } else {
      imgHTML = data.match(/<meta.*?og:image.*?content="(.*?)"/im);
    }
    if (!imgHTML)
      imgHTML = [
        "No Image",
        "data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjUxMnB0IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgd2lkdGg9IjUxMnB0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im00NTUuODEyNSA1MTEuNjYwMTU2aC0zOTkuNjMyODEyYy0xMC40Njg3NSAwLTE4Ljk1MzEyNi04LjQ4NDM3NS0xOC45NTMxMjYtMTguOTUzMTI1di0zMDUuNTg5ODQzaDQzNy41NDI5Njl2MzA1LjU4OTg0M2MwIDEwLjQ2ODc1LTguNDg4MjgxIDE4Ljk1MzEyNS0xOC45NTcwMzEgMTguOTUzMTI1em0wIDAiIGZpbGw9IiNmZmM3M2IiLz48cGF0aCBkPSJtMzcuMjI2NTYyIDE4Ny4xMTcxODhoNDM3LjU0Mjk2OXY2My41ODk4NDNoLTQzNy41NDI5Njl6bTAgMCIgZmlsbD0iI2VmYjAyNSIvPjxwYXRoIGQ9Im01MTIgMTIwLjgyNDIxOXY3OC43ODEyNWMwIDguNDE0MDYyLTYuODI4MTI1IDE1LjIzMDQ2OS0xNS4yNDIxODggMTUuMjMwNDY5aC00ODEuNTI3MzQzYy04LjQxNDA2MyAwLTE1LjIzMDQ2OS02LjgxNjQwNy0xNS4yMzA0NjktMTUuMjMwNDY5di03OC43ODEyNWMwLTguNDE0MDYzIDYuODE2NDA2LTE1LjIzMDQ2OSAxNS4yMzA0NjktMTUuMjMwNDY5aDQ4MS41MjczNDNjOC40MTQwNjMgMCAxNS4yNDIxODggNi44MTY0MDYgMTUuMjQyMTg4IDE1LjIzMDQ2OXptMCAwIiBmaWxsPSIjZmZjNzNiIi8+PHBhdGggZD0ibTIzOC41OTM3NSAxNDEuODEyNWMtMy4zMjQyMTkgMy44NzEwOTQtNi41ODU5MzggNy43OTY4NzUtOS43Njk1MzEgMTEuNzY1NjI1LTExLjg2MzI4MSAxNC43NjE3MTktMjIuNzIyNjU3IDMwLjIzMDQ2OS0zMi41MzkwNjMgNDYuMjg1MTU2LTMuMDE5NTMxIDQuOTM3NS01LjkzMzU5NCA5LjkyNTc4MS04Ljc2MTcxOCAxNC45NzI2NTdoLTEwMy44Mzk4NDRjNi4wNjY0MDYtMTMuNzY1NjI2IDEyLjcxODc1LTI3LjI3NzM0NCAxOS45MjU3ODEtNDAuNDg0Mzc2IDEzLjA3MDMxMy0yMy45NjA5MzcgMjcuOTg0Mzc1LTQ2Ljk1MzEyNCA0NC42NDg0MzctNjguNzU3ODEyIDMuOTgwNDY5LTUuMjA3MDMxIDguMDU0Njg4LTEwLjM1MTU2MiAxMi4yMzA0NjktMTUuNDE3OTY5IDIuNS0zLjA1NDY4NyA1LjA0Mjk2OS02LjA2NjQwNiA3LjYyMTA5NC05LjA2NjQwNiA5LjQ3NjU2MyA4LjE2NDA2MyAxOC45NDUzMTMgMTYuMzIwMzEzIDI4LjQyNTc4MSAyNC40ODQzNzUgMS40Njg3NSAxLjI1NzgxMiAyLjkzNzUgMi41MzEyNSA0LjQwMjM0NCAzLjc5Mjk2OSAxMS4xODc1IDkuNjMyODEyIDIyLjM3NSAxOS4yNjE3MTkgMzMuNTU4NTk0IDI4LjkwNjI1IDEuMzcxMDk0IDEuMTY0MDYyIDIuNzMwNDY4IDIuMzQ3NjU2IDQuMDk3NjU2IDMuNTE5NTMxem0wIDAiIGZpbGw9IiNlZmIwMjUiLz48cGF0aCBkPSJtMzkzLjUyNzM0NCAyMTQuODM1OTM4aC0xMDMuODQ3NjU2Yy0yLjgxNjQwNy01LjA0Njg3Ni01Ljc0MjE4OC0xMC4wMzUxNTctOC43NjE3MTktMTQuOTcyNjU3LTkuODE2NDA3LTE2LjA1NDY4Ny0yMC42ODc1LTMxLjUyMzQzNy0zMi41MzkwNjMtNDYuMjg1MTU2LTMuMTk1MzEyLTMuOTY4NzUtNi40NTcwMzEtNy44OTQ1MzEtOS43ODUxNTYtMTEuNzY1NjI1IDEuMzcxMDk0LTEuMTcxODc1IDIuNzMwNDY5LTIuMzQ3NjU2IDQuMTAxNTYyLTMuNTE5NTMxIDExLjE5NTMxMy05LjY0NDUzMSAyMi4zODI4MTMtMTkuMjg1MTU3IDMzLjU2NjQwNy0yOC45MDYyNSAxLjQ2ODc1LTEuMjYxNzE5IDIuOTM3NS0yLjUzNTE1NyA0LjQwNjI1LTMuNzkyOTY5IDkuNDc2NTYyLTguMTY0MDYyIDE4Ljk1NzAzMS0xNi4zMjAzMTIgMjguNDI1NzgxLTI0LjQ4NDM3NSAyLjU3ODEyNSAyLjk5MjE4NyA1LjEyMTA5NCA2LjAxMTcxOSA3LjYyMTA5NCA5LjA1ODU5NCA0LjE4MzU5NCA1LjA3NDIxOSA4LjI2MTcxOCAxMC4yMTg3NSAxMi4yMzA0NjggMTUuNDI1NzgxIDE2LjY2NDA2MyAyMS44MDQ2ODggMzEuNTc4MTI2IDQ0Ljc5Njg3NSA0NC42NTYyNSA2OC43NTc4MTIgNy4yMDcwMzIgMTMuMjA3MDMyIDEzLjg1OTM3NiAyNi43MTg3NSAxOS45MjU3ODIgNDAuNDg0Mzc2em0wIDAiIGZpbGw9IiNlZmIwMjUiLz48ZyBmaWxsPSIjZmY0NDQwIj48cGF0aCBkPSJtMjU1Ljk5MjE4OCAxNDEuODIwMzEyYy0zLjMyODEyNiAzLjg2NzE4OC02LjU4OTg0NCA3Ljc5Mjk2OS05Ljc3MzQzOCAxMS43NjE3MTktMTEuODU5Mzc1IDE0Ljc2MTcxOS0yMi43MjI2NTYgMzAuMjMwNDY5LTMyLjUzOTA2MiA0Ni4yODkwNjMtMzEuMTY0MDYzIDUwLjk0MTQwNi01MS44NjMyODIgMTA3Ljg0NzY1Ni02MC41OTM3NSAxNjcuNDEwMTU2LTEzLjEyMTA5NC0xNy40MDIzNDQtMjUuMjMwNDY5LTM2LjIzMDQ2OS0zNi4xMjUtNTYuMzYzMjgxLTE5LjE2NDA2MyAxMi41LTM3Ljg5NDUzMiAyNi43OTY4NzUtNTUuOTI5Njg4IDQyLjg4MjgxMiA5LjI2MTcxOS02My4xNzk2ODcgMjkuNjY3OTY5LTEyMy45MDYyNSA1OS45NzY1NjItMTc5LjQ0NTMxMiAxNi4xODc1LTI5LjY3OTY4OCAzNS4yMTA5MzgtNTcuODc4OTA3IDU2Ljg3NS04NC4xNzU3ODEgMi41LTMuMDU0Njg4IDUuMDQyOTY5LTYuMDYyNSA3LjYyMTA5NC05LjA2NjQwNyAxMC45NDUzMTMgOS40MjU3ODEgMjEuODgyODEzIDE4Ljg1MTU2MyAzMi44MzIwMzIgMjguMjc3MzQ0IDExLjE4MzU5MyA5LjYzMjgxMyAyMi4zNzEwOTMgMTkuMjYxNzE5IDMzLjU1ODU5MyAyOC45MDYyNSAxLjM2NzE4OCAxLjE2NDA2MyAyLjcyNjU2MyAyLjM0NzY1NiA0LjA5NzY1NyAzLjUyMzQzN3ptMCAwIi8+PHBhdGggZD0ibTQ1MC45NjA5MzggMzUzLjgwMDc4MWMtMTguMDM1MTU3LTE2LjA4NTkzNy0zNi43NjU2MjYtMzAuMzgyODEyLTU1LjkyOTY4OC00Mi44ODI4MTItMTAuODk0NTMxIDIwLjEzMjgxMi0yMy4wMDM5MDYgMzguOTYwOTM3LTM2LjEyNSA1Ni4zNjMyODEtOC43MzA0NjktNTkuNTYyNS0yOS40MjU3ODEtMTE2LjQ2ODc1LTYwLjU5Mzc1LTE2Ny40MTAxNTYtOS44MTY0MDYtMTYuMDU4NTk0LTIwLjY4NzUtMzEuNTI3MzQ0LTMyLjUzOTA2Mi00Ni4yODkwNjMtMy4xOTUzMTMtMy45Njg3NS02LjQ1NzAzMi03Ljg5NDUzMS05Ljc4MTI1LTExLjc2MTcxOSAxLjM2NzE4Ny0xLjE3NTc4MSAyLjcyNjU2Mi0yLjM1MTU2MiA0LjA5NzY1Ni0zLjUyMzQzNyAxMS4xOTUzMTItOS42NDQ1MzEgMjIuMzgyODEyLTE5LjI4NTE1NiAzMy41NzAzMTItMjguOTA2MjUgMTAuOTQ1MzEzLTkuNDM3NSAyMS44OTQ1MzItMTguODUxNTYzIDMyLjgyODEyNS0yOC4yNzczNDQgMi41NzgxMjUgMi45OTIxODggNS4xMjEwOTQgNi4wMTE3MTkgNy42MjEwOTQgOS4wNTg1OTQgMjEuNjY3OTY5IDI2LjI5Njg3NSA0MC42OTE0MDYgNTQuNDk2MDk0IDU2Ljg4NjcxOSA4NC4xODM1OTQgMzAuMzAwNzgxIDU1LjUzOTA2MiA1MC43MDMxMjUgMTE2LjI2NTYyNSA1OS45NjQ4NDQgMTc5LjQ0NTMxMnptMCAwIi8+PHBhdGggZD0ibTIxNS4yMzQzNzUgMTQxLjgyMDMxMmg4MS41MjczNDR2NzMuMDE1NjI2aC04MS41MjczNDR6bTAgMCIvPjwvZz48cGF0aCBkPSJtMzkwLjk5NjA5NCAxNzQuMzU1NDY5LTkyLjY4MzU5NCAyNS41MTU2MjVjLTkuODE2NDA2LTE2LjA1ODU5NC0yMC42ODc1LTMxLjUyNzM0NC0zMi41MzkwNjItNDYuMjg5MDYzbC01LjY4MzU5NC0xNS4yODUxNTYtNC4wOTc2NTYtMTEuMDIzNDM3IDM3LjY2Nzk2OC0xNy44ODI4MTMgNDAuNDQ5MjE5LTE5LjIxODc1YzIxLjY2Nzk2OSAyNi4yOTY4NzUgNDAuNjkxNDA2IDU0LjQ5NjA5NCA1Ni44ODY3MTkgODQuMTgzNTk0em0wIDAiIGZpbGw9IiNlYTJmMmYiLz48cGF0aCBkPSJtMjU1Ljk5MjE4OCAxMjcuMjczNDM4LTQuMDk3NjU3IDExLjAyMzQzNy01LjY3NTc4MSAxNS4yODUxNTZjLTExLjg1OTM3NSAxNC43NjE3MTktMjIuNzIyNjU2IDMwLjIzMDQ2OS0zMi41MzkwNjIgNDYuMjg5MDYzbC05Mi42NzE4NzYtMjUuNTE1NjI1YzE2LjE4NzUtMjkuNjc5Njg4IDM1LjIxMDkzOC01Ny44Nzg5MDcgNTYuODc1LTg0LjE3NTc4MWw0MC40NTMxMjYgMTkuMjEwOTM3em0wIDAiIGZpbGw9IiNlYTJmMmYiLz48cGF0aCBkPSJtNDAzLjkxNDA2MiAzLjU0Mjk2OS0xNDcuOTE3OTY4IDcwLjI0NjA5MyAyOC40MTQwNjIgNzYuNDE3OTY5IDE1Ny44ODI4MTMtNDMuNDU3MDMxYzIwLjY0ODQzNy01LjY4MzU5NCAzMS45OTIxODctMjcuODQzNzUgMjQuNTI3MzQzLTQ3LjkxNzk2OWwtMTMuMDMxMjUtMzUuMDM5MDYyYy03LjQ2MDkzNy0yMC4wNzQyMTktMzAuNTI3MzQzLTI5LjQzNzUtNDkuODc1LTIwLjI1em0wIDAiIGZpbGw9IiNmZjQ0NDAiLz48cGF0aCBkPSJtMTA4LjA3ODEyNSAzLjU0Mjk2OSAxNDcuOTE3OTY5IDcwLjI0NjA5My0yOC40MTQwNjMgNzYuNDE3OTY5LTE1Ny44Nzg5MDYtNDMuNDU3MDMxYy0yMC42NDg0MzctNS42ODM1OTQtMzEuOTkyMTg3LTI3Ljg0Mzc1LTI0LjUyNzM0NC00Ny45MTc5NjlsMTMuMDI3MzQ0LTM1LjAzOTA2MmM3LjQ2NDg0NC0yMC4wNzQyMTkgMzAuNTI3MzQ0LTI5LjQzNzUgNDkuODc1LTIwLjI1em0wIDAiIGZpbGw9IiNmZjQ0NDAiLz48cGF0aCBkPSJtMjkxLjMxNjQwNiAxMDQuNWMtMi42ODc1IDAtNS4zMjQyMTgtMS4zMjgxMjUtNi44NzUtMy43NjE3MTktMi40MjU3ODEtMy43OTI5NjktMS4zMjAzMTItOC44MzIwMzEgMi40NzI2NTYtMTEuMjU3ODEyIDEuMTIxMDk0LS43MTQ4NDQgMjcuNzYxNzE5LTE3LjY2Nzk2OSA1OC4zNDc2NTctMzAuMDM5MDYzIDQ0LjA5Mzc1LTE3LjgzNTkzNyA3My41MzkwNjItMTYuODc4OTA2IDg3LjUwNzgxMiAyLjg0Mzc1IDIuNjA1NDY5IDMuNjc1NzgyIDEuNzM0Mzc1IDguNzY1NjI1LTEuOTQxNDA2IDExLjM2NzE4OC0zLjY3NTc4MSAyLjYwMTU2Mi04Ljc2MTcxOSAxLjczNDM3NS0xMS4zNjMyODEtMS45NDE0MDYtMTguOTM3NS0yNi43MzQzNzYtOTcuNjc1NzgyIDE0LjgzNTkzNy0xMjMuNzY1NjI1IDMxLjUwNzgxMi0xLjM1OTM3NS44NjcxODgtMi44Nzg5MDcgMS4yODEyNS00LjM4MjgxMyAxLjI4MTI1em0wIDAiIGZpbGw9IiNlYTJmMmYiLz48cGF0aCBkPSJtMjE5Ljg3MTA5NCAxMDQuNWMtMS41MDM5MDYgMC0zLjAyMzQzOC0uNDE0MDYyLTQuMzgyODEzLTEuMjgxMjUtMjYuMDg5ODQzLTE2LjY3MTg3NS0xMDQuODI4MTI1LTU4LjI0MjE4OC0xMjMuNzY1NjI1LTMxLjUwNzgxMi0yLjYwNTQ2OCAzLjY3NTc4MS03LjY5MTQwNiA0LjU0Mjk2OC0xMS4zNjcxODcgMS45NDE0MDYtMy42NzE4NzUtMi42MDU0NjktNC41NDI5NjktNy42OTE0MDYtMS45Mzc1LTExLjM2NzE4OCAxMy45Njg3NS0xOS43MjI2NTYgNDMuNDEwMTU2LTIwLjY3OTY4NyA4Ny41MDc4MTItMi44NDM3NSAzMC41ODU5MzggMTIuMzY3MTg4IDU3LjIyNjU2MyAyOS4zMjQyMTkgNTguMzQ3NjU3IDMwLjAzOTA2MyAzLjc5Mjk2OCAyLjQyNTc4MSA0Ljg5ODQzNyA3LjQ2NDg0MyAyLjQ3NjU2MiAxMS4yNTc4MTItMS41NTg1OTQgMi40MzM1OTQtNC4xOTE0MDYgMy43NjE3MTktNi44Nzg5MDYgMy43NjE3MTl6bTAgMCIgZmlsbD0iI2VhMmYyZiIvPjxwYXRoIGQ9Im0yNzkuMTkxNDA2IDQ3LjUyMzQzOGgtNDYuMzkwNjI1Yy0xMi42OTUzMTIgMC0yMi45ODgyODEgMTAuMjkyOTY4LTIyLjk4ODI4MSAyMi45OTIxODd2NjcuMzk0NTMxYzAgMTIuNjk5MjE5IDEwLjI5Mjk2OSAyMi45OTIxODggMjIuOTg4MjgxIDIyLjk5MjE4OGg0Ni4zOTA2MjVjMTIuNjk1MzEzIDAgMjIuOTg4MjgyLTEwLjI5Mjk2OSAyMi45ODgyODItMjIuOTkyMTg4di02Ny4zOTQ1MzFjMC0xMi42OTkyMTktMTAuMjkyOTY5LTIyLjk5MjE4Ny0yMi45ODgyODItMjIuOTkyMTg3em0wIDAiIGZpbGw9IiNlYTJmMmYiLz48cGF0aCBkPSJtMjE1LjIzNDM3NSAyMTQuODM1OTM4aDgxLjUyNzM0NHYyOTYuODI0MjE4aC04MS41MjczNDR6bTAgMCIgZmlsbD0iI2ZmNDQ0MCIvPjxwYXRoIGQ9Im0yMTUuMjM0Mzc1IDIxNC44MzU5MzhoODEuNTI3MzQ0djM1Ljg3MTA5M2gtODEuNTI3MzQ0em0wIDAiIGZpbGw9IiNlYTJmMmYiLz48L3N2Zz4=",
      ];
    const titleHTML = data.match(/<title.*?>(.*?)</im);
    const itemName = AllHtmlEntities.decode(titleHTML[1]).replace(
      /(^Amazon.com: )|(^Toys R Us \| )|(^רשת חנויות פרחים ברחבי ישראל -  זרפוריו \| )/i,
      ""
    );
    const item = { link: src, imageLink: imgHTML[1], itemName };
    return item;
  },
  giftItem: async (userId, listId, itemId) => {
    try {
      const { data } = await axios.patch(`/api/lists/${listId}`, { userId, itemId });
      return data;
    } catch (error) {
      throw error;
    }
  },
  ungiftItem: async (listId, itemId) => {
    try {
      const { data } = await axios.patch(`/api/lists/${listId}`, { userId: null, itemId });
      return data;
    } catch (error) {
      throw error;
    }
  },
  getUserData: async (token, appContext) => {
    try {
      if (token) {
        const { data } = await axios.get(`/api/user/${token}`);
        appContext.setUserId(data._id);
        appContext.setUserAvatar(data.image);
        appContext.setUserName(data.name);
        appContext.setUserFirstName(data.firstName);
      } else console.log("no token");
    } catch (error) {
      console.log(error.data);
    }
  },
  getCookie: (cname) => {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  },
  setCookie: (cname, cvalue, exdays) => {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  },
  deleteCookie: (cname) => {
    var d = new Date(0);
    var expires = "expires=" + d;
    document.cookie = cname + "=;" + expires + ";path=/";
  },

  saveListToLocalstorage: (listId, listName) => {
    localStorage.setItem("listId", listId);
    localStorage.setItem("listName", listName);
  },

  getListFromLocalstorage: () => {
    const listId = localStorage.getItem("listId") || null;
    const listName = localStorage.getItem("listName") || null;
    return { listId, listName };
  },
};

export default functions;
