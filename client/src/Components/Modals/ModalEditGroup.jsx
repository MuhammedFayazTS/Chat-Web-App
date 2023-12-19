/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {  Stack, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { editGroupAPI } from '../../Services/allAPIs';
import { toast } from 'react-toastify'; 
import { toastConfig } from '../../utils/toastConfig';
import { loaderContext } from '../../Context/loaderContext';
import { setRecieverDetails } from '../../Redux/Slices/recieverDetailsSlice';

function ModalEditGroup({open,handleClose,chatId,chatName}) {
  const [groupName,setGroupName] = useState('')
  const {loaded,setLoaded} = useContext(loaderContext) //for loader display
  const dispatch = useDispatch()
  const navigate = useNavigate()
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

      const handleOnChange = (e) => {
        setGroupName(e.target.value);
      }  

      // handle update changes
      const handleUpdate = async(e) => {
        e.preventDefault();
        setLoaded(true)
        let groupDetails = {
          chatId,groupName
        }
        const result = await editGroupAPI(groupDetails)
        if(result.status == 200){
          setLoaded(false)
          toast.success("Group details updated successfully",toastConfig)
          dispatch(setRecieverDetails({name:groupName,pfp:''}))
          navigate("/app/groups/chat/"+chatId+'&'+groupName)
          handleClose()
        }else{
          setLoaded(false)
          toast.error(
            result.request.response?result.request.response.split('"').join(''):
            "Cannot update group details",
            toastConfig)
          handleClose()
        }
      }


      // useEffect for group name
      useEffect(() => {
        setGroupName(chatName)
      },[chatName,open])
      

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
            Edit Group details
          </Typography>

          <Stack spacing={2} my={2} alignItems={'center'}>
              <TextField
              variant={lightTheme?'outlined':'filled'}
              sx={{outlineColor:lightTheme?'':'#fff',bgcolor:lightTheme?'':'#1C1C1C'}} 
              inputProps={{style:{color:lightTheme?'#1C1C1C':'#EBEBEB'}}}
              InputLabelProps={{style:{color:lightTheme?'#1C1C1C':'#EBEBEB'}}}
              onChange={handleOnChange} 
              value={groupName}
              name='groupname' label='group name' fullWidth color='primary' />
              <Button onClick={handleUpdate} variant='contained'>Update</Button> 
          </Stack>         
        </Box>
      </Fade>
    </Modal>
    </>
  )
}

export default ModalEditGroup