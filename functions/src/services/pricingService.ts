import CurrencyConversionService from './currencyConversionService';

class PricingService {
  private currencyConversionService: CurrencyConversionService;

  constructor() {
    this.currencyConversionService = new CurrencyConversionService();
  }

  // Calculate the price for a package in a specific country and currency
  public async calculatePrice(basePrice: number, fromCurrency: string, toCurrency: string): Promise<number> {
    try {
      // Convert the toCurrency to uppercase
      const targetCurrency = toCurrency.toUpperCase();

        // Fetch the exchange rate and convert the price
        const exchangeRate = await this.currencyConversionService.getExchangeRate(fromCurrency, targetCurrency);
        if (!exchangeRate) {
          throw new Error(`Failed to fetch exchange rate for ${targetCurrency}`);
        }

        const convertedPrice = basePrice * exchangeRate;

        // Round the converted price
        return Math.round(convertedPrice * 100) / 100;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error calculating the price with currency conversion: ${error.message}`);
        } else {
            throw new Error('Unknown error occurred while calculating the price');
        }
    }
  }
}

export default PricingService;

