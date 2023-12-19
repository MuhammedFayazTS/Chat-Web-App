import React from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeAccountAPI } from '../../Services/allAPIs';
import { toast } from 'react-toastify';
import { toastConfig } from '../../utils/toastConfig';
import { Fade } from '@mui/material';

function ConformDeleteAccount({open,setOpen,handleClose}) {
    const nav = useNavigate()
    const userData = JSON.parse(localStorage.getItem("userData"))

      const [dialogtext,setDialogText] = React.useState('Are you sure you want to delete your Account?')
  const [dialogTitle,setDialogTitle] = React.useState('Remove Account');
  
  const handleAgree = async(e) =>{
        e.preventDefault();
            const result = await removeAccountAPI(userData.data._id)
            if(result.status == 200){
                localStorage.removeItem('userData')
                nav('/')
            }else{
                console.log(result);
                toast.error("Failed to remove account",toastConfig)
            }
        }
    

  return (
    <React.Fragment>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {dialogtext}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleAgree}>Agree</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default ConformDeleteAccount