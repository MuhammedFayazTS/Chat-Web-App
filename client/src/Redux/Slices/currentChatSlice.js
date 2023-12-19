const { createSlice } = require("@reduxjs/toolkit");

const currentChatSlice = createSlice({
    name:"currentChatSlice",
    initialState:{},
    reducers:{
        setCurrentChat:(state,action)=>{
            return action.payload
        }
    }
})

export const {setCurrentChat}= currentChatSlice.actions
export default currentChatSlice.reducer