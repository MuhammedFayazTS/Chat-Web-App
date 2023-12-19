import {  IconButton, Stack, Tooltip,Zoom} from '@mui/material'
import React, { useEffect, useState } from 'react'
// icons
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonPinCircleOutlinedIcon from '@mui/icons-material/PersonPinCircleOutlined';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import { grey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../Redux/Slices/themeSlice';
import { SidebarButton } from '../../Material ui/Styled Components';
// import { SidebarButton } from '../Material ui/SideBarButtonStyle';
import Lottie from 'react-lottie-player/dist/LottiePlayerLight'

import chatAppLogo from '../../Assets/lotte_animation/logo.json'
import { setSidebarActive } from '../../Redux/Slices/sideBarSlice';
// icons
import {  ChatCircleDots, Gear, GearFine, GearSix, Globe, Moon, MoonStars, SignOut, SunDim, UsersThree } from "@phosphor-icons/react";
import { setUserOfflineAPI } from '../../Services/allAPIs';

function Sidebar({setView,view}) {
    // tooltip style
    const userData = JSON.parse(localStorage.getItem("userData"))
    const lightTheme = useSelector(state=>state.themeKey)
    const ActiveButton = useSelector(state=>state.sideBar)
    const colorTheme = useSelector(state=>state.colorTheme)
    // const Bgcolors = ['#A251E1','#007FFF','#29AB87','#3e3e3e','#1F305E','#DE3163']
    const icoColors = ['#EED8FF','#f5f5f7','#90EE90','#c3c3c3','#E6E6FA']

    const SidebarButtonActiveButtonColors = {
        bgcolor: theme => theme.palette.primary.main,color:icoColors[4]
        // bgcolor:'#2CB3B0',color:'whitesmoke'
    }
    const SidebarButtonNotActiveButtonColors = {
        bgcolor:'transparent',color:grey[700]
    }

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
    
    const location = useNavigate()
    const dispatch = useDispatch()

    useEffect(()=>{
        const currUrl = window.location.pathname;
        const urlKeywordsArray = currUrl.split('/');
        if(urlKeywordsArray.filter(keyword => keyword).some(keyword => keyword==='groups'))
        {
            dispatch(setSidebarActive('groups'))
        }
        else if(urlKeywordsArray.filter(keyword => keyword).some(keyword => keyword==='settings'))
        {
            dispatch(setSidebarActive('settings'))
        }
        else
        {
            dispatch(setSidebarActive('chat'))
        }
    },[dispatch])

    useEffect(()=>{
        localStorage.setItem('themeMode',lightTheme)
    },[lightTheme])

  return (
      <>
          <Stack direction={'column'} flex={0.05} justifyContent={'space-between'} alignItems={'center'} height={'100%'} py={3} bgcolor={lightTheme ? grey[300] : '#171717'} >

              <Lottie
                  loop
                  animationData={chatAppLogo}
                  play
                  style={{ width: '85%'}}
              />

              <Stack direction={'column'} gap={2}  >
                  <Tooltip title='Chats' arrow placement='right' TransitionComponent={Zoom}>
                      <SidebarButton onClick={() => {
                          dispatch(setSidebarActive('chat'))
                          location('/app/users')
                      }}
                          sx={ActiveButton === 'chat' ? SidebarButtonActiveButtonColors : SidebarButtonNotActiveButtonColors}>
                          {/* <ChatBubbleOutlineOutlinedIcon sx={{ width: 25 }} /> */}
                          <ChatCircleDots size={25} />
                      </SidebarButton>
                  </Tooltip>

                  <Tooltip title='Groups' arrow placement='right' TransitionComponent={Zoom}>
                      <SidebarButton onClick={() => {
                          dispatch(setSidebarActive('groups'))
                          location('/app/groups')
                      }}
                          sx={ActiveButton === 'groups' ? SidebarButtonActiveButtonColors : SidebarButtonNotActiveButtonColors}>
                          {/* <GroupsRoundedIcon sx={{ width: 25 }} /> */}
                          <UsersThree size={25} />
                      </SidebarButton>
                  </Tooltip>

                  {/* <Tooltip title='Online-Users' arrow placement='right' TransitionComponent={Zoom}>
                      <SidebarButton onClick={() => dispatch(setSidebarActive('online'))}
                          sx={ActiveButton === 'online' ? SidebarButtonActiveButtonColors : SidebarButtonNotActiveButtonColors}>
                          <Globe size={25} />
                      </SidebarButton>
                  </Tooltip> */}

                  <Tooltip title='Settings' arrow placement='right' TransitionComponent={Zoom}>
                      <SidebarButton onClick={() => {
                          dispatch(setSidebarActive('settings'))
                          location('/app/settings')
                      }}
                          sx={ActiveButton === 'settings' ? SidebarButtonActiveButtonColors : SidebarButtonNotActiveButtonColors}>
                          {/* <SettingsOutlinedIcon sx={{ width: 25 }} /> */}
                          <Gear size={25}   />
                      </SidebarButton>
                  </Tooltip>

              </Stack>

              <Stack direction={'column'} gap={.5}>

                  <Tooltip title='Dark mode' arrow placement='right' TransitionComponent={Zoom}>
                      <IconButton onClick={() => {dispatch(toggleTheme())}} color={lightTheme ? 'info' : 'warning'} >
                          {lightTheme ? 
                          <DarkModeIcon sx={{ width: 25 }} />
                        // <MoonStars size={25} weight="fill" />
                           :
                        // <LightModeIcon sx={{ width: 25 }} />
                        <SunDim size={25} weight="fill" />
                        }
                      </IconButton>
                  </Tooltip>

                  <Tooltip title='Logout' arrow placement='right' TransitionComponent={Zoom}>
                      <IconButton onClick={handleLogout} color='secondary' >
                            <LogoutOutlinedIcon />
                        </IconButton>
                  </Tooltip>
              </Stack>

          </Stack>
      </>
  )
}

export default Sidebar