import FriendIntro from "../../FriendList/FriendIntro";
import { ImageList, ImageListItem, Avatar } from "@mui/material";
import Stack from '@mui/material/Stack';
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useSelector, useDispatch } from "react-redux";
import { update, clear } from "../../../redux/UserDetails"
import SocialMediaUtil from "../../../../util/io_utils/SocialMediaUtil";
import localforage from "localforage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@mui/icons-material";

export default function (props) {
    let [details, setDetails] = useState(null)
    let navigate = useNavigate()

    React.useEffect(() => {
        localforage.getItem("userIntro").then((res) => {
            setDetails(res)
        })
    },[])

    let contactButtonText = ""

    let followButtonText = ""

    let extraInformation = ""
    if (details === undefined || details === null) {
        return <div>loading</div>
    }
    //console.log(details.relationship)
    //01: you do not follow him/ but he follow you.
    //10: you follow him but he does not follow you.
    //,etc.
    if (details.relationship === 0) {
        followButtonText = "Follow"
        extraInformation = ""
        contactButtonText = ""
    } else if (details.relationship === 1) {
        followButtonText = "Follow"
        extraInformation = "He follows you."
    } else if (details.relationship === 10) {
        contactButtonText = "Request"
        followButtonText = "Unfollow"
    } else if (details.relationship === 11) {
        extraInformation = "He follows you."
        followButtonText = "Unfollow"
        contactButtonText = "Contact"
    }

    const handleContact = () => {
        if (details.userId === localStorage.getItem("userId")) {
            return
        }
        localforage.setItem("contactCursor", details.userId)
        navigate("/chat")
        console.log("navigate")
    }
    if (details.userId === localStorage.getItem("userId")) {
        followButtonText = ""
    }

    let handleFollow = () => {

        if (Math.floor(details.relationship / 10) === 1) {
            details.relationship = details.relationship % 10
            SocialMediaUtil.unfollow(localStorage.getItem("userId"), details.userId, details, setDetails)
        } else {
            SocialMediaUtil.follow(localStorage.getItem("userId"), details.userId, details, setDetails)
            details.relationship += 10
        }
        if (details.relationship === 11) {
            localforage.getItem("friendList").then(async res=>{
                if (!res) res = {}
                res[details.userId] = { userId: details.userId, name: details.name, avatar: details.avatar }
                await localforage.setItem("friendList", res)
            })
        } else {

            localforage.getItem("friendList").then(async res => {
                if (!res) res = {}
                res[details.userId] = null
                await localforage.setItem("friendList", res)
            })
        }
        setDetails(details)
    }

    let imageData = [
        {
            img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
            title: 'Breakfast',
        },
        {
            img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
            title: 'Burger',
        },
        {
            img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
            title: 'Camera',
        },
        {
            img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
            title: 'Coffee',
        },
        {
            img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
            title: 'Hats',
        },
        {
            img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
            title: 'Honey',
        },
        {
            img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
            title: 'Basketball',
        },
        {
            img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
            title: 'Fern',
        },
        {
            img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
            title: 'Mushrooms',
        },
        {
            img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
            title: 'Tomato basil',
        },
        {
            img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
            title: 'Sea star',
        },
        {
            img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
            title: 'Bike',
        },
    ];



    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={0.5} sx={{ width: "100%", overflow: "scroll", boxShadow: 1 }}>
            <Stack direction="row" justifyContent="end" sx={{ width: "60%" }}>
                <ListItem alignItems="flex-start" >
                    <ListItemAvatar>
                        <Avatar alt={details.userName} src={details.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={details.userName}

                        secondary={
                            <React.Fragment>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                </Typography>
                                {details.introduction}
                            </React.Fragment>
                        }
                    />

                </ListItem>


                <ButtonGroup sx={{ marginTop: "3%", height: "50%" }} aria-label="Basic button group" >
                    {followButtonText.length === 0 ? <div></div> : <Button onClick={handleFollow}> {followButtonText}</Button>}
                    {contactButtonText.length === 0 ? <div></div> : <Button onClick={handleContact}>{contactButtonText}</Button>}
                </ButtonGroup>
            </Stack>
            <Stack>
                {localStorage.getItem("id")}
            </Stack>
            <Stack>
                {extraInformation}
            </Stack>
            <Stack sx={{ width: "60%", }}>
                <TextField
                    id="outlined-required"
                    label="Gender"
                    defaultValue={details.gender}
                    variant="standard"
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <TextField
                    id="outlined-required"
                    label="Age"
                    defaultValue={details.birthdate}
                    variant="standard"

                    InputProps={{
                        readOnly: true,
                    }}
                />
                <TextField
                    id="outlined-required"
                    label="Location"
                    defaultValue={details.location}
                    variant="standard"
                    InputProps={{
                        readOnly: true,
                    }}

                />

                {details.nickname === undefined ? <div></div> : <TextField
                    id="outlined-required"
                    label="NickName"
                    defaultValue={details.nickname}
                    variant="standard" type="search" />}

            </Stack>


            {imageData === undefined ? <div></div> : <ImageList sx={{ width: "60%" }} cols={3} >
                {imageData.map((item) => (
                    <ImageListItem key={item.img}>
                        <img
                            srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                            alt={item.title}
                            loading="lazy"
                        />
                    </ImageListItem>
                ))}
            </ImageList>}
        </Stack>

    )



}