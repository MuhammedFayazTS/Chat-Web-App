import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useState } from 'react';
import { isAdminContext } from './Context/DialogContext';
import { useSelector } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

function DialogBox({setDialogOpen,dialogOpen,handleConfirm}) {
   
  const {isAdmin,setIsAdmin} = React.useContext(isAdminContext) //for checking if the user is group admin
  const lightTheme = useSelector(state=>state.themeKey) // for dark and light themes


  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
             <Dialog
        open={dialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        sx={{
          bgcolor: 'rgba(0,0,0,0.3)',
          backdropFilter:'blur(3px)'
        }}
        PaperProps={{
          style: {
            backgroundColor: lightTheme?"#EBEBEB":'#262626',
            color: lightTheme?'#1c1c1c':'#D6D6D6'
          },
        }}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Exit Group?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" color={lightTheme?'#1c1c1c':'#ADADAD'}>
           {isAdmin?"Are you sure you want to exit this group? As the admin of the group, this action will result in deleting the group.":"Are you sure you want to exit from this group"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleConfirm}>Agree</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DialogBox