export interface Question {
  id: string
  question: string
  choices: string[]
  correctAnswer: number
  explanation: string
  difficulty: "easy" | "medium" | "hard" | "legendary"
}

export interface Quiz {
  id: string
  title: string
  difficulty: "easy" | "medium" | "hard" | "legendary"
  category: string
  questions: Question[]
  reward: number
  minDurationSeconds: number
  thumbnail?: string
}

// Sample quiz data
export const sampleQuizzes: Quiz[] = [
  {
    id: "history-basics",
    title: "Ancient Civilizations",
    difficulty: "easy",
    category: "History",
    reward: 20,
    minDurationSeconds: 30,
    questions: [
      {
        id: "q1",
        question: "Which ancient wonder was located in Egypt?",
        choices: [
          "Hanging Gardens of Babylon",
          "Great Pyramid of Giza",
          "Colossus of Rhodes",
          "Lighthouse of Alexandria",
        ],
        correctAnswer: 1,
        explanation: "The Great Pyramid of Giza is the oldest and only remaining ancient wonder.",
        difficulty: "easy",
      },
      {
        id: "q2",
        question: "Who was the first emperor of Rome?",
        choices: ["Julius Caesar", "Augustus", "Nero", "Constantine"],
        correctAnswer: 1,
        explanation: "Augustus (Octavian) became the first Roman Emperor in 27 BCE.",
        difficulty: "easy",
      },
      {
        id: "q3",
        question: "Which civilization built Machu Picchu?",
        choices: ["Aztec", "Maya", "Inca", "Olmec"],
        correctAnswer: 2,
        explanation: "The Inca Empire built Machu Picchu in the 15th century in Peru.",
        difficulty: "easy",
      },
      {
        id: "q4",
        question: "What year did the Roman Empire fall?",
        choices: ["476 CE", "410 CE", "500 CE", "395 CE"],
        correctAnswer: 0,
        explanation: "The Western Roman Empire fell in 476 CE when Romulus Augustulus was deposed.",
        difficulty: "easy",
      },
      {
        id: "q5",
        question: "Which ancient Greek philosopher taught Alexander the Great?",
        choices: ["Socrates", "Plato", "Aristotle", "Pythagoras"],
        correctAnswer: 2,
        explanation: "Aristotle tutored Alexander the Great during his youth.",
        difficulty: "easy",
      },
    ],
  },
  {
    id: "science-medium",
    title: "Scientific Discoveries",
    difficulty: "medium",
    category: "Science",
    reward: 40,
    minDurationSeconds: 30,
    questions: [
      {
        id: "q1",
        question: "What is the speed of light in a vacuum?",
        choices: ["299,792 km/s", "300,000 km/s", "250,000 km/s", "350,000 km/s"],
        correctAnswer: 0,
        explanation: "The speed of light in a vacuum is exactly 299,792,458 meters per second.",
        difficulty: "medium",
      },
      {
        id: "q2",
        question: "Who discovered penicillin?",
        choices: ["Louis Pasteur", "Alexander Fleming", "Marie Curie", "Jonas Salk"],
        correctAnswer: 1,
        explanation: "Alexander Fleming discovered penicillin in 1928.",
        difficulty: "medium",
      },
      {
        id: "q3",
        question: "What is the powerhouse of the cell?",
        choices: ["Nucleus", "Ribosome", "Mitochondria", "Chloroplast"],
        correctAnswer: 2,
        explanation: "Mitochondria produce ATP, the energy currency of cells.",
        difficulty: "medium",
      },
      {
        id: "q4",
        question: "What is the chemical symbol for gold?",
        choices: ["Go", "Gd", "Au", "Ag"],
        correctAnswer: 2,
        explanation: "Au comes from the Latin word 'aurum' meaning gold.",
        difficulty: "medium",
      },
      {
        id: "q5",
        question: "How many bones are in the adult human body?",
        choices: ["186", "206", "226", "246"],
        correctAnswer: 1,
        explanation: "The adult human skeleton has 206 bones.",
        difficulty: "medium",
      },
    ],
  },
  {
    id: "literature-hard",
    title: "Classic Literature",
    difficulty: "hard",
    category: "Literature",
    reward: 60,
    minDurationSeconds: 30,
    questions: [
      {
        id: "q1",
        question: "Who wrote 'One Hundred Years of Solitude'?",
        choices: ["Jorge Luis Borges", "Gabriel García Márquez", "Pablo Neruda", "Octavio Paz"],
        correctAnswer: 1,
        explanation: "Gabriel García Márquez wrote this masterpiece of magical realism in 1967.",
        difficulty: "hard",
      },
      {
        id: "q2",
        question: "In which year was '1984' by George Orwell published?",
        choices: ["1948", "1949", "1950", "1984"],
        correctAnswer: 1,
        explanation: "George Orwell published '1984' in 1949.",
        difficulty: "hard",
      },
      {
        id: "q3",
        question: "What is the first line of 'Pride and Prejudice'?",
        choices: [
          "Call me Ishmael",
          "It was the best of times",
          "It is a truth universally acknowledged",
          "Happy families are all alike",
        ],
        correctAnswer: 2,
        explanation:
          "Jane Austen's famous opening: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.'",
        difficulty: "hard",
      },
      {
        id: "q4",
        question: "Who wrote 'The Brothers Karamazov'?",
        choices: ["Leo Tolstoy", "Fyodor Dostoevsky", "Anton Chekhov", "Ivan Turgenev"],
        correctAnswer: 1,
        explanation: "Fyodor Dostoevsky wrote this philosophical novel in 1880.",
        difficulty: "hard",
      },
      {
        id: "q5",
        question: "What is the name of the whale in 'Moby-Dick'?",
        choices: ["Moby", "Dick", "Moby-Dick", "The White Whale"],
        correctAnswer: 2,
        explanation: "The whale's name is Moby-Dick, a white sperm whale.",
        difficulty: "hard",
      },
    ],
  },
  {
    id: "mythology-legendary",
    title: "Mythological Legends",
    difficulty: "legendary",
    category: "Mythology",
    reward: 100,
    minDurationSeconds: 30,
    questions: [
      {
        id: "q1",
        question: "In Norse mythology, what is the name of Odin's eight-legged horse?",
        choices: ["Fenrir", "Sleipnir", "Jormungandr", "Huginn"],
        correctAnswer: 1,
        explanation: "Sleipnir is Odin's magical eight-legged horse, the best of all horses.",
        difficulty: "legendary",
      },
      {
        id: "q2",
        question: "Who was the Greek goddess of the rainbow?",
        choices: ["Iris", "Hera", "Artemis", "Athena"],
        correctAnswer: 0,
        explanation: "Iris was the goddess of the rainbow and messenger of the gods.",
        difficulty: "legendary",
      },
      {
        id: "q3",
        question: "In Egyptian mythology, who weighed the hearts of the dead?",
        choices: ["Ra", "Osiris", "Anubis", "Thoth"],
        correctAnswer: 2,
        explanation: "Anubis weighed hearts against the feather of Ma'at in the afterlife judgment.",
        difficulty: "legendary",
      },
      {
        id: "q4",
        question: "What was the name of King Arthur's sword?",
        choices: ["Excalibur", "Caliburn", "Clarent", "Carnwennan"],
        correctAnswer: 0,
        explanation: "Excalibur was the legendary sword of King Arthur.",
        difficulty: "legendary",
      },
      {
        id: "q5",
        question: "In Hindu mythology, who is the destroyer god in the Trimurti?",
        choices: ["Brahma", "Vishnu", "Shiva", "Indra"],
        correctAnswer: 2,
        explanation: "Shiva is the destroyer and transformer in the Hindu Trimurti.",
        difficulty: "legendary",
      },
    ],
  },
]

export function getQuizzesByDifficulty(difficulty: string): Quiz[] {
  return sampleQuizzes.filter((quiz) => quiz.difficulty === difficulty)
}

export function getQuizById(id: string): Quiz | undefined {
  return sampleQuizzes.find((quiz) => quiz.id === id)
}

export const quizzes = sampleQuizzes
