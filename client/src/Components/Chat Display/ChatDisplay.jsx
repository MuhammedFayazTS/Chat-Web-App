import React, { useEffect, useState } from 'react'
import ChatArea from './ChatArea'
import ProfileSection from './ProfileSection'
import { Stack } from '@mui/material'
import { useSelector } from 'react-redux'
import Welcome from '../Common Components/Welcome'
import { useParams } from 'react-router-dom'

function ChatDisplay({isGroup}) {
    const [view,setView] = useState(false)
    const lightTheme = useSelector(state=>state.themeKey)
    const dyParams = useParams();
  const [chat_id, chat_user] = dyParams && dyParams._id ? dyParams._id.split("&") : ["", ""]; 
  

  return (
    <>
          <Stack flex={1} borderLeft={{xs:'',md:`1px solid ${lightTheme?'#DADADA':'#1a1a1a'}`}}  height={'100%'} position={{xs:'absolute',md:'static'}} sx={{top:0,left:0}} zIndex={5} width={'100%'} direction={'row'}> 

              {/* chat area display */}
              
              <ChatArea  view={view} setView={setView} isGroup={isGroup} />
              {/*group profile display */}
                <ProfileSection view={view} setView={setView} isGroup={isGroup} />
              

          </Stack>  
          
    </>
  )
}

export default ChatDisplay