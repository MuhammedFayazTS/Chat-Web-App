import { Box, Stack, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import { CloudSun, MoonStars, Sun, SunHorizon } from '@phosphor-icons/react'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function Greetings() {
    const lightTheme = useSelector(state=>state.themeKey)
    const [greeting,setGreeting] = useState('')

    // const emojis = {
    //     'Good morning': <SunHorizon  size={22} weight="fill" />,
    //     'Good afternoon': <Sun   size={22} weight="fill" />,
    //     'Good evening': <CloudSun color='#1B82E6' size={22} weight="fill" />,
    //     'Good night': <MoonStars  size={22} weight="fill" />,
    //   };

    const emojis = {
      'Cheerful! A Bright and Beautiful Morning to You': '🌅', // Sunrise emoji for 'Cheerful! A Bright and Beautiful Morning to You'
      'Hello! Enjoy the Radiant Afternoon': <Sun size={22} weight="fill" />, // Sun emoji for 'Hello! Enjoy the Radiant Afternoon'
      'Welcome! Have a Peaceful Evening': '🌥️', // Partly cloudy emoji for 'Welcome! Have a Peaceful Evening'
      'Hi! Sweet Dreams': '✨', // Stars emoji for 'Hi! Sweet Dreams'
    };
    
    useEffect(() => {
      const currTime = moment();
      const currentHour = currTime.hour();
      
      let greetingMessage = '';
    
      if (currentHour >= 5 && currentHour < 12) {
        greetingMessage = 'Cheerful! A Bright and Beautiful Morning to You';
      } else if (currentHour >= 12 && currentHour < 17) {
        greetingMessage = 'Hello! Enjoy the Radiant Afternoon';
      } else if (currentHour >= 17 && currentHour < 21) {
        greetingMessage = 'Welcome! Have a Peaceful Evening';
      } else {
        greetingMessage = 'Hi! Sweet Dreams';
      }
      
      setGreeting(greetingMessage);
    }, []);
    

  return (
    <Stack direction={'row'} alignItems={'center'} spacing={.5} height={'auto'} color={lightTheme?'#D98C00':'#FEC11C'}>
      {emojis[greeting]}
      <Typography color={lightTheme?grey[800]:grey[500]} variant='body1' component={'span'} fontSize={20}>{greeting},</Typography>    
    </Stack>
    )
}

export default Greetings