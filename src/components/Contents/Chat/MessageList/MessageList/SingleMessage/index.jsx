import 'react-chat-elements/dist/main.css'
import { MessageBox } from 'react-chat-elements'
import { useState } from 'react';
import { Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Avatar, Fab, ListItemButton } from '@mui/material';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import * as React from 'react';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    // padding: theme.spacing(1),
    textAlign: 'right',
    color: theme.palette.text.secondary,
    flexGrow: 2,
  }));
  

export default function(props) {
  console.log(props)
    if (props.position == "left") {
        return (<Stack direction="row"  >
          
        <Stack>
          <IconButton
              size="small"
              edge="end"
              aria-label="account"
              display="none"
              //aria-controls={menuId}
              aria-haspopup="true"
              //onClick={handleProfileMenuOpen}
              color="inherit"
              textAlign="center">
            <Avatar alt="Travis Howard"  />
          </IconButton>  
        </Stack>
        
        <Stack>
          老婆
      <MessageBox
        position={'left'}
        type={'photo'}
        text={'react.svg'}
        data={{
          uri: 'https://facebook.github.io/react/img/logo.svg',
          status: {
            click: false,
            loading: 0,
          },
          height:10,
        }}/>
        </Stack></Stack>
)
    } 
    else {
        return (<Stack direction="row"  >
        
        <Item>
      <MessageBox
        position={'right'}
        type={'photo'}
        text={'react.svg'}
        data={{
          uri: 'https://facebook.github.io/react/img/logo.svg',
          status: {
            click: false,
            loading: 0,
          },
          height:10,
        }}
      /></Item>
      <IconButton
              size="small"
              edge="end"
              aria-label="account"
              display="none"
              //aria-controls={menuId}
              aria-haspopup="true"
              //onClick={handleProfileMenuOpen}
              color="inherit"
              textAlign="center"
            >
            <Avatar alt="Travis Howard"  />
            </IconButton>
      </Stack>
)
    }
}