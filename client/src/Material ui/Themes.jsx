// import styled from '@emotion/styled';
// import { grey } from '@mui/material/colors';
// import { ThemeOptions, createTheme } from '@mui/material/styles';

// export const theme = createTheme({
//   palette:{
//     primary:{
//         main:'#A251E1',
//         dark:'#7d3fad',
//         contrastText:'#EED8FF'
//     },
//     secondary:{
//         main:'#31C2BF',
//         dark:'#2CB3B0',
//         light:'#36D2CE',
//         contrastText:'#EFF0FF'
//     },
//     success:{
//         main:'#28B056'
//     },
//     info:{
//         main:'#0C3D61'
//     },
//     warning:{
//       main:'#FFB906'
//     },
//     error:{
//       main:'#DA291C',
//       dark:'#CF1020',
//       light:'#ED2939'
//     }
//   },
// });



// Material ui/Themes.jsx
// Material ui/Themes.jsx
import { green } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export function useColorThemeSelector() {
  // Custom hook to get the color theme from Redux state
  return useSelector(state => state.colorTheme);
}

const purpleTheme = {
    primary: {
      main: '#A251E1',
      dark: '#7d3fad',
      contrastText: '#EED8FF',
    },
    secondary: {
      main: '#8449B1',
      dark: '#45235F',
      light: '#B895D2',
      contrastText: '#6A3693',
    },
    success: {
      main: '#018749',
      light: '#279964',
      dark: '#01733E',
      contrastText:'#D9EDE4'
    },
    info: {
      main: '#318CE7',
      light: '#83BAF1',
      dark: '#2C7ED0',
      contrastText:'#D9ECFF'
    },
    warning: {
      main: '#D57026',
      dark: '#D05F0D',
      light: '#E19A66',
      contrastText:'#F8E6D9'
    },
    error: {
      main: '#D03F35',
      dark: '#CE3429',
      light: '#DE7770',
      contrastText:'#F7DDDB'
    },
    // You can include more palette configurations as needed
  }


const SkyTheme = {
    primary: {
      main: '#007FFF',
      dark: '#3457D5',
      contrastText: '#F0F8FF',
    },
    secondary: {
      main: '#40A1FF',
      dark: '#1A7AD9',
      light: '#9ACDFF',
      contrastText: '#145EA6',
    },
    success: {
      main: '#16A864',
      light: '#5DC896',
      dark: '#149659',
      contrastText:'#DCF3E9'
    },
    info: {
      main: '#0BA6F2',
      light: '#18B3FF',
      dark: '#0A95D9',
      contrastText:'#DBF3FF'
    },
    warning: {
      main: '#FEC11C',
      dark: '#E5AB0E',
      light: '#FECB40',
      contrastText:'#FFF5DB'
    },
    error: {
      main: '#E63C4A',
      dark: '#CC2231',
      light: '#E9515E',
      contrastText:'#FBDEE1'
    },
    // You can include more palette configurations as needed
  }

const greenTheme = {
    primary: {
      main: '#159F5F',
      dark: '#128E54',
      light:'#23B571',
      contrastText: '#DCF3E9',
    },
    secondary: {
      main: '#26A763',
      dark: '#219056',
      light: '#8EEDBB',
      contrastText: '#196F42',
    },
    success: {
      main: '#197FCB',
      light: '#2686CE',
      dark: '#006BBB',
      contrastText:'#D9EAF6'
    },
    info: {
      main: '#0BA6F2',
      light: '#18B3FF',
      dark: '#0A95D9',
      contrastText:'#DBF3FF'
    },
    warning: {
      main: '#FECB40',
      dark: '#FEC11C',
      light: '#FED258',
      contrastText:'#FFF9E7'
    },
    error: {
      main: '#DE3E33',
      dark: '#CF271B',
      light: '#E0493E',
      contrastText:'#F9DFDD'
    },
    // You can include more palette configurations as needed
  }

const blackTheme = {
    primary: {
      main: '#363636',
      dark: '#2C2C2C',
      light:'#4D4D4D',
      contrastText: '#E3E3E3',
    },
    secondary: {
      main: '#292929',
      dark: '#1B1B1B',
      light: '#575757',
      contrastText: '#BEBEBE',
    },
    success: {
      main: '#00A261',
      light: '#19B375',
      dark: '#009157',
      contrastText:'#D9F2E8'
    },
    info: {
      main: '#0D7DD0',
      light: '#268BD5',
      dark: '#006AB9',
      contrastText:'#D9EAF8'
    },
    warning: {
      main: '#F2CC00',
      dark: '#E6C200',
      light: '#FFDF33',
      contrastText:'#FFF9D9'
    },
    error: {
      main: '#D42626',
      dark: '#B80000',
      light: '#D63333',
      contrastText:'#F7D9D9'
    },
    // You can include more palette configurations as needed
  }

const darkBlueTheme = {
    primary: {
      main: '#033F85',
      dark: '#02356F',
      light:'#104F99',
      contrastText: '#D9E3EF',
    },
    secondary: {
      main: '#03438D',
      dark: '#104F99',
      light: '#2962A4',
      contrastText: '#D9E3EF',
    },
    success: {
      main: '#00A261',
      light: '#19B375',
      dark: '#009157',
      contrastText:'#D9F2E8'
    },
    info: {
      main: '#0D7DD0',
      light: '#268BD5',
      dark: '#006AB9',
      contrastText:'#D9EAF8'
    },
    warning: {
      main: '#F2CC00',
      dark: '#E6C200',
      light: '#FFDF33',
      contrastText:'#FFF9D9'
    },
    error: {
      main: '#D42626',
      dark: '#B80000',
      light: '#D63333',
      contrastText:'#F7D9D9'
    },
    // You can include more palette configurations as needed
  }

const pinkTheme = {
    primary: {
      main: '#DE3163',
      dark: '#BD2A54',
      light:'#E14673',
      contrastText: '#FAE0E8',
    },
    secondary: {
      main: '#E14673',
      dark: '#E03B6B',
      light: '#E55A82',
      contrastText: '#FAE0E8',
    },
    success: {
      main: '#00A261',
      light: '#19B375',
      dark: '#009157',
      contrastText:'#D9F2E8'
    },
    info: {
      main: '#0BA6F2',
      light: '#18B3FF',
      dark: '#0A95D9',
      contrastText:'#DBF3FF'
    },
    warning: {
      main: '#F2CC00',
      dark: '#E6C200',
      light: '#FFDF33',
      contrastText:'#FFF9D9'
    },
    error: {
      main: '#BD0D2C',
      dark: '#A7001E',
      light: '#C42642',
      contrastText:'#F5D9DE'
    },
    // You can include more palette configurations as needed
  }

  const colorThemeCheck = (color)=>{
    if(color === 'purple'){
      return purpleTheme;
    }
    else if(color === 'green'){
      return greenTheme
    }
    else if(color === 'black'){
      return blackTheme
    }
    else if(color === 'blue'){
      return darkBlueTheme
    }
    else if(color === 'pink'){
      return pinkTheme
    }
    else{
      return SkyTheme
    }
  }

export function createCustomTheme(colorTheme) {
  // Function to create a custom theme based on the colorTheme
  const theme = createTheme({
    // palette: {
    //   primary: {
    //     main: '#A251E1',
    //     dark: '#7d3fad',
    //     contrastText: '#EED8FF',
    //   },
    //   secondary: {
    //     main: '#31C2BF',
    //     dark: '#2CB3B0',
    //     light: '#36D2CE',
    //     contrastText: '#EFF0FF',
    //   },
    //   success: {
    //     main: '#28B056',
    //   },
    //   info: {
    //     main: '#0C3D61',
    //   },
    //   warning: {
    //     main: '#FFB906',
    //   },
    //   error: {
    //     main: '#DA291C',
    //     dark: '#CF1020',
    //     light: '#ED2939',
    //   },
    //   // You can include more palette configurations as needed
    // },
    palette:colorThemeCheck(colorTheme)
    // Other theme configurations...
  });

  return theme;
}

export function useDynamicTheme() {
  const colorTheme = useColorThemeSelector();
  const [customTheme, setCustomTheme] = useState(createCustomTheme(colorTheme));

  useEffect(() => {
    // Function to create a custom theme based on the colorTheme
    const updatedTheme = createCustomTheme(colorTheme);
    setCustomTheme(updatedTheme);
  }, [colorTheme]);

  return customTheme;
}
