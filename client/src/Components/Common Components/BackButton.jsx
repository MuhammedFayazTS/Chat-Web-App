import { Box } from '@mui/material'
import React from 'react'
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { motion } from 'framer-motion';

function BackButton({color,bgcolor}) {
  return (
    <>
         <Box
         component={motion.div}
         whileHover={{filter:'contrast(0.85)'}}
            width={"30px"}
            height={"30px"}
            color={color}
            bgcolor={bgcolor}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            borderRadius={"5px"}
            sx={{cursor:'pointer'}}
          >
            <KeyboardArrowLeftIcon />
          </Box>
    </>
  )
}

export default BackButton