import { createSlice } from "@reduxjs/toolkit";

const sideBarSlice = createSlice({
    name: 'sideBarSlice',
    initialState:'chat',
    reducers:{
        setSidebarActive: (state,action)=>{
            return action.payload
        },
    }
})

export const {setSidebarActive} = sideBarSlice.actions
export default sideBarSlice.reducer