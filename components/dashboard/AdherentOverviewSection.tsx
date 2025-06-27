import { startOfMonth, endOfMonth, subMonths, addDays, format } from "date-fns";
import { fr } from "date-fns/locale"; // Importation du locale français
import { 
  UsersIcon, 
  UserPlusIcon, 
  UserCogIcon, 
  CalendarIcon,
  AlertTriangleIcon
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdherentOverviewSection() {
  // Obtenir la date actuelle et calculer les plages de dates importantes
  const now = new Date();
  
  // Plage de dates du mois en cours
  const firstDayOfMonth = startOfMonth(now);
  const lastDayOfMonth = endOfMonth(now);
  
  // Plage de dates du mois précédent
  const firstDayOfLastMonth = startOfMonth(subMonths(now, 1));
  const lastDayOfLastMonth = endOfMonth(subMonths(now, 1));
  
  // Date dans 7 jours pour les abonnements expirants
  const sevenDaysFromNow = addDays(now, 7);

  // ---------------------------------------------------
  // 1. Total des Adhérents
  // ---------------------------------------------------
  const totalAdherents = await prisma.adherent.count();

  // ---------------------------------------------------
  // 2. Nouveaux Adhérents ce Mois
  // ---------------------------------------------------
  const newAdherentsThisMonth = await prisma.adherent.count({
    where: {
      createdAt: {
        gte: firstDayOfMonth,
        lte: lastDayOfMonth,
      },
    },
  });

  // ---------------------------------------------------
  // 3. Nouveaux Adhérents le Mois Dernier
  // ---------------------------------------------------
  const newAdherentsLastMonth = await prisma.adherent.count({
    where: {
      createdAt: {
        gte: firstDayOfLastMonth,
        lte: lastDayOfLastMonth,
      },
    },
  });

  // Calculer le pourcentage de croissance d'un mois à l'autre
  const adherentGrowthPercent = newAdherentsLastMonth > 0
    ? ((newAdherentsThisMonth - newAdherentsLastMonth) / newAdherentsLastMonth) * 100
    : newAdherentsThisMonth > 0 ? 100 : 0;

  // ---------------------------------------------------
  // 4. En Attente de Validation
  // ---------------------------------------------------
  const pendingValidation = await prisma.adherent.count({
    where: {
      isValidated: false,
    },
  });

  // ---------------------------------------------------
  // 5. Abonnements Expirant Cette Semaine
  // ---------------------------------------------------
  const expiringSubscriptions = await prisma.subscription.count({
    where: {
      endDate: {
        gte: now,
        lte: sevenDaysFromNow,
      },
      status: "actif", // Compter uniquement les abonnements actifs
    },
  });

  // ---------------------------------------------------
  // 6. Métrique Supplémentaire: Abonnements Actifs
  // ---------------------------------------------------
  const activeSubscriptions = await prisma.subscription.count({
    where: {
      status: "actif",
      endDate: {
        gte: now,
      },
    },
  });

  // Calculer le pourcentage d'abonnements actifs
  const activePercentage = totalAdherents > 0
    ? (activeSubscriptions / totalAdherents) * 100
    : 0;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Aperçu des Adhérents</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Carte du Total des Adhérents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total des Adhérents
            </CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAdherents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activePercentage.toFixed(1)}% avec abonnements actifs
            </p>
          </CardContent>
        </Card>

        {/* Carte des Nouveaux Adhérents ce Mois */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nouveaux Adhérents ({format(now, 'MMMM', { locale: fr })})
            </CardTitle>
            <UserPlusIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newAdherentsThisMonth}</div>
            <div className="flex items-center pt-1">
              <Badge variant={adherentGrowthPercent >= 0 ? "outline" : "destructive"}>
                {adherentGrowthPercent >= 0 ? "+" : ""}
                {adherentGrowthPercent.toFixed(1)}%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">vs mois précédent</span>
            </div>
          </CardContent>
        </Card>

        {/* Carte des Nouveaux Adhérents le Mois Dernier */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mois Précédent ({format(firstDayOfLastMonth, 'MMMM', { locale: fr })})
            </CardTitle>
            <UserPlusIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newAdherentsLastMonth}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total des nouvelles inscriptions
            </p>
          </CardContent>
        </Card>

        {/* Carte des Adhérents en Attente de Validation */}
        <Card className={pendingValidation > 0 ? "border-orange-300" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              En Attente de Validation
            </CardTitle>
            <UserCogIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingValidation}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingValidation > 0 
                ? "Adhérents nécessitant validation" 
                : "Tous les adhérents sont validés"}
            </p>
          </CardContent>
        </Card>

        {/* Carte des Abonnements Expirant */}
        <Card className={expiringSubscriptions > 0 ? "border-amber-300" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Expirant Cette Semaine
            </CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringSubscriptions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Abonnements se terminant dans les 7 prochains jours
            </p>
          </CardContent>
        </Card>

        {/* Carte des Abonnements Actifs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Abonnements Actifs
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Adhésions actuellement actives
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}