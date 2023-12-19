import { Badge, Box, Skeleton, Stack, Typography } from '@mui/material'
import {  motion } from 'framer-motion'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { grey } from '@mui/material/colors'
import UserAvatar from '../Users/UserAvatar'
import axios from 'axios'
// group add animation
import GroupAddAnim from '../../Assets/lotte_animation/AddGroups.json'
import Lottie from 'react-lottie-player'
import {setGroupUsers } from '../../Redux/Slices/groupUsers.Slice'
import moment from 'moment'
import { DateFormat, timeFormat } from '../../utils/TimeFormat'
import { isAdminContext } from '../../Context/DialogContext'
import { setRecieverDetails } from '../../Redux/Slices/recieverDetailsSlice'
import { myContext } from '../../Context/myContext'



function GroupList({searchGroup}) {
  const lightTheme = useSelector(state=>state.themeKey)
    const location = useNavigate()
    const { refresh } = useContext(myContext);
    const [loaded,setIsLoaded] = useState(false)
    const userData = JSON.parse(localStorage.getItem("userData"))
    const [groups,setGroups]= useState([])
    const dispatch = useDispatch()
    const {isAdmin,setIsAdmin} = useContext(isAdminContext) //for checking if the user is group admin
    if(!userData){
         //('Not authenticate')
      window.location.replace('/not-authenticated')
    }
    // fetch groups api call
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchGroups = ()=>{
      const config = {
        headers:{
          Authorization:`Bearer ${userData.data.token}`
        }
      }
      axios.get("http://localhost:5000/chat/fetchGroups",config).then(data=>{
        setGroups(data.data)
        setIsLoaded(true)
      })
    }
    useEffect(()=>{
        fetchGroups();
      },[refresh, userData.data.token])
      
      // if user is admin
      const checkIsAdmin =()=>{
        const isAdmin = groups.some(group => group.groupAdmin === userData.data._id);
        if(isAdmin){
          setIsAdmin(true)
        }else{
          setIsAdmin(false)
        }
      }
      // filter out groups which only contains current logged in user as member or admin.
      const userInGroup = groups.filter(group =>
        group.users.some(user => user === userData.data._id) || group.groupAdmin === userData.data._id
      );
      
      // filer group based on search bar
      const filteredGroups = userInGroup.filter(group => group.chatName.includes(searchGroup));
        // format time using moment js
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
    
  return (
    <>
        {filteredGroups.length>0 ?
        filteredGroups?.map((group) => (         
          <motion.div
          key={group._id}
          onClick={()=>{location("/app/groups/chat/"+group._id+'&'+group.chatName)
          checkIsAdmin()
          dispatch(setRecieverDetails({name:group.chatName,pfp:''}))
          dispatch(setGroupUsers(group.users))
          }}
            whileHover={{
              backgroundColor: lightTheme
                ? "rgba(0,0,0,0.085)"
                : "rgba(0,0,0,0.3)",
              scale: 1.01,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Box px={3} mt={0.5} py={1}>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Stack direction={"row"} columnGap={1}>
                  <UserAvatar
                    width={"3rem"}
                    height={"3rem"}
                    uName={group.chatName}
                    pfp={''}
                    noBadge
                    isGroup
                    isOnline
                  />

                  <Stack flex={1}>
                    <Typography
                      variant="h6"
                      fontSize={"1rem"}
                      color={lightTheme ? grey[700] : grey[400]}
                    >
                      {group.chatName}
                    </Typography>
                    <Typography
                      variant="p"
                      fontSize={".7rem"}
                      color={lightTheme ? grey[500] : grey[600]}
                    >
                      {'you and '+(Number(group.users.length)-1)+' others'}
                    </Typography>
                  </Stack>

                  <Stack
                    flex={".3"}
                    direction={"column"}
                    gap={2}
                    aligngroups={"center"}
                  >
                    <Typography variant="p" fontSize={".6rem"} color={lightTheme?grey[700]:grey[700]}>
                    {FormatTimeAndDate(group.updatedAt)}
                    </Typography>
                    {/* {
                      group.latestMessage &&
                      <Badge sx={{ pr: 4 }} badgeContent={4} color="primary" />
                    } */}
                  </Stack>
                </Stack>
              </motion.div>
            </Box>
          </motion.div>
        ))
          :
        <Stack direction={'column'} alignItems={'center'} height={'90%'} >
          <Lottie
            loop
            animationData={GroupAddAnim}
            play
            style={{ width: '85%', height: '60%',objectFit:'cover' }}
            />
            <Typography color={lightTheme?grey[700]:grey[400]} variant='h6'>No Groups available</Typography>
        </Stack>
      }
    </>
  );
}

export default GroupList