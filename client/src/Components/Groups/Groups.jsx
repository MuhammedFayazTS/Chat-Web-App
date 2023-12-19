import React from 'react'
import {Box, Stack} from "@mui/material";
import { grey } from "@mui/material/colors";
import BottomNavBar from "../Navigations/BottomNavBar";
import UserStausDisplay from "../Common Components/UserStausDisplay";
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import UsersOrGroupsContainer from '../Common Components/UsersOrGroupsContainer';

function Groups() {
  const lightTheme = useSelector(state=>state.themeKey)


  return (
    <>
    {/* <Stack flex={{xs:1,md:0.4}} direction={"column"} bgcolor={grey[100]}> */}
    <Stack flex={1} direction={"row"}>
      {/* available users display stack */}
      <Stack flex={{xs:1,md:0.4}} direction={"column"} bgcolor={lightTheme?grey[100]:'#1D1D1D'}>
        {/*user self details display  */}
        <UserStausDisplay  />
        {/*available users list component */}
        <UsersOrGroupsContainer isGroups={true} />
        {/* <SpeedDialComponent/> */}
        {/* bottom nav for mobile devices */}
        <BottomNavBar />
      </Stack>
      {/* available users display stack  end*/}

    {/* chat area display */}
    {/* <ChatArea /> */}
    {/*group profile display */}
    {/* <ProfileSection view={true} isGroups={true}  /> */}
    <Box flex={{xs:0,md:1}} display={{xs:'none',md:'block'}} bgcolor={lightTheme?'#e8e8e8':'#171717'}>
          <Outlet/>
    </Box>
    <Box  display={{xs:'block',md:'none'}}  >
          <Outlet/>
      </Box>


    </Stack>
  </>
  )
}

export default Groups