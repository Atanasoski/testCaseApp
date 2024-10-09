import axios from 'axios';

class CurrencyConversionService {
    private apiUrl: string;
    private apiKey: string;

    constructor() {
        this.apiUrl = 'https://openexchangerates.org/api/latest.json';
        this.apiKey = '6be40a01cd3040a48ec55be57ad6826c';
    }

    public async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
        try {
            const response = await axios.get(`${this.apiUrl}?app_id=${this.apiKey}&base=${fromCurrency}&symbols=${toCurrency}`);
            return response.data.rates[toCurrency];
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch exchange rate: ${error.message}`);
            } else {
                throw new Error('Unknown error occurred while fetching exchange rate.');
            }
        }
    }
}

export default CurrencyConversionService;
