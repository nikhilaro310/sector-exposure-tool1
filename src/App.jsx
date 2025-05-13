import React, { useState } from 'react';

const sectors = [
  'Residential Accommodation - Investment', 'Residential Accommodation - Development', 'Retirement Living',
  'Student Accommodation', 'Co-living', 'Commercial', 'Hotels', 'Pubs & Bars', 'Restaurants', 'Other Leisure',
  'Healthcare', 'Fund Finance', 'Lender Finance', 'Education', 'Professional Services',
  'Consumer Goods and Retail', 'Industrials', 'Others'
];

export default function SectorExposureTool() {
  const [selectedSector, setSelectedSector] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [currency, setCurrency] = useState('GBP');
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    const response = await fetch('https://sector-exposure-backend.onrender.com/calculate', {
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
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Sector Exposure Calculator</h1>

      <div className="max-w-2xl mx-auto bg-gray-100 p-6 rounded-xl shadow">
        <label className="block mb-2 font-medium">Select Sector</label>
        <select
          className="w-full p-2 border rounded mb-4"
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
        >
          <option value="">Choose a sector</option>
          {sectors.map((sector) => (
            <option key={sector} value={sector}>{sector}</option>
          ))}
        </select>

        <label className="block mb-2 font-medium">Loan Amount</label>
        <div className="flex gap-2 mb-4">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="GBP">GBP</option>
            <option value="USD">USD</option>
          </select>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Enter loan amount"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Calculate Exposure
        </button>
      </div>

      {result && (
        <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-semibold mb-4">Exposure Summary</h2>
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">{selectedSector}</th>
                <th className="px-4 py-2">Sectoral</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">% of Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-100">
                <td className="px-4 py-2 font-medium">Current</td>
                <td className="px-4 py-2">£{result.currentExposure.toLocaleString()}</td>
                <td className="px-4 py-2">£{result.totalExposure.toLocaleString()}</td>
                <td className="px-4 py-2">{((result.currentExposure / result.totalExposure) * 100).toFixed(2)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">New / Subject deal</td>
                <td className="px-4 py-2">£{result.newExposure.toLocaleString()}</td>
                <td className="px-4 py-2">£{result.newExposure.toLocaleString()}</td>
                <td className="px-4 py-2">-</td>
              </tr>
              <tr className="font-semibold bg-gray-50">
                <td className="px-4 py-2">Total, if approved</td>
                <td className="px-4 py-2">£{result.totalIfApproved.toLocaleString()}</td>
                <td className="px-4 py-2">£{(result.totalExposure + result.newExposure).toLocaleString()}</td>
                <td className="px-4 py-2">{(result.updatedPct * 100).toFixed(2)}%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Within Limit</td>
                <td className="px-4 py-2">£{result.withinLimit.toLocaleString()}</td>
                <td className="px-4 py-2">£{result.totalExposure.toLocaleString()}</td>
                <td className="px-4 py-2">{(result.limitPct * 100).toFixed(2)}%</td>
              </tr>
              <tr className="text-green-600 font-semibold">
                <td className="px-4 py-2">Remaining Capacity</td>
                <td className="px-4 py-2">£{result.remainingCapacity.toLocaleString()}</td>
                <td className="px-4 py-2">-</td>
                <td className="px-4 py-2">{((result.limitPct - result.updatedPct) * 100).toFixed(2)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
