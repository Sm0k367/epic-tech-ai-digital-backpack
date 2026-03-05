import { FaMusic, FaRobot, FaCode, FaMicrophoneAlt, FaGamepad, FaBolt } from "react-icons/fa";
import styled, { keyframes } from "styled-components";

const pulse = keyframes`
0% { box-shadow: 0 0 12px 2px #31dfff99; }
50% { box-shadow: 0 0 32px 12px #ff00cc88, 0 0 18px 4px #fff01a88; }
100% { box-shadow: 0 0 12px 2px #31dfff99; }
`;

const Sidebar = styled.nav`
position: fixed;
top: 50%;
left: 28px;
transform: translateY(-50%);
display: flex;
flex-direction: column;
gap: 30px;
z-index: 12;
`;

const IconWrap = styled.div<{color: string}>`
background: ${({color}) => color}22;
border: 2.5px solid ${({color}) => color};
padding: 15px;
border-radius: 18px;
margin: 0;
transition: all 0.21s;
box-shadow: 0 0 20px 0 ${({color}) => color}66;
display: flex;
justify-content: center;
align-items: center;
animation: ${pulse} 3.2s infinite;

&:hover {
background: ${({color}) => color};
filter: brightness(1.17);
scale: 1.08;
cursor: pointer;
box-shadow: 0 0 40px 14px ${({color}) => color}cc;
}
`;

export default function NeonSidebar() {
return (
<Sidebar>
<IconWrap color="#ff00cc" title="Music Vault">
<FaMusic size={30} />
</IconWrap>
<IconWrap color="#31dfff" title="AI Chat & Bots">
<FaRobot size={30} />
</IconWrap>
<IconWrap color="#fff01a" title="Code Vaults">
<FaCode size={30} />
</IconWrap>
<IconWrap color="#17c6ff" title="Open Mic">
<FaMicrophoneAlt size={30} />
</IconWrap>
<IconWrap color="#ffea00" title="Game Labs">
<FaGamepad size={30} />
</IconWrap>
<IconWrap color="#ff00cc" title="Apps Launcher">
<FaBolt size={30} />
</IconWrap>
</Sidebar>
);
}
