import { motion } from "framer-motion";
import styled, { keyframes } from "styled-components";
import { FaRobot } from "react-icons/fa";

const pulseChat = keyframes`
0% { box-shadow: 0 0 20px 7px #31dfff44; }
50% { box-shadow: 0 0 44px 25px #ffea0049, 0 0 64px 15px #0ff9; }
100% { box-shadow: 0 0 20px 7px #31dfff44; }
`;

const ChatContainer = styled(motion.section)`
width: 408px;
margin: 38px auto 38px auto;
background: rgba(21, 26, 37, 0.97);
border-radius: 26px;
border: 4px solid #ff00cc;
box-shadow: 0 0 80px 14px #17c6ff33, 0 0 64px 8px #ffea00aa;
animation: ${pulseChat} 2.6s infinite;
padding: 34px 30px 28px 30px;
display: flex;
flex-direction: column;
align-items: center;
position: relative;
`;

const Title = styled.h2`
color: #31dfff;
font-size: 2rem;
letter-spacing: 2px;
margin: 0 0 10px 0;
text-shadow: 0 0 16px #ff00cc;
font-weight: 800;
`;

const Bubbles = styled.div`
width: 90%;
display: flex;
flex-direction: column;
gap: 11px;
margin: 24px 0;
`;

const BotBubble = styled.div`
align-self: flex-start;
max-width: 72%;
background: linear-gradient(90deg, #31dfff 80%, #ff00cc 120%);
color: #101323;
margin-left: 0;
border-radius: 17px 17px 17px 5px;
font-size: 1.13rem;
padding: 10px 18px;
font-weight: 600;
box-shadow: 0 0 20px #17c6ff33;
`;

const UserBubble = styled.div`
align-self: flex-end;
max-width: 73%;
background: linear-gradient(90deg, #ff00cc 15%, #fff01abf 99%);
color: #181825;
margin-right: 0;
border-radius: 17px 17px 5px 17px;
font-size: 1.13rem;
padding: 10px 18px;
font-weight: 600;
box-shadow: 0 0 20px #ff00cc55;
`;

export function AIChat() {
return (
<ChatContainer
initial={{ scale: 0.94, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ type: "spring", stiffness: 99, damping: 13 }}
>
<FaRobot size={41} color="#31dfff" style={{ marginBottom: "-2px", textShadow: "0 0 14px #ff00cc" }}/>
<Title>AI Chat & Bots</Title>
<Bubbles>
<BotBubble>
Need help launching an idea? I’m your digital co-conspirator. 🎛️
</BotBubble>
<UserBubble>
Let’s remix that vault code, make it thump!
</UserBubble>
<BotBubble>
Forked and deployed—watch the logs glow in real time. 🚀
</BotBubble>
</Bubbles>
<span style={{ color: "#ffea00", fontWeight: 500, marginTop: 8 }}>
🤖 Context-rich AI chat, real bots, and crew coming soon!
</span>
</ChatContainer>
);
}

export default AIChat;
