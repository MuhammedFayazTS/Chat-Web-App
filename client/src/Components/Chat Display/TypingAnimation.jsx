import { Box, Stack, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import React from 'react'
import { ThreeDots } from 'react-loader-spinner'
import { useSelector } from 'react-redux'

function TypingAnimation() {
    const lightTheme = useSelector(state=>state.themeKey)

    const colors = lightTheme?'#D8D8D8':'#393939'
    return (
        <>
            <Stack direction={'row'} justifyContent={'end'}>
                <Stack  width={85} height={50}  mx={3} mb={1}  direction={'row'} bgcolor={lightTheme?'#D8D8D8':'#393939'} position={'relative'}
                         sx={{"::before":{content:'""',position:'absolute',top:0,right:-5.5,width:'12px',height:'12px',
                         background:`linear-gradient(135deg,${colors} 0%,${colors} 50%,transparent 50%,transparent)`}}}
                         borderRadius={2}  maxWidth={{xs:300,md:600}}   
                        alignItems={'center'} justifyContent={'center'}  >
                    <ThreeDots
                        height="50"
                        width="50"
                        radius="9"
                        color={lightTheme?grey[500]:grey[400]}
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClassName=""
                        visible={true}
                    />
                </Stack>
            </Stack>
        </>
    )
}

export default TypingAnimation