

import { useState, useCallback } from "react"
import { useTheme } from "@/contexts/ThemeContext"

interface Quiz {
  id: string
  title: string
  description: string
  questions: number
  difficulty: "Débutant" | "Intermédiaire" | "Avancé"
  category: "IRSA" | "Procédures" | "Scripts" | "Général"
  completed: boolean
  score?: number
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface ActiveQuiz {
  quiz: Quiz
  questions: QuizQuestion[]
  currentQuestion: number
  answers: number[]
  showResults: boolean
}

const quizzes: Quiz[] = [
  {
    id: "irsa-basics",
    title: "Bases du barème IRSA",
    description: "Comprendre les cas de responsabilité les plus courants",
    questions: 10,
    difficulty: "Débutant",
    category: "IRSA",
    completed: false,
  },
  {
    id: "scripts-appels",
    title: "Scripts d'appels téléphoniques",
    description: "Maîtriser les différentes phases d'un appel client",
    questions: 15,
    difficulty: "Intermédiaire",
    category: "Scripts",
    completed: true,
    score: 85,
  },
  {
    id: "procedures-kyc",
    title: "Procédures KYC et documents",
    description: "Gestion des pièces justificatives et vérifications",
    questions: 12,
    difficulty: "Intermédiaire",
    category: "Procédures",
    completed: false,
  },
  {
    id: "cas-complexes",
    title: "Cas complexes de sinistres",
    description: "Situations particulières et exceptions",
    questions: 20,
    difficulty: "Avancé",
    category: "Général",
    completed: false,
  },
]

const quizQuestions: Record<string, QuizQuestion[]> = {
  "irsa-basics": [
    {
      id: "q1",
      question: "Dans un cas IRSA 10 (heurt par l'arrière), quelle est la répartition de responsabilité typique ?",
      options: ["50% / 50%", "X 0% / Y 100%", "X 100% / Y 0%", "Variable selon les circonstances"],
      correctAnswer: 1,
      explanation:
        "Le véhicule heurté par l'arrière n'est généralement pas responsable (X 0%), le véhicule qui heurte est responsable (Y 100%).",
    },
    {
      id: "q2",
      question: "Que signifie un cas IRSA 40 ?",
      options: ["Collision frontale", "Stationnement régulier", "Changement de file", "Marche arrière"],
      correctAnswer: 1,
      explanation:
        "Le cas IRSA 40 concerne un véhicule en stationnement régulier qui est heurté par un autre véhicule.",
    },
    {
      id: "q3",
      question: "Dans un cas IRSA 50, qui est généralement responsable ?",
      options: [
        "Partage 50/50",
        "Le véhicule qui n'a pas respecté la signalisation",
        "Le véhicule prioritaire",
        "Aucun des deux",
      ],
      correctAnswer: 1,
      explanation:
        "Le cas IRSA 50 concerne le non-respect de la signalisation, le véhicule fautif est généralement 100% responsable.",
    },
  ],
  "scripts-appels": [
    {
      id: "q1",
      question: "Quelle est la première étape d'un script téléphonique ?",
      options: [
        "Demander les circonstances",
        "Se présenter et vérifier la disponibilité",
        "Expliquer la franchise",
        "Proposer un garage",
      ],
      correctAnswer: 1,
      explanation:
        "Il faut toujours commencer par se présenter et s'assurer que le client est disponible pour l'entretien.",
    },
    {
      id: "q2",
      question: "Que signifie CLI ADAPT dans le script ?",
      options: ["Client Adaptatif", "Adaptation du ton selon la situation", "Code client", "Procédure standard"],
      correctAnswer: 1,
      explanation:
        "CLI ADAPT signifie adapter le ton et l'empathie selon la gravité du sinistre et l'état émotionnel du client.",
    },
  ],
}

export default function FormationModule() {
  const { theme } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous")
  const [activeQuiz, setActiveQuiz] = useState<ActiveQuiz | null>(null)

  const categories = ["Tous", "IRSA", "Procédures", "Scripts", "Général"]
  const filteredQuizzes =
    selectedCategory === "Tous" ? quizzes : quizzes.filter((quiz) => quiz.category === selectedCategory)

  const completedQuizzes = quizzes.filter((q) => q.completed).length
  const averageScore =
    quizzes.filter((q) => q.score).reduce((acc, q) => acc + (q.score || 0), 0) /
      quizzes.filter((q) => q.score).length || 0

  const startQuiz = useCallback((quiz: Quiz) => {
    const questions = quizQuestions[quiz.id] || []
    setActiveQuiz({
      quiz,
      questions,
      currentQuestion: 0,
      answers: [],
      showResults: false,
    })
  }, [])

  const answerQuestion = useCallback(
    (answerIndex: number) => {
      if (!activeQuiz) return

      const newAnswers = [...activeQuiz.answers, answerIndex]

      if (activeQuiz.currentQuestion < activeQuiz.questions.length - 1) {
        setActiveQuiz((prev) =>
          prev
            ? {
                ...prev,
                currentQuestion: prev.currentQuestion + 1,
                answers: newAnswers,
              }
            : null,
        )
      } else {
        // Quiz terminé, calculer le score
        const correctAnswers = activeQuiz.questions.filter((q, index) => q.correctAnswer === newAnswers[index]).length
        const score = Math.round((correctAnswers / activeQuiz.questions.length) * 100)

        setActiveQuiz((prev) =>
          prev
            ? {
                ...prev,
                answers: newAnswers,
                showResults: true,
              }
            : null,
        )
      }
    },
    [activeQuiz],
  )

  const closeQuiz = useCallback(() => {
    setActiveQuiz(null)
  }, [])

  if (activeQuiz && !activeQuiz.showResults) {
    const currentQ = activeQuiz.questions[activeQuiz.currentQuestion]
    return (
      <div
        className={`min-h-screen p-6 transition-colors duration-200 ${theme === "dark" ? "bg-[#2436B1] text-white" : "bg-white text-[#2436B1]"}`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-[#2436B1]"}`}>
              {activeQuiz.quiz.title}
            </h1>
            <button
              onClick={closeQuiz}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                theme === "dark"
                  ? "bg-white text-[#2436B1] hover:bg-gray-100"
                  : "bg-[#E02424] text-white hover:bg-red-600"
              }`}
            >
              ✕ Fermer
            </button>
          </div>

          <div
            className={`rounded-xl p-8 shadow-xl border-2 transition-colors duration-200 ${
              theme === "dark" ? "bg-white text-[#2436B1] border-white" : "bg-white text-[#2436B1] border-[#2436B1]/20"
            }`}
          >
            <div className="flex items-center justify-between mb-8">
              <span className={`text-sm font-medium ${theme === "dark" ? "text-[#2436B1]" : "text-gray-600"}`}>
                Question {activeQuiz.currentQuestion + 1} sur {activeQuiz.questions.length}
              </span>
              <div className="w-64 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-[#2436B1] h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((activeQuiz.currentQuestion + 1) / activeQuiz.questions.length) * 100}%` }}
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#2436B1] mb-8 leading-relaxed">{currentQ.question}</h2>

            <div className="space-y-4">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => answerQuestion(index)}
                  className={`w-full p-6 text-left rounded-xl font-medium transition-all duration-200 border-2 ${
                    theme === "dark"
                      ? "bg-gray-50 text-[#2436B1] border-gray-200 hover:bg-[#2436B1] hover:text-white hover:border-[#2436B1] hover:shadow-lg"
                      : "bg-gray-50 text-[#2436B1] border-gray-200 hover:bg-[#2436B1] hover:text-white hover:border-[#2436B1] hover:shadow-lg"
                  } transform hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <span className="inline-block w-8 h-8 bg-[#2436B1] text-white rounded-full text-center leading-8 font-bold mr-4 text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-lg">{option}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (activeQuiz && activeQuiz.showResults) {
    const correctAnswers = activeQuiz.questions.filter(
      (q, index) => q.correctAnswer === activeQuiz.answers[index],
    ).length
    const score = Math.round((correctAnswers / activeQuiz.questions.length) * 100)

    return (
      <div
        className={`min-h-screen p-6 transition-colors duration-200 ${theme === "dark" ? "bg-[#2436B1] text-white" : "bg-white text-[#2436B1]"}`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className={`text-4xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-[#2436B1]"}`}>
              Quiz Terminé !
            </h1>
            <div className="text-8xl mb-6">{score >= 80 ? "🎉" : score >= 60 ? "👍" : "📚"}</div>
            <div
              className={`text-6xl font-bold mb-4 ${score >= 80 ? "text-green-500" : score >= 60 ? "text-[#2436B1]" : "text-[#E02424]"}`}
            >
              {score}%
            </div>
            <p className={`text-xl ${theme === "dark" ? "text-white" : "text-gray-600"}`}>
              {correctAnswers} bonnes réponses sur {activeQuiz.questions.length}
            </p>
          </div>

          <div className="space-y-6 mb-12">
            {activeQuiz.questions.map((question, index) => (
              <div
                key={question.id}
                className={`rounded-xl p-6 shadow-lg border-2 transition-colors duration-200 ${
                  theme === "dark"
                    ? "bg-white text-[#2436B1] border-white"
                    : "bg-white text-[#2436B1] border-[#2436B1]/20"
                }`}
              >
                <div className="flex items-start gap-6">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      question.correctAnswer === activeQuiz.answers[index] ? "bg-green-500" : "bg-[#E02424]"
                    }`}
                  >
                    {question.correctAnswer === activeQuiz.answers[index] ? "✓" : "✗"}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#2436B1] mb-3 text-lg">{question.question}</h3>
                    <p className="text-gray-600 mb-2 font-medium">
                      Votre réponse: {question.options[activeQuiz.answers[index]]}
                    </p>
                    {question.correctAnswer !== activeQuiz.answers[index] && (
                      <p className="text-green-600 mb-3 font-medium">
                        Bonne réponse: {question.options[question.correctAnswer]}
                      </p>
                    )}
                    <p className="text-gray-700 italic bg-gray-50 p-3 rounded-lg">{question.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={closeQuiz}
              className="bg-[#2436B1] text-white px-12 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Retour aux Quiz
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-200 ${theme === "dark" ? "bg-[#2436B1] text-white" : "bg-white text-[#2436B1]"}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-[#2436B1]"}`}>
            🎓 Formation & Quiz
          </h1>
          <p className={`text-xl ${theme === "dark" ? "text-white/80" : "text-gray-600"}`}>
            Développez vos compétences avec nos modules de formation interactifs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div
            className={`rounded-xl p-6 shadow-lg border-2 transition-colors duration-200 ${
              theme === "dark" ? "bg-white text-[#2436B1] border-white" : "bg-white text-[#2436B1] border-[#2436B1]/20"
            }`}
          >
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-3xl font-bold text-[#2436B1] mb-2">
              {completedQuizzes}/{quizzes.length}
            </h3>
            <p className="text-gray-600 font-medium">Quiz Complétés</p>
          </div>

          <div
            className={`rounded-xl p-6 shadow-lg border-2 transition-colors duration-200 ${
              theme === "dark" ? "bg-white text-[#2436B1] border-white" : "bg-white text-[#2436B1] border-[#2436B1]/20"
            }`}
          >
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-3xl font-bold text-[#2436B1] mb-2">{Math.round(averageScore)}%</h3>
            <p className="text-gray-600 font-medium">Score Moyen</p>
          </div>

          <div
            className={`rounded-xl p-6 shadow-lg border-2 transition-colors duration-200 ${
              theme === "dark" ? "bg-white text-[#2436B1] border-white" : "bg-white text-[#2436B1] border-[#2436B1]/20"
            }`}
          >
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-3xl font-bold text-[#2436B1] mb-2">{completedQuizzes * 10}</h3>
            <p className="text-gray-600 font-medium">Points Gagnés</p>
          </div>

          <div
            className={`rounded-xl p-6 shadow-lg border-2 transition-colors duration-200 ${
              theme === "dark" ? "bg-white text-[#2436B1] border-white" : "bg-white text-[#2436B1] border-[#2436B1]/20"
            }`}
          >
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-3xl font-bold text-[#2436B1] mb-2">{completedQuizzes >= 2 ? "Expert" : "Débutant"}</h3>
            <p className="text-gray-600 font-medium">Niveau Actuel</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-[#2436B1]"}`}>
            Filtrer par catégorie
          </h2>
          <div className="flex gap-3 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                  selectedCategory === category
                    ? "bg-[#2436B1] text-white shadow-lg"
                    : `${theme === "dark" ? "bg-white text-[#2436B1]" : "bg-white border-2 border-[#2436B1] text-[#2436B1]"} hover:bg-[#2436B1] hover:text-white`
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className={`rounded-xl p-6 shadow-lg border-2 transition-all duration-200 hover:shadow-xl transform hover:scale-[1.02] ${
                theme === "dark"
                  ? "bg-white text-[#2436B1] border-white"
                  : "bg-white text-[#2436B1] border-[#2436B1]/20"
              }`}
            >
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-[#2436B1] text-white text-sm font-bold rounded-full">
                    {quiz.category}
                  </span>
                  <span
                    className={`px-3 py-1 text-sm font-bold rounded-full ${
                      quiz.difficulty === "Débutant"
                        ? "bg-green-100 text-green-700"
                        : quiz.difficulty === "Intermédiaire"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {quiz.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#2436B1] mb-3">{quiz.title}</h3>
                <p className="text-gray-600 leading-relaxed">{quiz.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                  <span className="font-medium">📝 {quiz.questions} questions</span>
                  {quiz.completed && quiz.score && <span className="text-[#2436B1] font-bold">✅ {quiz.score}%</span>}
                </div>

                <button
                  onClick={() => startQuiz(quiz)}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg ${
                    quiz.completed
                      ? "bg-white border-2 border-[#2436B1] text-[#2436B1] hover:bg-[#2436B1] hover:text-white"
                      : "bg-[#2436B1] text-white hover:opacity-90"
                  }`}
                >
                  {quiz.completed ? "Refaire le Quiz" : "Commencer le Quiz"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
