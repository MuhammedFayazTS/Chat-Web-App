import { Button, Container, Stack, Typography } from '@mui/material'
import React from 'react'
import Lottie from 'react-lottie-player'
import NotFoundJson from '../Assets/lotte_animation/404.json'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function NotFoundPage() {
  const nav = useNavigate()
  return (
    <>
      <Container>
      <Stack height={'100vh'}  justifyContent={'center'} alignItems={'center'} >
        <Lottie
          loop
          animationData={NotFoundJson}
          play
          style={{ width:{xs:'100%',md:'70%'},height:'auto'}}
        />
            <Button  variant='outlined' sx={{color:'#8550fb',borderColor:'#8550fb'}} onClick={()=>nav(-1)}>
             <ArrowBackIcon sx={{fontSize:16,mr:.3}} /> Return
            </Button>
      </Stack>
      </Container>
    </>  
  )
}

export default NotFoundPage