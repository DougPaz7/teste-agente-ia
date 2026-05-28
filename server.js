require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 Memória em memória (simples para aula)
const sessions = {};

// 🛠️ Tools do agente
const tools = {
  getTime: () => {
    return new Date().toLocaleString();
  },

  calculate: (expression) => {
    try {
      return eval(expression).toString();
    } catch {
      return "Erro ao calcular";
    }
  }
};

// 🎯 Prompt do agente
const SYSTEM_PROMPT = `
Você é um Agente de IA que executa comandos estritos.

Ferramentas disponíveis que você DEVE usar quando necessário:
- Para saber data, horas ou momento atual, responda APENAS: TOOL: getTime
- Para fazer operações matemáticas, responda APENAS: TOOL: calculate | expressão_matemática

Regra de Ouro: Se o usuário perguntar o horário ou pedir um cálculo, sua resposta DEVE conter o padrão "TOOL: nome_da_tool". Não invente respostas sobre o tempo e não tente calcular de cabeça.
`;

app.post("/chat", async (req, res) => {
  const { message, sessionId } = req.body;
  const id = sessionId || uuidv4();

  if (!sessions[id]) {
    sessions[id] = [{ role: "system", content: SYSTEM_PROMPT }];
  }

  sessions[id].push({ role: "user", content: message });

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: sessions[id]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let reply = response.data.choices[0].message.content;

    // 🛠️ NOVO REGEX: O grupo do argumento agora é opcional (por causa do (?: ... )?)
    const toolMatch = reply.match(/TOOL:\s*(\w+)(?:\s*\|\s*(.+))?/);

    if (toolMatch) {
      const toolName = toolMatch[1].trim();
      // Se não houver argumento (como no getTime), define como string vazia ""
      const arg = toolMatch[2] ? toolMatch[2].trim() : ""; 

      if (tools[toolName]) {
        console.log(`[INFO] [Back-end] Requisição recebida com sucesso. Processando ferramentas para SessionId: ${id}`);
        // Executa a tool passando o argumento (vazio ou preenchido)
        const result = tools[toolName](arg);

        // Salva o pensamento da IA na memória
        sessions[id].push({
          role: "assistant",
          content: reply 
        });
        
        // Alimenta a IA com o resultado real da função
        sessions[id].push({
          role: "user",
          content: `[SISTEMA]: O resultado da ferramenta ${toolName} foi: ${result}. Agora, responda ao usuário final com base nesse dado.`
        });

        // Faz a segunda chamada para obter o texto "humano" final
        const finalResponse = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model: "llama-3.1-8b-instant",
            messages: sessions[id]
          },
          {
            headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` }
          }
        );

        reply = finalResponse.data.choices[0].message.content;
        sessions[id].push({ role: "assistant", content: reply });

      } else {
        reply = "Peço desculpas, tive um problema ao acessar minhas ferramentas.";
      }
    } else {
      sessions[id].push({ role: "assistant", content: reply });
    }
    
    console.log(`[INFO] [Back-end] Segunda chamada concluída. Resposta final humanizada enviada ao Front-end.`);
    res.json({ reply, sessionId: id });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Erro no agente" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`🤖 Agente rodando em http://localhost:${process.env.PORT}`);
});

module.exports = { tools };