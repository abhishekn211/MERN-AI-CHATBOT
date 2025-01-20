import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(136, 136, 136, 0.1);
          border-radius: 4px;
          transition: background 0.2s;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(136, 136, 136, 0.4);
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(136, 136, 136, 0.1) transparent;
        }
      `,
    },
  },
});

export default theme; 