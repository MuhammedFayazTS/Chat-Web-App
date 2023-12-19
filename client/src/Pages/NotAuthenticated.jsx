import { Button,  Stack, Typography } from '@mui/material'
import React from 'react'
import Lottie from 'react-lottie-player'

import AccessDeniedJson from '../Assets/lotte_animation/403.json'

function NotAuthenticated() {
  return (
    <>
      <Stack height={'100vh'}  justifyContent={'center'} alignItems={'center'} >
        <Lottie
          loop
          animationData={AccessDeniedJson}
          play
          style={{ width: '60%',height:'auto'}}
        />
          <Typography variant='h3' fontFamily={'monospace'} color={'#666666'}  > Access Denied </Typography>
            <Button sx={{mt:3}} variant='contained' color='error' href='/'>Login or Register</Button>
      </Stack>
    </>
  )
}

export default NotAuthenticated