
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
    const response = await fetch('https://your-backend-url.onrender.com/calculate', {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <label className="block mb-2 font-medium">Select Sector</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {selectedSector || 'Choose a sector'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                {sectors.map(sector => (
                  <DropdownMenuItem key={sector} onSelect={() => setSelectedSector(sector)}>
                    {sector}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <label className="block mt-4 mb-2 font-medium">Loan Amount</label>
            <div className="flex space-x-2">
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="p-2 border rounded">
                <option value="GBP">GBP</option>
                <option value="USD">USD</option>
              </select>
              <Input
                type="number"
                placeholder="Enter amount"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="flex-1"
              />
            </div>

            <Button onClick={handleSubmit} className="mt-6 w-full">
              Calculate Exposure
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Exposure Summary</h2>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="font-medium py-1">Current Exposure</td>
                    <td className="text-right">£{result.currentExposure.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="font-medium py-1">New / Subject Deal</td>
                    <td className="text-right">£{result.newExposure.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b font-semibold">
                    <td className="py-1">Total if Approved</td>
                    <td className="text-right">£{result.totalIfApproved.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="font-medium py-1">Within Limit</td>
                    <td className="text-right">£{result.withinLimit.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="font-medium py-1">Updated %</td>
                    <td className="text-right">{(result.updatedPct * 100).toFixed(2)}%</td>
                  </tr>
                  <tr className="font-semibold text-green-600">
                    <td className="py-1">Remaining Capacity</td>
                    <td className="text-right">£{result.remainingCapacity.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
