import { Backdrop, ThemeProvider } from '@mui/material';
import './App.css';
// import { theme} from './Material ui/Themes';
import { useDynamicTheme } from './Material ui/Themes';
import Home from './Pages/Main';
import { Route, Routes} from 'react-router-dom';
import Settings from './Components/Settings/Settings';
import {  useContext, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  Grid } from 'react-loader-spinner';
import NotFoundPage from './Pages/NotFoundPage';
import ChatDisplay from './Components/Chat Display/ChatDisplay';
import Groups from './Components/Groups/Groups';
import Users from './Components/Users/Users';
import Welcome from './Components/Common Components/Welcome';
import NotAuthenticated from './Pages/NotAuthenticated';
import DialogBox from './DialogBox';
import Auth from './Pages/Auth';
import Login from './Components/Login and Register/Login';
import Register from './Components/Login and Register/Register';
import { loaderContext } from './Context/loaderContext';
import JoinGroupByLink from './Pages/JoinGroupByLink';

function App() {
  // loader function
  // const [open, setOpen] = useState(false);
  const {loaded,setLoaded} = useContext(loaderContext)
  const handleClose = () => {
    setLoaded(false);
  };
  const theme = useDynamicTheme();
  

  return (
    <ThemeProvider theme={theme}>
        <div className="App">
        {/* loading */}
        <Backdrop
        sx={{ color: '#fff',bgcolor:'rgba(0,0,0,0.7)', backdropFilter:'blur(3px)',zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loaded}
        onClick={handleClose}
      >
          <Grid
            height="80"
            width="80"
            color="#c3c3c3"
            ariaLabel="grid-loading"
            radius="12.5"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </Backdrop>
      {/* loader end */}
      {/* toastContainer */}
        <ToastContainer
          position="bottom-center"
          autoClose={1000}
          hideProgressBar
          limit={1}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="colored"
        />
        
        

          <Routes>

            <Route path='/' element={<Auth />} >     
                <Route path='/' element={<Login  />} />
                <Route path='/register' element={<Register />} />
            </Route>
            <Route path='app' element={<Home />} >
              <Route path='users' element={<Users />}>  
                  {/* <Route path='' element={<ChatDisplay/>}/> */}
                  <Route path='' element={<Welcome/>}/>
                  <Route path='chat/:_id' element={<ChatDisplay/>}/>
              </Route>
              <Route path='groups' element={<Groups  />}>
                  <Route path='' element={<Welcome/>}/>
                  {/* <Route path='' element={<ChatDisplay/>}/> */}
                  <Route path='chat/:_id' element={<ChatDisplay isGroup />}/>
              </Route>
              <Route path='settings' element={<Settings/>}/>
            </Route>
            <Route path='joinGroupChat/:_id' element={<JoinGroupByLink/>}/>
            <Route path='not-authenticated' element={<NotAuthenticated />} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>

        </div>
    </ThemeProvider>
  );
}

export default App;
