/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { IconButton, Stack, TextField } from '@mui/material';
import {  useSelector } from 'react-redux';
import { addUsersToGroupAPI,getNotGroupUsersAPI } from '../../Services/allAPIs';
import UserAvatar from '../Users/UserAvatar';
import { grey } from '@mui/material/colors';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import {toast} from 'react-toastify'
import { toastConfig } from '../../utils/toastConfig';
import { myContext } from '../../Context/myContext';

function ModalAddUsersGroup({open,handleClose,chatId}) {
  const { refresh, setRefresh } = useContext(myContext);
    const lightTheme = useSelector(state=>state.themeKey)
    const style = {
        background: lightTheme?'#ffffff':'#121212',
        color:lightTheme?'#1C1C1C':'#EBEBEB',
          borderRadius: '0.5em',
          boxShadow: '0 10px 20px rgba(black, 0.2)',
          border:lightTheme?'none':'1.5px solid #2A2A2A',
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

      const [users,setUsers] = useState([])
      const [search,setSearch] = useState('')
    
    // fetch users in groups
    const fetchGroupUsers = async()=>{
      const result = await getNotGroupUsersAPI(chatId)
      if(result.status == 200){
        setUsers(result.data)
      }
      else{
        toast.error("failed fetch users",toastConfig)
      } 
    }

    const handleAddToGroup = async(id)=>{
      let data = { chatId,userId:id}
      const result = await addUsersToGroupAPI(data)
      if(result.status == 200){
        toast.success("User added successfully",toastConfig)
        setRefresh(!refresh)
        
      }else{
        toast.error("failed to add user",toastConfig)
      }
    }

    

    //   fetch users
    useEffect(()=>{
        fetchGroupUsers();
    },[refresh])
    
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
            Add user to Group.
          </Typography>

          <Stack >    
                        {/* search field */}
                        <TextField variant={lightTheme?'outlined':'filled'}    label='user name'
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
                      users.length>0 ? users.map((user,index) => (
                        <Stack key={index} direction={'row'} alignItems={'center'} gap={1} px={'5%'} py={'3%'} width={'100%'} borderRadius={3} 
                        bgcolor={lightTheme?grey[200]:'#1C1C1C'}
                          boxShadow={lightTheme?' rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px':'none'} >
                          <UserAvatar  uName={user.name} pfp={user.pfp?user.pfp:''} noBadge isOnline />
                          <Typography  variant='h6' color={lightTheme?grey[700]:'#f5f5f7'}>{user.name}</Typography>
                          <IconButton onClick={(e)=>handleAddToGroup(user._id)} sx={{ ml: 'auto' }} >
                            {/* <PersonAddAltRoundedIcon /> */}
                            <PersonAddAltRoundedIcon sx={{ color: '#999999', ":hover": { color: grey[700] } }} />
                            </IconButton>
                        </Stack>
                        )
                    ):
                    <Typography variant='body1'>No other users found</Typography>
                  }
                    </Stack>
                   
                </Stack>     
        </Box>
      </Fade>
    </Modal>
    </>
  )
}

export default ModalAddUsersGroup