import styled, { keyframes } from "styled-components";
import { FaRobot, FaMusic, FaUserAstronaut, FaUserNinja, FaCrown } from "react-icons/fa";

const pulseAvatar = keyframes`
0% { box-shadow: 0 0 8px 3px #ff00cc66; }
45% { box-shadow: 0 0 28px 10px #31dfffbb, 0 0 16px 3px #ffea00cc; }
100% { box-shadow: 0 0 8px 3px #ff00cc66; }
`;

const Row = styled.div`
display: flex;
gap: 22px;
justify-content: center;
align-items: flex-end;
margin: 18px 0 38px 0;
z-index: 6;
position: relative;
`;

const AvatarShell = styled.div<{ color: string }>`
background: ${({ color }) => color}25;
border: 3px solid ${({ color }) => color};
border-radius: 50%;
padding: 13px 13px 9px 13px;
font-size: 2.1rem;
position: relative;
animation: ${pulseAvatar} 2.7s infinite;
transition: transform 0.15s, filter 0.17s;
&:hover {
transform: scale(1.11) rotate(-2deg);
filter: brightness(1.18);
z-index: 11;
cursor: pointer;
}
`;

const Name = styled.span`
display: block;
color: #fff;
font-size: 1rem;
font-family: 'Fira Mono', monospace;
font-weight: 700;
letter-spacing: .045em;
margin-top: 2px;
text-align: center;
opacity: 0.85;
`;

export default function LiveAvatars() {
return (
<Row>
<AvatarShell color="#31dfff" title="ai_blitz">
<FaRobot /><Name>ai_blitz</Name>
</AvatarShell>
<AvatarShell color="#ff00cc" title="dj_neon">
<FaMusic /><Name>dj_neon</Name>
</AvatarShell>
<AvatarShell color="#fff01a" title="astro_zen">
<FaUserAstronaut /><Name>astro_zen</Name>
</AvatarShell>
<AvatarShell color="#17c6ff" title="code_ninja">
<FaUserNinja /><Name>code_ninja</Name>
</AvatarShell>
<AvatarShell color="#ffea00" title="gold_crown">
<FaCrown /><Name>gold_crown</Name>
</AvatarShell>
</Row>
);
}
