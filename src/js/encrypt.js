import CryptoJS from "crypto-js";
import { encdec } from "../variables/appVariables.jsx";
import { emitter } from "../modules/common/WebSocketComponent";

export function encryptBot(botId, botname) {
    let encData = CryptoJS.AES.encrypt(
        JSON.stringify({
          botId: botId,
          botName: botname,
          userId: localStorage.getItem("id")
        }),
        encdec
      ).toString();
      encData = encryptBase64(encData);
      return encData;
}

export function decryptBot(decData) {
    let data = decryptBase64(decData);
    var bytes = CryptoJS.AES.decrypt(data, encdec);
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    if(decryptedData.userId !== localStorage.getItem("id")) {
      console.log("Not Owned Bot", emitter.all);
      emitter.emit("unauthorized");
    }
    return decryptedData;
}

export function encryptBase64(data) {
  var wordArray = CryptoJS.enc.Utf8.parse(data);
    return CryptoJS.enc.Base64.stringify(wordArray);
}

export function decryptBase64(data) {
  var parsedWordArray = CryptoJS.enc.Base64.parse(data);
  return parsedWordArray.toString(CryptoJS.enc.Utf8);
}
