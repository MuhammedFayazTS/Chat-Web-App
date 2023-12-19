import { Divider, IconButton, Stack } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
// icons
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import LinkedIn from '@mui/icons-material/LinkedIn';
import { grey } from '@mui/material/colors';


function CreatorDetails() {
    const lightTheme = useSelector(state=>state.themeKey)
    return (
        <>
            <Divider sx={{
                width: '100%', my: 2.5, typography: 'overline', color:
                    "text.disabled", "&::before,::after": {
                        borderTopStyte:
                            "dashed",
                    }
            }} >Creator</Divider>
            <Stack direction={'row'}  spacing={2} justifyContent={'center'}>
                        <IconButton
                        href='https://github.com/MuhammedFayazTS' target='blank'
                        sx={{width:45,height:45}} ><GitHubIcon sx={{color:lightTheme?grey[600]:grey[300],":hover":{color:'#010409'}}} /></IconButton>
                        <IconButton
                        href='https://www.linkedin.com/in/muhammed-fayaz-t-s-64a934285' target='blank' 
                        sx={{width:45,height:45}} ><LinkedIn sx={{color:lightTheme?grey[600]:grey[300],":hover":{color:'#0077b5'}}} /></IconButton>
                        <IconButton
                        href='mailto:muhammedfayazts01@gmail.com' target='blank'
                        sx={{width:45,height:45}} ><EmailIcon sx={{color:lightTheme?grey[600]:grey[300],":hover":{color:'#c71610'}}} /></IconButton>
                      </Stack>
        </>
    )
}

export default CreatorDetails