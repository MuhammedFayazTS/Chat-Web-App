import { createSlice } from "@reduxjs/toolkit";

const recieverDetailsSlice = createSlice({
    name: 'recieverDetailsSlice',
    initialState:{name:"Reciever",pfp:''},
    reducers:{
        setRecieverDetails: (state,action)=>{
            return action.payload;
        }
    }
})

export const {setRecieverDetails} = recieverDetailsSlice.actions
export default recieverDetailsSlice.reducer