//this file will do localstorage/indexDB storage cache.
import axios from "axios";
import AccountUtil from "./AccountUtil";
import Qs from 'qs'
import {DOWNLOAD_BASE_URL, API_BASE_URL} from "./URL";


export default class UserInitializer {
    // static function() {
    //     console.log("initializing")
    // }


    static init() {
        this.initMessageHandlers()
        this.initEndpoints()

    }


    static initMessageHandlers() {
        // if ('serviceWorker' in navigator) {
        //     navigator.serviceWorker.register('/service-worker.js')
        //         .then(function (registration) {
        //             // 注册成功
        //             console.log('Service Worker 注册成功：', registration);
        //         })
        //         .catch(function (error) {
        //             // 注册失败
        //             console.log('Service Worker 注册失败：', error);
        //         });
        // }
    }

    static initEndpoints() {

    }

    // This method is called first time the user login/ or no cache.
    static downloadUserInformations() {
        return axios({
            url: API_BASE_URL + "/account/verifyToken",
            method: 'post',
            data: { token: localStorage.getItem("token") },
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }],
            headers: {
                token: localStorage.getItem("token"),
            }
        })

    }



}