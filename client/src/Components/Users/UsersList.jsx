import { Badge, Box, Skeleton, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import React, { useContext, useEffect, useState } from 'react'
import {  useDispatch, useSelector } from 'react-redux'
import { grey } from '@mui/material/colors'
import UserAvatar from './UserAvatar'
import {  useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setCurrentChat } from '../../Redux/Slices/currentChatSlice'
import moment from 'moment'
import { DateFormat, dateAndTimeFormat, timeFormat } from '../../utils/TimeFormat'
import { setRecieverDetails } from '../../Redux/Slices/recieverDetailsSlice'
import { myContext } from '../../Context/myContext'
import Lottie from 'react-lottie-player'
import noUserAnimation from '../../Assets/lotte_animation/AddUsers.json'

function UsersList({searchUser}) {
    const lightTheme = useSelector(state=>state.themeKey)
    const nav = useNavigate()
    const { refresh, setRefresh } = useContext(myContext);
    const userData = JSON.parse(localStorage.getItem("userData"))
    const [loaded, setloaded] = useState(false);
    const [conversations,setConversations]= useState([])
    const dispatch = useDispatch()
    // notifications
  const {notifications,setNotifications} = useContext(myContext)
    if(!userData.data.token){
        //('Not authorized')
        window.location.replace('/not-authenticated')
    }

    const user = userData?.data;

    useEffect(() => {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };  
        axios.get("http://localhost:5000/chat/", config).then((response) => {
          setConversations(response.data);
          setRefresh(!refresh)
          setloaded(true)
        });
      }, [refresh,user.token]);

      

    
    // const filteredConversations = conversations && conversations?.filter(conversation => conversation?.users[0]?.name.includes(searchUser));
    const filterOutGroups = conversations.length>0 && conversations.filter(convo =>{
      return convo.isGroupChat == false;
    })
    const filteredConversations = filterOutGroups && filterOutGroups
    ?.filter(conversation => {
      const userName = 
        (conversation?.users[0]._id !== userData?.data._id) 
          ? conversation?.users[0]?.name
          : conversation?.users[1]?.name;
  
      return userName && userName.toLowerCase().includes(searchUser.toLowerCase());
    });
  

    const FormatTimeAndDate =(time)=>{
        let created = moment(time);
        let currDate = DateFormat(moment()); 
        var createdFullDate = DateFormat(created); 
        if(createdFullDate === currDate){
            return timeFormat(created);
        }else{
            return DateFormat(created);
        }    

    }

    // console.log(notifications.map(n=>n.));
   


    if (loaded===false) {
        return (
          <div
            style={{
              border: "20px",
              padding: "10px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <Skeleton
            variant="rectangular" animation={'wave'}
            sx={{ width: "100%", borderRadius: "10px" }}
            height={60}
          />
          <Skeleton
            variant="rectangular" animation={'wave'}
            sx={{ width: "100%", borderRadius: "10px" }}
            height={60}
          />
          <Skeleton
            variant="rectangular" animation={'wave'}
            sx={{ width: "100%", borderRadius: "10px" }}
            height={60}
          />
          </div>
        );
      } 
      else {
  return (
    <>
    {filteredConversations.length>0?filteredConversations?.map((conversation, index) => {
        if (conversation.users.length === 1) {
            return <div key={index}></div>;
          }

          // eslint-disable-next-line no-lone-blocks
          { if ( conversation.isGroupChat===false) 
            if (conversation.latestMessage === undefined ) {
            return (
                <motion.div
                // onClick={() => nav("/app/users/chat/" + conversation._id + '&' + conversation?.users[1].name)}
                onClick={() => {
                    if (conversation.users.length > 1) {
                        setRefresh(!refresh)
                        let name = (conversation?.users[0]._id !== userData?.data._id )? conversation?.users[0].name:conversation?.users[1].name
                        let pfp = (conversation?.users[0]._id !== userData?.data._id )? conversation?.users[0].pfp?conversation?.users[0].pfp:''
                          :conversation?.users[1].pfp?conversation?.users[1].pfp:''
                          let isOnline=(conversation?.users[0]._id !== userData?.data._id )? conversation?.users[0].isOnline:conversation?.users[1].isOnline  
                        dispatch(setRecieverDetails({name:name,pfp:pfp,isOnline:isOnline}))
                        nav("/app/users/chat/" + conversation._id + '&' + conversation?.users[1]?.name);
                    }
                }}
                key={index}
                whileHover={{ backgroundColor: lightTheme ? 'rgba(0,0,0,0.085)' : 'rgba(0,0,0,0.3)', scale: 1.05 }}
                transition={{ duration: 0.3 }}
            >
                <Box px={3} mt={.5} py={1}>
                    <motion.div
                        whileTap={{ scale: 0.95 }}
                    >
                        <Stack direction={'row'} columnGap={1}>
                          {/* for checking if username of users */}
                            <UserAvatar pfp={(conversation?.users[0]._id !== userData?.data._id )? conversation?.users[0].pfp?conversation?.users[0].pfp:''
                            :conversation?.users[1].pfp?conversation?.users[1].pfp:''
                            }
                            uName={(conversation?.users[0]._id !== userData?.data._id )? conversation?.users[0].name:conversation?.users[1].name} 
                            width={'3rem'} height={'3rem'} 
                            isOnline={(conversation?.users[0]._id !== userData?.data._id )? conversation?.users[0].isOnline:conversation?.users[1].isOnline}
                            />
        
                            <Stack flex={1}>
                                <Typography variant="h6" fontSize={'1rem'} color={lightTheme ? grey[700] : grey[400]}>
                                {(conversation?.users[0]._id !== userData?.data._id )? conversation?.users[0].name:conversation?.users[1].name}
                                    </Typography>
                                <Typography variant="p" fontSize={'.7rem'} color={lightTheme ? grey[500] : grey[600]}>
                               click here to start a new chat
                                </Typography>
                            </Stack>
        
                            <Stack flex={'.3'} direction={'column'} gap={2} alignItems={'center'}>
                                <Typography variant="p" fontSize={'.6rem'} color={lightTheme ? grey[700] : grey[700]}>
                                {FormatTimeAndDate(conversation.updatedAt)}
                                </Typography>
                                
                            {/* <Badge sx={{ pr: 4 }} badgeContent={notifications.length} color="primary" /> */}
                                
                            </Stack>
                        </Stack>
                    </motion.div>
                </Box>
        
            </motion.div>
            );
        } else { 
            return (
                <motion.div
                onClick={() => {
                    if (conversation.users.length > 1) {
                          nav("/app/users/chat/" + conversation._id + '&' 
                          + conversation?.users[1]?.name);
                          let name = (conversation?.users[0]._id !== userData?.data._id )? conversation?.users[0].name:conversation?.users[1].name
                          let pfp = (conversation?.users[0]._id !== userData?.data._id )? conversation?.users[0].pfp?conversation?.users[0].pfp:''
                          :conversation?.users[1].pfp?conversation?.users[1].pfp:''
                          let isOnline=(conversation?.users[0]._id !== userData?.data._id )? conversation?.users[0].isOnline:conversation?.users[1].isOnline
                          dispatch(setRecieverDetails({name:name,pfp:pfp,isOnline:isOnline}))
                            dispatch(setCurrentChat(conversation))
                        }
                    }}
                    key={index}
                    whileHover={{ backgroundColor: lightTheme ? 'rgba(0,0,0,0.085)' : 'rgba(0,0,0,0.3)', scale: 1.05 }}
                transition={{ duration: 0.3 }}
            >
                <Box px={3} mt={.5} py={1}>
                    <motion.div
                        whileTap={{ scale: 0.95 }}
                    >
                        <Stack direction={'row'} columnGap={1}>
        
                            <UserAvatar pfp={(conversation?.users[0]._id !== userData?.data._id )? conversation?.users[0].pfp?conversation?.users[0].pfp:''
                            :conversation?.users[1].pfp?conversation?.users[1].pfp:''
                            }
                             uName={(conversation?.users[0]._id !== userData?.data._id )? conversation?.users[0].name:conversation?.users[1].name} 
                             width={'3rem'} height={'3rem'} 
                             isOnline={(conversation?.users[0]._id !== userData?.data._id )? conversation?.users[0].isOnline:conversation?.users[1].isOnline}/>
        
                            <Stack flex={1}>
                                <Typography variant="h6" fontSize={'1rem'} color={lightTheme ? grey[700] : grey[400]}>
                                   {(conversation?.users[0]._id !== userData?.data._id )? conversation?.users[0].name:conversation?.users[1].name}</Typography>
                                <Typography variant="p" fontSize={'.7rem'} color={lightTheme ? grey[500] : grey[600]}>
                                {conversation.latestMessage?.content}
                                </Typography>
                            </Stack>
        
                            <Stack flex={'.3'} direction={'column'} gap={2} alignItems={'center'}>
                                <Typography variant="p" fontSize={'.6rem'} color={lightTheme ? grey[700] : grey[700]}>
                                    {FormatTimeAndDate(conversation.latestMessage?.updatedAt)}
                                </Typography>

                                
                                   {/* <Badge sx={{ pr: 4 }}
                                     badgeContent={4}
                                      color="primary" /> */}
                                

                            </Stack>
                        </Stack>
                    </motion.div>
                </Box>
        
            </motion.div>
            );
        }}
    }):
    <Stack alignItems={'center'} justifyContent={'center'} px={5} maxHeight={'20rem'}>
      <Lottie
      loop
      animationData={noUserAnimation}
      play
      style={{ width: '15rem', height: '15rem' }}
      />
      <Typography variant="body2" fontSize={'1rem'} color={'#ccc'}>No users found</Typography>
    </Stack>
    }      
    </>
  )
}
}

export default UsersList