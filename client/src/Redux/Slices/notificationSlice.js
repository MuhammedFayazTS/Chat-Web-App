const { createSlice } = require("@reduxjs/toolkit");

const notificationSlice = createSlice({
    name: "notificationSlice",
    initialState: [],
    reducers: {
        setNotificationsRead: (state, action) => {
            state.push({ ...action.payload, isRead: true });
        },
        setNotificationsNotRead: (state, action) => {
            state.push({ ...action.payload, isRead: false });
        }
    }
});


export const {setNotificationsRead,setNotificationsNotRead} = notificationSlice.actions
export default notificationSlice.reducer