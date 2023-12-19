import { Avatar, Box, Paper, Stack, Typography, Zoom } from '@mui/material'
import { green, grey } from '@mui/material/colors'
import React from 'react'
import { useSelector } from 'react-redux'
import UserAvatar from '../Users/UserAvatar'
import { DateFormat, timeFormat } from '../../utils/TimeFormat'
import moment from 'moment'
import { motion } from 'framer-motion'

function MessageFromUser({message,uName,timeStamp,isGroup,pfp}) {
  const lightTheme = useSelector(state=>state.themeKey)

  const dateOrTime = (time)=>{
    if(DateFormat(time) === DateFormat(moment()))
    {
      return timeFormat(time)
    }else{
      return DateFormat(time)
    }
  }
  // const isGroup = 
  const colors = lightTheme?green[200]:'#50AC54'
  return (
    <>
    
          <Stack component={motion.div}
          whileHover={{scale:1.1}} transition={{duration:.3,type:'spring'}}
          direction={'row'} alignItems={'center'} alignSelf={'start'} spacing={1} >
          
          <Box  display={isGroup?'block':'none'} sx={{alignSelf:'flex-start',pt:.3}} >
              <UserAvatar width={'1.8rem'} height={'1.8rem'} uName={uName} pfp={pfp?pfp:''} isOnline noBadge />
          </Box>
  
              <Stack direction={'column'} alignItems={'end'} position={'relative'}>
                  <Stack minWidth={75} bgcolor={lightTheme?green[200]:'#50AC54'} position={'relative'}
                  sx={{"::before":{content:'""',position:'absolute',top:0,left:-5.5,width:'12px',height:'12px',
                  background:`linear-gradient(-135deg,${colors} 0%,${colors} 50%,transparent 50%,transparent)`}}}
                   borderRadius={2} p={.8} maxWidth={{xs:300,md:600}} height={'auto'} direction={'column'}  flexWrap={'wrap'}>
                      <Typography pl={1} textAlign={'left'} variant='p' color={lightTheme?grey[700]:grey[300]} maxWidth={'100%'} sx={{wordWrap:'break-word'}} >{message}</Typography>
                      <Typography variant='body2' fontSize={6.5} textAlign={'end'} justifySelf={'flex-end'}  color={lightTheme?grey[700]:grey[300]}  >{dateOrTime(timeStamp)}</Typography>
                  </Stack>
              </Stack>
          </Stack>
    </>
  )
}

export default MessageFromUser