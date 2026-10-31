import type { Farmer, Product } from "@/lib/marketplace";

export type HarvestFactor = "soil" | "weather" | "compatibility" | "irrigation" | "season" | "reliability" | "completeness";
export type HarvestMessage =
  | "harvestPositiveRegion" | "harvestPositiveSeason" | "harvestPositiveVerified" | "harvestPositiveWater" | "harvestPositiveData"
  | "harvestRiskIrrigation" | "harvestRiskWeather" | "harvestRiskSeason" | "harvestRiskData" | "harvestRiskCompatibility"
  | "harvestRecommendationIrrigation" | "harvestRecommendationDates" | "harvestRecommendationData" | "harvestRecommendationMonitor";

export type HarvestAIResult = {
  overallScore: number;
  label: "low" | "medium" | "high";
  factors: Record<HarvestFactor, number>;
  positiveFactors: HarvestMessage[];
  riskFactors: HarvestMessage[];
  recommendations: HarvestMessage[];
  preliminary: boolean;
  lastUpdated: string;
};

const cropRegions: Record<string, string[]> = {
  "Meyvə": ["Quba", "Şəki", "Qəbələ", "Zaqatala", "Lənkəran"],
  "Tərəvəz": ["Lənkəran", "Quba", "Bakı", "Şəki"],
  "Bal": ["Şəki", "Zaqatala", "Qəbələ", "İsmayıllı"],
  "Süd məhsulları": ["Quba", "Şəki", "İsmayıllı"],
  "Taxıl": ["Şamaxı", "Şəki", "Qəbələ"],
  "Ting və toxum": ["Şamaxı", "Quba", "Gəncə", "Şəki"]
};

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return Math.abs(result >>> 0);
}
function stableRange(seed: string, min: number, max: number) { return min + (hash(seed) % (max - min + 1)); }
function selectedScore(value: string | undefined, fallback: number) {
  if (value === "high" || value === "available") return 92;
  if (value === "medium" || value === "partial") return 70;
  if (value === "low" || value === "none") return 42;
  return fallback;
}
function seasonScore(product: Product, seed: string) {
  const planting = product.plantingDate ? new Date(`${product.plantingDate}T00:00:00`) : null;
  const harvest = product.harvestDate ? new Date(`${product.harvestDate}T00:00:00`) : null;
  if (planting && harvest && !Number.isNaN(planting.valueOf()) && !Number.isNaN(harvest.valueOf())) {
    const days = (harvest.valueOf() - planting.valueOf()) / 86400000;
    return days >= 45 && days <= 300 ? 90 : days > 0 ? 66 : 35;
  }
  return stableRange(`${seed}:season`, 58, 78);
}

export function calculateHarvestAI(product: Product, farmer?: Farmer | null): HarvestAIResult {
  const seed = [product.id, product.name, product.category, product.region, farmer?.status ?? "missing", farmer?.region ?? ""].join("|");
  const compatibility = cropRegions[product.category]?.includes(product.region) ? 92 : product.category === "Digər" ? 64 : stableRange(`${seed}:compatibility`, 52, 76);
  const factors: Record<HarvestFactor, number> = {
    soil: selectedScore(product.soilFertility, stableRange(`${seed}:soil`, 58, 82)),
    weather: stableRange(`${seed}:weather`, compatibility >= 85 ? 74 : 58, compatibility >= 85 ? 92 : 80),
    compatibility,
    irrigation: selectedScore(product.irrigation ?? farmer?.irrigation, stableRange(`${seed}:water`, 54, 72)),
    season: seasonScore(product, seed),
    reliability: farmer?.status === "approved" ? 94 : farmer?.status === "changes" ? 58 : 66,
    completeness: 0
  };
  const required = [product.name, product.category, product.region, product.description, product.harvestDate, product.plantingDate, product.soilFertility, product.irrigation, product.previousExperience ?? farmer?.previousExperience];
  factors.completeness = Math.round(required.filter(Boolean).length / required.length * 100);
  const overallScore = Math.max(0, Math.min(100, Math.round(
    factors.soil * .25 + factors.weather * .25 + factors.compatibility * .20 + factors.irrigation * .10 + factors.season * .10 + factors.reliability * .05 + factors.completeness * .05
  )));
  const positiveFactors: HarvestMessage[] = [];
  const riskFactors: HarvestMessage[] = [];
  const recommendations: HarvestMessage[] = [];
  if (factors.compatibility >= 85) positiveFactors.push("harvestPositiveRegion"); else riskFactors.push("harvestRiskCompatibility");
  if (factors.season >= 80) positiveFactors.push("harvestPositiveSeason"); else riskFactors.push("harvestRiskSeason");
  if (factors.reliability >= 85) positiveFactors.push("harvestPositiveVerified");
  if (factors.irrigation >= 80) positiveFactors.push("harvestPositiveWater"); else { riskFactors.push("harvestRiskIrrigation"); recommendations.push("harvestRecommendationIrrigation"); }
  if (factors.completeness >= 75) positiveFactors.push("harvestPositiveData"); else { riskFactors.push("harvestRiskData"); recommendations.push("harvestRecommendationData"); }
  if (!product.plantingDate || !product.harvestDate) recommendations.push("harvestRecommendationDates");
  riskFactors.push("harvestRiskWeather");
  recommendations.push("harvestRecommendationMonitor");
  return {
    overallScore,
    label: overallScore >= 80 ? "high" : overallScore >= 60 ? "medium" : "low",
    factors,
    positiveFactors: positiveFactors.slice(0, 4),
    riskFactors: riskFactors.slice(0, 3),
    recommendations: [...new Set(recommendations)].slice(0, 3),
    preliminary: factors.completeness < 75,
    lastUpdated: product.updatedAt ?? product.createdAt
  };
}
