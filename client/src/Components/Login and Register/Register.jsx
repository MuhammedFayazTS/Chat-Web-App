import { Avatar, Box, Button, FilledInput, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, Link, Stack, TextField, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import chatImg from '../../Assets/images/chat-Image.jpg'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import PersonIcon from '@mui/icons-material/Person';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { toast } from 'react-toastify';
import Lottie from 'react-lottie-player';
import chatAppLogo from '../../Assets/lotte_animation/logo.json'
import { Link as RouterLink } from 'react-router-dom'
import CreatorDetails from './CreatorDetails';
import { loaderContext } from '../../Context/loaderContext';
import { toastConfig } from '../../utils/toastConfig';
import { AnimatePresence, motion, progress } from 'framer-motion';

import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useTheme } from '@emotion/react';
import { grey } from '@mui/material/colors';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ProgressProvider from './ProgressProvider';
import { render } from "react-dom";
import { myContext } from '../../Context/myContext';


function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [data,setData] = useState({email:"",name:"",password:""})
    const [signInStatus, setSignInStatus] = React.useState("")
    const [loginInStatus, setLoginInStatus] = React.useState("")
    const {loaded,setLoaded} = useContext(loaderContext)
    const [uploaded,setUploaded] = useState(false)
    const [pfp,setPfp] = useState('')
    const { refresh, setRefresh } = useContext(myContext);


    const location = useNavigate()

    const notify = () => toast.error(loginInStatus.msg, toastConfig);
    useEffect(()=>{
       if(loginInStatus) notify();
    },[loginInStatus,signInStatus])

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // onchange handler
  const changeHandler =(e)=>{
    setData({...data,[e.target.name]:e.target.value});
  }
  
  // register api call
  const registerHandler = async()=>{
    setLoaded(true)
      try{
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        let Postdata = {
          name: data.name,
          email: data.email,
          password:data.password,
          pfp:pfp
        }
        const response = await axios.post('http://localhost:5000/user/register',Postdata,config)
        setSignInStatus({msg:'Success',key:Math.random()})
        localStorage.setItem("userData",JSON.stringify(response))
        setLoaded(false)
        location("/app/users")
        setRefresh(!refresh)
        toast.success('user signed up successfully', toastConfig);
        
      }
      catch(err){
        setLoaded(false)
        console.log(err);
          if(err.response.status === 405){
            setLoginInStatus({
              msg:'user with this email id already registered',
              key:Math.random()
            })
          }
          if(err.response.status === 406){
            setLoginInStatus({
              msg:'user with this user name already registered',
              key:Math.random()
            })
          }
          if(err.response.status === 400){
            setLoginInStatus({
              msg:'Registration Error',
              key:Math.random()
            })
            toast.error(loginInStatus.msg, toastConfig);
          }
      }
  }

  const handleUploadPic=(pic)=>{
    setUploaded(true)
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
        setPfp(resData.url.toString());
        setUploaded(false)
      })
      .catch((error)=>{
        console.log(error);
        setUploaded(false)
      })
      console.log("Data:"+data);
    }else{
      toast.warning("Please select an image!",toastConfig)
      setUploaded(false)
    }

  }

  // stepper
  const [activeStep, setActiveStep] = React.useState(0);
  const theme = useTheme();
  const maxSteps = 2;

  const handleNext = () => {
    if(activeStep <=1){
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  
  const handleBack = () => {
    if(activeStep >=0){
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  // progress 
  const percentage = 99;
  return (
    <AnimatePresence>
        
        <Stack 
        key={'register'}
        component={motion.div}
        initial={{ scale:.8,opacity:0 }}
        animate={{ scale: 1,opacity:1 }}
        transition={{duration:.3,type:'tween'}}
        height={'100vh'} justifyContent={'center'} spacing={1} >
          <Stack
            sx={{ width: "100%" }}
            direction={"column"}
            alignItems={"center"}
          >
            <Lottie
              loop
              animationData={chatAppLogo}
              play
              style={{ width: 120, height: 120 }}
            />
          </Stack>
          <Stack spacing={2} width={'100%'} alignItems={'center'}   sx={{ mb: 5, position: 'relative' }}>
            <Typography variant='h5' color={'#666'}>Sign up to Connectify</Typography>

          

            {/* LoginForm */}
            <Stack width={{xs:'90%',md:'45%'}} spacing={2}  >
            {activeStep===0?
                <Stack width={'100%'} height={'25vh'} spacing={3}  direction={'column'}>
                  <TextField name='name'
                  onChange={changeHandler}
                  value={data.name}
                  type='text' fullWidth label={'name'} size='small'/>
                  <TextField name='email'
                  value={data.email}
                  onChange={changeHandler}
                  type='email' fullWidth label={'email'} size='small'/>
                  
                  <TextField
                  onChange={changeHandler}
                  value={data.password}
                  name='password' type={showPassword ? "text" : "password"} label={'password'} fullWidth size='small' 
                  InputProps={{
                    endAdornment:
                    <InputAdornment position="end">
                    <IconButton
                     onClick={handleClickShowPassword}
                     onMouseDown={handleMouseDownPassword}
                     >
                    {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                    </IconButton>
                  </InputAdornment>
                  }} 
                  />
                </Stack>
              :
            <Stack height={'25vh'} spacing={1} >
              <Typography fontSize={14} color={grey[600]} alignSelf={'center'} variant='body1'>Profile Picture
              <Typography variant='span' color={grey[400]}>(Optional)</Typography>
              </Typography>
              <motion.label whileHover={{scale:1.02}} style={{width:'10rem',height:'10rem',alignSelf:'center'}}>   
                  <input
                  onChange={(e)=>handleUploadPic(e.target.files[0])}
                  style={{display:'none'}} type="file" name='fileUpload'
                  accept='image/*'
                  /> 
                  {uploaded?
                   <ProgressProvider valueStart={0} valueEnd={percentage}>
                   {value =>  <CircularProgressbar value={value} text={`${value}%`} /> }
                 </ProgressProvider>
                      
                    :
                  <Avatar sx={{width:'10rem',height:'10rem'}}  src={pfp?pfp:'https://imgs.search.brave.com/V1HRFrMXruzF_haelIsThp34Ro9P_PlnFVSjwuryTU8/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNTg3/ODA1MDc4L3ZlY3Rv/ci9wcm9maWxlLXBp/Y3R1cmUtdmVjdG9y/LWlsbHVzdHJhdGlv/bi5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9c1VDZHgtTGlr/cWU3ZUJFY2JuMUZU/OHliT1FRSFhEZ0JL/THNKYzk5TXRDQT0'}/>
                  }                          
                </motion.label>
            </Stack>
              }


              {/* stepper */}
            <MobileStepper
      variant="dots"
      steps={maxSteps}
      position="static"
      activeStep={activeStep}
      sx={{ maxWidth: '100%', flexGrow: 1,my:3 }}
      nextButton={
        <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps-1}>
          Next
          {theme.direction === 'rtl' ? (
            <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
              )}
        </Button>
      }
      backButton={
        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
          {theme.direction === 'rtl' ? (
            <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
              )}
          Back
        </Button>
      }
    />

      <Button disabled={activeStep===0?true:false} onClick={registerHandler} variant='contained' color='primary' sx={{textTransform:'capitalize'}}>Sign Up</Button>
                <Stack direction={'row'} justifyContent={'center'}>
              <Typography variant='body2'>Already a User?</Typography>
              <Link to='/' component={RouterLink}  variant='subtitle2'>
                login
              </Link>
            </Stack>
              {/* <CreatorDetails  /> */}
            </ Stack>

              

          </Stack>
        </Stack>

       
    </AnimatePresence>
  )
}

export default Register