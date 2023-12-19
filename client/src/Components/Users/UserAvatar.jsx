import React from 'react'
import { OfflineStyledBadge, OnlineStyledBadge } from '../../Material ui/Styled Components'
import Avatar from '@mui/material/Avatar';
import { useSelector } from 'react-redux'

const colors = [
    '#5D8AA8', '#0072B5', '#935529', '#1E90FF','#00A170', '#DE3163','#17B169',
]
const colors2 = [
    '#1034A6', '#6F00FF', '#D2122E', '#F400A1','#CD5700', '#568203','#01796F',
]

const array1 = ['G', 'U', 'T', 'W'];
const array2 = ['M', 'K', 'L', 'V'];
const array3 = ['S', 'Q', 'R', 'X'];
const array4 = ['B', 'A', 'C', 'Y'];
const array5 = ['F', 'E', 'D', 'Z'];
const array6 = ['I', 'H', 'J'];
const array7 = ['O', 'N', 'P'];



// # Seven arrays with unique alphabets
const colorCheck = (name)=>{
  let alphabet =  name?.slice(0,1).toUpperCase();
  if(array1.includes(alphabet)){
      return colors[0]
  }else if(array2.includes(alphabet)){
      return colors[1]
  }else if(array3.includes(alphabet)){
      return colors[2]
  }else if(array4.includes(alphabet)){
      return colors[3]
  }else if(array5.includes(alphabet)){
      return colors[4]
  }else if(array6.includes(alphabet)){
      return colors[5]
  }else{
    return colors[6]
  }
}
// # Seven arrays with unique alphabets FOR GROUPS
const colorCheckGroup = (name)=>{
  let alphabet =  name?.slice(0,1).toUpperCase();
  if(array1.includes(alphabet)){
      return colors2[0]
  }else if(array2.includes(alphabet)){
      return colors2[1]
  }else if(array3.includes(alphabet)){
      return colors2[2]
  }else if(array4.includes(alphabet)){
      return colors2[3]
  }else if(array5.includes(alphabet)){
      return colors2[4]
  }else if(array6.includes(alphabet)){
      return colors2[5]
  }else{
    return colors2[6]
  }
}


function UserAvatar({width,height,isOnline,pfp,uName,noBadge,isGroup,fs}) {
    const lightTheme = useSelector(state=>state.themeKey)

  return (
    <>
        {
            isOnline?
            <OnlineStyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant={!noBadge?"dot":''}
          >
            <Avatar
              sx={{
                width: width,
                height: height,
                outline: lightTheme?"2px solid rgba(255,255,255,0.3)":"2px solid rgba(0,0,0,0.1)",
                bgcolor:isGroup?colorCheckGroup(uName):colorCheck(uName),
                fontSize:fs
              }}
              alt={uName?.slice(0,1)}
              src={pfp}
            >{uName?.slice(0,1)}</Avatar>
            </OnlineStyledBadge>
            :
            <OfflineStyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant={!noBadge?"dot":''}
          >
            <Avatar
              sx={{
                width: width,
                height: height,
                outline: lightTheme?"2px solid rgba(255,255,255,0.3)":"2px solid rgba(0,0,0,0.3)",
                bgcolor:isGroup?colorCheckGroup(uName):colorCheck(uName),
                fontSize:fs
              }}
              alt={uName?.slice(0,1)}
              src={pfp}
            >{uName?.slice(0,1)}</Avatar>
            </OfflineStyledBadge>
            }
    </>
  )
}

export default UserAvatar