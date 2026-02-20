import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import { CalculatorShell } from './CalculatorShell';

const BrokerageCalcContent = () => {
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [tradeType, setTradeType] = useState<'delivery' | 'intraday'>('delivery');

  const handleAIParams = (params: Record<string, number>) => {
    if (params.buyPrice) setBuyPrice(String(params.buyPrice));
    if (params.sellPrice) setSellPrice(String(params.sellPrice));
    if (params.quantity) setQuantity(String(Math.round(params.quantity)));
  };

  const calculate = () => {
    const buy = parseFloat(buyPrice) || 0;
    const sell = parseFloat(sellPrice) || 0;
    const qty = parseInt(quantity) || 0;
    const turnover = (buy + sell) * qty;
    const brokerage = tradeType === 'delivery' ? 0 : Math.min(20, turnover * 0.0003);
    const stt = tradeType === 'delivery' ? turnover * 0.001 : sell * qty * 0.00025;
    const exchangeCharges = turnover * 0.0000345;
    const gst = (brokerage + exchangeCharges) * 0.18;
    const sebiCharges = turnover * 0.000001;
    const stampDuty = buy * qty * 0.00015;
    const totalCharges = brokerage + stt + exchangeCharges + gst + sebiCharges + stampDuty;
    const profit = (sell - buy) * qty - totalCharges;
    return { turnover, brokerage, stt, exchangeCharges, gst, sebiCharges, stampDuty, totalCharges, profit };
  };

  const results = calculate();
  const buy = parseFloat(buyPrice) || 0;
  const sell = parseFloat(sellPrice) || 0;
  const qty = parseInt(quantity) || 0;
  const chargesPct = results.turnover > 0 ? ((results.totalCharges / results.turnover) * 100).toFixed(3) : '0';

  const commentary = buy > 0 && sell > 0 && qty > 0
    ? `For ${tradeType === 'delivery' ? 'delivery' : 'intraday'} trade of ${qty} shares at ₹${buy} buy / ₹${sell} sell, total statutory charges are ₹${results.totalCharges.toFixed(2)} (${chargesPct}% of turnover). ${tradeType === 'delivery' ? 'Delivery trades have zero brokerage at SerNet but attract 0.1% STT on both sides.' : 'Intraday brokerage is capped at ₹20 per order.'} The largest cost component is typically STT (₹${results.stt.toFixed(2)}). Net P&L after all charges: ₹${results.profit.toFixed(2)}.`
    : 'Enter your buy price, sell price, and quantity to calculate all trading charges.';

  const fmt = (n: number) => `₹${n.toFixed(2)}`;

  return (
    <CalculatorShell
      title="Brokerage Calculator"
      description="Calculate your total trading costs including brokerage, STT, and other charges"
      icon={<BarChart3 className="w-4 h-4" />}
      calcType="brokerage"
      aiContext="Brokerage calculator for equity trades. Computes brokerage, STT (Securities Transaction Tax), exchange charges, GST, SEBI charges, and stamp duty for delivery and intraday trades. SerNet charges zero brokerage on delivery trades."
      onAIParams={handleAIParams}
      formInputs={
        <div className="space-y-5">
          <div className="flex gap-3">
            <Button variant={tradeType === 'delivery' ? 'default' : 'outline'} onClick={() => setTradeType('delivery')} className="flex-1">Delivery</Button>
            <Button variant={tradeType === 'intraday' ? 'default' : 'outline'} onClick={() => setTradeType('intraday')} className="flex-1">Intraday</Button>
          </div>
          <div>
            <Label htmlFor="brok-buy">Buy Price (₹)</Label>
            <Input id="brok-buy" type="number" placeholder="Enter buy price" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="brok-sell">Sell Price (₹)</Label>
            <Input id="brok-sell" type="number" placeholder="Enter sell price" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="brok-qty">Quantity</Label>
            <Input id="brok-qty" type="number" placeholder="Enter quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="mt-1.5" />
          </div>
        </div>
      }
      result={{
        label: 'Trading Cost Breakdown',
        primary: {
          label: results.profit >= 0 ? 'Net Profit' : 'Net Loss',
          value: `₹${Math.abs(results.profit).toFixed(2)}`,
        },
        metrics: [
          { label: 'Total Charges', value: fmt(results.totalCharges) },
          { label: 'STT', value: fmt(results.stt) },
          { label: 'Brokerage', value: fmt(results.brokerage) },
          { label: 'GST', value: fmt(results.gst) },
          { label: 'Exchange Charges', value: fmt(results.exchangeCharges) },
          { label: 'Stamp Duty', value: fmt(results.stampDuty) },
        ],
        commentary,
      }}
    />
  );
};

export default BrokerageCalcContent;
