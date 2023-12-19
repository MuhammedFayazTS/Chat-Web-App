/* eslint-disable eqeqeq */
import { Avatar, Box, Button, Grid, IconButton, Stack, Typography } from '@mui/material'
import {  grey } from '@mui/material/colors'
import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BottomNavBar from '../Navigations/BottomNavBar';
// icons
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import LinkedIn from '@mui/icons-material/LinkedIn';
import AnimatedNumbers from "react-animated-numbers";
import { setColorTheme } from '../../Redux/Slices/colorThemeSlice';
import { AnimatePresence, motion } from 'framer-motion';
import { dateAndTimeFormat } from '../../utils/TimeFormat';
import Lottie from 'react-lottie-player';
import GearJsonICO from '../../Assets/lotte_animation/Gear.json'
import { editUserPfpAPI, fetchChats } from '../../Services/allAPIs';
import ModalEditUserDetails from '../Modals/ModalEditUserDetails';
import Greetings from '../../utils/Greetings';
import moment from 'moment';
import { toastConfig } from '../../utils/toastConfig';
import { toast } from 'react-toastify';
import ConformDeleteAccount from '../Dialogs/ConformDeleteAccount';
import { myContext } from '../../Context/myContext';


function Settings() {
  //check if user is logged in
  const location = useNavigate()
  const userData = JSON.parse(localStorage.getItem("userData"))
  const {data} = JSON.parse(localStorage.getItem("userData"))
  if(!data.token){
    //('Not authorized')
    window.location.replace('/not-authenticated')
  } 
  const lightTheme = useSelector(state=>state.themeKey)
  const secondary = lightTheme?grey[200]:'#1e1e1e'
  // eslint-disable-next-line no-unused-vars
  const { refresh, setRefresh } = useContext(myContext);
  const [allChats,setAllChats] = useState([])
  const [groupConversations,setGroupConversations] = useState([])
  const [singleConversations,setSingleConversations] = useState([])
  const [openEditModal,setOpenEditModal] = useState(false)
  const [uploadLoading,setUploadLoading] = useState(false)
  const dispatch = useDispatch()
  
    
  // fetch single chats
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchSingleConversations = async () => {
    try {
      const result = await fetchChats();
      if (result && result.data && result.data.length > 0) {
        setAllChats(result.data);
        const singleConvos = result.data.filter(chat => chat.isGroupChat !== true);
        setSingleConversations(singleConvos);
      }
    } catch (error) {
      // Handle any errors from fetching chats
      console.error("Error fetching chats:", error);
    }
  };
  
  useEffect(() => {
    fetchSingleConversations();
  }, [refresh]);
  
  
  // group chats   
    useEffect(()=>{
      const groupChats = allChats.filter(conversation => conversation.isGroupChat === true);
        const userInGroup = groupChats.filter(group =>
          group.groupAdmin._id == data._id 
          ||
          group.users.some(user => user._id == data._id)  
          );
          setGroupConversations(userInGroup)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[refresh,allChats])

    // setColor Theme function
    const changeColorTheme = (color) =>{
      dispatch(setColorTheme(color))
      localStorage.setItem('colorTheme',color)
    }

    const framerHoverStyle = {scale:1.1,border:lightTheme?'none':'3px solid #fff',}
    const framerTapStyle = {scale:0.9}

    const boxShadow = 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px';

    // open edit modal
    const handleOpenModal = (e) => {
      e.preventDefault();
      setOpenEditModal(true)
    }


    //profile pic upload
    const handleUploadPic=(pic)=>{
      setUploadLoading(true)
      if(pic === undefined){
        toast.warning("Please select an image!",toastConfig)
        return;
      }
  
      if(pic.type === "image/jpeg" || pic.type === "image/jpg" ||pic.type === "image/png" ){
        const data = new FormData()
        data.append("file",pic)
        data.append("folder","profile_pics")
        data.append("upload_preset","chat_App")
        data.append("cloud_name","fayaz1001")
        fetch("https://api.cloudinary.com/v1_1/fayaz1001/image/upload", {
          method: "post",
          body: data,
        })
        .then((res)=>res.json())
        .then((resData)=>{
          updatePfpInDB(resData.url.toString())
        })
        .catch((error)=>{
          console.log(error);
          setUploadLoading(false)
        })
        console.log("Data:"+data);
      }else{
        toast.warning("Please select an image!",toastConfig)
        setUploadLoading(false)
      }
    }


    const updatePfpInDB = async (pic) => {
      try {
        const updated = await editUserPfpAPI(pic);
        if (updated && updated.status === 200) {
          setUploadLoading(false);
          userData.data.pfp = updated.data.pfp;
          userData.data.updatedAt = updated.data.updatedAt;
          // Update local storage with the modified 'data' object
          localStorage.setItem("userData", JSON.stringify(userData));
        } else {
          // toast.error("Upload failed",toastConfig)
          setUploadLoading(false);
        }
      } catch (error) {
        console.error("Error updating profile picture:", error);
        setUploadLoading(false);
      }
    };


    // handle open remove dialog
    const [openRemoveDialog,setOpenRemoveDialog] = useState(false)
    const handleOpenRemoveDialog = ()=>{
        setOpenRemoveDialog(true);
    }
    const handleCloseRemoveDialog = ()=>{
      setOpenRemoveDialog(false)  
  }
    

  return (
    <AnimatePresence>
      {/* edit modal */}
      <ModalEditUserDetails open={openEditModal} setOpen={setOpenEditModal} />
      {/* dialog */}
      <ConformDeleteAccount open ={openRemoveDialog} setOpen={setOpenRemoveDialog} handleClose={handleCloseRemoveDialog} />

        <Stack flex={1} direction={'column'} bgcolor={lightTheme?grey[400]:'#111'} px={{xs:3,md:5}} py={3} spacing={1.5} sx={{overflowY:{xs:'scroll',md:'hidden'}}}>
                  <Stack  direction={'row'} pl={1} alignItems={'center'} spacing={.6}>
                      <Greetings/> 
                    <Typography 
                    component={motion.h5}
                    initial={{y:-100}}
                    animate={{y:0}}
                    transition={{duration:.4,type:'spring'}}
                    variant='body1' fontSize={21} 
                    color={lightTheme?grey[800]:grey[500]}
                    >
                      {data.name}
                      </Typography>
                    </Stack>
                 

            {/* 1st inner stack */}
             <Stack
             flex={1} direction={{xs:'column',md:'row'}} spacing={2}>     
              <Stack  flex={{xs:1,md:.75}} spacing={2}   >
                  {/* profile stack */}
                  <Stack                   
            direction={'column'} height={'100%'} spacing={2}>
                    {/* profile */}
                          <Grid 
                            key={'top box'} 
                            component={motion.div}
                            initial={{ scale: .8, opacity: 0 }}
                           animate={{ scale: 1, opacity: 1 }}
                           transition={{duration:.3,type:'spring'}}
                           container flex={.4} p={2} borderRadius={3}   bgcolor={secondary} boxShadow={boxShadow}>
                                <Grid item xs={12} md={3} alignSelf={'center'}  p={1}  >
                                    <motion.div whileHover={{scale:1.02}} style={{width:{xs:'100%',md:'95%'},aspectRatio:'1/1'}}>                                    
                                      {
                                      uploadLoading?
                                      <Stack justifyContent={'center'} alignItems={'center'} sx={{width:'100%',height:'100%'}} borderRadius={'50%'} 
                                      bgcolor={lightTheme?grey[400]:grey[800]} >
                                          uploading..
                                      </Stack>
                                      :
                                        <label key={'image-upload'}  style={{width:'100%',aspectRatio:'1/1'}}>                                    
                                      <input onChange={(e)=>handleUploadPic(e.target.files[0])} style={{display:'none'}} type="file" accept='image/*' name="uploadImage" />
                                      <Avatar sx={{width:'100%',height:'100%'}}  src={data.pfp?data.pfp:'https://imgs.search.brave.com/V1HRFrMXruzF_haelIsThp34Ro9P_PlnFVSjwuryTU8/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNTg3/ODA1MDc4L3ZlY3Rv/ci9wcm9maWxlLXBp/Y3R1cmUtdmVjdG9y/LWlsbHVzdHJhdGlv/bi5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9c1VDZHgtTGlr/cWU3ZUJFY2JuMUZU/OHliT1FRSFhEZ0JL/THNKYzk5TXRDQT0'}/>
                                    </label>
                                      }
                                    </motion.div>
                                </Grid>
                                <Grid xs={10} md={8} item   pl={2}>
                                    <Typography color={lightTheme?grey[700]:grey[500]} fontFamily={'monospace'} mt={3}  variant='h5'>{data.name}</Typography>
                                    <Typography color={lightTheme?grey[700]:grey[600]} fontFamily={'monospace'} mt={1} variant='h6'>{data.email}</Typography>
                                    <Typography color={lightTheme?grey[700]:grey[600]} fontFamily={'monospace'}  variant='h6'>created:{dateAndTimeFormat(data.createdAt)}</Typography>
                                    <Typography color={lightTheme?grey[700]:grey[600]} fontFamily={'monospace'}  variant='h6'>last update:{dateAndTimeFormat(data.updatedAt)}</Typography>
                                </Grid>
                                <Grid xs={2} md={1} item >
                                    <Button onClick={handleOpenModal} sx={{float:'right',fontFamily:'monospace',textTransform:'capitalize'}} color='info' variant='text'> Edit</Button>
                                </Grid>
                          </Grid>
                        {/* group and frineds */}
                          <Stack 
                           flex={{xs:1,md:.2}} direction={'row'} spacing={2}>
                                <Box 
                                flex={.5} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} borderRadius={3} bgcolor={secondary} boxShadow={boxShadow} >
                                    <Typography variant='h6' color={lightTheme?grey[800]:grey[500]}>Friends</Typography>
                                    <Typography variant='h4' color={lightTheme?grey[600]:grey[400]}>
                                      {/* {singleConversations.length} */}
                                        <AnimatedNumbers animateToNumber={singleConversations.length} transitions={(index) => ({
                                          type: "spring",
                                          duration: index + 0.3,
                                        })} />
                                      </Typography>
                                </Box>
                                <Box 
                                flex={.5} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} borderRadius={3} bgcolor={secondary} boxShadow={boxShadow} >
                                    <Typography variant='h6' color={lightTheme?grey[800]:grey[500]}>Groups</Typography>
                                    <Typography variant='h4' color={lightTheme?grey[600]:grey[400]}>
                                      {/* {userInGroup.length} */}
                                      <AnimatedNumbers animateToNumber={groupConversations.length} transitions={(index) => ({
                                          type: "spring",
                                          duration: index + 0.3,
                                        })} />
                                      </Typography>
                                </Box>
                          </Stack>
                          {/* theme selection */}
                          <Box
                           key={'connectionssection'} 
                           component={motion.div}
                           initial={{ scale: .8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{duration:.3,type:'spring'}}
                          flex={{xs:1,md:.3}}  px={10} py={{xs:2,md:0}} rowGap={1} width={'100%'} bgcolor={secondary} display={'flex'} flexWrap={{xs:'wrap',md:'nowrap'}} 
                          alignItems={'center'} justifyContent={'center'} height={'100%'} borderRadius={3} sx={{columnGap:2}} boxShadow={boxShadow}>
                                <Typography variant='h6' color={lightTheme?grey[700]:grey[400]} display={{xs:'none',md:'block'}}>ColorTheme - </Typography>
                                <motion.div 
                                 whileInView={{scale:1}} initial={{scale:.5}}
                                 whileHover={framerHoverStyle}  whileTap={framerTapStyle} transition={{type:'tween'}} 
                                 onClick={()=>changeColorTheme('purple')}  style={{width:'2.5rem',height:'2.5rem',background:'#A251E1', borderRadius:'50%'}} />
                                <motion.div 
                                 whileInView={{scale:1}} initial={{scale:.5}}
                                 whileHover={framerHoverStyle}  whileTap={framerTapStyle} transition={{type:'tween'}} 
                                 onClick={()=>changeColorTheme('sky')}  style={{width:'2.5rem',height:'2.5rem',background:'#007FFF', borderRadius:'50%'}} />
                                <motion.div 
                                 whileInView={{scale:1}} initial={{scale:.5}}
                                 whileHover={framerHoverStyle}  whileTap={framerTapStyle} transition={{type:'tween'}} 
                                 onClick={()=>changeColorTheme('green')}  style={{width:'2.5rem',height:'2.5rem',background:'#018749', borderRadius:'50%'}} />
                                <motion.div 
                                 whileInView={{scale:1}} initial={{scale:.5}}
                                 whileHover={framerHoverStyle}  whileTap={framerTapStyle} transition={{type:'tween'}} 
                                 onClick={()=>changeColorTheme('black')}  style={{width:'2.5rem',height:'2.5rem',background:'#444', borderRadius:'50%'}} />
                                <motion.div 
                                 whileInView={{scale:1}} initial={{scale:.5}}
                                 whileHover={framerHoverStyle}  whileTap={framerTapStyle} transition={{type:'tween'}} 
                                 onClick={()=>changeColorTheme('blue')}  style={{width:'2.5rem',height:'2.5rem',background:'#1F305E', borderRadius:'50%'}} />
                                <motion.div 
                                 whileInView={{scale:1}} initial={{scale:.5}}
                                 whileHover={framerHoverStyle}  whileTap={framerTapStyle} transition={{type:'tween'}} 
                                 onClick={()=>changeColorTheme('pink')}  style={{width:'2.5rem',height:'2.5rem',background:'#DE3163', borderRadius:'50%'}} />
                          </Box>

                          

                          <Box flex={.1} display={{md:'flex',xs:'none'}} alignItems={'end'} justifyContent={'center'}>
                            <Typography color={grey[500]}  variant='p' fontSize={14}>
                              @copyright:{new Date().getFullYear()}
                            </Typography>
                          </Box>
                  </Stack>
              </Stack>
              {/* settings section */}
              <Stack
               key={'stack2'} 
               component={motion.div}
               initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 200, opacity: 0 }}
              transition={{duration:.5,type:'spring'}}
              flex={.25}  direction={'column'} p={2} spacing={2} borderRadius={3} bgcolor={secondary} boxShadow={boxShadow}>
                  {/* top part */}
                  <Stack flex={.4} width={'100%'} justifyContent={'center'} alignItems={'center'} >
                  <Lottie
              loop
              animationData={GearJsonICO}
              play
              style={{ width: 150, height: 150 }}
            />
                  </Stack>
                  {/* middle too bottom part */}
                  <Box flex={.4} display={'flex'} flexDirection={'column'} py={2} rowGap={2} width={'100%'}>
                      {/* <Button variant='text' color='error' fullWidth >Remove All Users</Button> */}
                      {/* <Button variant='text' color='error' fullWidth >Exit All Group</Button> */}
                      <Button onClick={handleOpenRemoveDialog} variant='text' color='error' fullWidth >Remove Account</Button>
                      <Button onClick={()=>{
                        localStorage.removeItem('userData');
                        location('/')
                      }} variant='text' color='info' >Logout</Button>
                  </Box>
                  <Box flex={.2} display={'flex'} flexDirection={'column'} py={2} rowGap={1} width={'100%'}>
                    <Typography variant='body1' textAlign={'center'} color={grey[500]}> Creator</Typography>

                      <Stack direction={'row'} gap={2} justifyContent={'center'}>
                        <IconButton href='https://github.com/MuhammedFayazTS' target='blank'
                         sx={{width:45,height:45}} ><GitHubIcon sx={{color:lightTheme?grey[600]:grey[300]}} /></IconButton>
                        <IconButton href='https://www.linkedin.com/in/muhammed-fayaz-t-s-64a934285' target='blank' 
                        sx={{width:45,height:45}} ><LinkedIn sx={{color:lightTheme?grey[600]:grey[300]}} /></IconButton>
                        <IconButton href='mailto:muhammedfayazts01@gmail.com' target='blank'
                        sx={{width:45,height:45}} ><EmailIcon sx={{color:lightTheme?grey[600]:grey[300]}} /></IconButton>
                      </Stack>
                  </Box>
              </Stack>
            </Stack>
            <Box flex={.1} display={{xs:'flex',md:'none'}} alignItems={'end'} justifyContent={'center'}>
                            <Typography color={grey[500]}  variant='p' fontSize={14}>
                              @copyright:{moment().year()}
                            </Typography>
                          </Box>
            <BottomNavBar />
        </Stack>
    </AnimatePresence>
  )
}

export default Settings