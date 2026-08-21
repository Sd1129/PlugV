const vehicleImages: Record<string, string> = {
  "mahindra-be-6": "/images/vehicles/mahindra-be-6.png",
  "tata-punch-ev": "/images/vehicles/tata-punch-ev.png",
  "hyundai-creta-electric": "/images/vehicles/hyundai-creta-electric.png",
  "tata-nexon-ev": "/images/vehicles/tata-nexon-ev.png",
  "mg-windsor-ev": "/images/vehicles/mg-windsor-ev.png",
  "tesla-model-y": "/images/vehicles/tesla-model-y.png",
};

export function getVehicleImage(slug: string) {
  return vehicleImages[slug] ?? null;
}
