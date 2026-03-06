import { motion } from "framer-motion";
import styled, { keyframes } from "styled-components";
import { FaCode } from "react-icons/fa";

const pulseCode = keyframes`
0% { box-shadow: 0 0 23px 5px #fff01a55; }
50% { box-shadow: 0 0 48px 22px #31dfff88, 0 0 64px 8px #ff00cc77; }
100% { box-shadow: 0 0 23px 5px #fff01a55; }
`;

const VaultShell = styled(motion.section)`
width: 440px;
margin: 38px auto 42px auto;
background: rgba(28, 28, 40, 0.97);
border-radius: 28px;
border: 4px solid #fff01a;
box-shadow: 0 0 75px 16px #31dfff33, 0 0 60px 6px #ff00ccaa;
animation: ${pulseCode} 2.6s infinite;
padding: 38px 34px 24px 34px;
display: flex;
flex-direction: column;
align-items: center;
position: relative;
`;

const Title = styled.h2`
color: #fff01a;
font-size: 2rem;
letter-spacing: 2px;
margin: 0 0 12px 0;
text-shadow: 0 0 18px #31dfff;
font-weight: 800;
`;

const Snippet = styled.pre`
background: linear-gradient(90deg, #181825 80%, #ffea0022 98%);
color: #ffea00;
font-size: 1.01rem;
padding: 14px 17px;
border-radius: 12px;
margin: 15px 0;
line-height: 1.5;
font-family: 'Fira Mono', 'JetBrains Mono', monospace;
overflow-x: auto;
box-shadow: 0 0 18px #31dfff55;
font-weight: 600;
`;

export function CodeVaults() {
return (
<VaultShell
initial={{ scale: 0.94, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ type: "spring", stiffness: 102, damping: 13 }}
>
<FaCode size={44} color="#fff01a" style={{ marginBottom: "-2px", textShadow: "0 0 14px #31dfff" }}/>
<Title>Code Vaults</Title>
<Snippet>
{`const launch = () => {
remix('music-vault');
glow('open-mic');
deploy('game-labs');
}; // All live, all hackable.`}
</Snippet>
<span style={{ color: "#31dfff", fontWeight: 500, marginTop: 8 }}>
💾 Real-time snippets, sandbox deploys, and collab coming soon!
</span>
</VaultShell>
);
}

export default CodeVaults;
