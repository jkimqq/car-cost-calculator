import React, { useState, useEffect } from 'react';

const fuelTaxRates = {
  lpg: 0.02,
  petrol: 0.03,
  diesel: 0.04,
};

const dealerCommissionRates = {
  kazakhstan: 0.05,
  russia: 0.06,
};

const deliveryCosts = {
  kazakhstan: 1500,
  russia: 2000,
};

const customsTaxRates = {
  kazakhstan: 0.12,
  russia: 0.15,
};

const carModels = [
  { name: 'Toyota Camry', price: 24000 },
  { name: 'Hyundai Sonata', price: 22000 },
  { name: 'Kia Optima', price: 21000 },
];

const CarCostCalculator = () => {
  const [selectedCar, setSelectedCar] = useState(carModels[0].name);
  const [country, setCountry] = useState('kazakhstan');
  const [fuelType, setFuelType] = useState('petrol');
  const [currency, setCurrency] = useState('USD');
  const [currencyRates, setCurrencyRates] = useState({ USD: 1, KRW: 1330, RUB: 92, KZT: 450 });
  const [calculated, setCalculated] = useState(false);
  const [details, setDetails] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchCurrencyRates = async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        setCurrencyRates({
          USD: 1,
          KRW: data.rates.KRW,
          RUB: data.rates.RUB,
          KZT: data.rates.KZT,
        });
      } catch (error) {
        console.error('Ошибка загрузки курсов валют:', error);
      }
    };

    fetchCurrencyRates();
  }, []);

  const calculateDetails = () => {
    const carPrice = carModels.find((car) => car.name === selectedCar).price;
    const fuelTax = carPrice * fuelTaxRates[fuelType];
    const dealerCommission = carPrice * dealerCommissionRates[country];
    const customsTax = carPrice * customsTaxRates[country];
    const deliveryCost = deliveryCosts[country];
    const totalCost = carPrice + fuelTax + dealerCommission + customsTax + deliveryCost;

    setDetails({ carPrice, fuelTax, dealerCommission, customsTax, deliveryCost, totalCost });
    setCalculated(true);
  };

  const resetForm = () => {
    setSelectedCar(carModels[0].name);
    setCountry('kazakhstan');
    setFuelType('petrol');
    setCurrency('USD');
    setCalculated(false);
    setDetails({});
  };

  const convertCurrency = (amountUSD) => (amountUSD * currencyRates[currency]).toFixed(2);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="w-full max-w-xl mx-auto p-6 sm:p-8 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center w-full">Калькулятор стоимости авто</h2>
          <label className="ml-4 inline-flex items-center cursor-pointer">
            <span className="mr-2 text-sm">🌙</span>
            <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full after:transition-all after:content-[''] after:absolute after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:top-0.5 after:left-0.5 relative" />
          </label>
        </div>

        <label className="block mb-2 font-medium">Модель автомобиля</label>
        <select
          className="w-full mb-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600"
          value={selectedCar}
          onChange={(e) => setSelectedCar(e.target.value)}
        >
          {carModels.map((car) => (
            <option key={car.name} value={car.name}>
              {car.name}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-medium">Страна назначения</label>
        <select
          className="w-full mb-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="kazakhstan">Казахстан</option>
          <option value="russia">Россия</option>
        </select>

        <label className="block mb-2 font-medium">Тип топлива</label>
        <select
          className="w-full mb-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600"
          value={fuelType}
          onChange={(e) => setFuelType(e.target.value)}
        >
          <option value="petrol">Бензин</option>
          <option value="diesel">Дизель</option>
          <option value="lpg">LPG</option>
        </select>

        <label className="block mb-2 font-medium">Валюта расчета</label>
        <select
          className="w-full mb-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="USD">USD</option>
          <option value="KRW">KRW</option>
          <option value="RUB">RUB</option>
          <option value="KZT">KZT</option>
        </select>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button
            className="w-full py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition"
            onClick={calculateDetails}
          >
            Рассчитать
          </button>
          <button
            className="w-full py-3 bg-white text-gray-800 border border-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-500 dark:hover:bg-gray-600 transition"
            onClick={resetForm}
          >
            Сбросить
          </button>
        </div>

        {calculated && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm sm:text-base animate-fade-in">
            <p className="mb-2">Цена автомобиля: <span className="font-semibold">{convertCurrency(details.carPrice)} {currency}</span></p>
            <p className="mb-2">Растаможка: <span className="font-semibold">{convertCurrency(details.customsTax)} {currency}</span></p>
            <p className="mb-2">Комиссия дилера: <span className="font-semibold">{convertCurrency(details.dealerCommission)} {currency}</span></p>
            <p className="mb-2">Доставка: <span className="font-semibold">{convertCurrency(details.deliveryCost)} {currency}</span></p>
            <p className="text-lg sm:text-xl font-bold">Общая стоимость: {convertCurrency(details.totalCost)} {currency}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarCostCalculator;

