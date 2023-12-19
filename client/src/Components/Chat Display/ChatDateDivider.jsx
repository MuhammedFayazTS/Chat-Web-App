import { Divider, Typography } from '@mui/material'
import moment from 'moment'
import React from 'react'
import { DateFormat } from '../../utils/TimeFormat'
import { useSelector } from 'react-redux';

function ChatDateDivider({date}) {
  const currentDate = moment().format('DD-MM-YYYY');
  const yesterday = moment().subtract(1, 'days').format('DD-MM-YYYY');
  const lightTheme = useSelector(state=>state.themeKey)
  const color = lightTheme?'#999999':'#ADADAD'
  const BorderColor = lightTheme?'#D6D6D6':'#292929'

  // check if the date is yesterday
  // const isYesterday = moment(date).isSame(yesterday, 'day');
  const isYesterday = date === yesterday

  if(date !== DateFormat(moment())){
    return (
      <>
        <Divider  sx={{fontSize:10,fontWeight:'300',my:2,color:color, "&::before, &::after": {
      borderColor:BorderColor,
    },}} >
          {isYesterday?'Yesterday':date}
        </Divider>
    </>
  )
}else{
  return (
    <>
      <Divider  sx={{fontSize:10,fontWeight:'300',my:2,color:color, "&::before, &::after": {
      borderColor:BorderColor,
    },}} >
        Today
      </Divider>
  </>
) 
}
}

export default ChatDateDivider