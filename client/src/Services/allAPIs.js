import { useEffect } from "react";
import { BASE_URL } from "./base_url";
import { CommonAPI } from "./commonAPI";

const userData = JSON.parse(localStorage.getItem("userData"))

if(userData){
  // config
  var config = {
    Authorization:`Bearer ${userData.data.token}`
  }  
}

  export const fetchChats = async () =>{
    return await CommonAPI("get",`${BASE_URL}/chat/`,"",config)
}

// fetch groups
export const fetchGroups = async () =>{
  return await CommonAPI("get",`${BASE_URL}/chat/fetchGroups`,"",config)
}

// join groupChat
export const joinGroupChat = async (groupChat) =>{
  const {chatId,userId} = groupChat;
  return await CommonAPI("post",`${BASE_URL}/chat/joinGroup`,{chatId,userId},config)
}

// edit user details
export const editUserDetails = async (user) =>{
  const {userId,username,email} = user;
  return await CommonAPI("post",`${BASE_URL}/user/edituser`,{userId,username,email},config)
}

// remove single chat
export const removeChat = async (chatId) =>{
  return await CommonAPI("delete",`${BASE_URL}/chat/removeChat`,{chatId:chatId},config)
}

//access chat or add connection for chat
export const accessChat = async (userId) =>{
  return await CommonAPI("post",`${BASE_URL}/chat`,{userId:userId},config)
}

// create Group chat
export const createGroupChat = async (groupData)=>{
  return await CommonAPI("post",`${BASE_URL}/chat/createGroup`,groupData,config)
}

// fetch groups with search functionality
export const fetchGroupsSearchAPI = async (search) =>{
  return await CommonAPI("get",`${BASE_URL}/user/fetch-other-users?search=${search}`,"",config)
}

// EXIT GROUP
export const exitGroupAPI = async (group) =>{
  return await CommonAPI("delete",`${BASE_URL}/chat/exitgroup`,group,config)
}
// await axios.post('http://localhost:5000/user/exitgroup',{ chatId, userId },config)
//       .then(
//         // Update the state after the API call is successful
//         setRefresh(prevRefresh => !prevRefresh),
//         navigate('/app/groups'),
//         toast.success('Exited from group',toastConfig ),
//         )


// clear chat
export const clearChatAPI = async (chatId) =>{
  return await CommonAPI("post",`${BASE_URL}/chat/clearChat`,{chatId:chatId},config)
}

// setOnlineStatus Api
export const setOnlineStatusAPI = async (chatId,status)=>{
  return await CommonAPI("post",`${BASE_URL}/user/updateOnlineStatus`,{chatId:chatId,status:status},config)
}

// edit group api
export const editGroupAPI = async (groupDetails) =>{
  const {chatId,groupName} = groupDetails
  return await CommonAPI("put",`${BASE_URL}/chat/editgroup`,{chatId:chatId,groupName:groupName},config)
}

// fetch users in groups
export const getGroupAdminAPI = async (chatId) =>{
  return await CommonAPI("get",`${BASE_URL}/chat/getGroupAdmin/${chatId}`,"",config)
}

// fetch users in groups
export const getGroupUsersAPI = async (groupDetails) =>{
  return await CommonAPI("post",`${BASE_URL}/chat/fetchUserInGroup`,{chatId:groupDetails},config)
}

// fetch users not in groups
export const getNotGroupUsersAPI = async (groupDetails) =>{
  return await CommonAPI("post",`${BASE_URL}/chat/fetchUsersNotInGroup`,{chatId:groupDetails},config)
}

// add user to group api
export const addUsersToGroupAPI = async (groupData)=>{
  const {chatId,userId} = groupData
  return await CommonAPI("put",`${BASE_URL}/chat/addUserToGroup`,{chatId:chatId,userId:userId},config)
}

// remove user from group api
export const removeUsersFromGroupAPI = async (groupData)=>{
  const {chatId,userId} = groupData
  return await CommonAPI("put",`${BASE_URL}/chat/removeUserFromGroup`,{chatId:chatId,userId:userId},config)
}

// set admin
export const setGroupAdminAPI = async (groupData)=>{
  const {chatId,userId} = groupData
  return await CommonAPI("put",`${BASE_URL}/chat/setGroupAdmin`,{chatId:chatId,userId:userId},config)
}

// message reaction
export const reactToMessageAPI = async(msgID,reaction)=>{
  return await CommonAPI("put",`${BASE_URL}/message/reaction/${msgID}`,{reactionEmoji:reaction},config)
}

// fetch message reaction
export const fetchreactToMessageAPI = async(msgID)=>{
  return await CommonAPI("get",`${BASE_URL}/message/reaction/${msgID}`,"",config)
}
// remove message reaction
export const removeReactToMessageAPI = async(msgID)=>{
  return await CommonAPI("put",`${BASE_URL}/message/removeReaction/${msgID}`,{},config)
}

// fetch all users
export const fetchAllUsersAPI = async (search) =>{
  return await CommonAPI("get",`${BASE_URL}/user/fetchusers?search=${search}`,"",config)
}

// update user profile pic only
export const editUserPfpAPI = async (pfp) =>{
  return await CommonAPI("put",`${BASE_URL}/user/edituser/pfp`,{pfp:pfp},config)
}

// fetch user pfp
export const fetchUserPfpAPI = async (userId) =>{
  return await CommonAPI("get",`${BASE_URL}/user/fetchuserpfp/${userId}`,"",config)
}

// setUser offline
export const setUserOfflineAPI = async (userId)=>{
  return await CommonAPI("put",`${BASE_URL}/user/setOffline/${userId}`,{},config)
}

// remove account
export const removeAccountAPI = async (userId)=>{
  return await CommonAPI("delete",`${BASE_URL}/user/removeAccount/${userId}`,{},config)
}

// login api call
// export const loginAPI = async (data)=>{
//   console.log(data);
//   const {name,password} = data
//   return await CommonAPI("post",`${BASE_URL}/user/user/login`,{name:name,password:password},config)
// }