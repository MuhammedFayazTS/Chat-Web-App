const { createSlice } = require("@reduxjs/toolkit");

const themeSlice = createSlice({
    name: 'themeSlice',
    initialState:true,
    reducers:{
        toggleTheme:((state)=>{
            return !state;
        })
    }
})

export const {toggleTheme} = themeSlice.actions
export default themeSlice.reducer;