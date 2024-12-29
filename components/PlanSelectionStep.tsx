"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export type PricingPlan = "basic" | "plus" | "premium";

interface PlanData {
  id: PricingPlan;
  name: string;
  price: string;
  description: string;
}

interface PlanSelectionStepProps {
  onPlanSelect: (plan: PricingPlan) => void;
  selectedPlan: PricingPlan | null;
}

const PlanSelectionStep = ({
  onPlanSelect,
  selectedPlan,
}: PlanSelectionStepProps) => {
  const t = useTranslations("newListing.planSelection");

  const plans: PlanData[] = [
    {
      id: "basic",
      name: t("plans.basic.name"),
      price: t("plans.basic.price"),
      description: t("plans.basic.description"),
    },
    {
      id: "plus",
      name: t("plans.plus.name"),
      price: t("plans.plus.price"),
      description: t("plans.plus.description"),
    },
    {
      id: "premium",
      name: t("plans.premium.name"),
      price: t("plans.premium.price"),
      description: t("plans.premium.description"),
    },
  ];

  const handleSelectPlan = (plan: PlanData) => {
    onPlanSelect(plan.id);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`border ${
              selectedPlan === plan.id ? "border-primary" : "border-muted"
            }`}
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {plan.name}
              </CardTitle>
              <p className="text-muted-foreground text-sm">{plan.price}</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{plan.description}</p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleSelectPlan(plan)}
                variant={selectedPlan === plan.id ? "default" : "outline"}
                className="w-full"
                disabled={!!selectedPlan}
              >
                {t("actions.select")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlanSelectionStep;
