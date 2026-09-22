import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentRecord } from '../../types';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  CreditCard,
  Landmark,
  Smartphone,
  AlertCircle,
  Loader2,
  Lock,
  Sparkles,
} from 'lucide-react';

interface PaymentModalProps {
  payment: PaymentRecord;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ payment, onClose }) => {
  const { t, makePayment, setActiveReceiptModal, currentProfile, currentUser, profiles, settings } = useApp();

  // Dynamically resolve member name for this specific payment record
  const currentMember =
    profiles.find((p) => p.memberId === payment.memberId) ||
    (currentProfile && currentProfile.memberId === payment.memberId ? currentProfile : null) ||
    (currentUser && currentUser.memberId === payment.memberId ? currentUser : null) ||
    currentProfile ||
    currentUser;

  const payerDisplayName = currentMember?.name || 'Mahal Member';

  const [method, setMethod] = useState<'STRIPE' | 'UPI' | 'NET_BANKING'>('STRIPE');
  const [upiId, setUpiId] = useState('member@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [cardName, setCardName] = useState(payerDisplayName);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [stripeStatus, setStripeStatus] = useState<string>('');

  useEffect(() => {
    if (payerDisplayName) {
      setCardName(payerDisplayName);
    }
  }, [payerDisplayName]);

  const formatCardNumber = (val: string) => {
    const cleaned = val.replace(/\D/g, '').substring(0, 16);
    const parts = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const handlePay = async () => {
    setIsProcessing(true);
    setError('');
    setStripeStatus('Connecting to secure payment gateway...');

    try {
      if (method === 'STRIPE') {
        // Step 1: Create Stripe Payment Intent on server
        setStripeStatus('Initializing Stripe PaymentIntent...');
        const intentRes = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: payment.amount,
            currency: 'inr',
            memberId: payment.memberId,
            memberName: cardName || payerDisplayName,
            monthFor: payment.monthName,
            familyId: payment.familyId,
          }),
        });

        if (!intentRes.ok) {
          throw new Error('Failed to initialize Stripe PaymentIntent');
        }

        const intentData = await intentRes.json();
        setStripeStatus(
          intentData.isLiveStripe
            ? 'Processing live Stripe transaction...'
            : 'Processing Free Stripe Test Mode transaction...'
        );

        // Simulate gateway validation latency
        await new Promise((r) => setTimeout(r, 1000));

        // Step 2: Confirm payment on server
        const confirmRes = await fetch('/api/stripe/confirm-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: intentData.paymentIntentId,
            memberId: payment.memberId,
            memberName: cardName || payerDisplayName,
            familyId: payment.familyId,
            monthFor: payment.monthName,
            amount: payment.amount,
          }),
        });

        if (!confirmRes.ok) {
          throw new Error('Stripe confirmation failed');
        }

        const confirmData = await confirmRes.json();

        // Update local app context payment state
        const receipt = await makePayment(payment.id, 'STRIPE_CARD' as any);
        setIsProcessing(false);
        onClose();
        // Immediately present the official digital receipt!
        setActiveReceiptModal({
          ...receipt,
          memberName: cardName || payerDisplayName,
          transactionId: confirmData.transactionId || receipt.transactionId,
          receiptNumber: confirmData.receiptNumber || receipt.receiptNumber,
          paymentMethod: 'STRIPE (Credit/Debit Card)',
        });
      } else {
        // UPI or Net Banking
        await new Promise((r) => setTimeout(r, 800));
        const receipt = await makePayment(payment.id, method as any);
        setIsProcessing(false);
        onClose();
        setActiveReceiptModal({
          ...receipt,
          memberName: payerDisplayName,
        });
      }
    } catch (err: any) {
      setIsProcessing(false);
      setError(err?.message || 'Payment processing failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#ecffb6] w-full max-w-lg overflow-hidden flex flex-col my-6">
        {/* Header with Spruce & Lime Theme */}
        <div className="bg-[#00545f] text-white p-5 flex items-center justify-between border-b border-[#ecffb6]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#003a42] border border-[#d6fb00]/50 text-[#d6fb00] flex items-center justify-center font-serif text-lg font-black shadow-xs">
              ₹
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight font-serif text-white">
                {t.payments.payDues}
              </h3>
              <p className="text-xs text-[#ecffb6]">
                {payment.monthName} • {settings.mahalName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#ecffb6] hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Summary Card */}
          <div className="bg-[#fafdf2] border border-[#ecffb6] rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] text-[#557277] uppercase tracking-wider font-bold">
                Total Monthly Dues (മാസവരി)
              </span>
              <p className="text-2xl font-black text-[#00545f] font-serif mt-0.5">
                ₹{payment.amount.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-[#3d686e] mt-0.5">
                Payer:{' '}
                <strong className="text-[#00545f]">
                  {payerDisplayName}
                </strong>{' '}
                ({payment.memberId})
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-[#ecffb6] text-[#00545f] border border-[#d6fb00] text-[10px] font-black px-3 py-1 rounded-full uppercase">
                {payment.status}
              </span>
              <p className="text-[10px] text-[#557277] mt-1 font-mono">Due: {payment.dueDate}</p>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-[#00545f] uppercase tracking-wider mb-2.5">
              Select Payment Gateway
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* Stripe Card Button */}
              <button
                type="button"
                onClick={() => setMethod('STRIPE')}
                className={`relative flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  method === 'STRIPE'
                    ? 'border-[#00545f] bg-[#fafdf2] text-[#00545f] font-extrabold shadow-sm ring-2 ring-[#d6fb00]'
                    : 'border-stone-200 hover:border-stone-300 text-stone-600 bg-white'
                }`}
              >
                <span className="absolute -top-2 right-2 bg-[#00545f] text-[#d6fb00] text-[9px] font-black px-2 py-0.5 rounded-full border border-[#d6fb00] shadow-xs">
                  Free Stripe
                </span>
                <CreditCard className="w-5 h-5 mb-1 text-[#00545f]" />
                <span className="text-xs">Stripe Card</span>
              </button>

              {/* UPI / QR Button */}
              <button
                type="button"
                onClick={() => setMethod('UPI')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  method === 'UPI'
                    ? 'border-[#00545f] bg-[#fafdf2] text-[#00545f] font-extrabold shadow-sm ring-2 ring-[#d6fb00]'
                    : 'border-stone-200 hover:border-stone-300 text-stone-600 bg-white'
                }`}
              >
                <Smartphone className="w-5 h-5 mb-1 text-[#00545f]" />
                <span className="text-xs">UPI / QR</span>
              </button>

              {/* Net Banking Button */}
              <button
                type="button"
                onClick={() => setMethod('NET_BANKING')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  method === 'NET_BANKING'
                    ? 'border-[#00545f] bg-[#fafdf2] text-[#00545f] font-extrabold shadow-sm ring-2 ring-[#d6fb00]'
                    : 'border-stone-200 hover:border-stone-300 text-stone-600 bg-white'
                }`}
              >
                <Landmark className="w-5 h-5 mb-1 text-[#00545f]" />
                <span className="text-xs">Net Banking</span>
              </button>
            </div>
          </div>

          {/* STRIPE CARD METHOD DETAILS */}
          {method === 'STRIPE' && (
            <div className="p-4 bg-white border border-[#ecffb6] rounded-2xl space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="bg-[#635BFF] text-white text-[11px] font-black px-2 py-0.5 rounded tracking-wider">
                    stripe
                  </div>
                  <span className="text-xs font-bold text-[#00545f]">
                    Secured Card Checkout
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCardNumber('4242 4242 4242 4242');
                    setCardExpiry('12/28');
                    setCardCvc('123');
                    setCardName(payerDisplayName);
                  }}
                  className="text-[10px] text-[#00545f] hover:underline font-bold flex items-center gap-1 bg-[#ecffb6] px-2 py-0.5 rounded-full border border-[#d6fb00] cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-[#00545f]" />
                  <span>Use Free Test Card</span>
                </button>
              </div>

              {/* Visual Card Representation with Spruce & Lime */}
              <div className="bg-gradient-to-r from-[#00545f] via-[#00434c] to-[#003a42] p-4 rounded-2xl text-white shadow-md relative overflow-hidden border border-[#ecffb6]/30">
                <div className="flex justify-between items-center mb-3">
                  <div className="w-9 h-6 bg-[#d6fb00] rounded-sm flex items-center justify-center opacity-90">
                    <div className="w-6 h-4 border border-[#00545f]/40 rounded-xs" />
                  </div>
                  <span className="text-xs font-mono font-black tracking-wider text-[#d6fb00]">
                    MAHAL CONNECT
                  </span>
                </div>
                <div className="font-mono text-sm tracking-widest my-2 text-[#ecffb6]">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div className="flex justify-between text-[10px] text-[#ecffb6] mt-2">
                  <div>
                    <span className="text-[8px] text-[#ecffb6]/70 block uppercase">Card Holder</span>
                    <span className="font-extrabold uppercase tracking-wider text-white">{cardName || payerDisplayName}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-[#ecffb6]/70 block uppercase">Expires</span>
                    <span className="font-mono font-semibold">{cardExpiry || 'MM/YY'}</span>
                  </div>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-[#00545f] mb-1">
                    Cardholder Name (Payer)
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Full name as printed on card"
                    className="w-full px-3 py-2 bg-[#fafdf2] border border-[#ecffb6] rounded-xl text-xs font-bold text-[#00545f] focus:ring-2 focus:ring-[#00545f] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#00545f] mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      placeholder="4242 4242 4242 4242"
                      className="w-full pl-9 pr-3 py-2 bg-[#fafdf2] border border-[#ecffb6] rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#00545f] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#00545f] mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      maxLength={5}
                      placeholder="12/28"
                      className="w-full px-3 py-2 bg-[#fafdf2] border border-[#ecffb6] rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#00545f] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#00545f] mb-1">
                      CVC / CVV
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        maxLength={4}
                        placeholder="123"
                        className="w-full pl-8 pr-3 py-2 bg-[#fafdf2] border border-[#ecffb6] rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#00545f] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-[#557277] flex items-center gap-1.5 pt-1">
                <Lock className="w-3 h-3 text-[#00545f]" />
                <span>
                  Encrypted via Stripe 256-bit SSL gateway. Free test mode active.
                </span>
              </div>
            </div>
          )}

          {/* UPI METHOD */}
          {method === 'UPI' && (
            <div className="p-4 bg-white border border-[#ecffb6] rounded-2xl space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-[#fafdf2] border border-[#ecffb6] rounded-2xl flex items-center justify-center shadow-xs">
                  <QrCode className="w-12 h-12 text-[#00545f]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#00545f]">Scan & Pay via UPI App</p>
                  <p className="text-[11px] text-[#557277]">Google Pay, PhonePe, Paytm, BHIM</p>
                  <p className="text-[11px] text-[#00545f] font-mono font-bold mt-0.5">
                    noorulhudamahal@sbi
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#00545f] mb-1">
                  Or enter your VPA / UPI ID:
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-[#fafdf2] border border-[#ecffb6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00545f]"
                />
              </div>
            </div>
          )}

          {/* NET BANKING METHOD */}
          {method === 'NET_BANKING' && (
            <div className="p-4 bg-white border border-[#ecffb6] rounded-2xl text-xs space-y-2 shadow-xs">
              <label className="block font-bold text-[#00545f]">Select Bank:</label>
              <select className="w-full px-3 py-2 bg-[#fafdf2] border border-[#ecffb6] rounded-xl text-[#00545f] font-medium">
                <option>State Bank of India (SBI)</option>
                <option>Federal Bank</option>
                <option>Kerala Bank</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>South Indian Bank</option>
              </select>
            </div>
          )}

          {/* Notice */}
          <div className="bg-[#ecffb6]/40 border border-[#d6fb00] rounded-2xl p-3 flex items-start gap-2.5 text-[#00545f] text-xs">
            <ShieldCheck className="w-4 h-4 text-[#00545f] shrink-0 mt-0.5" />
            <p className="leading-snug font-medium">
              <strong>Official Mahal Guarantee:</strong> Every payment updates your family registry instantly and generates an authenticated, digitally verifiable contribution receipt with your verified name.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 flex items-center gap-2 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-[#fafdf2] border-t border-[#ecffb6] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-bold text-[#00545f] hover:text-[#003a42] cursor-pointer"
          >
            {t.common.cancel}
          </button>

          <button
            id="confirm-pay-btn"
            type="button"
            onClick={handlePay}
            disabled={isProcessing}
            className="flex items-center gap-2 bg-[#00545f] hover:bg-[#003a42] text-[#d6fb00] font-black px-6 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#d6fb00]" />
                <span>{stripeStatus || t.payments.processingPayment}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#d6fb00]" />
                <span>Pay ₹{payment.amount.toLocaleString('en-IN')} with {method === 'STRIPE' ? 'Stripe' : method}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
