import type { AppProps } from "next/app";
import { createGlobalStyle, ThemeProvider } from "styled-components";

const GlobalStyle = createGlobalStyle`
html, body {
padding: 0;
margin: 0;
font-family: 'Inter', 'Fira Mono', 'JetBrains Mono', 'Menlo', 'Futura', sans-serif;
color: #e5e5f7;
background: #0b0c15;
min-height: 100vh;
scroll-behavior: smooth;
-webkit-font-smoothing: antialiased;
/* slick neon scrollbars */
scrollbar-width: thin;
scrollbar-color: #ff00cc #181825;
}
*::-webkit-scrollbar {
width: 10px;
background: #181825;
}
*::-webkit-scrollbar-thumb {
background: linear-gradient(120deg,#ff00cc 40%,#31dfff 90%);
border-radius: 7px;
}
html {
box-sizing: border-box;
}
*, *:before, *:after {
box-sizing: inherit;
}
a {
color: inherit;
text-decoration: none;
transition: color .2s;
}
a:hover {
color: #ffea00;
}
`;

const theme = {
colors: {
primary: "#ff00cc",
accent: "#31dfff",
yellow: "#ffea00",
bgDark: "#0b0c15",
text: "#e5e5f7",
},
};

export default function App({ Component, pageProps }: AppProps) {
return (
<ThemeProvider theme={theme}>
<GlobalStyle />
<Component {...pageProps} />
</ThemeProvider>
);
}
