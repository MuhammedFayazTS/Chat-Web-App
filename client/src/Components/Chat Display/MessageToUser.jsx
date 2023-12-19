import React, { useContext, useEffect, useState } from 'react'
import {  Box, IconButton, Stack, Typography } from '@mui/material'
import { green, grey } from '@mui/material/colors'
import { useSelector } from 'react-redux'
import UserAvatar from '../Users/UserAvatar'
import { AnimatePresence, motion } from 'framer-motion'
import { DateFormat, timeFormat } from '../../utils/TimeFormat'
import moment from 'moment'
import { CaretDown } from '@phosphor-icons/react'
import { fetchUserPfpAPI, fetchreactToMessageAPI, reactToMessageAPI } from '../../Services/allAPIs'
import MenuComponent from './MenuComponent'
import { myContext } from '../../Context/myContext'


function MessageToUser({message,uName,timeStamp,isGroup,msgID,reaction,socket,userId}) {
  const lightTheme = useSelector(state=>state.themeKey)
  const { refresh, setRefresh } = useContext(myContext);
  const [loaded, setloaded] = useState(false)
  const [pfp, setpfp] = useState('')

  const dateOrTime = (time)=>{
    if(DateFormat(time) === DateFormat(moment()))
    {
      return timeFormat(time)
    }else{
      return DateFormat(time)
    }
  }
  const colors = lightTheme?'#D8D8D8':'#393939'

  // for side button
  const iconVariants = {
    default: { opacity: 0 },
    hover: { opacity: 1 },
  }
  // for emojis button
  const emojiVariants = {
    default:{scale:2,opacity:0},
    hover:{scale:1,opacity:1,cursor:'pointer'}
  }

  
  const [reactionContent, setreactionContent] = useState('')
  // react to msg
  const reactToMessage = async(reactContent)=>{
    setreactionContent(reactContent);
  //   socket.emit("reactToMessage", { messageId: msgID, reactionEmoji: reactContent })

  //    // Handle server responses if necessary
  // socket.on('reactionSuccess', (data) => {
  //   console.log('Reaction added successfully:', data.message);
  //   // Update UI or perform actions accordingly
  //   setRefresh(!refresh);
  // });

  // socket.on('reactionError', (data) => {
  //   alert(`Error: ${data.message}`);
  //   // Handle error scenario if needed
  // });
    setloaded(false)
    const result = await reactToMessageAPI(msgID,reactContent);
    if(result.status == 200){
      setloaded(true)
      setRefresh(!refresh)
    }else{
      setloaded(true)
    }
  }

  // menu

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  // fetch reaction of message
  const fetchreactToMessage = async()=>{
    const result = await fetchreactToMessageAPI(msgID);
    if (result.status == 200){
      setreactionContent(result.data.reaction)
    }
  }

  const fetchUserPFP = async()=>{
    if(isGroup){
      const result = await fetchUserPfpAPI(userId)
      if(result.status == 200){
        setpfp(result.data)
      }
    }
  }

  useEffect(() => {
    // fetchreactToMessage()
    fetchUserPFP();
  }, [refresh])
  

  return (
    <>
            <Stack direction={'row-reverse'}  alignSelf={'end'} alignItems={'center'}  spacing={1}>
            
            <Box display={isGroup ?'block':'none'}  sx={{alignSelf:'flex-start',pt:.3}} >
              <UserAvatar width={"1.8rem"} height={"1.8rem"} uName={uName} pfp={pfp?pfp:''} noBadge  />
            </Box>

            <motion.div
            // onDoubleClick={(e)=>{
            //   reactToMessage("❤️")}} 
            style={{display:'flex',direction:'row',alignItems:'center'}} initial="default" whileHover="hover" transition={{duration:.3,type:'tween'}} >

                      {/* <motion.div variants={iconVariants} transition={{duration:0.3,type:'tween'}}>
                        <IconButton 
                         id="demo-positioned-button"
                         aria-controls={open ? 'demo-positioned-menu' : undefined}
                         aria-haspopup="true"
                         aria-expanded={open ? 'true' : undefined}
                         onClick={handleClick}
                        color='primary'   ><CaretDown color={lightTheme?grey[700]:grey[500]} size={18} /></IconButton>
                        <MenuComponent   anchorEl={anchorEl} open={open} handleClose={handleClose} />
                      </motion.div> */}
             
                <Stack
                 direction={'column'} alignItems={'start'} position={'relative'}>
                    <Stack minWidth={75} bgcolor={lightTheme?'#D8D8D8':'#393939'} position={'relative'}
                     sx={{"::before":{content:'""',position:'absolute',top:0,right:-5.5,width:'12px',height:'12px',
                     background:`linear-gradient(135deg,${colors} 0%,${colors} 50%,transparent 50%,transparent)`}}}
                     borderRadius={2} p={.8} maxWidth={{xs:300,md:600}} height={'auto'} direction={'column'}  flexWrap={'wrap'} >
                        <Typography px={1}  variant='p' color={lightTheme?grey[700]:grey[300]} textAlign={'end'} maxWidth={'100%'} sx={{wordWrap:'break-word'}} >{message}</Typography>
                      <Typography variant='body2'mt={.2} textAlign={'start'} fontSize={6.5}   color={grey[600]}  >{dateOrTime(timeStamp)}</Typography>
                    
                     <Box   sx={{position:'absolute',left:-10,bottom:-8}}>
                        {/* {!reaction?
                          <motion.div onClick={(e)=>{reactToMessage("😊")}} 
                            variants={emojiVariants} whileTap={{scale:1.3,cursor:'pointer'}}  transition={{duration:0.3,type:'spring'}} >
                        ❤️
                      </motion.div>
                      : */}
                        <motion.div onClick={(e)=>{reactToMessage("😊")}}
                        style={{
                          MozUserSelect: 'none',
                          WebkitUserSelect: 'none',
                          msUserSelect: 'none',
                          userSelect: 'none'
                      }}
                          initial={{scale:1}}  whileHover={{scale:1.3,cursor:'pointer'}} whileTap={{scale:1.3,cursor:'pointer'}}  transition={{duration:0.3,type:'spring'}} >
                        {loaded?reaction:reactionContent}
                      </motion.div>
                      {/* } */}

                      </Box>


                      

                    </Stack>
                </Stack>

            </motion.div>
                   

            </Stack>
    </>
  )
}

export default MessageToUser