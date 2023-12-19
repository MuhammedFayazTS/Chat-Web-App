import { Box, Button, IconButton, Skeleton, Stack, Typography,FormControl,InputAdornment, OutlinedInput } from '@mui/material'
import React, {  useContext, useEffect, useRef, useState } from 'react'
// icons
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import AttachmentIcon from '@mui/icons-material/Attachment';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
// color
import { grey } from '@mui/material/colors';
import MessageFromUser from './MessageFromUser';
import MessageToUser from './MessageToUser';
import ChatDateDivider from './ChatDateDivider';
import TypingAnimation from './TypingAnimation';
import {  useDispatch, useSelector } from 'react-redux';
import Picker from '@emoji-mart/react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import UserAvatar from '../Users/UserAvatar';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { setNotificationsNotRead, setNotificationsRead } from '../../Redux/Slices/notificationSlice';
import chatBgDefaultLight from '../../Assets/images/ChatAreaBgImages/lightChatBg.jpg'
import chatBgDefaultdark from '../../Assets/images/ChatAreaBgImages/darkChatBg.jpg'
import { DateFormat } from '../../utils/TimeFormat';
import { motion } from 'framer-motion';
import io from 'socket.io-client'
import Welcome from '../Common Components/Welcome';
import { myContext } from '../../Context/myContext';
const chatBg = [chatBgDefaultLight,chatBgDefaultdark]

const ENDPOINT = "http://localhost:5000";
var socket,selectedChatCompare;

function ChatArea({setView,view,isGroup}) {
  // context for refreshing
  const { refresh, setRefresh } = useContext(myContext);
  // redux useSelectors
  const lightTheme = useSelector(state=>state.themeKey)
  // recieverName
  const recieverDetails = useSelector(state=>state.recieverDetails)
  // diffrent states
  const [showEmoji,setShowEmoji] = useState(false)
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [typing,setTyping] =useState(false)
  const [isTyping,setIsTyping] = useState(false)
  // message section states
  const [messageContent, setMessageContent] = useState("");
  const [allMessagesCopy,setAllMessagesCopy] = useState([])
  const [allMessages, setAllMessages] = useState([]);
  const [loaded, setloaded] = useState(false);
  const [socketConnectionStatus,setSocketConnectionStatus] = useState(false)
  // dynamic parameter from url
  const dyParams = useParams();
  const [chat_id, chat_user] = dyParams && dyParams._id ? dyParams._id.split("&") : ["", ""]; 
  // navigate
  const nav = useNavigate()
  // use ref
  const inputRef = useRef(null); //for entering emoji to input field
  const handleShowEmoji =() =>{
    inputRef.current.focus()
    setShowEmoji(!showEmoji)
  }
  // current chat
  const currChat = useSelector(state=>state.currentChat)
  // notifications
  const {notifications,setNotifications} = useContext(myContext)
  // emoji handling
  const onEmojiSelect = (event) => {
    const ref = inputRef.current;
    ref.focus();
    const sym = event.unified.split("_");
    const codeArray = sym.map(el => parseInt(el, 16)); // Convert hex strings to integers
    const emoji = String.fromCodePoint(...codeArray);
    const msg = messageContent + emoji;
    setMessageContent(msg);
};


// handle change functionality
  const handleChange = (e) =>{
    setMessageContent(e.target.value)
    // typing indicator logic
    if(!socketConnectionStatus) return;
    // setting typing event
    if(!typing) {
      setTyping(true)
      socket.emit('typing',chat_id)
    }
    let lastTypingTime = new Date().getTime()
    var timerLength = 1000;
    setTimeout(()=>{
        var timeNow = new Date().getTime()  
        var timeDiff = timeNow - lastTypingTime;

        if(timeDiff >= timerLength && typing) 
        {
          socket.emit('stop typing',chat_id)
          setTyping(false)
        }
    }, timerLength)
  }

  // send message api call function
  const sendMessage = async() => {
    // console.log("SendMessage Fired to", chat_id._id);
    socket.emit('stop typing',chat_id)
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
    const {data} = await axios
      .post(
        "http://localhost:5000/message/",
        {
          content: messageContent,
          chatId: chat_id,
        },
        config
      )
      socket.emit("newMessage", data)
      setAllMessages([...allMessages,data])
  };


  // connecting sockets
  useEffect(()=>{
    socket = io(ENDPOINT);
    socket.emit("setup",userData.data)
    socket.on("connected",()=>setSocketConnectionStatus(true))
    socket.on('typing',()=>setIsTyping(true))
    socket.on('stop typing',()=>setIsTyping(false))

    return () => {
    socket.off("setup")
    };
  },[])

    // fetching messages
    useEffect(() => {
      // console.log("Users refreshed");
      const config = {
        headers: {
          Authorization: `Bearer ${userData.data.token}`,
        },
      };
      axios
        .get("http://localhost:5000/message/" + chat_id, config)
        .then(({ data }) => {
          setAllMessages(data);
          setRefresh(!refresh)
          setloaded(true);
          socket.emit("join chat",chat_id)
        });
      setAllMessagesCopy(allMessages)
      selectedChatCompare = allMessages;
    }, [refresh,,chat_id,chat_user]);

  
   
  // message recieved
  useEffect(()=>{
    socket.on("message Recieved",(newMessageRecieved) =>{
      if(!selectedChatCompare || selectedChatCompare._id!== newMessageRecieved.chat._id){
        // give notification
        if(!notifications.includes(newMessageRecieved)){
          setNotifications([newMessageRecieved,...notifications])
          setRefresh(!refresh)
        }
      }else{
        console.log("msg recieved");
        setAllMessages({...allMessages,newMessageRecieved})
      }
    })
  })
  
  // chat Bg
  const defaultConversationBg = lightTheme?`url(${chatBg[0]})`:`url(${chatBg[1]})`

    if (!loaded ) {
      return (
        <Box
          sx={{bgcolor:{xs:lightTheme?grey[300]:grey[800],md:'transparent'}}}
          style={{
            zIndex:20,
            border: "20px",
            padding: "10px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          
          }}
        >
          <Skeleton
            animation="wave"
            variant="rectangular"
            sx={{ width: "100%", borderRadius: "10px" }}
            height={60}
          />
          <Skeleton
            animation="wave"
            variant="rectangular"
            sx={{
              width: "100%",
              borderRadius: "10px",
              flexGrow: "1",
            }}
          />
          <Skeleton
            animation="wave"
            variant="rectangular"
            sx={{ width: "100%", borderRadius: "10px" }}
            height={60}
          />
        </Box>
      );
    } else {
  return (
    <>
        <Stack flex={{xs:1,md:1}} flexGrow={1} height={'100%'}  
        sx={{background:defaultConversationBg}}
        // bgcolor={theme => theme.palette.primary.light}
        direction={'column'}>
            
            {/* user details */}
            <Stack flex={.1}  direction={'row'} bgcolor={lightTheme?grey[300]:'#1a1a1a'}  alignItems={'center'} gap={.6} px={1.5} p={1}  >
              <IconButton  onClick={()=>nav(-1)}><ArrowBackRoundedIcon sx={{color:lightTheme?grey[700]:grey[500]}}/></IconButton>
              <UserAvatar width={'3rem'} height={'3rem'} uName={recieverDetails.name} pfp={recieverDetails.pfp} noBadge isGroup={isGroup} />
            {/* Details od User to which chatting */}
            <Stack flex={1} direction={'column'} >
                <Typography variant="p" color={lightTheme?grey[700]:grey[300]} >{recieverDetails.name}</Typography>
                <Typography display={isGroup?'none':'block'} variant="p" fontSize={'.6rem'} color={recieverDetails.isOnline?'#28B056':'#D9A200'}>{recieverDetails.isOnline?'Online':'Offline'}</Typography>                
                {isTyping && isGroup && <Typography fontSize={10} fontFamily={'monospace'} variant="body1" color={lightTheme?grey[700]:grey[300]} >Typing.....</Typography>}
            </Stack>
            {/* video call and audio call stack */}
            <Stack direction={'row'} gap={.5} >
                {/* <IconButton color='primary'><CallOutlinedIcon/></IconButton>
                <IconButton color='primary'><VideocamOutlinedIcon/></IconButton> */}
                {!view && <IconButton onClick={()=>setView(true)} color='primary'><MoreVertRoundedIcon/></IconButton>}
            </Stack>
            </Stack>

              {/* message display area */} 
              <Stack flex={1} direction={'column-reverse'}  p={2} sx={{overflowY:'scroll'}} spacing={2}  className='chatArea' textAlign={'justify'} 
              // color={lightTheme?'#A1A1A1':grey[700]}
               >
          {
            Array.isArray(allMessages) &&
            allMessages
              .slice(0)
              .reverse()
              .map((message, index, array) => {
                const sender = message?.sender;
                const selfId = userData?.data._id;
                const currDate = DateFormat(message.createdAt);
                const nextDate = index < array.length - 1 ? DateFormat(array[index + 1].createdAt) : null;
                const isLastMessageOfDate = nextDate !== currDate;
                const isGroupChat = message.chat.isGroupChat;
          
                return (
                  <React.Fragment key={`message.${index}`}>
                    {sender && sender._id === selfId ? (
                      <MessageFromUser
                        isGroup ={isGroupChat}
                        message={message?.content}
                        uName={userData.data.name}
                        pfp={userData.data.pfp}
                        key={index}
                        timeStamp={message.createdAt}
                        />
                        ) : (
                          <MessageToUser
                          socket={socket}
                        isGroup ={isGroupChat}
                        message={message?.content}
                        uName={sender.name}
                        userId={sender._id}
                        reaction={message?.reaction}
                        msgID={message._id}
                        key={index}
                        loaded={loaded}
                        timeStamp={message.created}
                      />
                    )}
                    {isLastMessageOfDate && (
                      <React.Fragment key={`divider.${index}`}>
                        <ChatDateDivider date={currDate} />
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )
              })
            }

              </Stack>
              {/* typing animation */}
            { isTyping ?<Box><TypingAnimation /></Box>:<Box></Box>}
              
              
              
          <Box zIndex={10} display={showEmoji? 'block' : 'none'} position={'absolute'} bottom={'13%'} right={view?'25%':'5%'}  >
            <Picker theme={lightTheme ? 'light' : 'dark'} onEmojiSelect={onEmojiSelect} onClickOutside={()=>showEmoji && setShowEmoji(false)} />
          </Box>
              {/* message type input */}
        <Stack flex={'.1'} px={2} pb={2} direction={'row'} spacing={1} position={'relative'} >
          {/* message input section */}
          <FormControl sx={{ m: 1, width: '100%' }} variant="filled">
            <OutlinedInput
              autoComplete='off'
              ref = {inputRef}
              value={messageContent}
              onChange={handleChange}
              onKeyDown={(event) => {
                if (event.code === "Enter") {
                  sendMessage();
                  setMessageContent("");
                  setRefresh(!refresh);
                }
              }}
              id="outlined-adornment-weight"
              aria-describedby="outlined-weight-helper-text"
              placeholder='message..'
              sx={{ color: lightTheme ? '#525252' : '#D9D9D9', bgcolor: lightTheme ? '#f5f5f7' : '#262626' }}
              inputProps={{
                'aria-label': 'weight',
              }}
              endAdornment={
                <InputAdornment position="end">
                  <Stack direction={'row'} mr={.3} >
                    {/* <IconButton size='small'><AttachmentIcon sx={{ color: lightTheme ? '#525252' : '#D9D9D9' }} /></IconButton> */}
                    <IconButton size='small' onClick={handleShowEmoji}>
                      {showEmoji?
                      <CloseRoundedIcon  sx={{ color: lightTheme ? '#525252' : '#D9D9D9'}} />:
                      <InsertEmoticonIcon sx={{ color: lightTheme ? '#525252' : '#D9D9D9'}} />
                      }
                    </IconButton>
                  </Stack>
                  <Button
                    onClick={() => {
                      sendMessage()
                      setMessageContent("")
                      setRefresh(!refresh)
                    }} 
                    variant='contained'><Typography variant='span' display={{xs:'none',md:'block'}}>
                      Send</Typography>
                      <SendRoundedIcon fontSize='small' sx={{ ml: .3 }} />
                      </Button>
                </InputAdornment>
              }
            />
          </FormControl>

        </Stack>  

             

            
                  
        </Stack>
    </>
  )
  }
}

export default ChatArea