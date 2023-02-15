import axios from "axios";
import { emitter } from "../modules/common/WebSocketComponent";

export const api = axios.create();

export const cancelToken = () => {
    return axios.CancelToken.source()
}
// {
//     baseURL: "https://kaiwa-api.dev.weconnect.chat/api/"
// }
// api.defaults.headers.common['Authorization'] = localStorage.getItem('token') || "";

api.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

api.interceptors.response.use(function (response) {
    // console.log("response", response);
    return response;
}, function (error) {
    if (error.response.status === 404) {
        console.log("unauthorized", error.response);
        emitter.emit("showAlert", {
            type: "error",
            message: "Unathorized page access"
        })
        emitter.emit('logout');
    }
    return Promise.reject(error);
});
