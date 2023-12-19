import React, { createContext, useEffect, useState } from 'react'
import Stack from '@mui/material/Stack';
import { Box } from '@mui/material';
import Sidebar from '../Components/Navigations/Sidebar';

import {  grey } from '@mui/material/colors';
import { Outlet} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../Redux/Slices/themeSlice';
import { setColorTheme } from '../Redux/Slices/colorThemeSlice';


// export const myContext = createContext();
function Home() {
  const lightTheme = useSelector(state=>state.themeKey)
  // const [refresh, setRefresh] = useState(true);
  // const [notifications,setNotifications] = useState([])
  const [view,setView] = useState(true);
  const dispatch = useDispatch()
  const colorTheme = localStorage.getItem('colorTheme')
  const themeMode = localStorage.getItem('themeMode')




  useEffect(()=>{
    if(colorTheme){
      dispatch(setColorTheme(colorTheme))
    }
  },[])

  return (
    <>
      <Box sx={{ display: { xs: 'none', md: 'block' } }} py={{md:0,lg:3}} px={{md:0,lg:8}} width={'100%'} height={'100vh'} bgcolor={lightTheme ? grey[800] : '#2F2F2F'} >
        <Stack direction={'row'} width={'100%'} height={'100%'} borderRadius={{md:'3px',lg:'10px'}} overflow={'hidden'}  >
          {/* <myContext.Provider value={{ refresh: refresh, setRefresh: setRefresh,notifications:notifications,setNotifications:setNotifications }}> */}
            <Sidebar setView={setView} view={view} />
            <Outlet />
          {/* </myContext.Provider> */}
        </Stack>
      </Box>

      <Box sx={{ display: { md: 'none', xs: 'block' } }} width={'100%'} height={'100vh'} bgcolor={lightTheme ? grey[800] : '#2F2F2F'} >
        <Stack direction={'row'} width={'100%'} height={'100%'} overflow={'hidden'}  >
          {/* <myContext.Provider value={{ refresh: refresh, setRefresh: setRefresh ,notifications:notifications,setNotifications:setNotifications}}> */}
            <Outlet />
          {/* </myContext.Provider> */}
        </Stack>
      </Box>
      
    </>
  )
}

export default Home