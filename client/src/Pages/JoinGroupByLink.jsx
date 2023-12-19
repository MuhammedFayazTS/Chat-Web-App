import { Avatar, AvatarGroup, Box, Button, CircularProgress, Container, Stack, Typography, keyframes } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {  getGroupUsersAPI, joinGroupChat } from '../Services/allAPIs'
import { toast } from 'react-toastify'
import { toastConfig } from '../utils/toastConfig'
import { AnimatePresence, motion } from 'framer-motion'

// for color checking based on first letter of avatar name
const array1 = ['G', 'U', 'T', 'W'];
const array2 = ['M', 'K', 'L', 'V'];
const array3 = ['S', 'Q', 'R', 'X'];
const array4 = ['B', 'A', 'C', 'Y'];
const array5 = ['F', 'E', 'D', 'Z'];
const array6 = ['I', 'H', 'J'];
const array7 = ['O', 'N', 'P'];

const colors = [
    '#5D8AA8', '#0072B5', '#935529', '#1E90FF','#00A170', '#DE3163','#17B169',
]

// avatr color change 
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

// styled button
const buttonStyle = {
    minWidth:'8rem',
    backgroundColor: '#8381C3',
    color: '#FFFFFF',
    '&:hover': {
        backgroundColor: '#646395',
    },
    '&:disabled': {
        color: 'red', // Adjust the disabled color as needed
        backgroundColor: '#":hover"', // Adjust the border color for disabled state
      },
  };

  const outlinedButtonStyle = {
    color: '#8381C3',
    borderColor: '#8381C3',
    '&:hover': {
        color: '#646395',
        borderColor: '#646395',
        backgroundColor: '#AEADEA',
    },
};




function JoinGroupByLink() {
    const dyParams= useParams()
    const [chat_id,chatName] = dyParams && dyParams._id ? dyParams._id.split("&") : ["", ""];  
    const [groupUsers, setgroupUsers] = useState([])
    const userData = JSON.parse(localStorage.getItem("userData"))
    const [loading, setLoading] = useState(false)
    const nav = useNavigate()
    if(!userData.data.token){
        //('Not authorized')
        nav('/not-authenticated')
        // window.location.replace('/not-authenticated')
    }
    

    const fetchGroupUsers = async() =>{
        const result =  await getGroupUsersAPI(chat_id);
        if(result.status == 200){
            setgroupUsers(result.data)
        }else{
            console.log("cannot fetch group users");
        }
    }

    const joinGroup = async()=>{
        setLoading(true)
        const details = {
            chatId:chat_id,
            userId:userData.data._id
        }
        const result = await joinGroupChat(details)
        if(result.status == 200){
            setLoading(false)
            toast.success("user joined group successfully",toastConfig);
            nav(`/app/groups`)
        }else{
            setLoading(false)
            toast.error("user failed to join the group.",toastConfig);
        }
    }
    useEffect(()=>{
        fetchGroupUsers();
    },[])
    
    return (
        // <Box sx={{backgroundImage: `linear-gradient(to right, 
        //     #17B1694d,  #17B1694d),url(${bg})`,backgroundSize:'contain'}} >
        <AnimatePresence>
            <Box  sx={{background:'#D2D1F3',backgroundSize:'contain'}} >
                <Container sx={{backdropFilter:'blur(5px)'}}>
                    <Stack height={'100vh'} justifyContent={'center'} alignItems={'center'}>
                        
                        <Box component={motion.div} 
                        initial={{scale:0.6}} animate={{scale:1}} exit={{scale:.8}} transition={{duration:.3,type:'spring'}}
                        boxShadow={2}  bgcolor={'#f5f5f7'} width={{xs:'100%',md:'45%'}} borderRadius={3} sx={{px:{xs:5,md:10},py:{xs:5,md:5}}}>
                            <Stack spacing={3}>
                                
                                <Typography textAlign={'center'} color={'#8381C3'}  variant='h5'>Invited to group</Typography>
        
                                <Stack alignItems={'center'} spacing={2}>
                                    <Avatar
                                    component={motion.div} 
                                    initial={{scale:0.6}} animate={{scale:1}} exit={{scale:.8}} transition={{duration:.3,delay:.3,type:'spring'}}
                                    sx={{width:'10rem',height:'10rem',fontSize:'5rem',background:colorCheck(chatName)}} alt={chatName} src="">{chatName.slice(0,1)}</Avatar>
                                    <Typography variant='h5' color={'#5C5C5C'}>{chatName}</Typography>
                                  
                                    <Typography variant='body2' color={'#858585'}>"Experience lively discussions and connections in Group {chatName} on our app!"</Typography>
                                    
                                    <Stack direction={'row'} width={'80%'} justifyContent={'center'} spacing={1} alignItems={'center'}>      
                                        
                                        <AvatarGroup  spacing={10}   max={3} 
                                          sx={{ '& .MuiAvatar-root': { bgcolor: '#9a98e5' } }} >
                                            {groupUsers.length>0 &&
                                            groupUsers.map((user,index)=>(
                                                <Avatar key={index} alt={user.name}  src={user.pfp?user.pfp:''} />
                                                ))
                                            }
                                        </AvatarGroup>
    
                                        <Typography color={"#707070"} variant='body2'>{groupUsers.length} people already joined the Group.</Typography>
                                    </Stack>
    
                                    <Stack pt={2}  direction={'row'} width={{xs:'80%',md:'70%'}} justifyContent={'center'} spacing={1}>
                                        <Button style={outlinedButtonStyle} size='large' onClick={()=>nav(-1)} variant='outlined'>Cancel</Button>
                                        <Button disabled={loading?true:false} style={buttonStyle} onClick={joinGroup}
                                        size='large' variant='contained'>
                                            {loading?
                                            <CircularProgress size={24} color='inherit' />
                                            :'Join Now'}
                                        </Button>
                                    </Stack>
    
                                </Stack>
                            </Stack>
                        </Box>
                    </Stack>
                </Container>
            </Box>
        </AnimatePresence>
    )
}

export default JoinGroupByLink