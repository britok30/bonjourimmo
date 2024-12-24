"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Title and Last Updated */}
          <div className="flex items-center space-x-2 mb-6">
            <h1 className="text-4xl font-bold">
              Conditions Générales d'Utilisation
            </h1>
            <Button variant="ghost" size="lg" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Link>
            </Button>
          </div>

          <div className="text-sm text-muted-foreground mb-8">
            Dernière mise à jour : 12/10/2024
          </div>

          {/* Platform Introduction */}
          <section className="space-y-4 mb-12">
            <p className="text-muted-foreground leading-relaxed">
              Merci d'utiliser la plateforme BonjourImmo. Ces Conditions
              Générales d'Utilisation ("Conditions") régissent la relation entre
              BonjourImmo ("BonjourImmo," "nous," "notre") et l'individu ou
              l'entité ("Utilisateur," "vous," "votre") utilisant ou accédant à
              nos services, applications ou plateforme via notre site web
              disponible à bonjourimmo.com (le "Site") ou par tout autre moyen
              (collectivement, les "Services"). Ces Conditions décrivent vos
              droits concernant les annonces, communications et autres activités
              réalisées via les Services (le "Contenu"), vos responsabilités en
              tant qu'Utilisateur, ainsi que d'autres sujets importants tels que
              la protection des données et le règlement des litiges. Notre
              Politique de Confidentialité, qui détaille la manière dont nous
              traitons vos données, est disponible ici.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Veuillez lire attentivement ces Conditions, ainsi que notre
              Politique de Confidentialité et tous les autres documents
              référencés ici, y compris les Plans d'Abonnement ou les Directives
              d'Utilisation. Ensemble, ces Conditions et les documents associés
              constituent un accord unique et contraignant entre vous et
              BonjourImmo (l'“Accord”).
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Cet Accord prend effet lorsque l'Utilisateur est présenté avec ces
              Conditions et commence à utiliser ou à accéder aux Services (la
              "Date d’Entrée en Vigueur") ou soumet, reçoit ou interagit avec le
              Contenu via la plateforme. Nous pouvons mettre à jour ces
              Conditions de temps à autre, et toute mise à jour vous sera
              communiquée. L'utilisation continue des Services constitue une
              acceptation des Conditions mises à jour. Si vous n'acceptez pas
              ces Conditions, veuillez cesser immédiatement d'utiliser ou
              d'accéder aux Services.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              BonjourImmo est conçu pour permettre aux propriétaires de vendre,
              louer ou proposer des biens de vacances directement, offrant une
              expérience simplifiée et sans commission. La plateforme vise à
              faciliter la gestion des biens, améliorer leur visibilité et
              permettre une communication directe entre les propriétaires et les
              locataires ou acheteurs potentiels. Bien que BonjourImmo s'efforce
              de fournir un environnement sécurisé et efficace, nous n'agissons
              pas en tant qu'agence immobilière et ne fournissons pas de
              conseils professionnels en immobilier, juridique ou financier. Les
              utilisateurs sont seuls responsables de garantir l'exactitude et
              la légalité de leurs annonces et leur conformité aux lois et
              règlements applicables.
            </p>
          </section>

          <section className="space-y-4 mb-12">
            <h2 className="text-lg font-semibold mb-3">
              Acceptation des Conditions
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              En accédant aux services de BonjourImmo ou en les utilisant, vous
              acceptez d'être lié par les présentes Conditions Générales
              d'Utilisation ("Conditions"). Ces Conditions constituent un accord
              juridiquement contraignant entre vous et BonjourImmo, définissant
              vos droits et obligations lors de l'utilisation de nos Services.
              Si vous n'acceptez pas ces Conditions, vous n'êtes pas autorisé à
              accéder à nos Services ou à les utiliser.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Vous reconnaissez que l'utilisation des Services implique une
              acceptation sans réserve de ces Conditions. En cas de modification
              ou de mise à jour des Conditions, vous serez informé et devrez les
              accepter pour continuer à utiliser les Services. Votre utilisation
              continue des Services après notification constitue votre accord
              aux modifications apportées.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Si vous agissez au nom d'une entreprise ou d'une organisation,
              vous déclarez et garantissez avoir l'autorité légale de lier cette
              entité aux présentes Conditions. Dans ce cas, "vous" ou "votre"
              fait référence à l'entité représentée.
            </p>
          </section>

          <section className="space-y-4 mb-12">
            <h2 className="text-lg font-semibold mb-3">
              Description du Service
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              BonjourImmo est une plateforme numérique conçue pour permettre aux
              propriétaires privés de publier, gérer et promouvoir leurs
              propriétés à vendre, à louer ou en location saisonnière. Grâce à
              nos outils modernes et intuitifs, nous facilitons la mise en
              relation directe entre propriétaires et locataires ou acheteurs
              potentiels, sans intermédiaire et sans commission.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Les Services fournis par BonjourImmo incluent la création et la
              gestion d'annonces, le téléchargement de photos, l'édition des
              informations sur les propriétés, ainsi que des fonctionnalités
              avancées pour maximiser la visibilité des annonces. Les
              utilisateurs peuvent consulter les informations des parties
              intéressées via la plateforme et sont responsables d'initier et de
              poursuivre les communications en dehors de celle-ci.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Notre objectif est de fournir une expérience transparente et
              conviviale, en offrant aux propriétaires privés des outils
              efficaces pour atteindre leur public cible. Toutefois, nous ne
              garantissons pas que chaque propriété trouvera un locataire ou un
              acheteur, et la responsabilité des transactions incombe aux
              parties concernées.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Veuillez noter que BonjourImmo n'est pas une agence immobilière et
              ne fournit aucun service de conseil juridique, financier ou
              immobilier. La plateforme est un outil de gestion et de mise en
              relation, et les utilisateurs sont entièrement responsables des
              informations publiées et des engagements pris avec d'autres
              utilisateurs.
            </p>
          </section>

          <section className="space-y-4 mb-12">
            <h2 className="text-lg font-semibold mb-3">
              Disponibilité et Qualité du Service
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              BonjourImmo s'efforce de fournir un service de haute qualité et de
              garantir la disponibilité de la plateforme à tout moment.
              Cependant, en raison de la nature des technologies numériques,
              nous ne pouvons pas garantir que le Service sera ininterrompu ou
              exempt d'erreurs.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Des interruptions temporaires peuvent survenir pour diverses
              raisons, notamment des mises à jour techniques, des travaux de
              maintenance, ou des événements imprévus. BonjourImmo mettra tout
              en œuvre pour informer les utilisateurs en cas de perturbations
              majeures et pour rétablir le Service dans les plus brefs délais.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              En outre, la qualité des Services, y compris les temps de
              chargement, les performances et la précision des fonctionnalités,
              peut varier en fonction de facteurs indépendants de notre volonté,
              tels que la qualité de votre connexion Internet ou la
              compatibilité de vos appareils avec notre plateforme.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              BonjourImmo se réserve le droit de modifier, suspendre ou
              interrompre certaines parties ou l'intégralité du Service, de
              manière temporaire ou permanente, afin d'améliorer ou d'adapter la
              plateforme. Ces modifications seront effectuées sans préavis, bien
              que nous nous efforcions de minimiser l'impact sur les
              utilisateurs.
            </p>
          </section>

          <section className="space-y-4 mb-12">
            <h2 className="text-lg font-semibold mb-3">Exigences d'Âge</h2>
            <p className="text-muted-foreground leading-relaxed">
              L'utilisation de la plateforme BonjourImmo est strictement
              réservée aux personnes âgées d'au moins 18 ans. En accédant ou en
              utilisant les Services, vous déclarez et garantissez que vous avez
              l'âge légal requis pour conclure un contrat contraignant dans
              votre juridiction et que vous respectez cette exigence.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Si nous découvrons qu'un utilisateur ne répond pas aux exigences
              d'âge, BonjourImmo se réserve le droit de suspendre ou de résilier
              immédiatement son compte, sans préavis. De plus, l'accès à
              certaines fonctionnalités ou services peut être limité aux
              utilisateurs qui fournissent des vérifications supplémentaires de
              leur âge.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              En tant qu'utilisateur, il est de votre responsabilité de fournir
              des informations précises et véridiques concernant votre âge lors
              de la création de votre compte. Toute tentative de falsification
              ou de dissimulation d'informations peut entraîner des sanctions, y
              compris la perte d'accès à la plateforme.
            </p>
          </section>

          <section className="space-y-4 mb-12">
            <h2 className="text-lg font-semibold mb-3">Vos Informations</h2>
            <p className="text-muted-foreground leading-relaxed">
              Lorsque vous utilisez la plateforme BonjourImmo, vous acceptez de
              fournir des informations exactes, complètes et à jour. Cela
              inclut, mais sans s'y limiter, les informations nécessaires pour
              créer un compte, publier des annonces ou utiliser d'autres
              services proposés sur la plateforme.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Vous êtes seul responsable de l'exactitude et de la véracité des
              données que vous fournissez. BonjourImmo ne peut être tenu
              responsable des pertes ou des dommages résultant de l'inexactitude
              ou de la falsification des informations fournies par
              l'utilisateur.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              En soumettant vos informations, vous nous accordez le droit
              d'utiliser, de stocker, et de traiter ces données conformément à
              notre Politique de Confidentialité. Cela peut inclure le partage
              de certaines données avec des tiers dans le cadre de la fourniture
              des services ou pour des raisons légales.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              BonjourImmo se réserve le droit de suspendre ou de résilier votre
              compte si les informations fournies s'avèrent inexactes,
              incomplètes, ou trompeuses. Vous êtes également tenu de mettre à
              jour vos informations en cas de changement, notamment votre
              adresse, votre numéro de téléphone, ou toute autre donnée
              essentielle à l'utilisation de nos services.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              En utilisant la plateforme, vous confirmez également que les
              informations soumises ne violent pas les droits de tiers,
              notamment les droits d'auteur, la vie privée ou tout autre droit
              protégé par la loi.
            </p>
          </section>

          <section className="space-y-4 mb-12">
            <h2 className="text-lg font-semibold mb-3">
              Paiement et Facturation
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              BonjourImmo peut facturer vos frais d'utilisation de la plateforme
              via un prestataire de services de paiement tiers, notamment
              Stripe. Les conditions générales de service du prestataire de
              paiement tiers prévaudront et remplaceront les présentes
              conditions en cas de conflit, mais uniquement pour ce qui concerne
              le traitement des paiements. En utilisant les Services, vous
              acceptez de fournir des informations de paiement exactes et
              complètes, et vous autorisez BonjourImmo ou ses prestataires de
              paiement tiers, tels que Stripe, à débiter les frais applicables
              du mode de paiement que vous fournissez.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Vous pouvez annuler votre abonnement à tout moment via la section
              gestion de compte du site. En cas d'annulation, votre accès aux
              Services restera actif jusqu'à la fin de la période d'abonnement
              en cours. Aucun remboursement ne sera accordé pour la durée
              restante de la période d'abonnement ; cependant, aucun frais
              supplémentaire ne sera facturé après la fin de la période
              d'abonnement. Veuillez noter que tout manquement à nos directives
              communautaires ou toute utilisation inappropriée des Services
              constitue une violation des présentes conditions et peut entraîner
              la résiliation de votre accès à BonjourImmo sans remboursement.
              Aucun remboursement ne sera accordé pour les Services déjà
              utilisés.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              BonjourImmo se réserve le droit de modifier ses prix, ses plans
              d'abonnement et ses offres. Toute modification des tarifs sera
              communiquée aux utilisateurs via un avis préalable raisonnable. Il
              est de votre responsabilité de consulter les frais et les
              conditions applicables avant d'acheter ou de renouveler un
              abonnement. Des informations supplémentaires concernant les plans
              d'abonnement, les politiques de facturation, les taxes, les
              remboursements et les autorisations de paiement sont disponibles
              ici.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              BonjourImmo n'est pas responsable des problèmes liés aux services
              de paiement tiers, y compris les retards, les erreurs ou les
              transactions non autorisées. Il vous incombe de résoudre ces
              problèmes directement avec le prestataire de paiement, tel que
              Stripe. Si le paiement n'est pas traité avec succès en raison de
              fonds insuffisants, de modes de paiement expirés ou pour d'autres
              raisons, nous nous réservons le droit de suspendre ou de résilier
              votre accès aux Services jusqu'à ce que tous les frais en attente
              soient réglés.
            </p>
          </section>

          <section className="space-y-4 mb-12">
            <h2 className="text-lg font-semibold mb-3">
              Limitation de Responsabilité et Indemnité
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Dans les limites autorisées par la loi applicable, BonjourImmo,
              ses affiliés, partenaires, dirigeants, employés et agents ne
              pourront être tenus responsables des dommages directs, indirects,
              accessoires, spéciaux, consécutifs ou punitifs, y compris, sans
              s'y limiter, les pertes de revenus, de profits, de données ou
              autres pertes immatérielles, résultant de l'utilisation ou de
              l'impossibilité d'utiliser les Services, même si BonjourImmo a été
              informé de la possibilité de tels dommages.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              BonjourImmo ne garantit pas que les Services seront ininterrompus,
              exempts d'erreurs ou sécurisés, ni que les informations fournies
              par les utilisateurs ou d'autres parties seront exactes ou
              fiables. Vous acceptez que votre utilisation des Services se fasse
              à vos propres risques.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Vous acceptez d'indemniser et de dégager de toute responsabilité
              BonjourImmo, ses affiliés, partenaires, dirigeants, employés et
              agents contre toute réclamation, demande, perte, responsabilité,
              coût ou dépense (y compris les frais d'avocat raisonnables)
              résultant de votre violation de ces Conditions ou de votre
              utilisation des Services, y compris, mais sans s'y limiter, les
              violations de la loi applicable, les atteintes aux droits de tiers
              ou tout contenu que vous fournissez à travers la plateforme.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Cette limitation de responsabilité s'applique dans toute la mesure
              permise par la loi applicable et reste valide même si tout recours
              prévu dans ces Conditions échoue dans son objectif essentiel.
            </p>
          </section>

          <section className="space-y-4 mb-12">
            <h2 className="text-lg font-semibold mb-3">
              Modification des Conditions d’Utilisation
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              BonjourImmo se réserve le droit de modifier ou de mettre à jour
              les présentes Conditions d’Utilisation à tout moment, à sa seule
              discrétion, afin de refléter des changements dans nos pratiques,
              nos Services, ou les lois applicables. Toute modification sera
              publiée sur notre plateforme et indiquée par une mise à jour de la
              date en haut des Conditions.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              En cas de modifications substantielles, nous nous engageons à
              informer les utilisateurs par des moyens raisonnables, tels qu’un
              avis sur notre site ou une notification par e-mail, si vous nous
              avez fourni une adresse valide. Nous vous encourageons à consulter
              régulièrement ces Conditions pour rester informé des mises à jour.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Votre utilisation continue des Services après la publication des
              modifications constitue votre acceptation des Conditions révisées.
              Si vous n’acceptez pas les nouvelles dispositions, vous devez
              cesser d’utiliser nos Services immédiatement.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Toute modification des présentes Conditions ne s’appliquera pas
              rétroactivement et ne changera pas les conditions applicables aux
              transactions conclues avant la date d’entrée en vigueur des
              modifications.
            </p>
          </section>

          <section className="space-y-4 mb-12">
            <h2 className="text-lg font-semibold mb-3">Merci</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nous vous remercions de choisir BonjourImmo comme votre plateforme
              de confiance pour gérer vos annonces immobilières. Nous nous
              engageons à fournir un service de qualité qui répond à vos besoins
              et simplifie vos démarches en tant que propriétaire.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Votre satisfaction et votre réussite sont au cœur de nos
              priorités. Si vous avez des questions, des préoccupations ou des
              suggestions pour améliorer nos Services, n’hésitez pas à nous
              contacter. Nous sommes toujours à l’écoute et déterminés à vous
              offrir la meilleure expérience possible.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Merci de faire partie de la communauté BonjourImmo. Ensemble, nous
              réinventons la façon de vendre, louer ou proposer vos biens en
              toute transparence et simplicité.
            </p>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
