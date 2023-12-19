import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack } from '@mui/material'
import React, { useContext } from 'react'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import AttachmentIcon from '@mui/icons-material/Attachment';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { useSelector } from 'react-redux';
import { myContext } from '../../Context/myContext';


function MessageInputBox({show,setShow,setMessageContent,sendMessage}) {
  const lightTheme = useSelector(state=>state.themeKey)
  const { refresh, setRefresh } = useContext(myContext); 

  return (
    <>
        <FormControl sx={{ m: 1, width: '100%' }} variant="filled">
          <OutlinedInput
          onChange={(e)=>setMessageContent(e.target.value)}
          onKeyDown={(event) => {
            if (event.code == "Enter") {
              console.log(event);
              sendMessage();
              setMessageContent("");
              setRefresh(!refresh);
            }}}
            id="outlined-adornment-weight"
            aria-describedby="outlined-weight-helper-text"
            placeholder='message..'
            sx={{color:lightTheme?'#525252':'#D9D9D9',bgcolor:lightTheme?'#f5f5f7':'#262626'}}
            inputProps={{
              'aria-label': 'weight',
            }}
            endAdornment={
              <InputAdornment position="end">
                <Stack  direction={'row'} mr={.3} >
                    <IconButton   size='small'><AttachmentIcon sx={{color:lightTheme?'#525252':'#D9D9D9'}} /></IconButton>
                    <IconButton size='small' onClick={()=>setShow(!show)}><InsertEmoticonIcon sx={{color:lightTheme?'#525252':'#D9D9D9',display:{xs:'none',md:'block'}}} /></IconButton>
                </Stack>
                <Button 
                onClick={()=>{sendMessage()
                 setMessageContent("")
                 setRefresh(!refresh)}}  variant='contained'>Send<SendRoundedIcon fontSize='small' sx={{ml:.3}} /></Button>
              </InputAdornment>
            }
          />
        </FormControl>
    </>
  )
}

export default MessageInputBox