import { motion } from "framer-motion";
import styled, { keyframes } from "styled-components";
import { FaMusic } from "react-icons/fa";

const pulseMusic = keyframes`
0% { box-shadow: 0 0 24px 6px #ff00cc33; }
50% { box-shadow: 0 0 44px 22px #00ffe077, 0 0 68px 20px #ffea0044; }
100% { box-shadow: 0 0 24px 6px #ff00cc33; }
`;

const VaultShell = styled(motion.section)`
width: 420px;
margin: 36px auto 40px auto;
background: rgba(24, 8, 36, 0.97);
border-radius: 26px;
border: 4px solid #31dfff;
box-shadow: 0 0 92px 20px #ff00cc33, 0 0 64px 10px #ffea00aa;
animation: ${pulseMusic} 2.8s infinite;
padding: 38px 36px;
display: flex;
flex-direction: column;
align-items: center;
position: relative;
`;

const Title = styled.h2`
color: #ff00cc;
font-size: 2rem;
letter-spacing: 2px;
margin: 0 0 12px 0;
text-shadow: 0 0 16px #31dfff;
font-weight: 800;
`;

const Sub = styled.p`
color: #fff9;
font-size: 1.07rem;
text-align: center;
margin-bottom: 16px;
`;

const Visualizer = styled.div`
width: 100%;
height: 44px;
display: flex;
align-items: flex-end;
gap: 6px;
margin: 26px 0 18px 0;
`;

const Bar = styled.div<{ h: number }>`
width: 14px;
height: ${({ h }) => h}px;
background: linear-gradient(180deg, #fff01a 0%, #ff00cc 100%);
border-radius: 6px 6px 2px 2px;
box-shadow: 0 0 14px 2px #31dfff88;
transition: height 0.22s cubic-bezier(.22,1.02,.7,.98);
`;

export function MusicVault() {
// Fake visualizer for demo—replace with live audio later
const barHeights = [36, 17, 50, 28, 42, 11, 33, 20, 45, 21, 39, 27];

return (
<VaultShell
initial={{ scale: 0.93, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ type: "spring", stiffness: 90, damping: 11 }}
>
<FaMusic size={44} color="#fff01a" style={{ marginBottom: "-2px", textShadow: "0 0 18px #ff00cc" }}/>
<Title>Music Vault</Title>
<Sub>Stream, remix, and vibe with community beats.<br/>Plug in AI DJ soon.</Sub>
<Visualizer>
{barHeights.map((h, i) => (
<Bar key={i} h={h} />
))}
</Visualizer>
<span style={{ color: "#31dfff", fontWeight: 500 }}>
🔊 Live audio channels, player, and AI DJ coming up!
</span>
</VaultShell>
);
}

export default MusicVault;
