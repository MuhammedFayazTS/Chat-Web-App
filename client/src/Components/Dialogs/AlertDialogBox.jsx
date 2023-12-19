import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useEffect } from 'react';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

function AlertDialogBox({open,handleClose,handleClearChat,handleRemoveSingleChat,type}) {
  
  const [dialogtext,setDialogText] = React.useState('Are you sure you want to clear the chat?')
  const [dialogTitle,setDialogTitle] = React.useState('Clear chat?');
  
  const handleAgree = (e) =>{
        e.preventDefault();
        if(type === 'clearChat'){
            handleClearChat(e);
            handleClose()
          }else{
            handleRemoveSingleChat(e);
            handleClose()
          }
        }
        
        useEffect(()=>{
          if(type === 'clearChat'){
            setDialogText('Are you sure you want to clear the chat?')
            setDialogTitle('Clear chat?')
            }else{
              setDialogText('Do you want to remove the connection?')
              setDialogTitle('Remove connection?')
            }

        },[type])
        
        return (
          <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
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

export default AlertDialogBox