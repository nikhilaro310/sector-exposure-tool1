import React, { useState } from 'react';

const sectors = [
  'Commercial', 'Hotels', 'Pubs & Bars', 'Restaurants', 'Other Leisure',
  'Healthcare', 'Fund Finance', 'Lender Finance', 'Education', 'Professional Services',
  'Consumer Goods and Retail', 'Industrials', 'Others', 'Hotels - Dev',
  'Hotels - Dev (as % of Total Hotel Sector)'
];

const CET1 = 952334227;

export default function SectorExposureTool() {
  const [selectedSector, setSelectedSector] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [currency, setCurrency] = useState('GBP');
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    const response = await fetch('https://sector-exposure-backend-1.onrender.com/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sector: selectedSector,
        amount: parseFloat(loanAmount),
        currency
      })
    });
    const data = await response.json();
    setResult(data);
  };

  const exposurePolicies = [
    {
      label: 'Single largest group exposure (collateralized, NAV, Capital Call)',
      limitPct: 0.10
    },
    {
      label: 'Single largest group exposure – non collateralized',
      limitPct: 0.05
    },
    {
      label: 'Single largest group exposure in US',
      limitPct: 0.05
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 font-sans">
      <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-10">Sector Exposure Calculator</h1>

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Select Sector</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
            >
              <option value="">Choose a sector</option>
              {sectors.map((sector) => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Loan Amount</label>
            <div className="flex gap-2">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="GBP">GBP</option>
                <option value="USD">USD</option>
              </select>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded"
                placeholder="Enter loan amount"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
        >
          Calculate Exposure
        </button>
      </div>

      {result && result.currentExposure !== undefined && result.limitPct !== undefined && (
        <div className="max-w-5xl mx-auto mt-10 space-y-10">
          {/* existing table rendering remains unchanged */}
        </div>
      )}
    </div>
  );
}
