import localforage from "localforage"
import Qs from 'qs'
import axios from "axios"
import { update, clear, updateFollowState } from "../../components/redux/UserDetails"
import {DOWNLOAD_BASE_URL, API_BASE_URL} from "./URL";

import DatabaseManipulator from "./DatabaseManipulator"
export default class MessageUtil {



    static initialize() {
        // initialize when user first start the application

    }

    static setUserIntro(information, dispatch) {
        console.log(information)
        dispatch(update(information))
    }


    static updateMessage(response) {
        // find the newest message.
        response = JSON.parse(response.data)
        for (let i = 0; i < response.size(); i++) {
            localforage.getItem(response[i]["user_id"]).then(function (value) {
                value["chatRecords"].push(response[i]["records"])
                localforage.setItem(response[i]["user_id"], value)
            })
        }
    }

    static getMessageById(type,receiverId) {
        return DatabaseManipulator.getRecentContactByTypeAndId(type, receiverId).then((res) => {
            return DatabaseManipulator.getTimestamp().then((timestamp) => {
                if (!timestamp) {
                    timestamp = 0
                }
                if (type === "group") {
                    return axios(
                        {
                            url: URL.API_BASE_URL + "/chat/get_messages",
                            method: "post",
                            data: { type:type,groupId:receiverId, timestamp:timestamp },
                            transformRequest: [function (data) {
                                return Qs.stringify(data)
                            }],
                            //synchronous: true,
                            headers: {
                                token: localStorage.getItem("token"),
                            }
                        }
                    ).catch(error => {
                        console.log(error)
                    })
                }
                else {
                    return axios(
                        {
                            url: API_BASE_URL + "/chat/get_messages",
                            method: "post",
                            data: { type:type,receiverId:receiverId, timestamp:timestamp },
                            transformRequest: [function (data) {
                                return Qs.stringify(data)
                            }],
                            //synchronous: true,
                            headers: {
                                token: localStorage.getItem("token"),
                            }
                        }).catch(error => {
                            console.log(error)
                        })
                }
            }).then((response) => {
                console.log(response)
                return DatabaseManipulator.batchAddContactHistory(response.data)
        })
 
        })
       
    }

    static setCheckTime(key) {
        localforage.setItem("chatLastUpdate")

    }


    static searchLocalRecords(keywords, dispatch) {

    }

    static registerEndPoint(endpoint, p256dh, auth) {
        p256dh = btoa(String.fromCharCode.apply(null, new Uint8Array(p256dh)));
        auth = btoa(String.fromCharCode.apply(null, new Uint8Array(auth)));
        axios({
            url: `${API_BASE_URL}/chat/registerWebPushEndpoints`, // 使用模板字符串
            method: 'post',
            data: {
                endpoint: endpoint,
                p256dh: p256dh,
                auth: auth
            }, // 使用 Qs 序列化请求数据
            headers: {
                token: localStorage.getItem('token'), // 添加 token 作为请求头
            },
        })
            .then(response => {
                // 成功回调处理
                console.log('Response:', response);
            })
            .catch(error => {
                // 错误回调处理
                console.error('Error:', error);
            });
    }
    
    static getNewestMessages(friendId, setSelect) {
        let checkKey = "chatLastUpdate"
        localforage.getItem(checkKey).then(async timestamp => {
            if (!timestamp) {
                timestamp = 0;
            }
            axios(
                {
                    url: API_BASE_URL + "/chat/getNewestMessages",
                    method: "post",
                    data: { "userId": friendId, "timestamp": timestamp },
                    transformRequest: [function (data) {
                        console.log(Qs.stringify(data))
                        return Qs.stringify(data)
                    }],
                    //synchronous: true,
                    headers: {
                        token: localStorage.getItem("token"),
                    }
                }
            ).then(
                async (response) => {
                    //MessageUtil.updateMessage(response)
                    // //console.log(response)

                    // if (!response) {
                    //     return
                    // }
                    // if (!response.data) {
                    //     console.log("error")
                    //     return
                    // }

                    // if (response.data.code !== 1) {
                    //     console.log("logic error")
                    //     return
                    // }
                    // const messages = JSON.parse(response.data.message)
                    // let records_map = {}

                    // //dispatch messages to their sender in a map. 
                    // let maxTimestamp = timestamp
                    // for (let i = 0; i < messages.length; i++) {
                    //     let userId = messages[i].userId;
                    //     if (records_map[userId]) {
                    //         records_map[userId].push(messages[i])
                    //     } else {
                    //         records_map[userId] = [messages[i]]
                    //     }
                    //     maxTimestamp = Math.max(messages[i].sendTime, maxTimestamp)
                    // }
                    // await localforage.setItem(checkKey, maxTimestamp)

                    // //write to the database
                    // for (let key in records_map) {
                    //     let value = records_map[key]
                    //     let result = await localforage.getItem(key + "_records")
                    //     if (!result) {
                    //         result = { count: value.size, chats: value }
                    //     }
                    //     else {
                    //         result.count++
                    //         result.chats = [result.chats, ...value]
                    //     }
                    //     await localforage.setItem("send_from_" + friendId, result.chats)
                    // }

                    // get chat record contacts lists
                    // await localforage.getItem("contactCursor").then((userId) => {
                    //     if (!userId) {
                    //         localforage.getItem("contactRecordList").then((result) => {

                    //         })
                    //         return
                    //     }
                    //     localforage.getItem("contactRecordList").catch(() => {
                    //     }).then(async (result) => {
                    //         if (!result) {
                    //             return
                    //         }
                    //         let contains = -1
                    //         for (let i = 0; i < result.length; i++) {
                    //             if (result[i].userId === userId) {
                    //                 contains = i;
                    //             }
                    //         }
                    //         // contactDetails
                    //         // contactRecordList [{userId:userId, avatar:avatar, userName}, xxx, xxx]
                    //         let detail = await localforage.getItem(userId + "_detail")
                    //         if (contains === -1) {//query from localforage and set information
                    //             if (!detail) {
                    //                 console.log("he is not your friend!!!!")
                    //                 return
                    //             }
                    //             result = [...result, { userName: detail.userName, avatar: detail.avatar, userId: detail.userId }]
                    //             localforage.setItem("contactRecordList", result)
                    //         }
                    //         else {
                    //             result = [...result, { userName: detail.userName, avatar: detail.avatar, userId: detail.userId }]
                    //             localforage.setItem("contactRecordList", result)
                    //         }
                    //     }
                    //     )
                    // })
                }
            ).then(() => {
                //setSelect(friendId)
            })
        })
    }

    static sendMessage(userId, sendTo, content, messageType) {
        let data = { userId: userId, content: content, messageType: messageType }
        console.log(sendTo)
        if (sendTo.type === "single") {
            data.receiverId = sendTo.userId
            data.type = "single"

        }
        else if (sendTo.type === "group") {
            data.groupId = sendTo.userId
            data.type = "group"
        }
        else {
            return
        }
        console.log(data)
        return axios(
            {
                url: API_BASE_URL + "/chat/sendMessage",
                method: "post",
                data: data,
                transformRequest: [function (data) {
                    return Qs.stringify(data)
                }],
                //synchronous: true,
                headers: {
                    token: localStorage.getItem("token"),
                }
            }
        )
    }

    // this is used for show friend details.
    static requestUserInfo(userId, setDetails) {
        //get information from search/ friend list.
        axios({
            url: API_BASE_URL + "/friends/getUserIntro",
            method: 'post',
            data: { token: localStorage.getItem("token"), userIdToFollow: userId },
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }], headers: {
                token: localStorage.getItem("token"),
            }
        }).catch(error => {
            console.log(error)
        }).then(function (response) {
            if (!response) {
                console.log("error")
                return
            }
            let responseData = response.data
            if (responseData.code === -1) {
                //props.setBarState({...props.barState, message:responseData.message, open:true})
                return
            }
            else if (responseData.code === 1) {
                console.log(JSON.parse(responseData.message))
                //MessageUtil.setUserIntro(JSON.parse(responseData.message), dispatch)
                setDetails({ ...JSON.parse(responseData.message) })
                // localforage.setItem("userIntro", JSON.parse(responseData.message)).then(() => {
                //     navigator("/friendInfomation",{state:{position:"mid"}})
                // })

            }
            else {
                //props.setBarState({...props.barState, message:responseData.message, open:true})
            }
            //setNetworkErr(false)
        })
    }

}