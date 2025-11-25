// === DOM ELEMENTS ===
const chatInput   = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox     = document.querySelector(".chatbox");

let userMessage;
let thinkingLi;

// ⚠ FRONTEND KEYS ARE NOT SAFE – USE ONLY FOR LOCAL TESTING / DEV
const API_KEY = "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"; 
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

// 🧠 Conversation memory with ChatAI + Kelvin (3rd person)
const conversation = [
  {
    role: "system",
    content: `
You are ChatAI, a helpful, friendly, and concise AI assistant.

=== Chatbot Identity ===
- Your name: ChatAI.
- You were created and designed by Kelvin Kgarudi.

- Your communication style should be short, clear, friendly, and easy to understand.

=== About Kelvin Kgarudi (your creator) ===
- Kelvin Kgarudi is a Data Science student specializing in Machine Learning and Web Development.
- Kelvin is from South Africa.
- Kelvin holds:
  • A BSc in Data Science
- Kelvin enjoys programming, building AI tools, and exploring new technologies.
- Kelvin doing BSc Data Science in Eduvos.
- Kelvin and group built a Fraud Detection App at Eduvos.
- Kelvin projects involve: Fraud Detection App (Eduvos), Stock Market/Forex/Crypto Forecaster using ML, Ecommerce Website.
- Kelvin LinkenIn account if a user wants to hire him: https://www.linkedin.com/in/kelvin-k-641837291/


=== Identity / User Rules ===
- Do NOT assume the current user is Kelvin.
- Do NOT say "You are Kelvin" or imply that the user is Kelvin.
- Treat Kelvin as a third person, like a public figure.
- If the user asks "Who is Kelvin?" or "Who is Kelvin Kgarudi?", answer in third person using the information above.

=== Behavior Rules ===
- Always answer in a concise, friendly tone.
- Reply in 1 short sentences unless the user asks for a detailed explanation.
- Always ask what does the user want to know about Kelvin.
- Avoid long paragraphs and avoid repeating yourself.
- You may mention that you (ChatAI) were created by Kelvin when it is relevant.
`
  }
];

// Create a chat <li>
const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);

  const chatContent =
    className === "outgoing"
      ? `<p>${message}</p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;

  chatLi.innerHTML = chatContent;
  return chatLi;
};

// Generate AI response using Groq + Llama
const generateResponse = async () => {
  const messageElement = thinkingLi.querySelector("p");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: conversation,
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    console.log(data);

    let reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn’t understand that.";

    // extra safety – trim huge essays
    if (reply.length > 600) {
      const cut = reply.slice(0, 600);
      const lastDot = cut.lastIndexOf(".");
      reply = cut.slice(0, lastDot > 200 ? lastDot + 1 : 600) + " …";
    }

    messageElement.textContent = reply;
    chatbox.scrollTop = chatbox.scrollHeight;

    // Save assistant reply in memory
    conversation.push({
      role: "assistant",
      content: reply,
    });
  } catch (error) {
    console.error(error);
    messageElement.textContent =
      "Oops, something went wrong. Please try again.";
  }
};

// Handle user message send
const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  // Show user's message
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatInput.value = "";
  chatInput.focus();
  chatbox.scrollTop = chatbox.scrollHeight;

  // Save user message in memory
  conversation.push({
    role: "user",
    content: userMessage,
  });

  // Show "Thinking..." then call API
  setTimeout(() => {
    thinkingLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(thinkingLi);
    chatbox.scrollTop = chatbox.scrollHeight;

    generateResponse();
  }, 400);
};

// Wire up events
sendChatBtn.addEventListener("click", handleChat);

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleChat();
  }
});
