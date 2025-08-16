"use client"

import { useState, useCallback, useMemo } from "react"
import { useTheme } from "@/contexts/ThemeContext"

interface Game {
  id: string
  title: string
  description: string
  type: "simulation" | "memory" | "puzzle" | "scenario"
  difficulty: "Facile" | "Moyen" | "Difficile"
  duration: string
  points: number
  played: boolean
  bestScore?: number
}

interface GameSession {
  game: Game
  currentLevel: number
  score: number
  timeLeft: number
  gameData: any
}

const games: Game[] = [
  {
    id: "simulation-appel",
    title: "Simulation d'Appel Client",
    description: "Gérez un appel client de A à Z avec des situations réalistes",
    type: "simulation",
    difficulty: "Moyen",
    duration: "10-15 min",
    points: 50,
    played: true,
    bestScore: 85,
  },
  {
    id: "memory-irsa",
    title: "Memory des Cas IRSA",
    description: "Mémorisez les cas IRSA et leurs responsabilités",
    type: "memory",
    difficulty: "Facile",
    duration: "5-8 min",
    points: 25,
    played: false,
  },
  {
    id: "puzzle-procedures",
    title: "Puzzle des Procédures",
    description: "Remettez les étapes dans le bon ordre",
    type: "puzzle",
    difficulty: "Moyen",
    duration: "8-12 min",
    points: 35,
    played: true,
    bestScore: 92,
  },
  {
    id: "scenario-complexe",
    title: "Scénarios Complexes",
    description: "Résolvez des cas de sinistres complexes",
    type: "scenario",
    difficulty: "Difficile",
    duration: "15-20 min",
    points: 75,
    played: false,
  },
]

const gameContent = {
  "simulation-appel": {
    scenarios: [
      {
        situation: "Client très énervé suite à un accident",
        dialogue:
          "Bonjour, je suis furieux ! Votre expert a dit que c'était ma faute alors que c'est évident que l'autre conducteur a grillé le feu !",
        options: [
          "Je comprends votre frustration, pouvez-vous me donner plus de détails ?",
          "L'expert a raison, vous devez accepter sa décision.",
          "Calmez-vous, nous allons voir ce qu'on peut faire.",
        ],
        correctOption: 0,
        feedback: "Excellente approche ! L'empathie et l'écoute active sont essentielles.",
      },
    ],
  },
  "memory-irsa": {
    cards: [
      { id: 1, type: "cas", content: "Cas 10", matched: false },
      { id: 2, type: "description", content: "Heurt par l'arrière", matched: false },
      { id: 3, type: "cas", content: "Cas 40", matched: false },
      { id: 4, type: "description", content: "Stationnement régulier", matched: false },
      { id: 5, type: "cas", content: "Cas 50", matched: false },
      { id: 6, type: "description", content: "Non-respect signalisation", matched: false },
    ],
  },
}

export default function JeuxModule() {
  const { theme } = useTheme()
  const [selectedType, setSelectedType] = useState<string>("Tous")
  const [activeGame, setActiveGame] = useState<GameSession | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedCards, setMatchedCards] = useState<number[]>([])

  const gameTypes = ["Tous", "simulation", "memory", "puzzle", "scenario"]

  const filteredGames = useMemo(
    () => (selectedType === "Tous" ? games : games.filter((game) => game.type === selectedType)),
    [selectedType],
  )

  const gameStats = useMemo(() => {
    const totalPoints = games.filter((g) => g.played).reduce((acc, g) => acc + g.points, 0)
    const gamesPlayed = games.filter((g) => g.played).length
    return { totalPoints, gamesPlayed }
  }, [])

  const getGameIcon = (type: string) => {
    switch (type) {
      case "simulation":
        return "🎭"
      case "memory":
        return "🧠"
      case "puzzle":
        return "🧩"
      case "scenario":
        return "📋"
      default:
        return "🎮"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "simulation":
        return "Simulation"
      case "memory":
        return "Mémoire"
      case "puzzle":
        return "Puzzle"
      case "scenario":
        return "Scénario"
      default:
        return type
    }
  }

  const startGame = useCallback((game: Game) => {
    setActiveGame({
      game,
      currentLevel: 1,
      score: 0,
      timeLeft: 300,
      gameData: gameContent[game.id as keyof typeof gameContent] || {},
    })
    setSelectedAnswer(null)
    setFlippedCards([])
    setMatchedCards([])
  }, [])

  const closeGame = useCallback(() => {
    setActiveGame(null)
    setSelectedAnswer(null)
    setFlippedCards([])
    setMatchedCards([])
  }, [])

  const handleAnswerSelect = useCallback((index: number) => {
    setSelectedAnswer(index)
    // Simulate answer processing
    setTimeout(() => {
      setSelectedAnswer(null)
    }, 2000)
  }, [])

  const handleCardFlip = useCallback(
    (cardId: number) => {
      if (flippedCards.length < 2 && !flippedCards.includes(cardId) && !matchedCards.includes(cardId)) {
        setFlippedCards((prev) => [...prev, cardId])

        if (flippedCards.length === 1) {
          setTimeout(() => {
            setFlippedCards([])
          }, 1000)
        }
      }
    },
    [flippedCards, matchedCards],
  )

  if (activeGame) {
    if (activeGame.game.type === "simulation") {
      const scenario = gameContent["simulation-appel"].scenarios[0]

      return (
        <div className="dashboard" data-theme={theme}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-primary">{activeGame.game.title}</h1>
              <button
                onClick={closeGame}
                className="px-4 py-2 bg-alert text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
              >
                ✕ Fermer
              </button>
            </div>

            <div className="bg-white dark:bg-primary rounded-xl p-6 shadow-lg border-2 border-primary/20 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-primary dark:text-white">Score: {activeGame.score}</span>
                <span className="text-sm text-primary dark:text-white">
                  Temps: {Math.floor(activeGame.timeLeft / 60)}:{(activeGame.timeLeft % 60).toString().padStart(2, "0")}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-primary dark:text-white mb-2">Situation:</h3>
                <p className="text-primary dark:text-white mb-4">{scenario.situation}</p>

                <div className="bg-white dark:bg-white/10 p-4 rounded-lg mb-4 border-2 border-primary/10">
                  <h4 className="font-medium text-primary dark:text-white mb-2">Client:</h4>
                  <p className="italic text-primary dark:text-white">"{scenario.dialogue}"</p>
                </div>

                <h4 className="font-medium text-primary dark:text-white mb-3">Comment répondez-vous ?</h4>
                <div className="space-y-3">
                  {scenario.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left rounded-lg transition-all duration-200 border-2 font-medium ${
                        selectedAnswer === index
                          ? index === scenario.correctOption
                            ? "bg-green-100 border-green-500 text-green-800"
                            : "bg-red-100 border-alert text-red-800"
                          : "bg-white dark:bg-white/10 border-primary/20 text-primary dark:text-white hover:border-primary hover:shadow-md transform hover:scale-[1.02]"
                      }`}
                      disabled={selectedAnswer !== null}
                    >
                      <span className="block">{option}</span>
                      {selectedAnswer === index && index === scenario.correctOption && (
                        <span className="text-sm mt-2 block text-green-600">{scenario.feedback}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (activeGame.game.type === "memory") {
      const cards = gameContent["memory-irsa"].cards

      return (
        <div className="dashboard" data-theme={theme}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-primary">{activeGame.game.title}</h1>
              <button
                onClick={closeGame}
                className="px-4 py-2 bg-alert text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
              >
                ✕ Fermer
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleCardFlip(card.id)}
                  className={`aspect-square rounded-lg flex items-center justify-center font-semibold cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    flippedCards.includes(card.id) || matchedCards.includes(card.id)
                      ? "bg-white border-2 border-primary text-primary"
                      : "bg-primary text-white hover:bg-opacity-80"
                  }`}
                >
                  {flippedCards.includes(card.id) || matchedCards.includes(card.id) ? card.content : "?"}
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="dashboard" data-theme={theme}>
      <div className="dashboard-header">
        <h1 className="text-3xl font-bold text-primary mb-2">🎮 Jeux Pédagogiques</h1>
        <p className="text-primary dark:text-white">Apprenez en vous amusant avec nos jeux interactifs</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3 className="stat-number">{gameStats.totalPoints}</h3>
            <p className="stat-label">Points Totaux</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎮</div>
          <div className="stat-content">
            <h3 className="stat-number">
              {gameStats.gamesPlayed}/{games.length}
            </h3>
            <p className="stat-label">Jeux Joués</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3 className="stat-number">{Math.round((gameStats.gamesPlayed / games.length) * 100)}%</h3>
            <p className="stat-label">Progression</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3 className="stat-number">{gameStats.totalPoints >= 100 ? "Pro" : "Amateur"}</h3>
            <p className="stat-label">Rang</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-primary mb-4">Type de jeu</h2>
        <div className="flex gap-2 flex-wrap">
          {gameTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                selectedType === type
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white hover:shadow-md"
              }`}
            >
              {type === "Tous" ? "Tous" : getTypeLabel(type)}
            </button>
          ))}
        </div>
      </div>

      <div className="quiz-grid">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="quiz-card hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <div className="quiz-header">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{getGameIcon(game.type)}</span>
                <span className={`difficulty-badge ${game.difficulty.toLowerCase()}`}>{game.difficulty}</span>
              </div>
              <h3 className="quiz-title">{game.title}</h3>
              <p className="quiz-description">{game.description}</p>
            </div>

            <div className="quiz-info">
              <div className="flex items-center justify-between text-sm text-primary dark:text-white mb-4">
                <span>⏱️ {game.duration}</span>
                <span>🎯 {game.points} pts</span>
              </div>

              {game.played && game.bestScore && (
                <div className="mb-4 p-3 bg-white dark:bg-white/10 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary dark:text-white">Meilleur score:</span>
                    <span className="font-semibold text-primary dark:text-white">{game.bestScore}%</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => startGame(game)}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                  game.played
                    ? "bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white hover:shadow-lg"
                    : "bg-primary text-white hover:bg-opacity-90 hover:shadow-lg"
                }`}
              >
                {game.played ? "Rejouer" : "Commencer"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
