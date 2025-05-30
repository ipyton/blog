import * as React from 'react';
import { Box, Typography, CircularProgress, Paper, List, InputBase, useMediaQuery, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Header from './Header';
// If you have the enhanced Contact component, import it
// Otherwise, continue using the original Contact component
import Contact from './Contact';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DatabaseManipulator from '../../../../util/io_utils/DatabaseManipulator';
import { useNotification } from '../../../../Providers/NotificationProvider';
import { useThemeMode } from '../../../../Themes/ThemeContext';
export default function SideBar(props) {
  let { select, setSelect, isMobile } = props;
  const [userRecords, setUserRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const { mode } = useThemeMode();


  let location = useLocation();
  const refresh = useSelector((state) => state.refresh.value.refresh);
  
  useEffect(() => {
    if (location && location.type && location.userId) {
      setSelect(location);
    }
  }, [location.type, location.userId, setSelect]);

  useEffect(() => {
    setLoading(true);
    DatabaseManipulator.getRecentContact()
      .then((res) => {
        setUserRecords(res || []); // Ensure this is always an array
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
        setUserRecords([]); // Set to empty array on error
        setLoading(false);
      });
  }, [refresh]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredContacts = Array.isArray(userRecords) 
    ? userRecords.filter(record => 
        (record.name && record.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (record.userId && record.userId.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const onClick = (idx) => {
    return () => {
      let mid = filteredContacts[idx];
      setSelect({ "userId": mid.userId, "type": mid.type });
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%', // Take full width of parent container
        height: isMobile ? "calc(100vh - 64px - 66px)" : "calc(100vh - 64px - 66px)",
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        overflow: 'hidden',
        backgroundColor: mode === 'dark' ? '#121212' : '#ffffff',
        position: 'relative',
      }}
    >
      <Header />
      
      <Box sx={{ 
        backgroundColor: mode === 'dark' ? '#1e1e1e' : '#f5f7fa',
        borderBottom: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', // 关键点：垂直居中
        height: '70px',
      }}>
  <Paper
    elevation={1}
    sx={{
      // p: '8px 16px', // Increased padding for more space around input
      display: 'flex',
      alignItems: 'center',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      backgroundColor: mode === 'dark' ? '#333333' : '#ffffff',
      width: '90%', // Changed from fixed pixel value to percentage
      maxWidth: '300px', // Added max-width for larger screens
      height: '70%',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
      },
      border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.03)'
    }}
  >
    <SearchIcon sx={{ 
      color: 'text.secondary', 
      mr: 1, // Added margin right for better spacing from text
      ml: 1.5,
      color: mode === 'dark' ? 'white' : 'black',
      fontSize: isMobile ? '1.2rem' : '1.4rem' 
    }} />
    <InputBase
      sx={{ 
        flex: 1,
        fontSize: isMobile ? '0.95rem' : '1rem',
        ml: 0.2, // Reduced margin left from 0.5 to 0.2
        '& .MuiInputBase-input': {
          py: 0.75,
          pl: 0.2, // Reduced padding left from 0.5 to 0.2
          overflow: 'hidden', // Prevent text overflow
          textOverflow: 'ellipsis', // Add ellipsis for overflowing text
          whiteSpace: 'nowrap' // Keep text on one line
        },
        color: mode === 'dark' ? 'white' : 'black',
      }}
      placeholder="Search contacts..."
      value={searchQuery}
      onChange={handleSearchChange}
    />
  </Paper>
</Box>
      
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto',
        backgroundColor: mode === 'dark' ? '#121212' : '#ffffff',
        width: '100%',
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#c1c1c1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#a8a8a8',
        },
      }}>
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: isMobile ? 'calc(100vh - 64px - 66px - 70px)' : 'auto',
            width: '100%'
          }}>
            <CircularProgress size={isMobile ? 30 : 40} />
          </Box>
        ) : !Array.isArray(userRecords) || userRecords.length === 0 ? (
          <Box sx={{ 
            p: isMobile ? 2 : 4, 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: isMobile ? 'calc(100vh - 64px - 66px - 70px)' : 'auto',
            width: '100%'
          }}>
            <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary">
              Start making some friends first
            </Typography>
          </Box>
        ) : filteredContacts.length === 0 ? (
          <Box sx={{ 
            p: isMobile ? 4 : 4, 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: isMobile ? '60vh' : 'auto',
            width: '100%'
          }}>
            <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary">
              No contacts found matching "{searchQuery}"
            </Typography>
          </Box>
        ) : (
          <List sx={{ 
            width: '100%', 
            bgcolor: mode === 'dark' ? '#121212' : 'background.paper',
            p: 0.5,
            '& .MuiListItem-root': {
              borderRadius: 1,
              my: 0.5,
              '&:last-child': {
                mb: 0
              }
            }
          }}>
            {filteredContacts.map((content, idx) => (
              <Contact 
                key={content.userId || idx} 
                onClick={onClick(idx)} 
                content={content} 
                selected={select}
                isMobile={isMobile}
              />
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
}