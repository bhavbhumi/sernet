import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Layers } from 'lucide-react';
import { CalculatorShell } from './CalculatorShell';

const MarginCalcContent = () => {
  const [stockPrice, setStockPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [segment, setSegment] = useState<'equity' | 'fno'>('equity');

  const handleAIParams = (params: Record<string, number>) => {
    if (params.stockPrice) setStockPrice(String(params.stockPrice));
    if (params.quantity) setQuantity(String(Math.round(params.quantity)));
  };

  const calculate = () => {
    const price = parseFloat(stockPrice) || 0;
    const qty = parseInt(quantity) || 0;
    const totalValue = price * qty;
    const marginPct = segment === 'equity' ? 0.2 : 0.15;
    const marginRequired = totalValue * marginPct;
    const leverage = segment === 'equity' ? 5 : 6.67;
    const marginUtilisation = marginRequired;
    return { totalValue, marginRequired, leverage, marginUtilisation };
  };

  const results = calculate();
  const price = parseFloat(stockPrice) || 0;
  const qty = parseInt(quantity) || 0;

  const segmentLabel = segment === 'equity' ? 'equity intraday' : 'F&O';
  const marginPctLabel = segment === 'equity' ? '20%' : '15%';
  const fnoNote = segment === 'fno'
    ? 'F&O margins vary by exchange and underlying volatility — SEBI SPAN + Exposure margin framework applies. Actual margin may differ from this estimate.'
    : 'Equity intraday margins can change intraday based on circuit filters and stock volatility.';
  const commentary = price > 0 && qty > 0
    ? `For ${qty} shares/lots at Rs.${price} in ${segmentLabel} segment, total contract value is Rs.${results.totalValue.toLocaleString('en-IN')}. You need Rs.${results.marginRequired.toFixed(0)} margin (${marginPctLabel} of contract value), providing ${results.leverage.toFixed(2)}x leverage. ${fnoNote}`
    : 'Enter stock price and quantity to calculate required margin.';

  return (
    <CalculatorShell
      title="Margin Calculator"
      description="Calculate the margin required for intraday equity and F&O trades"
      icon={<Layers className="w-4 h-4" />}
      calcType="margin"
      aiContext="Margin calculator for equity intraday and F&O trades. Computes required margin as a percentage of contract value and shows leverage. Equity intraday requires 20% margin (5x leverage); F&O requires 15% margin."
      onAIParams={handleAIParams}
      formInputs={
        <div className="space-y-5">
          <div className="flex gap-3">
            <Button variant={segment === 'equity' ? 'default' : 'outline'} onClick={() => setSegment('equity')} className="flex-1">Equity Intraday</Button>
            <Button variant={segment === 'fno' ? 'default' : 'outline'} onClick={() => setSegment('fno')} className="flex-1">F&O</Button>
          </div>
          <div>
            <Label htmlFor="margin-price">Stock / Index Price (₹)</Label>
            <Input id="margin-price" type="number" placeholder="Enter price" value={stockPrice} onChange={(e) => setStockPrice(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="margin-qty">Quantity / Lot Size</Label>
            <Input id="margin-qty" type="number" placeholder="Enter quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="mt-1.5" />
          </div>
        </div>
      }
      result={{
        label: 'Margin Details',
        primary: { label: 'Margin Required', value: `₹${results.marginRequired.toFixed(2)}` },
        metrics: [
          { label: 'Contract Value', value: `₹${results.totalValue.toLocaleString('en-IN')}` },
          { label: 'Leverage', value: `${results.leverage.toFixed(2)}x` },
          { label: 'Segment', value: segment === 'equity' ? 'Equity Intraday' : 'F&O' },
          { label: 'Margin %', value: segment === 'equity' ? '20%' : '15%' },
        ],
        commentary,
      }}
    />
  );
};

export default MarginCalcContent;
