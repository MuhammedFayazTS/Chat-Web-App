import { Box, Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'

function ActiveInActive({isActive}) {
  const lightTheme = useSelector(state=>state.themeKey)
  return (
    <>
        <Box  bgcolor={isActive?'#ADEBAD':'#FFDC73'} width={isActive?72:78} height={21} display={"flex"} justifyContent={'center'} alignItems={'center'} borderRadius={1.3} >
            <Typography color={isActive?'#47D247':'#E6AC00'} variant='p' fontSize={12}>{isActive?'Online':'Offline'}</Typography>
         </Box>
    </>
  )
}

export default ActiveInActive