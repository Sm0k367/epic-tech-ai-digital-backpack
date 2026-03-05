import { motion } from "framer-motion";
import styled, { keyframes } from "styled-components";
import { FaGamepad } from "react-icons/fa";

const pulseGame = keyframes`
0% { box-shadow: 0 0 20px 6px #ffea00cc; }
50% { box-shadow: 0 0 60px 22px #31dfff55, 0 0 30px 8px #ff00ccaa; }
100% { box-shadow: 0 0 20px 6px #ffea00cc; }
`;

const Shell = styled(motion.section)`
width: 410px;
margin: 32px auto 42px auto;
background: rgba(31, 18, 34, 0.97);
border-radius: 26px;
border: 4px solid #ffea00;
box-shadow: 0 0 82px 18px #31dfff22, 0 0 60px 10px #ff00cc99;
animation: ${pulseGame} 2.75s infinite;
padding: 38px 34px 26px 34px;
display: flex;
flex-direction: column;
align-items: center;
position: relative;
`;

const Title = styled.h2`
color: #ffea00;
font-size: 2rem;
letter-spacing: 2px;
margin: 0 0 12px 0;
text-shadow: 0 0 16px #ff00cc;
font-weight: 800;
`;

const MiniLeaderboard = styled.div`
width: 92%;
background: linear-gradient(90deg, #181825 75%, #ffea0066);
color: #fff;
font-size: 1.02rem;
padding: 10px 14px 7px 14px;
border-radius: 10px;
margin: 18px 0 10px 0;
font-family: 'Fira Mono', monospace;
box-shadow: 0 0 12px #31dfff40;
font-weight: 700;
text-align: left;
`;

export function GameLabs() {
return (
<Shell
initial={{ scale: 0.93, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ type: "spring", stiffness: 104, damping: 13 }}
>
<FaGamepad size={40} color="#ffea00" style={{ marginBottom: "-2px", textShadow: "0 0 13px #31dfff" }}/>
<Title>Game Labs</Title>
<MiniLeaderboard>
<b>Live Leaderboard</b><br/>
👾 neon_kid &nbsp;&nbsp; 990 pts<br/>
👑 ultra_one &nbsp;&nbsp;&nbsp;888 pts<br/>
🔥 blitz_ai &nbsp;&nbsp;&nbsp;&nbsp;777 pts
</MiniLeaderboard>
<span style={{ color: "#31dfff", fontWeight: 500, marginTop: 14 }}>
🕹️ Remix, play, and battle your crew—live!<br/>
Game uploads, collab, and XP drops coming soon!
</span>
</Shell>
);
}

export default GameLabs;
