/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Collapse, IconButton, Stack, TextField } from '@mui/material';
import UserAvatar from '../Users/UserAvatar';
import { grey } from '@mui/material/colors';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import { useNavigate } from 'react-router-dom';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useSelector } from 'react-redux';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { addModalContext } from '../../Context/addModalContext';
import { accessChat, createGroupChat,  fetchGroupsSearchAPI, fetchAllUsersAPI } from '../../Services/allAPIs';
import { toast } from 'react-toastify';
import { myContext } from '../../Context/myContext';


function ModalAdd({open,setOpen,isGroups}) {
  const { refresh, setRefresh } = useContext(myContext);
  const [loadingData, setLoadingData] = useState(false)
  const { setOpenModal} = useContext(addModalContext);
  const handleClose = () => {
    setOpen(false)
    setOpenModal(false)
    setGroupUsers([])
    setSearch('')
  };
    const location = useNavigate()
    const userData = JSON.parse(localStorage.getItem("userData"))
    const [search,setSearch] = useState('')
    const [searchText,setSearchText] = useState('')
    const [users,setUsers]= useState([])
    const [allUsers,setAllUsers] = useState([])
    const [groupName,setGroupName] = useState('')
    const [groupUsers,setGroupUsers] = useState([])
    const [collapse,setCollapse] = useState(false)
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


  if(!userData){
    //('Not authenticate')
 window.location.replace('/not-authenticated')
}


const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchText.toLowerCase()));
const filteredAllUsers = allUsers.filter(user => user.name.toLowerCase().includes(searchText.toLowerCase()));

// access chat api call or connection add 
const handleAccessChat = async(userId)=>{
  const result = await accessChat(userId);
  if(result.status == 200){
    toast.success("Connection added successfully")
    setRefresh(!refresh)
  }
  handleClose()
}
// create group functionality
const handleCreateGroup = async() =>{
  const user = userData?.data;
  // Convert groupUsers to an array of user IDs
          const usersArray = groupUsers.map(user => user._id);
        const groupData = {
          name: groupName,
          users:JSON.stringify(usersArray) 
      };
      const result =  await createGroupChat(groupData)
      if(result.status == 200){
        setRefresh(!refresh)
        location('/app/groups')   
      }  else{
        toast.error("Cannot create group")
      }
      handleClose();
    }
// fetch groupswith search functionality
const fetchGroupSearch = async()=>{
  const result = await fetchGroupsSearchAPI(search)
  if(result.status == 200){
        setUsers(result.data)
  }
}
const fetchAllUsers = async()=>{
  setLoadingData(true)
  const result = await fetchAllUsersAPI(searchText);
  if(result.status == 200){
  setLoadingData(false)
  setAllUsers(result.data)
}else{
  setLoadingData(false)
}
}

      useEffect(()=>{
          fetchGroupSearch();
          fetchAllUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        },[search,searchText,refresh])

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
            {isGroups? 'Create Groups' : 'Add User' }
          </Typography>
            {
                !isGroups?
               //USERS ADD SECTION
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
                      users.length>0?users.map((user,index) => (
                        <Stack key={index} direction={'row'} alignItems={'center'} gap={1} px={'5%'} py={'3%'} width={'100%'} borderRadius={3} 
                        bgcolor={lightTheme?grey[200]:'#1C1C1C'}
                          boxShadow={lightTheme?' rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px':'none'} >
                          <UserAvatar  uName={user.name} pfp={user.pfp?user.pfp:''} noBadge isOnline />
                          <Typography  variant='h6' color={lightTheme?grey[700]:'#f5f5f7'}>{user.name}</Typography>
                          <IconButton sx={{ ml: 'auto' }} onClick={(e)=>handleAccessChat(user._id)}><PersonAddAltRoundedIcon sx={{ color: '#999999', ":hover": { color: theme=>theme.palette.primary.main } }} /></IconButton>
                        </Stack>
                        )
                    ) :
                    <Typography variant='body1'>No other users found</Typography>
                  }
                    </Stack>
                   
                </Stack>
                ://GROUP Create Section
                <Stack spacing={2} my={1} >
                  <TextField variant={lightTheme?'outlined':'filled'}  
                  label='create a Group' 
                  InputProps={{
                    style:{color:lightTheme?'#1C1C1C':'#EBEBEB'}
                  }}
                  InputLabelProps={{
                    style: {
                      color:lightTheme? '#7A7A7A' :'#858585 '
                    } }} 
                  sx={{mt:2,outlineColor:lightTheme?'':'#fff',bgcolor:lightTheme?'':'#1C1C1C'}}  
                   onChange={(e)=>setGroupName(e.target.value)} />
                  <Button variant='contained' onClick={handleCreateGroup}>Create</Button>
                  {/* users display section */}
                  <Stack direction={'row'} gap={1} flexWrap={'wrap'}>
                    <Typography variant='p' sx={{bgcolor:lightTheme?'#9AE6B1':'#4FD377',py:1.2,px:2,borderRadius:5}} color={'#444'} fontSize={15} >You</Typography>
                    {groupUsers.map((user,index)=>(
                      <Typography key={index}  variant='p' sx={{bgcolor:lightTheme?'#E0E0E0':'#5C5C5C',py:1.2,px:2,borderRadius:5}} fontSize={15} >{user.name}
                      <IconButton sx={{width:14,height:14}} onClick={()=>{
                        setUsers([...users,user])
                        setGroupUsers(groupUsers.filter((item)=>item.name!=user.name))
                        }}>
                        <CloseRoundedIcon sx={{fontSize:14,ml:1,color:lightTheme?grey[700]:grey[400]}} />
                      </IconButton>
                      </Typography>
                    ))}
                  </Stack>
                    <Stack direction={'row'} alignItems={'center'}>
                      <Typography variant='p'>Available Users</Typography>
                      <IconButton onClick={()=>setCollapse(!collapse)} sx={{ml:'auto'}}>
                        {
                        collapse?
                          <ExpandLessIcon sx={{color:lightTheme?'#3D3D3D':'#858585'}} />
                        : <ExpandMoreIcon sx={{color:lightTheme?'#3D3D3D':'#858585'}} />}
                      </IconButton>
                    </Stack>
                  <Collapse in={collapse}>
                    <Stack className='modalUserContainer' direction={'column'} spacing={2}  sx={{overflowY:'scroll'}} pe={.1} pb={1} maxHeight={'40vh'} >
                        {/* search bar */}
                    <TextField variant={lightTheme?'outlined':'filled'}  label='User name' 
                    InputProps={{
                      style:{color:lightTheme?'#1C1C1C':'#EBEBEB'}
                    }}
                    InputLabelProps={{
                      style: {
                        color:lightTheme? '#7A7A7A' :'#858585 '
                      } }} 
                    sx={{mt:2,outlineColor:lightTheme?'':'#fff',bgcolor:lightTheme?'':'#1C1C1C'}} 
                    size='small' onChange={(e)=>setSearchText(e.target.value)} />
                    {   
                        allUsers.length>0 ? allUsers.map((user,index) => (
                          <Stack key={index} direction={'row'} alignItems={'center'} gap={1} px={'5%'} py={'3%'} width={'100%'} borderRadius={3} 
                          bgcolor={lightTheme?grey[200]:'#1C1C1C'}
                          boxShadow={lightTheme?' rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px':'none'} >
                            <UserAvatar isGroup uName={user.name} pfp={user.pfp?user.pfp:''} noBadge isOnline />
                            <Typography variant='h6' color={lightTheme?grey[700]:grey[300]}>{user.name}</Typography>
                            <IconButton sx={{ ml: 'auto' }} 
                              onClick={() => {
                                const userId = user._id;
                                // Check if the user ID is already in groupUsers
                                const isUserInGroup = groupUsers.some(item => item._id === userId);
                                if (!isUserInGroup) {
                                  // Add the user to groupUsers if not already present
                                  setGroupUsers(prevUsers => [...prevUsers, { name: user.name, _id: userId }]);
                                  setUsers(users.filter(item => item._id !== userId))
                                }
                              }}>
                              <PersonAddAltRoundedIcon sx={{ color: lightTheme?'#999999':grey[400], ":hover": { color:lightTheme?grey[700]:grey[100] } }} /></IconButton>
                          </Stack>
                          )
                      ):
                      loadingData?
                      <Typography variant="body2">loading...</Typography>
                      :
                      <Typography variant="body2">No other users found</Typography>
                      }
                    </Stack>
                  </Collapse>
                </Stack>
            }
        </Box>
      </Fade>
    </Modal>
  </>
  )
}

export default ModalAdd