import React, { useState } from 'react';

const sectors = [
  'Commercial', 'Hotels', 'Pubs & Bars', 'Restaurants', 'Other Leisure',
  'Healthcare', 'Fund Finance', 'Lender Finance', 'Education', 'Professional Services',
  'Consumer Goods and Retail', 'Industrials', 'Others', 'Hotels - Dev',
  'Hotels - Dev (as % of Total Hotel Sector)'
];

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
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">Exposure Summary</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-300 text-left">
              <thead className="bg-blue-100 text-blue-800">
                <tr>
                  <th className="px-4 py-2 font-semibold">{selectedSector}</th>
                  <th className="px-4 py-2 font-semibold">Sectoral</th>
                  <th className="px-4 py-2 font-semibold">Total</th>
                  <th className="px-4 py-2 font-semibold">% of Total</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-t">
                  <td className="px-4 py-2">Current</td>
                  <td className="px-4 py-2">£{result.currentExposure.toLocaleString()}</td>
                  <td className="px-4 py-2">£{result.totalExposure.toLocaleString()}</td>
                  <td className="px-4 py-2">{((result.currentExposure / result.totalExposure) * 100).toFixed(2)}%</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">New / Subject deal</td>
                  <td className="px-4 py-2">£{result.newExposure.toLocaleString()}</td>
                  <td className="px-4 py-2">£{result.newExposure.toLocaleString()}</td>
                  <td className="px-4 py-2">-</td>
                </tr>
                <tr className="border-t bg-gray-50 font-semibold">
                  <td className="px-4 py-2">Total, if approved</td>
                  <td className="px-4 py-2">£{result.totalIfApproved.toLocaleString()}</td>
                  <td className="px-4 py-2">£{(result.totalExposure + result.newExposure).toLocaleString()}</td>
                  <td className="px-4 py-2">{(result.updatedPct * 100).toFixed(2)}%</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">Within Limit</td>
                  <td className="px-4 py-2">£{result.withinLimit.toLocaleString()}</td>
                  <td className="px-4 py-2">£{result.totalExposure.toLocaleString()}</td>
                  <td className="px-4 py-2">{(result.limitPct * 100).toFixed(2)}%</td>
                </tr>
                <tr className="border-t text-green-700 font-semibold">
                  <td className="px-4 py-2">Remaining Capacity</td>
                  <td className="px-4 py-2">£{result.remainingCapacity.toLocaleString()}</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">{((result.limitPct - result.updatedPct) * 100).toFixed(2)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
