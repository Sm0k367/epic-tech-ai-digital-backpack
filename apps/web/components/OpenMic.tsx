import { motion } from "framer-motion";
import styled, { keyframes } from "styled-components";
import { FaMicrophoneAlt } from "react-icons/fa";

const pulseMic = keyframes`
0% { box-shadow: 0 0 19px 5px #17c6ff77; }
50% { box-shadow: 0 0 55px 26px #ff00ccaa, 0 0 44px 12px #fff01a99; }
100% { box-shadow: 0 0 19px 5px #17c6ff77; }
`;

const Shell = styled(motion.section)`
width: 430px;
margin: 34px auto 42px auto;
background: rgba(22, 28, 38, 0.98);
border-radius: 26px;
border: 4px solid #17c6ff;
box-shadow: 0 0 90px 16px #ff00cc44, 0 0 50px 6px #fff01a77;
animation: ${pulseMic} 2.8s infinite;
padding: 38px 34px 28px 34px;
display: flex;
flex-direction: column;
align-items: center;
position: relative;
`;

const Title = styled.h2`
color: #17c6ff;
font-size: 2rem;
letter-spacing: 2px;
margin: 0 0 10px 0;
text-shadow: 0 0 16px #ff00cc;
font-weight: 800;
`;

const Event = styled.div`
width: 100%;
background: linear-gradient(90deg, #181825 85%, #31dfff33 100%);
color: #fff;
font-size: 1.09rem;
padding: 13px 17px;
border-radius: 9px;
margin: 16px 0 10px 0;
box-shadow: 0 0 15px #ffea0040;
font-weight: 600;
text-align: center;
`;

const Reactions = styled.div`
width: 100%;
display: flex;
justify-content: center;
gap: 18px;
margin-top: 10px;
font-size: 1.37rem;
filter: drop-shadow(0 0 8px #31dfffAA);
`;

export function OpenMic() {
return (
<Shell
initial={{ scale: 0.92, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ type: "spring", stiffness: 100, damping: 15 }}
>
<FaMicrophoneAlt size={40} color="#17c6ff" style={{ marginBottom: "-2px", textShadow: "0 0 13px #fff01a" }}/>
<Title>Open Mic Console</Title>
<Event>
🚀 <b>AI Host:</b> Who’s dropping in next?<br/>
The crowd is live—submit your jam or story!
</Event>
<Reactions>
🔥 🙌 🤖 🎤 👑 🎶
</Reactions>
<span style={{ color: "#fff01a", fontWeight: 500, marginTop: 12 }}>
🎙️ Crowd engagement, AI hosts, and auto-montages dropping soon!
</span>
</Shell>
);
}

export default OpenMic;
