import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Backdrop, Box, Button, Fade, Stack, TextField, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import { editUserDetails } from '../../Services/allAPIs';
import { toast } from 'react-toastify';
import { toastConfig } from '../../utils/toastConfig';



function ModalEditUserDetails({open,setOpen}) {
    const userData = JSON.parse(localStorage.getItem("userData"))
    const lightTheme = useSelector(state=>state.themeKey)

    const {data} = JSON.parse(localStorage.getItem("userData"))
    // states
    const [userDetails,setUserDetails] = useState({username:data.name,email:data.email})

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
// for modal close
const handleClose = () => {
    setOpen(false)
  };
// for onchange textfield
const handleOnChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
}  

    // for uppdating details
    const handleUpdate = async (e) => {
        const user = {
            userId: data._id,
            username: userDetails.username,
            email: userDetails.email
        }
        const result = await editUserDetails(user);
        // eslint-disable-next-line eqeqeq
        if(result.status == 200){
            toast.success("user details updated successfully.")
             // Update 'data' with the new name and email from the result
        userData.data.name = result.data.name;
        userData.data.email = result.data.email;
        userData.data.updatedAt = result.data.updatedAt;

        // Update local storage with the modified 'data' object
        localStorage.setItem("userData", JSON.stringify(userData));
            handleClose()
        }
        else{
            toast.error(result.request.response?result.request.responseText.split('"').join(' '):"User details updation Failed.",toastConfig);
            handleClose()
            setUserDetails({username:data.name,email:data.email})
        }
    }


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
            Edit User details
          </Typography>

          <Stack spacing={2} my={2} alignItems={'center'}>
              <TextField
              variant={lightTheme?'outlined':'filled'}
              sx={{outlineColor:lightTheme?'':'#fff',bgcolor:lightTheme?'':'#1C1C1C'}} 
              inputProps={{style:{color:lightTheme?'#1C1C1C':'#EBEBEB'}}}
              InputLabelProps={{style:{color:lightTheme?'#1C1C1C':'#EBEBEB'}}}
              onChange={handleOnChange} value={userDetails.username} name='username' label='user name' fullWidth color='primary' />
              <TextField
              variant={lightTheme?'outlined':'filled'}
              sx={{outlineColor:lightTheme?'':'#fff',bgcolor:lightTheme?'':'#1C1C1C'}} 
              inputProps={{style:{color:lightTheme?'#1C1C1C':'#EBEBEB'}}}
              InputLabelProps={{style:{color:lightTheme?'#1C1C1C':'#EBEBEB'}}}
              onChange={handleOnChange} value={userDetails.email} name='email' label='email' fullWidth color='primary' /> 
              <Button onClick={handleUpdate} variant='contained'>Update</Button> 
          </Stack>         
        </Box>
      </Fade>
    </Modal>
    </>
  )
}

export default ModalEditUserDetails