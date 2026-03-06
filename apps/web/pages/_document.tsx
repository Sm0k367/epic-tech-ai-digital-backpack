import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
static async getInitialProps(ctx: any) {
const sheet = new ServerStyleSheet();
const originalRenderPage = ctx.renderPage;

try {
ctx.renderPage = () =>
originalRenderPage({
enhanceApp: (App: any) => (props: any) =>
sheet.collectStyles(<App {...props} />),
});

const initialProps = await Document.getInitialProps(ctx);
return {
...initialProps,
styles: (
<>
{initialProps.styles}
{sheet.getStyleElement()}
</>
),
};
} finally {
sheet.seal();
}
}

render() {
return (
<Html lang="en">
<Head>
{/* Cyberpunk gradient background for browser chrome */}
<meta name="theme-color" content="#0b0c15" />
{/* Public badge/logo for social link/unfurl */}
<link rel="icon" href="/backpack-logo-cyberpunk.svg" />
{/* Google Fonts for extra style */}
<link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@600;800&family=Fira+Mono:wght@400;700&display=swap" rel="stylesheet"/>
<meta property="og:image" content="/backpack-logo-cyberpunk.svg" />
<meta property="og:title" content="Epic Tech AI Digital Backpack" />
<meta property="og:description" content="Always-on, modular, neon-blasted creative playground built with Next.js. All bling, no refresh required!" />
</Head>
<body>
<Main />
<NextScript />
</body>
</Html>
);
}
}
