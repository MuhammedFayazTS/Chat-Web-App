import { IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import BackButton from "./BackButton";
import ActiveInActive from "./ActiveInActive";
import { grey } from "@mui/material/colors";


import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import UserAvatar from "../Users/UserAvatar";
import { toggleTheme } from "../../Redux/Slices/themeSlice";
import { SunDim } from "@phosphor-icons/react";

function UserStausDisplay() {
  const lightTheme = useSelector(state=>state.themeKey)
  const userData = JSON.parse(localStorage.getItem("userData"))
    const location = useNavigate()
    const dispatch = useDispatch()

  return (
    <>
        <Stack direction={"row"} columnGap={1.5} p={2} flex={"0.1"} alignItems={'center'}>
            <div onClick={()=>location(-1)}><BackButton color={lightTheme?grey[500]:grey[600]} bgcolor={lightTheme?grey[300]:'#2F2F2F'} /></div>
            <Typography variant="h6" color={lightTheme?grey[700]:grey[300]}>Conversación</Typography>
            <IconButton onClick={()=>dispatch(toggleTheme())} color={lightTheme ? 'info' : 'warning'}
             sx={{ ml: 'auto', display: { xs: 'block', md: 'none' } }}>
              {lightTheme?
              // <DarkModeIcon sx={{color:grey[500]}}  />
              <DarkModeIcon />
              :
              <SunDim size={25} weight="fill" />
              // <LightMode  sx={{color:yellow[800]}} />
              }
            </IconButton>
          </Stack>

          <Stack
            flex={"0.2"}
            direction={"column"}
            rowGap={0.9}
            justifyContent={"center"}
            alignItems={"center"}
            pb={2}
          >

          <UserAvatar width={'7rem'} height={'7rem'} fs={'4rem'} uName={userData.data.name} pfp={userData.data.pfp?userData.data.pfp:''} noBadge isOnline />

            <Typography variant="p" color={lightTheme?grey[700]:grey[400]}>{userData?.data?.name}</Typography>

            <ActiveInActive  isActive={userData.data.isOnline} />
          </Stack>   
    </>
  )
}

export default UserStausDisplay