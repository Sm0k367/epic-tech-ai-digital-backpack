import styled, { keyframes } from "styled-components";
import { FaBolt } from "react-icons/fa";

const glow = keyframes`
0% { text-shadow: 0 0 18px #ff00cc88, 0 0 40px #fff01a22; }
60% { text-shadow: 0 0 44px #31dfff99, 0 0 100px #ff00cc44; }
100% { text-shadow: 0 0 18px #ff00cc88, 0 0 40px #fff01a22; }
`;

const HeaderWrap = styled.header`
width: 100vw;
height: 64px;
position: fixed;
top: 0; left: 0;
z-index: 100;
display: flex;
align-items: center;
justify-content: center;
background: rgba(16, 8, 32, 0.76);
box-shadow: 0 2px 38px #ff00cc33;
backdrop-filter: blur(8px);
border-bottom: 3px solid #31dfff50;
`;

const Logo = styled.span`
display: inline-flex;
align-items: center;
font-size: 2.1rem;
font-weight: 900;
color: #ff00cc;
letter-spacing: 2px;
margin-right: 30px;
animation: ${glow} 2.4s infinite;
`;

const NowPlaying = styled.span`
font-size: 1.08rem;
color: #fff01a;
font-weight: 600;
background: #181825bb;
padding: 0.23em 1em;
border-radius: 13px;
margin-left: 18px;
letter-spacing: .04em;
box-shadow: 0 0 16px #31dfff66;
border: 1.6px solid #ff00cc77;
`;

export default function AnimatedHeader() {
return (
<HeaderWrap>
<Logo>
<FaBolt style={{marginRight: 10, color: "#fff01a"}} />
DIGITAL BACKPACK
</Logo>
<NowPlaying>
<span role="img" aria-label="play">🎧</span>
Now Playing: <b>Epic Tech AI Open Mic // Community Drop</b>
</NowPlaying>
</HeaderWrap>
);
}
