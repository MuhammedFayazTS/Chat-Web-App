import {  FormControl, IconButton, InputAdornment, OutlinedInput} from '@mui/material'
import React from 'react'
// icon
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';
import { MagnifyingGlass } from '@phosphor-icons/react';

function SearchBar({placeholder,setSearchGroup,isGroups,setSearchUser}) {
  
  const lightTheme = useSelector(state=>state.themeKey)
  return (

    <FormControl  sx={{ m: 1, width: '100%' }} variant="outlined">
          <OutlinedInput
          onChange={(e)=>{isGroups?setSearchGroup(e.target.value):setSearchUser(e.target.value)}}
          sx={{color:lightTheme?'#525252':'#D9D9D9',bgcolor:lightTheme?'#f5f5f7':'#262626',
          boxShadow:' rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px'}}
          size='small'
            id="outlined-adornment-weight"
            aria-describedby="outlined-weight-helper-text"
            placeholder={placeholder}
            inputProps={{
              'aria-label': 'weight',
            }}
            endAdornment={
              <InputAdornment position="end">
                    <IconButton   size='small'>
                    {/* <SearchIcon sx={{color:lightTheme?'#525252':'#D9D9D9'}} /> */}
                    <MagnifyingGlass style={{color:lightTheme?'#525252':'#999999'}} size={20} weight='bold' />
                    </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

  )
}

export default SearchBar