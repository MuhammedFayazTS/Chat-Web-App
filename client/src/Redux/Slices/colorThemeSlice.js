import { createSlice } from "@reduxjs/toolkit";

const colorThemeSlice = createSlice({
    name:'colorThemeSlice',
    initialState:'',
    reducers:{
        setColorTheme:(state,action)=>{
            return action.payload;
        }
    }
})


export const {setColorTheme} = colorThemeSlice.actions
export default colorThemeSlice.reducer 