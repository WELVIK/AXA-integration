"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Dossier, TYPOLOGIES, RESPONSABILITES } from "@/types/sinistre"
import { Phone, User, FileText, Shield, Wrench, Handshake, CheckCircle, MessageCircle } from "lucide-react"

interface ScriptTelephoniqueProps {
  dossier: Dossier
}

export default function ScriptTelephonique({ dossier }: ScriptTelephoniqueProps) {
  const generateSpecificScript = () => {
    const { typologie, responsabilite, garage } = dossier

    let specificContent =
      "Tout d'abord, y a-t-il d'autres dommages sur votre véhicule ou des blessés à déplorer ?<br><br>"

    if (responsabilite === "0") {
      specificContent += `
        <div class="bg-white p-4 rounded-xl border border-primary mb-4">
          <strong class="text-primary">🎉 Responsabilité 0% :</strong><br>
          "Excellente nouvelle, vous n'êtes pas responsable de ce sinistre. Votre franchise ne sera donc pas appliquée.<br>
          Nous allons nous occuper de récupérer l'intégralité des frais auprès de l'assureur adverse."
        </div>
      `
    } else if (responsabilite === "50") {
      specificContent += `
        <div class="bg-white p-4 rounded-xl border border-primary mb-4">
          <strong class="text-primary">⚖️ Responsabilité partagée 50% :</strong><br>
          "La responsabilité est partagée à 50/50. Votre franchise sera réduite de moitié.<br>
          Nous récupérerons 50% des frais auprès de l'autre assureur."
        </div>
      `
    } else {
      specificContent += `
        <div class="bg-white p-4 rounded-xl border border-error mb-4">
          <strong class="text-error">⚠️ Responsabilité 100% :</strong><br>
          "Vous êtes malheureusement responsable de ce sinistre. Votre franchise contractuelle s'appliquera.<br>
          Nous prendrons en charge les réparations selon les conditions de votre contrat."
        </div>
      `
    }

    if (garage === "partenaire") {
      specificContent += `
        <div class="bg-white p-4 rounded-xl border border-primary">
          <strong class="text-primary">🔧 Garage partenaire :</strong><br>
          "Bonne nouvelle, vous avez choisi un garage de notre réseau partenaire. Cela vous permet de bénéficier :<br>
          • D'un règlement direct (pas d'avance de frais)<br>
          • D'une garantie pièces et main d'œuvre étendue<br>
          • D'un véhicule de remplacement si nécessaire<br>
          L'expertise aura lieu directement au garage."
        </div>
      `
    } else {
      specificContent += `
        <div class="bg-white p-4 rounded-xl border border-primary">
          <strong class="text-primary">🏪 Garage non partenaire :</strong><br>
          "Vous avez choisi un garage hors réseau. Dans ce cas :<br>
          • Vous devrez faire l'avance des frais<br>
          • Nous vous rembourserons sur présentation des factures<br>
          • L'expertise aura lieu soit au garage, soit à votre domicile<br>
          Notre expert vous contactera sous 48h pour organiser le rendez-vous."
        </div>
      `
    }

    return specificContent
  }

  const scriptSections = [
    {
      id: 1,
      title: "Présentation",
      icon: <User className="w-5 h-5" />,
      content: '"Bonjour, [Prénom agent] du Service sinistre AXA Auto à l\'appareil."',
      bgClass: "bg-white",
      borderClass: "border-primary",
    },
    {
      id: 2,
      title: "Objet de l'appel",
      icon: <Phone className="w-5 h-5" />,
      content: `"Je vous appelle concernant le sinistre déclaré le ${new Date(dossier.dateCreation).toLocaleDateString("fr-FR")} sous la référence ${dossier.id}."`,
      bgClass: "bg-white",
      borderClass: "border-primary",
    },
    {
      id: 3,
      title: "Vérification de disponibilité",
      icon: <CheckCircle className="w-5 h-5" />,
      content: '"Êtes-vous disponible pour échanger quelques minutes sur votre dossier ?"',
      bgClass: "bg-white",
      borderClass: "border-primary",
    },
    {
      id: 4,
      title: "Enregistrement & Empathie",
      icon: <Shield className="w-5 h-5" />,
      content:
        '"Je vous informe que cet appel peut être enregistré à des fins de formation et de qualité. Je comprends que cette situation puisse être stressante pour vous, nous allons faire le maximum pour vous accompagner."',
      bgClass: "bg-white",
      borderClass: "border-primary",
    },
    {
      id: 5,
      title: "Plan d'entretien",
      icon: <FileText className="w-5 h-5" />,
      content:
        '"Nous allons ensemble reprendre les circonstances du sinistre, analyser la responsabilité et voir les modalités de prise en charge."',
      bgClass: "bg-white",
      borderClass: "border-primary",
    },
  ]

  return (
    <Card className="shadow-soft-lg bg-white border-primary">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-primary">
            <Phone className="w-6 h-6 text-primary" />
            <span>Script Téléphonique</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Badge variant="outline" className="border-primary text-primary">
              {TYPOLOGIES[dossier.typologie as keyof typeof TYPOLOGIES]}
            </Badge>
            <Badge variant="outline" className="border-primary text-primary">
              {RESPONSABILITES[dossier.responsabilite as keyof typeof RESPONSABILITES]}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Sections 1-5 */}
        {scriptSections.map((section) => (
          <div
            key={section.id}
            className={`p-4 rounded-lg border-l-4 ${section.bgClass} ${section.borderClass} transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-center space-x-2 mb-2">
              {section.icon}
              <h3 className="font-semibold text-lg text-primary">
                {section.id}. {section.title}
              </h3>
            </div>
            <div className="text-primary leading-relaxed">{section.content}</div>
          </div>
        ))}

        {/* Section 6 - Développement spécifique */}
        <div className="p-4 rounded-lg border-l-4 border-primary bg-white transition-all duration-200 hover:shadow-md">
          <div className="flex items-center space-x-2 mb-4">
            <Wrench className="w-5 h-5" />
            <h3 className="font-semibold text-lg text-primary">
              6. Développement spécifique - {TYPOLOGIES[dossier.typologie as keyof typeof TYPOLOGIES]}
            </h3>
          </div>
          <div
            className="text-primary leading-relaxed"
            dangerouslySetInnerHTML={{ __html: generateSpecificScript() }}
          />
        </div>

        <div className="p-4 rounded-lg border-l-4 border-primary bg-white transition-all duration-200 hover:shadow-md">
          <div className="flex items-center space-x-2 mb-2">
            <Handshake className="w-5 h-5" />
            <h3 className="font-semibold text-lg text-primary">7. Coordination</h3>
          </div>
          <div className="text-primary leading-relaxed">
            "Pouvez-vous me confirmer vos coordonnées actuelles (email et téléphone) ?<br />
            Je vais également vérifier votre profil KYC.
            <br />
            Je remplis votre CLI ADAPT pour personnaliser nos échanges.
            <br />
            Quel est votre canal de communication préféré : email ou téléphone ?"
          </div>
        </div>

        <div className="p-4 rounded-lg border-l-4 border-primary bg-white transition-all duration-200 hover:shadow-md">
          <div className="flex items-center space-x-2 mb-2">
            <MessageCircle className="w-5 h-5" />
            <h3 className="font-semibold text-lg text-primary">8. Acquittement</h3>
          </div>
          <div className="text-primary leading-relaxed">"Avez-vous d'autres questions concernant votre dossier ?"</div>
        </div>

        <div className="p-4 rounded-lg border-l-4 border-primary bg-white transition-all duration-200 hover:shadow-md">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5" />
            <h3 className="font-semibold text-lg text-primary">9. Prise de congé personnalisée</h3>
          </div>
          <div className="text-primary leading-relaxed">
            "Très bien [Prénom client], je vous remercie pour ces échanges. N'hésitez pas à me recontacter si vous avez
            des questions. Je vous souhaite une excellente journée [Prénom client]."
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
