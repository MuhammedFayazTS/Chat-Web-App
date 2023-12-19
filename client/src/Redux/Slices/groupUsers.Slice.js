const { createSlice } = require("@reduxjs/toolkit");

const groupUsersSlice = createSlice({
    name: 'groupUsersSlice',
    initialState:[],
    reducers:{
        setGroupUsers: (state,action)=>{
            state.splice(0, state.length, ...action.payload);
        },
        deleteGroupUsers: (state,action)=>{
            state = []
        }
    }
})

export const {setGroupUsers,deleteGroupUsers} = groupUsersSlice.actions
export default groupUsersSlice.reducer