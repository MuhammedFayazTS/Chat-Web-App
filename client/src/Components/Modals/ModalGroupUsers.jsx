import React, { useContext, useEffect, useState } from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { IconButton, Stack, TextField, Tooltip } from '@mui/material';
import {  useSelector } from 'react-redux';
import { addUsersToGroupAPI, fetchGroupUsersAPI, fetchGroupsSearchAPI, getGroupAdminAPI, getGroupUsersAPI, getNotGroupUsersAPI, removeUsersFromGroupAPI, setGroupAdminAPI } from '../../Services/allAPIs';
import UserAvatar from '../Users/UserAvatar';
import { grey, yellow } from '@mui/material/colors';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import {toast} from 'react-toastify'
import { toastConfig } from '../../utils/toastConfig';
import { X } from '@phosphor-icons/react';
import { loaderContext } from '../../Context/loaderContext';
import { myContext } from '../../Context/myContext';

function ModalGroupUsers({open,handleClose,chatId}) {
    const { refresh, setRefresh } = useContext(myContext);
    const {loaded,setLoaded} = useContext(loaderContext) //for loader display
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

      const [groupUsers,setGroupUsers] = useState([])
      const [search,setSearch] = useState('')
      const [admin,setAdmin] = useState('')

    
    // fetch users in groups
    const fetchGroupUsers = async()=>{
      const result = await getGroupUsersAPI(chatId)
      if(result.status == 200){
        setGroupUsers(result.data)
      }
    }

    const handleRemoveFromGroup = async(id)=>{
      let data = { chatId,userId:id}
      const result = await removeUsersFromGroupAPI(data)
      if(result.status == 200){
          toast.success("User removed successfully",toastConfig)
          setRefresh(!refresh)
          
        }else{
            toast.error("failed to remove user",toastConfig)
        }
    }
    
    const handlesetAdmin = async(id)=>{
        let data = { chatId,userId:id}
        setLoaded(true)
      const result = await setGroupAdminAPI(data)
      if(result.status == 200){
          setLoaded(false)
          toast.success("Admin changed successfully",toastConfig)
          handleClose()
          setRefresh(!refresh)
          
        }else{
            handleClose()
            setLoaded(false)
            toast.error(result.request.response?result.request.response.split('"').join(''):"failed to change admin user",toastConfig)
      }
    }

    const getAdminUser = async ()=>{
        const result = await getGroupAdminAPI(chatId)
        if(result.status == 200){
          setAdmin(result.data)
        }
      }

    //   fetch users
    useEffect(()=>{
        getAdminUser();
        fetchGroupUsers();
    },[refresh,chatId])

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
          <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography id="transition-modal-title" variant="h6" component="h2">
                Group Users list 
              </Typography>
              <IconButton onClick={handleClose}>
                <X size={20} />
            </IconButton>
             
          </Stack>

          <Stack >    
                        {/* search field */}
                        {/* <TextField variant={lightTheme?'outlined':'filled'}    label='user name'
                        InputProps={{
                          style:{color:lightTheme?'#1C1C1C':'#EBEBEB'}
                        }}
                        InputLabelProps={{
                          style: {
                            color:lightTheme? '#7A7A7A' :'#858585 '
                          } }} 
                        sx={{mt:2,outlineColor:lightTheme?'':'#fff',bgcolor:lightTheme?'':'#1C1C1C'}} 
                        onChange={(e)=>setSearch(e.target.value)} /> */}

                    <Stack className='modalUserContainer' direction={'column'} spacing={2} mt={2} sx={{overflowY:'scroll'}} pe={.1} py={2} maxHeight={'50vh'} >
                    {   
                      groupUsers.length>0 && groupUsers.map((user,index) => (
                        <Stack key={index} direction={'row'} alignItems={'center'} gap={1} px={'5%'} py={'3%'} width={'100%'} borderRadius={3} 
                        bgcolor={lightTheme?grey[200]:'#1C1C1C'}
                          boxShadow={lightTheme?' rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px':'none'} >
                          <UserAvatar  uName={user.name} pfp={user.pfp?user.pfp:''} noBadge isOnline />
                          <Typography  variant='h6' color={lightTheme?grey[700]:'#f5f5f7'}>{user.name}</Typography>

                          <Stack direction={'row'} alignItems={'center'} ml={'auto'} spacing={1}>

                            {admin._id === user._id &&
                             <Tooltip title='Admin' ><LockPersonIcon sx={{color:yellow[800]}}/></Tooltip>
                             }

                              {admin._id !== user._id &&
                                <IconButton  onClick={(e)=>handlesetAdmin(user._id)}  >
                                <Tooltip title='set admin'>
                                    <AdminPanelSettingsIcon sx={{ color: '#999999', ":hover": { color: grey[700] } }} />
                                </Tooltip>
                                </IconButton>}
    
                              {admin._id !== user._id &&
                                <IconButton  onClick={(e)=>handleRemoveFromGroup(user._id)}  >
                                <Tooltip title='Remove user'>
                                <PersonRemoveIcon sx={{ color: '#999999', ":hover": { color: grey[700] } }} />
                                </Tooltip>
                                </IconButton>
                                }
                          </Stack>

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

export default ModalGroupUsers