# Super Quiz - React Native (Expo)

Este é um aplicativo de perguntas e respostas (Quiz) temático de futebol, desenvolvido como parte da Avaliação 1 da disciplina de Dispositivos Móveis. O app utiliza persistência de dados local com SQLite.

## 🚀 Funcionalidades

- **Banco de Dados Local**: Utiliza o `expo-sqlite` para armazenar perguntas, opções e as respostas corretas.
- **Carga Inicial Automática**: Na primeira execução, o app cria a tabela e popula o banco com 10 perguntas temáticas de futebol.
- **Sorteio Aleatório Inteligente**: As perguntas são sorteadas de forma aleatória diretamente do banco de dados.
- **Sem Repetição**: O sistema garante que nenhuma pergunta se repita durante uma rodada de 5 perguntas.
- **Interface Intuitiva**:
  - Tela inicial com título e imagem temática.
  - Perguntas exibidas através de diálogos nativos (`Alert`).
  - Fluxo contínuo (o usuário só descobre a pontuação final no término do quiz).
- **Feedback de Desempenho**: Exibe a pontuação da última rodada na tela principal e um resumo final ao concluir o jogo.

## 🛠️ Tecnologias Utilizadas

- **React Native** (v0.81.5)
- **Expo SDK** (v54.0.33)
- **Expo SQLite** (Nova API assíncrona)
- **JavaScript/ES6**

## 📂 Estrutura do Banco de Dados

A tabela `questions` possui a seguinte estrutura:
- `id`: Chave primária autoincrementada.
- `question`: O enunciado da pergunta.
- `option_a`, `option_b`, `option_c`: As três opções de resposta.
- `correct_option`: A letra correspondente à resposta correta ('A', 'B' ou 'C').

## 🏃 Como Rodar o Projeto

1. Certifique-se de ter o **Node.js** instalado.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor do Expo:
   ```bash
   npx expo start
   ```
4. Escaneie o QR Code usando o aplicativo **Expo Go** no seu celular (compatível com a versão 54.0.6).

---
*Projeto desenvolvido para fins acadêmicos - IFSP.*
