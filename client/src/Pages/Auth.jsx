import {  Container} from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'

function Auth() {
  return (
    <>
      {/* <Stack  width={'100%'} height={'100vh'} justifyContent={'center'} alignItems={'center'} px={{xs:'0%',md:'10%'}} py={{xs:'0%',md:'4%'}}  
      bgcolor={'#EBEBEB'} > */}
        <Container >
          <Outlet />
        </Container>
      {/* </Stack> */}
    </>
  )
}

export default Auth