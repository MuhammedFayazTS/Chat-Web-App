import themeSliceReducer from './Slices/themeSlice'
import groupUsersSlice from './Slices/groupUsers.Slice';
import sideBarSlice from './Slices/sideBarSlice';
import currentChatSlice from './Slices/currentChatSlice';
import notificationSlice from './Slices/notificationSlice';
import colorThemeSlice from './Slices/colorThemeSlice';
import recieverDetailsSlice from './Slices/recieverDetailsSlice';
const { configureStore } = require("@reduxjs/toolkit");

const store = configureStore({
    reducer:{
        themeKey:themeSliceReducer,
        recieverDetails:recieverDetailsSlice,
        groupUsers:groupUsersSlice,
        sideBar:sideBarSlice,
        currentChat:currentChatSlice,
        notificationKey:notificationSlice,
        colorTheme:colorThemeSlice
    }
})


export default store