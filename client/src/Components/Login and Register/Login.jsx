import { Box, Button, OutlinedInput, FormControl, IconButton, InputAdornment, InputLabel, Stack, TextField, Typography, Container, Link } from '@mui/material'
import React, { useContext, useState } from 'react'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { toast } from 'react-toastify';
import Lottie from 'react-lottie-player';
import chatAppLogo from '../../Assets/lotte_animation/logo.json'
import { Link as RouterLink } from 'react-router-dom'
import CreatorDetails from './CreatorDetails';
import { loaderContext } from '../../Context/loaderContext';
import { toastConfig } from '../../utils/toastConfig';
import { AnimatePresence, motion } from 'framer-motion';
import { myContext } from '../../Context/myContext';

function Login() {
  // show hide password
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ name: "", password: "" })
  const [signInStatus, setSignInStatus] = React.useState("")
  const [loginInStatus, setLoginInStatus] = React.useState("")
  const {loaded,setLoaded} = useContext(loaderContext) //for loader display
  const location = useNavigate()
  const { refresh, setRefresh } = useContext(myContext);


  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  // register api call
  const loginHandler = async () => {
    setLoaded(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post('http://localhost:5000/user/login', data, config)
      // console.log(response);
      setSignInStatus({ msg: 'Success', key: Math.random() })
      localStorage.setItem("userData", JSON.stringify(response))
      setLoaded(false);
      location("/app/users")
      setRefresh(!refresh)
      toast.success('user logged in successfully', toastConfig);
    }
    catch (err) {
      console.log(err);
      setLoaded(false)
      if (err.response.status === 401) {
        setLoginInStatus({
          msg: 'invalid username or password',
          key: Math.random()
        })
        toast.error(loginInStatus.msg, toastConfig);
      }
    }
  }

  return (
    <AnimatePresence >
      
        <Stack
        key={'login'}
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
            <Typography variant='h5' color={'#666'}>Login to Connectify</Typography>
           
            {/* LoginForm */}
            <Stack width={{xs:'90%',md:'45%'}} spacing={3}  direction={'column'} >
                <TextField name='name'
                onChange={changeHandler}
                 type='text' fullWidth label={'name'} size='small'/>
                <TextField
                onChange={changeHandler}
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
                <Button onClick={loginHandler} variant='contained' color='primary'>Login</Button>
                <Stack direction={'row'} justifyContent={'center'}>
              <Typography variant='body2'>New User?</Typography>
              <Link to='/register' component={RouterLink}  variant='subtitle2'>
                Create an account
              </Link>
            </Stack>
              <CreatorDetails  />
            </ Stack>
          </Stack>
        </Stack>
    </AnimatePresence>
  );
}

export default Login