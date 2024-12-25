type StripePriceId = {
  test: string;
  production: string;
};

interface StripePlan {
  name: string;
  price_id: StripePriceId;
  listingsPerMonth: number;
  maxPhotos: number;
  price: {
    amount: number;
    currency: string;
  };
}

export const STRIPE_PLANS: Record<string, StripePlan> = {
  plus: {
    name: "Plus",
    price_id: {
      test: "price_1QZMjWGsQpX8AIfwHN4Khted",
      production: "price_1QZjOMGsQpX8AIfwaSXOndIv",
    },
    listingsPerMonth: 10,
    maxPhotos: 30,
    price: {
      amount: 29,
      currency: "EUR",
    },
  },
  premium: {
    name: "Premium",
    price_id: {
      test: "price_1QZMmHGsQpX8AIfwUwjhMyft",
      production: "price_1QZjOOGsQpX8AIfwYOM9mYzv",
    },
    listingsPerMonth: 25,
    maxPhotos: 60,
    price: {
      amount: 49,
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
