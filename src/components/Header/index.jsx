import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
// import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import LanguageIcon from '@mui/icons-material/Language';
import { Avatar, Fab, ListItemButton } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import IOUtil from '../../util/ioUtil';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import FunctionDrawer from './FunctionDrawer';
import MuiAppBar from '@mui/material/AppBar';

import SearchAndSuggestion from './SearchAndSuggestion';
import SearchUtil from '../../util/io_utils/SearchUtil';
import { useDispatch } from 'react-redux';
import {clear} from "../../components/redux/searchResult"
import localforage from 'localforage';
import { useState } from 'react';
import MessageBox from './MessageBox';
import MessageUtil from '../../util/io_utils/MessageUtil';
import MusicUtil from '../../util/io_utils/MusicUtil';
import {set} from "../redux/Search"

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const drawerWidth = 240;
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));



export default function Header(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [suggestionAnchorEl, setSuggestionAnchorEl] = React.useState(null);
  const [languageAnchorEl, setLanguageAnchorEl] = React.useState(null);  
  const [search, setSearch] = React.useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = React.useState(null)
  const [open, setOpen] = React.useState(false);
  const [category, setCategory] = React.useState(false)
  let [categorySelected, setCategorySelected] = React.useState([false, false, false, false, false])
  const [notificationList, setNotificationList] = useState([])


  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const searchSuggestionOpen = !Boolean(suggestionAnchorEl)
  const languageMenuOpen = Boolean(languageAnchorEl)
  const notificationsOpen = Boolean(notificationsAnchorEl)
  const dispatch = useDispatch()
  const {notifications, setNotifications} = props

  
  const navigate = useNavigate();
  const renderBadge = () => {

  }


  function onClick(event){ 
    console.log(event)
    console.log(categorySelected)

    if (event.target.id!=="category") {
      setSuggestionAnchorEl(false)
    }
  }

  React.useEffect(()=>{
    window.addEventListener("click",onClick)
    return ()=>{
      window.removeEventListener("click", onClick)
    }
  },[])
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    console.log("close")
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    console.log("mobile")
    console.log(event.currentTarget)
    setMobileMoreAnchorEl(event.currentTarget);
  };


  const handleSearch = (event) => {
    //dispatch()
    let index = -1
    if (categorySelected[0]===true) {
      index = 0
    } else if (categorySelected[1] === true) {
      // find local chat records.
      index = 1
    } else if (categorySelected[2] === true) {
      index = 2
    } else if (categorySelected[3] === true) {
      index = 3
    } else if (categorySelected[4] === true) {
      index = 4
    } else {
      console.log("good day")
    }
    dispatch(set({search:search, type:index}))
    navigate("searchresult" )
  }

  const handleSearchChange = (event) => {
    setSearch(event.currentTarget.value)
    setSuggestionAnchorEl(event.currentTarget)
    event.currentTarget.focus()
  }

  const handleLanguageMenuOpen =(event) => {
    setLanguageAnchorEl(event.currentTarget)
    console.log("language changed")
  }

  const handleLogout = (event) => {
    localStorage.clear()
    localforage.clear()
    props.setLogin(false)
    props.setBadgeContent(null)
    navigate("/login")
  }

  const handleInfomation = (event) => {
    navigate("/userinfo")
  }

  const handleSettings = (event) => {
    navigate("/settings")
  }

  const handleChange = (event) => {
    navigate("/")

  }
  const handleSearchSuggestionClose = (event) => {
    setSuggestionAnchorEl(null)
  }

  const handleLanguageMenuClose = (event) => {
    setLanguageAnchorEl(null)
  }

  
  const handleNotificationOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget)
  }



  const toggleDrawer = () => {
    setOpen(!open);
  };
  const handleTextBlur = () => {
    if (category == true) {
      setCategory(false)
    } else {
      setSuggestionAnchorEl(null)
    }


  }



  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleInfomation}>Account Information</MenuItem>
      {/* <MenuItem onClick={handleMenuClose}>My account</MenuItem> */}
      <MenuItem onClick={handleSettings}>Settings</MenuItem>
      <MenuItem onClick={handleLogout}>Log Out</MenuItem>
    </Menu>
  );


  const renderLanguageMenu = (
    <Menu
    anchorEl={languageAnchorEl}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    id={menuId}
    keepMounted
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    open={languageMenuOpen}
    onClose={handleLanguageMenuClose}
  >
    <MenuItem onClick={handleMenuClose}>English</MenuItem>
    {/* <MenuItem onClick={handleMenuClose}>My account</MenuItem> */}
    <MenuItem onClick={handleMenuClose}>Chinese</MenuItem>
    <MenuItem onClick={handleMenuClose}>Japanese</MenuItem>
  </Menu>

  )

  // messages
  const renderMessageMenu = (
      <MessageBox notificationsAnchorEl={notificationsAnchorEl} setNotificationsAnchorEl={setNotificationsAnchorEl} notificationsOpen={notificationsOpen}></MessageBox>
  )
  
  

  // const notifications = (
  //   <List hidden={!notificationsOpen} sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', zIndex:9999, position: 'absolute', left: '50%',
  //   transform: 'translate(-50%, 0)'}}>
  //   <ListItemButton onMouseDown={handleNotificationOpen}>
  //     <ListItem alignItems="flex-start">
  //       <ListItemAvatar>
  //         <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
  //       </ListItemAvatar>
  //       <ListItemText
  //         primary="Brunch this weekend?"
  //         secondary={
  //           <React.Fragment>
  //             <Typography
  //                variant="body2"
  //               color="text.primary"
  //             >
  //               Ali Connors
  //             </Typography>
  //             {" message1"}
  //           </React.Fragment>
  //         }
  //       />
  //     </ListItem>  
  //     </ListItemButton>
      
  //     <Divider variant="inset" component="li" />
  //     <ListItemButton onMouseDown={handleNotificationOpen}>
  //     <ListItem alignItems="flex-start">
  //       <ListItemAvatar>
  //         <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
  //       </ListItemAvatar>
  //       <ListItemText
  //         primary="Summer BBQ"
  //         secondary={
  //           <React.Fragment>
  //             <Typography
  //               sx={{ display: 'inline' }}
  //               component="span"
  //               variant="body2"
  //               color="text.primary"
  //             >
  //               to Scott, Alex, Jennifer
  //             </Typography>
  //             {" — message 2"}
  //           </React.Fragment>
  //         } />
  //     </ListItem>
  //     </ListItemButton>
    
  //     <Divider variant="inset" component="li" />

  //     <ListItemButton onMouseDown={handleNotificationOpen}>
  //     <ListItem alignItems="flex-start">
  //       <ListItemAvatar>
  //         <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
  //       </ListItemAvatar>
  //       <ListItemText
  //         primary="Oui Oui"
  //         secondary={
  //           <React.Fragment>
  //             <Typography
  //               sx={{ display: 'inline' }}
  //               component="span"
  //               variant="body2"
  //               color="text.primary"
  //             >
  //               Sandra Adams
  //             </Typography>
  //             {' — message3'}
  //           </React.Fragment>
  //         }
  //       />
  //     </ListItem>
  //     </ListItemButton>
  //   </List>


  // )

    let mockData = [{title:"Helloworld", introduction:"introduction", pic:"", type:"contact"}, {title:"Helloworld", introduction:"introduction", pic:"", type:"movie"}]
    const suggestionBar = (
      <SearchAndSuggestion categorySelected={categorySelected} setCategorySelected ={setCategorySelected} searchResult={mockData} searchSuggestionOpen={searchSuggestionOpen} setSuggestionOpen={setSuggestionAnchorEl} left={open} setCategory={setCategory}>

       </SearchAndSuggestion>
    )

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={20} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleLanguageMenuOpen}>
        <IconButton
          size="large"
          aria-label="language"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
        {/* <AccountCircle /> */}
        <LanguageIcon/>
       </IconButton>
        <p>Languages</p>
      </MenuItem>

      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
        <Avatar alt="Travis Howard"  src={props.avatar} />
       </IconButton>
       
        <p>Account</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div>
      <AppBar position="fixed" open={open}>
        <Toolbar>
        <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '0px',
                ...(open && { display: 'none' }),
              }}
            >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, marginLeft:"2.5%" }}
          >
            Everything  
          </Typography>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Search >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="search"
                inputProps={{ 'aria-label': 'search' }}
                onChange={handleSearchChange}
                onBlur={handleTextBlur}
              />
              <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearch} >
                <SearchIcon />
              </IconButton>
          </Search>
          </Box>

          <Box sx={{ flexGrow: 1 }}></Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              onClick={handleNotificationOpen}
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              aria-label="language"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleLanguageMenuOpen}
              color="inherit"
            >
              <LanguageIcon />
            </IconButton>


            <IconButton
              size="large"
              edge="end"
              aria-label="account"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
            <Avatar alt="Travis Howard"  src={props.avatar} />
            </IconButton>


          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignSelf:"right" }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {renderMobileMenu}
      {renderMenu}
      {suggestionBar}
      {renderLanguageMenu}
      {renderMessageMenu}
      <FunctionDrawer setOpen={setOpen} open={open}></FunctionDrawer>
    </div>
  );
}
