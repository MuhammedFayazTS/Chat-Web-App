import { Backdrop, Box, Fade, IconButton,Stack, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import { Plus } from '@phosphor-icons/react';
import { useSelector } from 'react-redux';
import { fetchGroups, joinGroupChat } from '../../Services/allAPIs';
import Modal from '@mui/material/Modal';
import { grey } from '@mui/material/colors';
import UserAvatar from '../Users/UserAvatar';
import {toast} from 'react-toastify'
import { toastConfig } from '../../utils/toastConfig';
import { myContext } from '../../Context/myContext';



function ModalJoinGroup({open,setOpen}) {
  const lightTheme = useSelector(state=>state.themeKey)
  const { refresh, setRefresh } = useContext(myContext);
  const userData = JSON.parse(localStorage.getItem("userData"))
  const style = {
    background: lightTheme?'#ffffff':'#121212',
    color:lightTheme?'#1C1C1C':'#EBEBEB',
    border:lightTheme?'none':'1.5px solid #2A2A2A',
    borderRadius: '0.5em',
    boxShadow: '0 10px 20px rgba(black, 0.2)',
    left: '50%',
    maxWidth: '90%',
    // pointerEvents: 'none',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '30rem',
    textAlign:' left',
    maxHeight: '90vh',
    p:4
  };
  const [groups,setGroups] = useState([])
    const [search,setSearch] = useState("")

    if(!userData){
      //('Not authenticate')
   window.location.replace('/not-authenticated')
 }

    const fetchAllGroups = async()=>{
        const result = await fetchGroups();
        setGroups(result.data)
    }
    const isGroup = groups?.filter(group=>group.isGroupChat===true)
    const filteredGroup = isGroup?.filter(group => group.chatName.toLowerCase().includes(search.toLowerCase()));
    // for joining group functionality
    const joinGroup = async(groupId)=>{
      let groupChat = {chatId:groupId,userId:userData.data._id} 
      console.log(groupChat);
      const result = await joinGroupChat(groupChat)
      // eslint-disable-next-line eqeqeq
      if(result.status == 200){
        setRefresh(!refresh)
        toast.success('user joined the group.',toastConfig);
        handleClose()

      }
      else{
        toast.error(result.request.response?result.request.responseText.split('"').join(' '):"Failed to join the group",toastConfig );
        handleClose()
      }
    }

    useEffect(()=>{
        fetchAllGroups();
    },[open])

    const handleClose = () => {
        setOpen(false)
      };


  return (
    <>
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open} 
      onClose={handleClose}
      closeAfterTransition
      sx={{backdropFilter:'blur(2px)'}}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={style} >
          <Typography id="transition-modal-title" variant="h6" component="h2">
            Join Group Chat
          </Typography>
          <Stack>
              <TextField variant={lightTheme?'outlined':'filled'}    label='group name'
                            InputProps={{
                              style:{color:lightTheme?'#1C1C1C':'#EBEBEB'}
                            }}
                            InputLabelProps={{
                              style: {
                                color:lightTheme? '#7A7A7A' :'#858585 '
                              } }} 
                            sx={{mt:2,outlineColor:lightTheme?'':'#fff',bgcolor:lightTheme?'':'#1C1C1C'}} 
                            onChange={(e)=>setSearch(e.target.value)} />
              <Stack className='modalUserContainer' direction={'column'} spacing={2} mt={2} sx={{overflowY:'scroll'}} pe={.1} py={2} maxHeight={'50vh'} >
              {   
                          filteredGroup?.map((group,index) => (
                            <Stack key={index} direction={'row'} alignItems={'center'} gap={1} px={'5%'} py={'3%'} width={'100%'} borderRadius={3} 
                            bgcolor={lightTheme?grey[200]:'#1C1C1C'}
                              boxShadow={lightTheme?' rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px':'none'} >
                              <UserAvatar  uName={group.chatName} noBadge isOnline isGroup />
                              <Typography  variant='h6' color={lightTheme?grey[700]:'#f5f5f7'}>{group.chatName}</Typography>
                              <IconButton  onClick={()=>joinGroup(group._id)}
                               sx={{ ml: 'auto' }}>
                              <Plus size={20} style={{color: '#999999', ":hover": { color: grey[700] }}} weight="bold" />
                              </IconButton>
                            </Stack>
                            )
                )}
            </Stack>
          </Stack>
        </Box>
      </Fade>
    </Modal>
    </>
  )
}

export default ModalJoinGroup