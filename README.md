# Agente de IA Inteligente com Arquitetura ReAct 🤖

Este projeto foi desenvolvido como parte prática da disciplina de **Teste de Software**. Trata-se de uma aplicação full-stack composta por um Front-end em React (TypeScript) e um Back-end em Node.js que implementa um Agente de IA utilizando a arquitetura ReAct (Reasoning and Acting).

O agente interage com a API do Groq (modelo Llama-3.1) e é capaz de decidir, de forma autónoma, quando deve executar funções locais (Tools) para responder a perguntas em tempo real.

## 🛠️ Funcionalidades e Ferramentas (Tools)
* **Conversa Natural:** Mantém o contexto de diálogos utilizando sessões dinâmicas guardadas em memória RAM.
* **Ferramenta `getTime`:** Captura e retorna a data e o horário exato do sistema.
* **Ferramenta `calculate`:** Executa operações e expressões matemáticas complexas no lado do servidor.
* **Validação por Expressões Regulares:** Interceptação robusta e tolerante a falhas dos comandos gerados pelo LLM.

## 🚀 Tecnologias Utilizadas
* **Front-end:** React, TypeScript, Vite, CSS3.
* **Back-end:** Node.js, Express, Axios, Cors, Dotenv.
* **LLM Infra:** Groq API (Llama-3.1-8b-instant).
