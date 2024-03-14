import React from "react"
import { InputBase, Stack } from "@mui/material"
import Header from "./Header"
import Message from "./MessageList"
import InputBox from "./InputBox"
import 'react-chat-elements/dist/main.css'
import { MessageBox } from 'react-chat-elements'
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { Avatar, Fab, ListItemButton } from '@mui/material';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	// padding: theme.spacing(1),
	textAlign: 'right',
	color: theme.palette.text.secondary,
	flexGrow: 2,
  }));
  

export default function () {
	let messages = [{from_nickName:"xxx", to_nickName:"xxx", content:"xxx", time:"xxx", position:"right", from_username:"", to_username:"", type:""},]

	let [messageList,setMessageList] = useState([1,2,3,4,5,65,67,76,56,5,234,2,42,4,23,423,4,23,42,4,2,34,2,3,42,34,2,4,24,23])
	return (<Stack sx={{width:"70%", boxShadow:1}}> 
	
		<Header></Header>
		<Message messageList={messageList} setMessageList={setMessageList} ></Message>
		<InputBox messageList={messageList} setMessageList={setMessageList}></InputBox>
	</Stack>)
}