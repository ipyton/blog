import React, { useState } from 'react'
import SignUp from "./SignUp";
import Forget from "./Forget";
import Login from "./Login";
import Box from '@mui/material/Box';
import NotFound from "../Errors/NotFoundError";
import AuthLayout from './AuthLayout';
import { Route, Routes, useNavigate, Navigate, redirect, BrowserRouter, } from 'react-router-dom'
import Iridescence from "../../Animations/Iridescence/Iridescence"
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import LandingPage from '../LandingPage';
function Copyright(props) {
    return (
        <Typography variant="body2" color="white" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
        </Typography>
    );
}

export default function (props) {
    return (
        <BrowserRouter>

            <Routes>
                <Route path="/" element={<LandingPage />}></Route>
                <Route element={<AuthLayout />}>

                    <Route path="forget" element={<Forget />}></Route>
                    <Route path="login" element={<Login login={props.loginState} setLogin={props.setLoginState} />}></Route>
                    <Route path="signup" element={<SignUp loginState={props.loginState} setLoginState={props.setLoginState} setBarState={props.setBarState} />}></Route>
                    <Route path="*" element={<Login login={props.loginState} setLogin={props.setLoginState} />}></Route>

                </Route>
            </Routes>


        </BrowserRouter >
    )
}