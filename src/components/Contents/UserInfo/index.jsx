import * as React from 'react';
import { useState } from "react"
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Qs from 'qs'
import { Navigate } from 'react-router-dom';
import { deepOrange, deepPurple } from '@mui/material/colors';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IconButton } from '@mui/material';
import PictureUtil from '../../../util/io_utils/FileUtil';
import AccountUtil from '../../../util/io_utils/AccountUtil';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import dayjs from 'dayjs';

var advancedFormat = require('dayjs/plugin/advancedFormat')
dayjs.extend(advancedFormat)

const defaultTheme = createTheme();

export default function UserInfo(props) {

  const [receive, setReceive] = useState(false)
  const [selected, setSelected] = useState(false)
  const { login, setLogin } = props.status
  const [avatar, setAvatar] = useState("")
  const [gender, setGender] = useState(0)
  const [date, setDate] = useState(dayjs('2022-04-17'))
  const [picToUpload, setPicToUpload] = useState(null)
  const [detail, setDetail] = useState({})
  // React.useEffect(()=> {
  //   AccountUtil.getOwnerInfo(detail, setDetail)
  // }, [])
  const handleChange = (event) => {
    setGender(event.target.value);
  };

  if (false === login) {
    return <Navigate to="/login" replace />
  }

  const getUserInformation = () => {

  }

  const validate = (nickname, username, password) => {
    return true
  }

  function encryption(password) {
    return password;
  }

  const handleReceive = (event) => {
    setReceive(!receive)
  }

  const picUploadHandler = (event) => {
    setAvatar(URL.createObjectURL(event.target.files[0]))
    console.log(avatar)
    PictureUtil.uploadAvatar(event.target.files[0])
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data)
    if (!validate(data.get('nickname'), data.get('username'), data.get('password'))) {
      props.setBarState({ ...props.barState, message: "please check your input", open: true })
    }
    else {
      // axios({
      //   url: "http://localhost:8080/account/getinfo",
      //   method: 'post',
      //   data: { userEmail: data.get('email'), password: encryption(data.get('password')), userName: data.get("nickname"), promotion: selected },
      //   transformRequest: [function (data) {
      //     return Qs.stringify(data)
      //   }],
      // }).then(
      //   (response) => {
      //     console.log("response");
      //     if (response.code === 1) {

      //     }
      //     else {

      //     }
      //   }
      // ).catch((err) => {
      //   console.log("check your input")
      // })
      console.log(data.get("intro"), data.get("nickname"), data.get("region"), data.get("pictures"), date.format('YYYY-MM-DD'), gender)
      AccountUtil.updateUserInfo(data.get("intro"), data.get("nickname"), data.get("region"), data.get("pictures"), date.format('YYYY-MM-DD'), gender)

    }
  };


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div>
            <input id="uploadPic" type="file" onChange={picUploadHandler}  hidden></input>
            <label htmlFor="uploadPic">
              <IconButton component="span">
                <Avatar id="avatar" src={avatar} sx={{ bgcolor: deepOrange[500] }}>N</Avatar>
              </IconButton>
            </label>
          </div>
          <Typography component="h1" variant="h5">
            User Information
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} >
                <TextField
                  name="nickname"
                  required
                  fullWidth
                  id="nickname"
                  label="Nickname"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="region"
                  label="Region"
                  name="region"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="intro"
                  label="intro"
                  type="intro"
                  id="intro"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="gender-select-label">Gender</InputLabel>
                  <Select
                    labelId="gender-select-label"
                    id="gender"
                    value={gender}
                    label="gender"
                    onChange={handleChange}
                  >
                    <MenuItem value={true}>Male</MenuItem>
                    <MenuItem value={false}>Female</MenuItem>
                    <MenuItem value={null}>Not to tell</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <DatePicker value={date} onChange={(newDate) => setDate(newDate)}/>
              </Grid>
              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox onClick={handleReceive} value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}