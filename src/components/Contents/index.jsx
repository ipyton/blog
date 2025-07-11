import Item from "./Item"
import { Route, Routes, useNavigate, Navigate, redirect, useLocation } from 'react-router-dom'
import NotFound from "./NotFound"
import React from "react"
import { Snackbar } from "@mui/material"
import UserInfo from "./UserInfo"
import TextEditor from "./TextEditor"
import Videos from "./Videos"
import NetworkError from "../Errors/NetworkError"
import Chat from "./Chat"
import Settings from "./Settings"
import AppStore from "./AppStore"
import Friends from "./FriendList"
import LongVideos from "./LongVideos"
import UploadFile from "./UploadFile"
import VideoList from "./VideoList"
import SearchResult from "./SearchResult"
import FriendIntroductionCentered from "./Introductions/FriendIntroductionCentered"
import "../../App.css"
import Header from "../Header"
import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { update as updateSideBar } from "../redux/refreshSideBar"
import { update as updateMailBox } from "../redux/refreshMailBox"
import { update as updateMessages } from "../redux/refreshMessages"

import Box from '@mui/material/Box';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import LongVideoIntroduction from "./Introductions/LongVideoIntroduction"
import { useSelector } from 'react-redux';

import Trends from "./Trends"
import Downloads from "./Downloads"
import About from "./About"
import BotChat from "./BotChat"
import ResetPassword from "./ResetPassword"
import RolePermissionPage from "./RolePermissionPage"
import UserManagementPage from "./UserManagementService"
import { useDispatch } from "react-redux"
import DownloadRequestManager from "./DownloadRequestManager"
import UpdateLog from "./UpdateLog"
import MessageUtil from "../../util/io_utils/MessageUtil"
import { useNotification } from '../../Providers/NotificationProvider';
import DatabaseManipulator from "../../util/io_utils/DatabaseManipulator"
import { GroupOutlined } from "@mui/icons-material"
import QRScanner from "./QRScanner"


const defaultTheme = createTheme();

export default function Contents(props) {
    //state bar
    const [state, setState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
        message: "helloworld"
    });

    const { setLogin } = props

    const [avatar, setAvatar] = useState(null)
    const [badgeContent, setBadgeContent] = useState([])
    const [networkStatus, setNetworkStatus] = useState(false)

    const refresh = useSelector((state) => state.refreshMessages.value.refresh);

    const { vertical, horizontal, open, message } = state;
    const handleClose = () => {
        setState({ ...state, open: false });
    };


    const [notifications, setNotifications] = useState([])
    //const [chatRecords, setChatRecords] = useState([])
    const [userRecords, setUserRecords] = useState([])
    const [sideBarSelector, setSideBarSelector] = useState()
    const location = useLocation()
    const { showNotification } = useNotification();

    // useEffect(()=>{
    //     if (!location.pathname.startsWith("/chat")) {
    //         setSideBarSelector(null)
    //     }

    // },[location])

    // const register = async () => {
    //     await localforage.getItem(
    //         "recent_contacts"
    //     ).then(res => {
    //         if (!res) res = []
    //         //refractor this, just add hitory user.
    //         setUserRecords(res)
    //     }
    //     ).then(() => {
    //     })
    // }

    // useLayoutEffect(() => {
    //     UserInitializer.init()
    //     register()
    // }, [])
    const dispatcher = useDispatch()


    const singleMessageHandler = (message) => {
        //single chat, not single message
        const senderId = message.direction === true ? message.userId1 : message.userId2;
        const receiverId = message.direction === true ? message.userId2 : message.userId1;
        message.senderId = senderId;
        message.receiverId = receiverId;
        console.log("Received single message:", message);
        DatabaseManipulator.addContactHistories([message]).then(() => {
            DatabaseManipulator.insertUnreadMessages([message]).then(() => {
                DatabaseManipulator.addRecentContacts([message]).then(() => {
                    dispatcher(updateMailBox())
                    dispatcher(updateMessages())
                    dispatcher(updateSideBar())
                });

            })
        });
    }

    const groupMessageHandler = (message) => {
        const sender = message.userId 
        const receiver = localStorage.getItem("userEmail")
        // message.senderId = sender
        console.log("group")
        console.log(message)
        message.receiver = receiver
        message.groupId = message.groupId
        
        DatabaseManipulator.addContactHistories([message]).then(() => {
            DatabaseManipulator.insertUnreadMessages([message]).then(() => {
                DatabaseManipulator.addRecentContacts([message]).then(() => {
                    dispatcher(updateMailBox())
                    dispatcher(updateMessages())
                    dispatcher(updateSideBar())
                });

            })
        });
        console.log("handle group messages")
    }

    const handleMessage = (message) => {
        if (message.type === "single") {
            singleMessageHandler(message);
        } else if (message.type === "group") {
            groupMessageHandler(message);
        }
    }
    useEffect(() => {
        const worker = new Worker("/webworkers/NotificationReceiver.js", { type: 'module' });

        // 1. 一启动就设置 token（发送给 Worker）
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (token && userId) {
            worker.postMessage({ action: "setToken", key: userId, value: token });
            console.log("Sent token and userId to worker");
        }

        // 2. 监听消息
        worker.onmessage = (event) => {
            const { action, data } = event.data;
            console.log("Main thread received:", event.data);

            if (action === "updateNotification") {
                console.log("Updating notification");
            } else if (action === "workerReady") {
                console.log("Worker is ready");
            } else if (action === "connectionFailed") {
                console.warn("WebSocket connection failed");
            } else if (action === "messageReceived") {
                console.log("messageREceiveed")
                handleMessage(JSON.parse(data));
            }
        };

        // 3. 错误处理
        worker.onerror = (event) => {
            console.error("Worker error:", event);
        };

        // 4. 清理
        return () => {
            console.log("Cleaning up worker");
            worker.terminate();
        };
    }, []);


    const markAsRead = (type, userId,groupId) => {
        console.log([type,userId,groupId])
        MessageUtil.markAsRead(type, userId,groupId).then((res) => {
            if (res && res.data && res.data.code === 0) {
                console.log("Marked as read successfully")
                // Update the notifications state to remove the read message
                DatabaseManipulator.changeCountOfRecentContact(type, userId,groupId, 0).then(() => {
                    DatabaseManipulator.deleteUnreadMessage(type,groupId, userId).then(() => {
                        // const updatedList = notifications.filter(notification => {
                        //     console.log("Filtering notification:", notification, "with userId:", userId, "and type:", type);
                        //     return !(notification.senderId === userId && notification.type === type);
                        // });
                        // console.log("Updated notifications list:", updatedList);
                        //setNotifications(updatedList);
                        dispatcher(updateMailBox())
                        dispatcher(updateSideBar())
                    })
                })

            } else {
                showNotification("Failed to mark as read", "error")
            }
        })
    }

    useState(() => {
        MessageUtil.getUnreadMessages().then((res) => {
            if (res && res.data && res.data.code === 0) {
                DatabaseManipulator.clearUnreadMessages().then(() => {
                    const messages = JSON.parse(res.data.message)
                    DatabaseManipulator.initUnreadMessages(messages).then(() => {
                        DatabaseManipulator.initRecentContacts(messages).then(() => {
                            setNotifications(messages)
                            dispatcher(updateMailBox())
                            dispatcher(updateSideBar())
                            //dispatcher(update())
                        })
                    })
                })
            } else {
                showNotification("Failed to fetch unread messages", "error")
            }

        })
    }, [])




    console.log(sideBarSelector)
    //state = {articles:[{id:1},{id:2},{id:3},], pagesize:5}
    return (
        < ThemeProvider theme={defaultTheme} >
            <Box sx={{ display: 'flex' }}>
                <Header avatar={avatar} setAvatar={setAvatar} setLogin={setLogin}  markAsRead={markAsRead}></Header>
                <Box width="calc(100% - 64px)" justifyContent="center" alignItems="center" marginTop="64px">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div>
                            <div>
                                <Routes>
                                    <Route path="/" element={<Item barState={state} setBarState={setState} status={props} />}></Route>
                                    {/* <Route path="/signup" element={<SignUp barState={state} setBarState={setState} status={props}/>}></Route> */}
                                    <Route path="/userinfo" element={<UserInfo barState={state} setBarState={setState} status={props}></UserInfo>}></Route>
                                    <Route path="/editor" element={<TextEditor barState={state} setBarState={setState} status={props}></TextEditor>}></Route>
                                    <Route path="/videos" element={<Videos barState={state} setBarState={setState} status={props}></Videos>}></Route>
                                    <Route path="/chat" element={<Chat barState={state} setBarState={setState} status={props}
                                        sideBarSelector={sideBarSelector} setSideBarSelector={setSideBarSelector}  markAsRead={markAsRead}></Chat>}></Route>
                                    <Route path="/settings" element={<Settings barState={state} setBarState={setState} status={props}></Settings>}></Route>
                                    <Route path="/notfound" element={<NetworkError barState={state} setBarState={setState} status={props} ></NetworkError>}></Route>
                                    <Route path="/friends" element={<Friends barState={state} setBarState={setState} status={props}></Friends>}></Route>
                                    <Route path="/error" element={<NetworkError></NetworkError>}></Route>
                                    <Route path="/appstore" element={<AppStore barState={state} setBarState={setState} status={props}> </AppStore>}></Route>
                                    <Route path="/longvideos" element={<LongVideos setBarState={setState} status={props}></LongVideos>}></Route>
                                    <Route path="/upload" element={<UploadFile setBarState={setState} status={props}></UploadFile>}></Route>
                                    <Route path="/videolist" element={<VideoList setBarState={setState} status={props}></VideoList>}></Route>
                                    <Route path="/searchresult" element={<SearchResult> </SearchResult>}></Route>
                                    <Route path="/friendInfomation" element={<FriendIntroductionCentered ></FriendIntroductionCentered>}></Route>
                                    <Route path="/videoIntroduction" element={<LongVideoIntroduction></LongVideoIntroduction>}> </Route>
                                    <Route path="/trending" element={<Trends></Trends>}> </Route>
                                    <Route path="/download" element={<Downloads></Downloads>}></Route>
                                    <Route path="/about" element={<About> </About>}> </Route>
                                    <Route path="/qa" element={<BotChat></BotChat>}></Route>
                                    <Route path="/reset" element={<ResetPassword></ResetPassword>}></Route>
                                    <Route path="/role" element={<RolePermissionPage></RolePermissionPage>}></Route>
                                    <Route path="/userManage" element={<UserManagementPage></UserManagementPage>}></Route>
                                    <Route path="/role" element={<RolePermissionPage></RolePermissionPage>}></Route>
                                    <Route path="/downloadRequestsManager" element={<DownloadRequestManager></DownloadRequestManager>} ></Route>
                                    <Route path="/logs" element={<UpdateLog></UpdateLog>} ></Route>
                                    <Route path="/scanner" element={<QRScanner></QRScanner>} ></Route>
                                    <Route path="*" element={<NotFound barState={state} setBarState={setState} status={props} />} ></Route>

                                </Routes>
                            </div>
                            <div>
                                <Snackbar
                                    anchorOrigin={{ vertical, horizontal }}
                                    open={open}
                                    onClose={handleClose}
                                    message={message}
                                    key={vertical + horizontal}
                                />
                            </div>
                        </div>
                    </LocalizationProvider>
                    {/* <Footer description='good' title='morning'></Footer> */}
                </Box>
            </Box>

        </ThemeProvider >


    )

}