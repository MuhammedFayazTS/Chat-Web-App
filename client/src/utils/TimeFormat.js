import moment from "moment";

export const dateAndTimeFormat = (time) =>{
    return moment(time).format( "DD-MM-YYYY -hh:mm A");
  }

export const timeFormat = (time) =>{
    return moment(time).format( "hh:mm A");
  }

export const DateFormat = (time) =>{
    return moment(time).format( "DD-MM-YYYY");
  }