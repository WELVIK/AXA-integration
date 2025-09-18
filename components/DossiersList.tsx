
import { useSinistres } from "@/contexts/SinistresContext"
import { type Dossier, TYPOLOGIES, RESPONSABILITES } from "@/types/sinistre"
import { Edit, Eye, Calendar, AlertCircle, TrendingUp } from "lucide-react"

interface DossiersListProps {
  onSelectDossier: (dossier: Dossier) => void
  onEditDossier: (dossier: Dossier) => void
}

export default function DossiersList({ onSelectDossier, onEditDossier }: DossiersListProps) {
  const { dossiers } = useSinistres()

  const getCompletionRate = (dossier: Dossier) => {
    const completed = dossier.checklist.filter((item) => item.completed).length
    return Math.round((completed / dossier.checklist.length) * 100)
  }

  if (dossiers.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-white dark:bg-primary rounded-full flex items-center justify-center border-2 border-primary shadow">
          <AlertCircle size={48} className="text-primary dark:text-white" />
        </div>
        <h3 className="text-2xl font-bold text-primary dark:text-white mb-4">Aucun dossier créé</h3>
        <p className="text-base text-primary dark:text-white max-w-md mx-auto mb-8">
          Commencez par créer votre premier dossier sinistre pour gérer vos déclarations efficacement.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary dark:text-white mb-2">Dossiers Sinistres</h2>
        <p className="text-base text-primary dark:text-white">Gérez et suivez vos dossiers de sinistres automobile</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dossiers.map((dossier) => {
          const completionRate = getCompletionRate(dossier)

          return (
            <div
              key={dossier.id}
              className="bg-white dark:bg-primary border-2 border-primary dark:border-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-primary dark:text-white mb-1">{dossier.id}</h3>
                  <div className="flex items-center gap-2 text-sm text-primary dark:text-white">
                    <Calendar size={14} />
                    {new Date(dossier.dateCreation).toLocaleDateString("fr-FR")}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    dossier.kycStatus === "OK" ? "bg-white text-primary" : "bg-danger text-white"
                  }`}
                >
                  {dossier.kycStatus}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-white border-2 border-danger rounded-xl p-4">
                  <p className="text-sm font-semibold mb-1 text-primary">Typologie</p>
                  <p className="text-base font-medium text-primary">
                    {TYPOLOGIES[dossier.typologie as keyof typeof TYPOLOGIES]}
                  </p>
                </div>

                <div className="bg-white border-2 border-danger rounded-xl p-4">
                  <p className="text-sm font-semibold mb-1 text-primary">Responsabilité</p>
                  <p className="text-base font-medium text-primary">
                    {RESPONSABILITES[dossier.responsabilite as keyof typeof RESPONSABILITES]}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary dark:text-white" />
                    <span className="text-sm font-semibold text-primary dark:text-white">Progression</span>
                  </div>
                  <span className="text-sm font-bold text-primary dark:text-white">{completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-white rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-primary dark:bg-danger transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => onSelectDossier(dossier)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-primary border-2 border-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-200"
                >
                  <Eye size={16} />
                  Voir
                </button>
                <button
                  onClick={() => onEditDossier(dossier)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-primary border-2 border-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-200"
                >
                  <Edit size={16} />
                  Modifier
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
