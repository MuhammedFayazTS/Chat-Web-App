import React from 'react'
import { Box, Typography } from '@mui/material'
import { Tilt } from 'react-tilt'
import Lottie from 'react-lottie-player/dist/LottiePlayerLight'
import lottieJson from '../../Assets/lotte_animation/msg.json'
import { grey } from '@mui/material/colors'
import {  useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion'

const array1 = ['G', 'U', 'T', 'W'];
const array2 = ['M', 'K', 'L', 'V'];
const array3 = ['S', 'Q', 'R', 'X'];
const array4 = ['B', 'A', 'C', 'Y'];
const array5 = ['F', 'E', 'D', 'Z'];
const array6 = ['I', 'H', 'J'];

const colors = [
  '#5D8AA8', '#0072B5', '#935529', '#1E90FF','#00A170', '#DE3163','#17B169',
]

// # Seven arrays with unique alphabets
const colorCheck = (name)=>{
  let alphabet =  name?.slice(0,1).toUpperCase();
  if(array1.includes(alphabet)){
      return colors[0]
  }else if(array2.includes(alphabet)){
      return colors[1]
  }else if(array3.includes(alphabet)){
      return colors[2]
  }else if(array4.includes(alphabet)){
      return colors[3]
  }else if(array5.includes(alphabet)){
      return colors[4]
  }else if(array6.includes(alphabet)){
      return colors[5]
  }else{
    return colors[6]
  }
}

const defaultOptions = {
	reverse:        false,  // reverse the tilt direction
	max:            35,     // max tilt rotation (degrees)
	perspective:    1000,   // Transform perspective, the lower the more extreme the tilt gets.
	scale:          1.1,    // 2 = 200%, 1.5 = 150%, etc..
	speed:          1000,   // Speed of the enter/exit transition
	transition:     true,   // Set a transition on enter/exit.
	axis:           null,   // What axis should be disabled. Can be X or Y.
	reset:          true,    // If the tilt effect has to be reset on exit.
	easing:         "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
}

function Welcome() {
  const lightTheme = useSelector(state=>state.themeKey)
  const userData = JSON.parse(localStorage.getItem("userData"));
  
  return (
    <AnimatePresence>
    <Box component={motion.div}
     initial={{ scale: .5, opacity: 0 }}
     animate={{ scale: 1, opacity: 1 }}
     exit={{ scale: 1.5, opacity: 0 }}
     transition={{duration:.5,type:'spring'}}
    flex={1} sx={{height:'100%'}}  display={{xs:'none',md:'flex'}} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}  gap={5}>
        <Tilt options={defaultOptions} style={{ height: '50%', width: '50%'}}>
        <Lottie
      loop
      animationData={lottieJson}
      play
      style={{ width: '100%', height: '100%' }}
    />
    </Tilt>

    <Typography variant='h4' color={lightTheme?grey[700]:grey[500]}>Welcome <Typography variant='span' color={colorCheck(userData.data.name)}>{userData.data.name}</Typography>👋</Typography>
        
    </Box>
    </AnimatePresence>
  )
}

export default Welcome