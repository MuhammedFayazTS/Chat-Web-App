import { Badge } from "@mui/material"
import { styled } from '@mui/material/styles';



export const OnlineStyledBadge = styled(Badge)(({ theme }) => ({
        "& .MuiBadge-badge": {
          backgroundColor: "#44b700",
          color: "#44b700",
          boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
          "&::after": {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            animation: "ripple 1.2s infinite ease-in-out",
            border: "1px solid currentColor",
            content: '""',
          },
        },
        "@keyframes ripple": {
          "0%": {
            transform: "scale(.8)",
            opacity: 1,
          },
          "100%": {
            transform: "scale(2.4)",
            opacity: 0,
          },
        },
      }))

export const OfflineStyledBadge = styled(Badge)(({ theme }) => ({
        "& .MuiBadge-badge": {
          backgroundColor: "#FFB906",
          color: "#FFB906",
          boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
          "&::after": {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            animation: "ripple 1.2s infinite ease-in-out",
            border: "1px solid currentColor",
            content: '""',
          },
        },
        "@keyframes ripple": {
          "0%": {
            transform: "scale(.8)",
            opacity: 1,
          },
          "100%": {
            transform: "scale(2.4)",
            opacity: 0,
          },
        },
      }))


      export const SidebarButton = styled('div')({
        width:'100%',
         padding:'8px',
          borderRadius:'5px' ,
          display:'flex' ,
          justifyContent:'center',
           alignItems:'center',
            
            cursor:'pointer'
      });