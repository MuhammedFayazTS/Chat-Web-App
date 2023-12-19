import React, { useContext } from 'react'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { removeReactToMessageAPI } from '../../Services/allAPIs';
import { myContext } from '../../Context/myContext';


function MenuComponent
({handleClose,open,anchorEl,msgId}) {
  
  const { refresh, setRefresh } = useContext(myContext);
  const removeReaction = async(e)=>{
    const result = await removeReactToMessageAPI(msgId)
    if(result.status == 200){
      console.log("success");
      setRefresh(!refresh)
      handleClose()
    }
  }
  
  return (
    <>
        <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={(e)=>removeReaction(e)}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </>
  )
}

export default MenuComponent
