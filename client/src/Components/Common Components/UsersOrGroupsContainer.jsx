import { IconButton, Stack, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchBar from './SearchBar';
import GroupList from '../Groups/GroupList';
import UsersList from '../Users/UsersList';
import { useSelector } from 'react-redux';
import { grey } from '@mui/material/colors';
import ModalAdd from '../Modals/ModalAdd';
import { addModalContext } from '../../Context/addModalContext';
import { PlusCircle } from '@phosphor-icons/react';
import ModalJoinGroup from '../Modals/ModalJoinGroup';
// import AvailableGroups from './Groups';

function UsersOrGroupsContainer({isGroups}) {
  const [open, setOpen] = useState(false);
  const [searchGroup,setSearchGroup] = useState('')
  const [searchUser,setSearchUser] = useState('')
  const lightTheme = useSelector(state=>state.themeKey)
  const { openModal, setOpenModal} = useContext(addModalContext);

  useEffect(()=>{
    setOpen(openModal)
  },[openModal, setOpenModal])

  const [openJoin,setOpenJoin] = useState(false)
  
  return (
    <>
        <Stack flex={'1'}  mb={1} direction={'column'}  rowGap={1}  sx={{overflowY:'scroll'}} borderRadius={8} className='usersContainer'>
        <ModalAdd open={open} setOpen={setOpen} isGroups={isGroups} />
        <ModalJoinGroup  open={openJoin} setOpen={setOpenJoin} />

           <Stack direction={'column'} px={3}   >
                <Stack px={1} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography variant='h6' color={lightTheme?grey[700]:grey[400]}>{!isGroups?'Chats':'Groups'}</Typography>
                    <Stack direction={'row'} spacing={1}>
                      {isGroups && <IconButton onClick={(e)=>setOpenJoin(!openJoin)} color='primary' >
                        <PlusCircle size={25} weight="fill" />
                        </IconButton>}
                      <IconButton onClick={()=>setOpen(true)} color='primary'>
                        {!isGroups?
                        <PersonAddIcon/>
                        :
                        <GroupAddRoundedIcon/>
                        }
                      </IconButton>
                    </Stack>
                </Stack>
                {/* searchBar */}
                <SearchBar setSearchGroup={setSearchGroup} setSearchUser={setSearchUser} isGroups={isGroups} placeholder={isGroups? 'Group name' : 'User name'} />
           </Stack>

            {/* chats */}
              <Stack  height={'auto'} width={'100%'} direction={'column'}>
                  {isGroups?<GroupList searchGroup={searchGroup}/>
                  :<UsersList searchUser={searchUser} />}
                  {/* <AvailableGroups /> */}
              </Stack>
           
           
        </Stack>
       
    </>
  )
}

export default UsersOrGroupsContainer