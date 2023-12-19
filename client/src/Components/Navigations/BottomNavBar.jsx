import React, { useContext, useEffect } from 'react'
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonPinCircleOutlinedIcon from '@mui/icons-material/PersonPinCircleOutlined';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import AddIcon from '@mui/icons-material/Add';

import styled from '@emotion/styled';
import { Fab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { grey } from '@mui/material/colors';
import { setSidebarActive } from '../../Redux/Slices/sideBarSlice';
import { addModalContext } from '../../Context/addModalContext';
import { setUserOfflineAPI } from '../../Services/allAPIs';

function BottomNavBar() {
    const [value, setValue] = React.useState(0);
    const ref = React.useRef(null);
    
    const userData = JSON.parse(localStorage.getItem("userData"))

    const lightTheme = useSelector(state=>state.themeKey)
    // styled bottom nav
    const style = {color:lightTheme?grey[700]:grey[500]}
  
    // styled add icon
    const StyledFab = styled(Fab)({
        position: 'absolute',
        zIndex: 1,
        top: -10,
        left: 0,
        right: 0,
        margin: '0 auto',
      });
  
      const location = useNavigate()
      const dispatch = useDispatch()
      const ActiveSideButton = useSelector(state=>state.sideBar)

      useEffect(()=>{
        const currUrl = window.location.pathname;
        const urlKeywordsArray = currUrl.split('/');
        if(urlKeywordsArray.filter(keyword => keyword).some(keyword => keyword==='groups'))
        {
            dispatch(setSidebarActive('groups'))
            setValue(2)
          }
          else if(urlKeywordsArray.filter(keyword => keyword).some(keyword => keyword==='settings'))
          {
            dispatch(setSidebarActive('settings'))
            setValue(4)
          }
          else
          {
            dispatch(setSidebarActive('chat'))
            setValue(1)
        }
    },[dispatch])

    const { openModal, setOpenModal} = useContext(addModalContext);

    // for add button
    const handleAdd=(e)=>{
      e.preventDefault();
      setOpenModal(true)
    }

    const handleNavigation = (path) => {
      location(`/app${path}`);
    };

    // logout function
    const handleLogout = async() => {
      const result = await setUserOfflineAPI(userData.data._id)
      if(result.status == 200) {
          location('/')
          localStorage.removeItem('userData');
      }else{
          location('/')
          localStorage.removeItem('userData');
      }
      }
  


    
      return (
      <Box sx={{ pb: 7,display:{xs:'block',md:'none'} }} ref={ref}>
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0,py:1 ,zIndex:3,bgcolor:lightTheme?grey[100]:'#1a1a1a'}} elevation={3}>
          <BottomNavigation
            showLabels
            value={value}
            sx={{bgcolor:lightTheme?grey[100]:'#1a1a1a'}}
            onChange={(event, newValue) => {
              setValue(newValue);
              // Determine the path based on the selected value
            let path = '/users'; // Default path

            if (newValue === 2) {
              path = '/groups';
            }else if (newValue === 3) {
              path = '/settings';
            }else if (newValue === 4) {
              handleLogout();
            }else{
              path = '/users'; 
            }

            handleNavigation(path);

            }}
          >
            <BottomNavigationAction value={1}
             sx={style}   label="Chat" icon={<ChatBubbleOutlineOutlinedIcon />} />
            <BottomNavigationAction value={2}
             sx={{color:lightTheme?grey[700]:grey[500],mr:8}}   label="Groups" icon={<GroupsRoundedIcon />} />
            <StyledFab onClick={handleAdd} color="primary" aria-label="add" sx={{width:70,height:70}}>
            <AddIcon />
          </StyledFab>
            <BottomNavigationAction value={3}
             sx={style}  label="Settings" icon={<SettingsOutlinedIcon />} />
            <BottomNavigationAction value={4}
             sx={style}  label="logout" icon={<LogoutOutlinedIcon />} />
          </BottomNavigation>
        </Paper>
      </Box>
    );
  }


export default BottomNavBar