type StripePriceId = {
  test: string;
  production: string;
};

interface StripePlan {
  name: string;
  price_id: StripePriceId;
  price: {
    amount: number;
    currency: string;
  };
}

export const STRIPE_PLANS: Record<string, StripePlan> = {
  basic: {
    name: "Basic",
    price_id: {
      test: "price_1Qb2TKGsQpX8AIfwkxxLaEGB",
      production: "price_1QbEQTGsQpX8AIfwOftnfh1X",
    },
    price: {
      amount: 29,
      currency: "EUR",
    },
  },
  plus: {
    name: "Plus",
    price_id: {
      test: "price_1Qb2UeGsQpX8AIfwdCSP4y5W",
      production: "price_1QbEQWGsQpX8AIfwAVHCs0ue",
    },
    price: {
      amount: 49,
      currency: "EUR",
    },
  },
  premium: {
    name: "Premium",
    price_id: {
      test: "price_1Qb2VJGsQpX8AIfwnD1918Oe",
      production: "price_1QbEQYGsQpX8AIfwakVoyraZ",
    },
    price: {
      amount: 99,
      currency: "EUR",
    },
  },
} as const;

export const isProd = process.env.NODE_ENV === "production";

export function getPriceId(plan: keyof typeof STRIPE_PLANS) {
  return STRIPE_PLANS[plan].price_id[isProd ? "production" : "test"];
}

export function getPlanFromPriceId(priceId: string) {
  const plan = Object.entries(STRIPE_PLANS).find(
    ([_, plan]) =>
      plan.price_id.test === priceId || plan.price_id.production === priceId
  );
  return plan ? plan[0] : "free";
}
