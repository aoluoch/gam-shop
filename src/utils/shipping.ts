/**
 * Shipping fee calculation utilities
 * 
 * Location-based shipping fees:
 * - Nairobi County areas (Nairobi, Kiambu, Kajiado): Uses nairobiAreaFee
 * - Other locations: Uses otherAreaFee
 */

const NAIROBI_AREA_CITIES = ['nairobi', 'kiambu', 'kajiado']

/**
 * Check if a city is in the Nairobi County area
 * Uses case-insensitive contains matching
 */
export function isNairobiArea(city: string): boolean {
  if (!city || typeof city !== 'string') {
    return false
  }
  
  const cityLower = city.toLowerCase().trim()
  
  return NAIROBI_AREA_CITIES.some(areaCity => 
    cityLower.includes(areaCity)
  )
}

/**
 * Calculate shipping fee based on city and subtotal
 * 
 * @param city - The city name from shipping address
 * @param subtotal - The order subtotal
 * @param freeShippingThreshold - The threshold for free shipping
 * @param nairobiAreaFee - Shipping fee for Nairobi County areas (default: 300)
 * @param otherAreaFee - Shipping fee for other locations (default: 500)
 * @returns The calculated shipping fee
 */
export function calculateShippingFee(
  city: string,
  subtotal: number,
  freeShippingThreshold: number,
  nairobiAreaFee: number = 300,
  otherAreaFee: number = 500
): number {
  // Free shipping if subtotal meets threshold
  if (subtotal >= freeShippingThreshold) {
    return 0
  }
  
  // Location-based fee
  if (isNairobiArea(city)) {
    return nairobiAreaFee
  }
  
  return otherAreaFee
}
