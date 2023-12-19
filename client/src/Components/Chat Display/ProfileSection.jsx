import { Avatar, AvatarGroup, Box, Button, Grow, IconButton, Slide, Snackbar, Stack, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import React, { useContext, useEffect, useState } from 'react'
import ActiveInActive from '../Common Components/ActiveInActive'
// icons
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import {  useSelector } from 'react-redux';
import UserAvatar from '../Users/UserAvatar';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import DialogBox from '../../DialogBox';
import { clearChatAPI, getGroupUsersAPI, removeChat } from '../../Services/allAPIs';
import { toastConfig } from '../../utils/toastConfig';
import AlertDialogBox from '../Dialogs/AlertDialogBox';
import { loaderContext } from '../../Context/loaderContext';
import ModalEditGroup from '../Modals/ModalEditGroup';
import { ShareNetwork, UserList, UserPlus } from '@phosphor-icons/react';
import ModalAddUsersGroup from '../Modals/ModalAddUsersGroup';
import ModalGroupUsers from '../Modals/ModalGroupUsers';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import { myContext } from '../../Context/myContext';





function ProfileSection({view,setView,isGroup}) {
  const lightTheme = useSelector(state=>state.themeKey) // for dark and light themes
  const { refresh, setRefresh } = useContext(myContext);
  const navigate = useNavigate()
  const recieverDetails = useSelector(state=>state.recieverDetails)
  const [groupUsers,setGroupUsers] = useState([])
  const userData = JSON.parse(localStorage.getItem("userData"))
  const [grpEditModalOpen,setGrpEditModalOpen] = useState(false)
  const [dialogOpen,setDialogOpen] = useState(false) //for dialog box 
  const {loaded,setLoaded} = useContext(loaderContext) //for loading
  const [alertType,setAlertType] = useState('')
   // dynamic parameter from url
   const dyParams = useParams();
   const [chat_id, chat_user] = dyParams && dyParams._id ? dyParams._id.split("&") : ["", ""]; 

   const handleGroupExit = async()=>{
     const chatId = chat_id;
     const userId= userData.data._id;
     const config = {
       headers:{
         Authorization:`Bearer ${userData.data.token}`
        }
      }
      await axios.post('http://localhost:5000/chat/exitgroup',{ chatId, userId },config)
      .then(
        // Update the state after the API call is successful
        setRefresh(prevRefresh => !prevRefresh),
        navigate('/app/groups'),
        toast.success('Exited from group',toastConfig ),
        )
  }

  // dialog open functionality
  const handleDialogOpen =(e)=>{
    e.preventDefault();
    setDialogOpen(true)
  }
  
  // dialog confirm functionality
  const handleConfirm = (e)=>{
    e.preventDefault();
    handleGroupExit();
  }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchGroupUsers = async()=>{
  if(isGroup){
    const result = await getGroupUsersAPI(chat_id)
    if(result.status == 200){
      setGroupUsers(result.data);
    }
    else{
      toast.error("Cannot fetch  users",toastConfig)
    }
  }
  }

  // remove single chat
  const handleRemoveSingleChat = async(e)=>{
    e.preventDefault();
    setLoaded(true)
    const result = await removeChat(chat_id);
    if(result.status == 200){
      setLoaded(false)
      setRefresh(!refresh)
      toast.success("Successfully removed chat",toastConfig)
      navigate('/app/users')
    }else{
      setLoaded(false)
      toast.error("Failed to remove Chat",toastConfig)
    }
  }

  // handle clear chat
  const handleClearChat = async(e)=>{
    e.preventDefault()
    setLoaded(true)

    const result  = await clearChatAPI(chat_id);
    
    if(result.status == 200){
      setLoaded(false)
      setRefresh(!refresh)
      toast.success("Successfully cleared chat",toastConfig)
    }else{
        setLoaded(false)
        toast.error("Failed to clear chat",toastConfig)
      }
  }

  useEffect(()=>{
    fetchGroupUsers()
  },[groupUsers,refresh])


  // for dialog open and close
  const [openAlertDialog, setOpenAlertDialog] = React.useState(false);

  const handleClickOpen = (type) => {
    if(type === 'clearChat'){
      setAlertType('clearChat')
    }else{
      setAlertType('closeChat')
    }
    setOpenAlertDialog(true);
  };

  const handleClose = () => {
    setOpenAlertDialog(false);
  };

  // for group edit modal
  const handleOpenEditModal = () => {
    setGrpEditModalOpen(true)
  }
  const handleCloseEditModal = () => {
    setGrpEditModalOpen(false)
  }
  
  
  // add users to group modal
  const [openGroupUserAdd,setOpenGroupUserAdd] = useState(false)
  // for open and close
  const handleOpenGroupUserAdd = () => {
    setOpenGroupUserAdd(true)
  }
  const handleCloseGroupUserAdd = () => {
    setOpenGroupUserAdd(false)
  }
  
  // group Users list modal open
  const [openGroupUsersModal,setOpenGroupUsersModal] = useState(false)
  // for open and close
  const handleOpenGroupUsersModal = () => {
    setOpenGroupUsersModal(true)
  }
  const handleCloseGroupUsersModal = () => {
    setOpenGroupUsersModal(false)
  }

  // copy to clip board  -- share button
  const [isCopied, setIsCopied] = useState(false);

  // This is the function we wrote earlier
  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(`http://localhost:5000/joinGroupChat/${chat_id}&${chat_user}`)
      .then(() => {
        // If successful, update the isCopied state value
        handleSnackBarOpen();
        setTimeout(() => {
          setIsCopied(false);
          handleSnackBarClose();
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // snack bar open close
  const [openSnackBar, setOpenSnackBAR] = React.useState(false);
  const [state, setState] = React.useState({
    vertical: 'bottom',
    horizontal: 'right',
  });
  const { vertical, horizontal } = state;


  const handleSnackBarOpen = () => {
    setOpenSnackBAR(true);
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackBAR(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSnackBarClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  

  return (
    <>
    {/* snack bar */}
    <Snackbar
    anchorOrigin={{ vertical, horizontal }}
        open={openSnackBar}
        autoHideDuration={1500}
        onClose={handleClose}
        message="Copied to clipboard"
        key={vertical + horizontal}
        action={action}
      />
    {/* alert dialog */}
    <AlertDialogBox open={openAlertDialog} handleClose={handleClose} handleClearChat={handleClearChat} handleRemoveSingleChat={handleRemoveSingleChat} type={alertType} />
    <DialogBox dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} handleConfirm={handleConfirm} />
    { isGroup &&
    <>
      <ModalEditGroup open={grpEditModalOpen} handleClose={handleCloseEditModal} chatId={chat_id} chatName={chat_user} />
      <ModalAddUsersGroup open={openGroupUserAdd} handleClose={handleCloseGroupUserAdd} chatId={chat_id} />
      <ModalGroupUsers open={openGroupUsersModal} handleClose={handleCloseGroupUsersModal} chatId={chat_id} />
    </>
    }

        {/* <Stack display={view?'block':'none'} flex={{xs:1,md:'.25'}} bgcolor={grey[100]} position={'relative'} pt={{xs:'5%',md:0}} pl={{xs:'5%',md:0}}> */}
        <Stack borderLeft={{xs:'',md:`1px solid ${lightTheme?'#DADADA':'#1a1a1a'}`}}
        flex={{xs:1,md:0.4}} display={view?'block':'none'} bgcolor={lightTheme?grey[100]:'#1D1D1D'} position={{xs:'fixed',md:'static'}} 
        top={0} left={0} pt={{xs:'5%',md:0}} pl={{xs:'5%',md:0}} width={'100%'} height={'100%'}>
         
         <Box 
         component={motion.div}
         initial={{x:100}}
         whileInView={{x:0}}
         transition={{duration:0.4,type:'spring'}}
         position={'relative'} height={'100%'}>

            <Stack direction={'column'} height={'100%'} position={'relative'} alignItems={'center'} pt={{xs:'10%',md:'30%'}} gap={1}>

            <UserAvatar key={chat_id} width={'6rem'} height={'6rem'} fs={'3rem'} uName={recieverDetails.name} pfp={recieverDetails.pfp} noBadge isOnline isGroup={isGroup} />

            {/* responce user name */}
            <Typography variant="p" my={0} color={lightTheme?grey[700]:grey[400]}>
              {recieverDetails.name}
              </Typography>
            {/* active */}
            {!isGroup && <ActiveInActive isActive={recieverDetails.isOnline} />}

           

            <Stack direction={'row'} justifyContent={'center'} spacing={2} my={2} >
                  
                    {/* {!isGroup &&
                      <Box width={33} height={33} color={'#EED8FF'} bgcolor={'#A251E1'} display={'flex'} justifyContent={'center'}
                    alignItems={'center'} borderRadius={'50%'} sx={{cursor:'pointer',":hover":{bgcolor:'#A251E1',color:'#EED8FF',transition: "background .500ms, color .500ms ease-in-out"}}} >
                    <CallOutlinedIcon sx={{width:20,height:20}}/>
                  </Box>}
                    
                    {!isGroup &&
                      <Box width={33} height={33} bgcolor={'#FFB906'} color={'#FDFAB2'} display={'flex'} justifyContent={'center'}
                    alignItems={'center'} borderRadius={'50%'} sx={{cursor:'pointer',":hover":{bgcolor:'#FFB906',color:'#FDFAB2',  transition: "background .500ms, color .500ms ease-in-out"}}} >
                      <VideocamOutlinedIcon sx={{width:20,height:20}} />
                  </Box>} */}


                 {isGroup && <Box component={IconButton} onClick={handleOpenGroupUsersModal}
                   width={36} height={36} bgcolor={'#E73074'} color={'#FBDAE7'} display={'flex'} justifyContent={'center'}
                   alignItems={'center'} borderRadius={'50%'} sx={{cursor:'pointer',":hover":{bgcolor:'#E41764',color:'#FCE7EF',  transition: "background .500ms, color .500ms ease-in-out"}}} >
                    <UserList size={20} />
                </Box>}
                  {isGroup &&<Box component={IconButton} onClick={handleOpenGroupUserAdd}
                   width={36} height={36} bgcolor={'#3ABD80'} color={'#DCF3E9'} display={'flex'} justifyContent={'center'}
                   alignItems={'center'} borderRadius={'50%'} sx={{cursor:'pointer',":hover":{bgcolor:'#23B571',color:'#E8F7F0',  transition: "background .500ms, color .500ms ease-in-out"}}} >
                    <UserPlus size={20} />
                </Box>}

                  {isGroup &&<Box component={IconButton} 
                  onClick={handleCopyClick}
                   width={36} height={36} bgcolor={'#2692FF'} color={'#D9ECFF'} display={'flex'} justifyContent={'center'}
                   alignItems={'center'} borderRadius={'50%'} sx={{cursor:'pointer',":hover":{bgcolor:'#0D85FF',color:'#D9ECFF',  transition: "background .500ms, color .500ms ease-in-out"}}} >
                    <ShareNetwork size={20} />
                </Box>}
                
            </Stack>

          
          {/* for displaying users in group */}
          {
            // eslint-disable-next-line eqeqeq
            isGroup  && groupUsers != [] &&
            <Box >
            <Typography variant='p' fontSize={16}textAlign={'center'} color={lightTheme?'#707070':'#D6D6D6'}>Users</Typography>
            <AvatarGroup  max={3} total={groupUsers.length} sx={{my:2}}>
              {groupUsers.map((item,index)=>(
              <Avatar key={index} alt={item.name.slice(0,1)} src={item.pfp?item.pfp:''} > {item.name.slice(0,1)} </Avatar>
                ))}
              </AvatarGroup>
          </Box>
          }
              {isGroup ?
          // {/* for removing groups */}
          <Stack  sx={{my:'auto'}} spacing={1}>
                <Button onClick={handleOpenEditModal} color='info' variant='text' sx={{textTransform:'capitalize'}}>Rename Group </Button>
                <Button onClick={handleDialogOpen} color='error' variant='text' sx={{textTransform:'capitalize'}}>Exit Group <ClearRoundedIcon sx={{fontSize:18,ml:.2}}/></Button>
          </Stack>
          :
          <Stack  sx={{my:'auto'}} spacing={1}>
                <Button onClick={(e)=>handleClickOpen('clearChat')}  color='error' variant='text' sx={{textTransform:'capitalize'}}>Clear Chat<ClearRoundedIcon sx={{fontSize:18,ml:.2}}/></Button>
                <Button onClick={(e)=>handleClickOpen('closeChat')}  color='error' variant='text' sx={{textTransform:'capitalize'}}>Remove <ClearRoundedIcon sx={{fontSize:18,ml:.2}}/></Button>
          </Stack>
          }

           
          </Stack>
         
         <IconButton   onClick={()=>setView(false)}
            color='primary'
            sx={{
              width:35,height:35,
              position:'absolute',left:'5%',top:'50%',transform:'transform: translateX(50%)'}} >
            <ChevronRightRoundedIcon />
         </IconButton>
          
         </Box>

        </Stack>
    </>
  )
}

export default ProfileSection