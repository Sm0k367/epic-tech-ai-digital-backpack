import { motion } from "framer-motion";
import styled, { keyframes } from "styled-components";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

// Club bling components
import NeonSidebar from "../components/NeonSidebar";
import AnimatedHeader from "../components/AnimatedHeader";
import LiveAvatars from "../components/LiveAvatars";
import MusicVault from "../components/MusicVault";
import AIChat from "../components/AIChat";
import CodeVaults from "../components/CodeVaults";
import OpenMic from "../components/OpenMic";
import GameLabs from "../components/GameLabs";

const pulse = keyframes`
0% { box-shadow: 0 0 25px 10px #ff00cc33; }
50% { box-shadow: 0 0 45px 25px #00ffe077, 0 0 100px 50px #ffea00cc; }
100% { box-shadow: 0 0 25px 10px #ff00cc33; }
`;
const neonText = keyframes`
0% { color: #F0F; text-shadow: 0 0 16px #0ff, 0 0 40px #fff01a; }
50% { color: #31DFFF; text-shadow: 0 0 32px #F0F, 0 0 80px #00ffe0; }
100% { color: #F0F; text-shadow: 0 0 16px #31DFFF, 0 0 40px #fff01a; }
`;

const Centerpiece = styled(motion.div)`
width: 360px; height: 360px;
border-radius: 50%; background: linear-gradient(145deg,#181825 70%, #5d2cec 100%);
margin: 78px auto 28px auto;
display: flex; align-items: center; justify-content: center;
animation: ${pulse} 2.4s infinite;
box-shadow: 0 0 40px 20px #c51cfc66, 0 0 120px 40px #17c6ff33;
position: relative; z-index: 3;
`;

const GlowText = styled(motion.h1)`
font-size: 2.75rem; font-weight: bold;
text-align: center; letter-spacing: 2px;
margin-bottom: 0;
animation: ${neonText} 2s infinite;
z-index: 4;
`;

const MainGrid = styled.div`
display: flex; flex-wrap: wrap; gap: 40px;
justify-content: center;
margin: 52px 0 38px 0;
z-index: 4; position: relative;
`;

const CallToActions = styled.div`
display: flex; gap: 40px; justify-content:center; margin: 54px 0 0 0;
`;
const CtaButton = styled(motion.button)`
font-size: 1.75rem; font-weight: 900; color: #fff;
padding: 0.7em 2.5em; border-radius: 16px; border: none;
background: linear-gradient(92deg,#ff00cc 60%, #31dfff 100%);
box-shadow: 0 0 32px #ffea0077, 0 0 40px #0ff5;
letter-spacing: 1px;
cursor: pointer;
transition: background 0.15s, transform 0.18s;
&:hover { transform: scale(1.12) rotate(1.5deg); filter: brightness(1.25); }
`;

export default function Home() {
return (
<div style={{ minHeight: "100vh", background: "#0b0c15", overflowX: "hidden", position: "relative" }}>
{/* Club header and neon sidebar always visible */}
<AnimatedHeader />
<NeonSidebar />

{/* Animated cosmic digital club background */}
<div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
<Canvas camera={{ position: [0,0,4], fov: 75 }}>
<Stars radius={80} depth={60} count={3600} factor={6} fade saturation={0.85} />
<ambientLight intensity={0.6} />
<OrbitControls autoRotate={true} enableZoom={false} enablePan={false} />
</Canvas>
</div>

{/* Central logo/shield */}
<Centerpiece
initial={{ scale: 0.7, opacity: 0, rotate: 22 }}
animate={{ scale: 1, opacity: 1, rotate: 0 }}
transition={{ type: "spring", stiffness: 120, damping: 14 }}
>
<svg width="210" height="210" viewBox="0 0 200 200" style={{zIndex: 4}}>
<defs>
<radialGradient id="backpackGlow" cx="50%" cy="50%" r="50%">
<stop offset="0%" stopColor="#fff01a" />
<stop offset="50%" stopColor="#17c6ff" />
<stop offset="100%" stopColor="#f0f" />
</radialGradient>
</defs>
<ellipse cx="100" cy="100" rx="88" ry="78" fill="url(#backpackGlow)" opacity="0.18"/>
<rect x="52" y="38" width="96" height="120" rx="35" fill="#171721" stroke="#ff00cc" strokeWidth="6"/>
<ellipse cx="100" cy="56" rx="27" ry="15" fill="#ffea00" opacity="0.87"/>
<rect x="70" y="118" width="60" height="24" rx="10" fill="#31dfff"/>
</svg>
</Centerpiece>

<GlowText
initial={{ scale:0.92, opacity:0.6 }}
animate={{ scale:1, opacity:1 }}
transition={{ type:"spring", stiffness:110, damping:8 }}
>
EPIC TECH AI DIGITAL BACKPACK
</GlowText>

{/* Avatars Party Row */}
<LiveAvatars />

{/* Main dashboard modules */}
<MainGrid>
<MusicVault />
<AIChat />
<CodeVaults />
<OpenMic />
<GameLabs />
</MainGrid>

<CallToActions>
<CtaButton whileHover={{ scale: 1.12, rotate:3 }}>Book Me</CtaButton>
<CtaButton whileHover={{ scale: 1.12, rotate:-3, background: "linear-gradient(76deg,#fff01a 40%,#ff00cc 100%)" }}>Collaborate</CtaButton>
<CtaButton whileHover={{ scale: 1.11, background: "linear-gradient(64deg,#31dfff 70%,#ffea00 110%)" }}>Launch Now</CtaButton>
</CallToActions>
</div>
);
}
