import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Friend from './Friend';
import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import FriendIntro from './FriendIntro';

export default function Friends(props) {
  let list = [12,12,312,4,13,4123,5,345,34]
  let height = window.innerHeight * 0.8
  return (
  <Stack sx={{marginLeft:'15%',width:'70%',marginTop:3, height:height}} direction="row" justify="center" spacing={2}>
    <Friend></Friend>
    <FriendIntro></FriendIntro>
  </Stack>

  );
}