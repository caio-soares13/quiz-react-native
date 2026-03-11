import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';

// Nome do banco de dados
const DB_NAME = 'quiz_db';

export default function App() {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Inicializa o banco de dados e as perguntas
  useEffect(() => {
    async function setup() {
      try {
        const _db = await SQLite.openDatabaseAsync(DB_NAME);
        setDb(_db);

        // Cria a tabela
        await _db.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY NOT NULL, 
            question TEXT NOT NULL, 
            option_a TEXT NOT NULL, 
            option_b TEXT NOT NULL, 
            option_c TEXT NOT NULL, 
            correct_option TEXT NOT NULL
          );
        `);

        // Verifica se já existem perguntas
        const firstRow = await _db.getFirstAsync('SELECT COUNT(*) as count FROM questions');
        
        if (firstRow.count === 0) {
          const soccerQuestions = [
            ['Quem é o maior artilheiro da história das Copas?', 'Pelé', 'Ronaldo', 'Miroslav Klose', 'C'],
            ['Qual país venceu a Copa do Mundo de 2022?', 'França', 'Argentina', 'Croácia', 'B'],
            ['Quantas Copas do Mundo o Brasil possui?', '4', '5', '6', 'B'],
            ['Em qual time o Rei Pelé jogou a maior parte da carreira?', 'Santos', 'Flamengo', 'Corinthians', 'A'],
            ['Quem ganhou a Bola de Ouro em 2023?', 'Mbappé', 'Haaland', 'Lionel Messi', 'C'],
            ['Qual seleção é conhecida como "A Laranja Mecânica"?', 'Alemanha', 'Holanda', 'Bélgica', 'B'],
            ['Onde foi realizada a primeira Copa do Mundo em 1930?', 'Brasil', 'Itália', 'Uruguai', 'C'],
            ['Qual jogador é o maior artilheiro da história da Champions League?', 'Cristiano Ronaldo', 'Messi', 'Neymar', 'A'],
            ['Qual clube brasileiro é conhecido como "O Imortal"?', 'Inter', 'Grêmio', 'Cruzeiro', 'B'],
            ['Qual estádio é conhecido como o "Templo do Futebol"?', 'Maracanã', 'Wembley', 'Camp Nou', 'A']
          ];

          for (const q of soccerQuestions) {
            await _db.runAsync(
              'INSERT INTO questions (question, option_a, option_b, option_c, correct_option) VALUES (?, ?, ?, ?, ?)',
              q[0], q[1], q[2], q[3], q[4]
            );
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Erro ao inicializar banco:", error);
      }
    }
    setup();
  }, []);

  const handleStartQuiz = async () => {
    setScore(0);
    setTotalQuestions(0);
    startNextRound(0, 0, []);
  };

  const startNextRound = async (currentScore, count, usedIds) => {
    try {
      // Sorteia uma pergunta aleatória que NÃO esteja na lista de IDs já usados
      let query = 'SELECT * FROM questions';
      if (usedIds.length > 0) {
        query += ` WHERE id NOT IN (${usedIds.join(',')})`;
      }
      query += ' ORDER BY RANDOM() LIMIT 1';
      
      const question = await db.getFirstAsync(query);
      
      if (question) {
        Alert.alert(
          `Pergunta #${count + 1}`,
          question.question,
          [
            { text: `A) ${question.option_a}`, onPress: () => checkAnswer(question.correct_option, 'A', currentScore, count, [...usedIds, question.id]) },
            { text: `B) ${question.option_b}`, onPress: () => checkAnswer(question.correct_option, 'B', currentScore, count, [...usedIds, question.id]) },
            { text: `C) ${question.option_c}`, onPress: () => checkAnswer(question.correct_option, 'C', currentScore, count, [...usedIds, question.id]) },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error("Erro ao buscar pergunta:", error);
    }
  };

  const checkAnswer = (correct, chosen, currentScore, count, usedIds) => {
    let newScore = currentScore;
    if (chosen === correct) {
      newScore += 1;
    }
    // Segue direto para o próximo passo sem exibir Alert de acerto/erro
    handleNextStep(newScore, count + 1, usedIds);
  };

  const handleNextStep = (newScore, newCount, usedIds) => {
    // Definimos um limite de 5 perguntas por rodada
    if (newCount < 5) {
      startNextRound(newScore, newCount, usedIds);
    } else {
      setScore(newScore);
      setTotalQuestions(newCount);
      Alert.alert("Fim do Quiz!", `Você acertou ${newScore} de ${newCount} perguntas.`);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando Banco de Dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <Text style={styles.title}>Super Quiz</Text>
      
      <Image 
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3407/3407024.png' }} 
        style={styles.logo} 
      />

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Última Pontuação: {score} acertos</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleStartQuiz}>
        <Text style={styles.buttonText}>Iniciar Novo Quiz (5 Perguntas)</Text>
      </TouchableOpacity>
      
      <Text style={styles.footer}>React Native + SQLite</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
    borderRadius: 20,
  },
  scoreContainer: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scoreText: {
    fontSize: 18,
    color: '#666',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 50,
    fontSize: 12,
    color: '#999',
  }
});
