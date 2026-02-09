import { useState, useEffect } from 'react';

export interface Currency {
  id: number;
  name: string;
  code_iso: string;
}

export interface Country {
  id: number;
  name: string;
}

interface UseCurrenciesAndCountriesReturn {
  currencies: Currency[];
  countries: Country[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to fetch and manage currencies and countries data
 */
export function useCurrenciesAndCountries(): UseCurrenciesAndCountriesReturn {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch currencies and countries in parallel
        const [currenciesResponse, countriesResponse] = await Promise.all([
          fetch('/api/currencies'),
          fetch('/api/countries'),
        ]);

        if (!currenciesResponse.ok || !countriesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [currenciesData, countriesData] = await Promise.all([
          currenciesResponse.json(),
          countriesResponse.json(),
        ]);

        setCurrencies(currenciesData.data || []);
        setCountries(countriesData.data || []);
      } catch (err) {
        console.error('Error fetching currencies and countries:', err);
        setError('Impossible de charger les données');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    currencies,
    countries,
    isLoading,
    error,
  };
}
