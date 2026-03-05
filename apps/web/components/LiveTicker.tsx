import styled, { keyframes } from "styled-components";
import { useEffect, useState } from "react";

const tickerSlide = keyframes`
0% { transform: translateX(100%); }
100% { transform: translateX(-100%); }
`;

const TickerBar = styled.div`
position: fixed;
top: 64px;
left: 0; right: 0;
width: 100vw;
z-index: 99;
background: linear-gradient(90deg, #181825 70%, #31dfff88);
padding: 9px 0 7px 0;
border-bottom: 2px solid #ff00cc55;
overflow: hidden;
box-shadow: 0 5px 26px #ff00cc33;
`;

const Track = styled.div`
display: inline-block;
white-space: nowrap;
font-size: 1rem;
color: #ffea00;
font-family: 'Fira Mono', monospace;
font-weight: 700;
letter-spacing: 0.025em;
padding-left: 100vw;
animation: ${tickerSlide} 24s linear infinite;
`;

const DEMO_EVENTS = [
"🔥 dj_neon dropped a remix in Music Vault",
"🤖 ai_blitz just launched a new code snippet",
"🎤 Open Mic: 'Epic Riffs' highlight montage is live now!",
"👾 blitz_ai hit #1 on Game Labs leaderboard",
"🚀 astro_zen deployed a fresh AI bot for chat"
];

export default function LiveTicker() {
const [msg, setMsg] = useState(DEMO_EVENTS[0]);
useEffect(() => {
let i = 1;
const t = setInterval(() => {
setMsg(DEMO_EVENTS[i++ % DEMO_EVENTS.length]);
}, 14000);
return () => clearInterval(t);
}, []);
return (
<TickerBar role="status" aria-live="polite">
<Track>{msg}</Track>
</TickerBar>
);
}
