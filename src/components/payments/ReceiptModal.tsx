import React from 'react';
import { useApp } from '../../context/AppContext';
import { Receipt } from '../../types';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Share2, QrCode } from 'lucide-react';

interface ReceiptModalProps {
  receipt: Receipt;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose }) => {
  const { t, settings, profiles, currentProfile, currentUser } = useApp();

  // Dynamically resolve latest member name so any profile changes are automatically synchronized
  const matchedProfile =
    profiles.find((p) => p.memberId === receipt.memberId) ||
    (currentProfile && (currentProfile.memberId === receipt.memberId || currentProfile.name.toLowerCase() === receipt.memberName.toLowerCase()) ? currentProfile : null) ||
    (currentUser && currentUser.memberId === receipt.memberId ? currentUser : null);

  const displayMemberName = matchedProfile?.name || receipt.memberName;

  const handlePrint = () => {
    const docElem = document.getElementById('printable-receipt-document');
    if (docElem) {
      const printWin = window.open('', '_blank');
      if (printWin) {
        printWin.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Receipt - ${receipt.receiptNumber}</title>
            <style>
              @page { size: A4 portrait; margin: 15mm; }
              body { font-family: system-ui, -apple-system, sans-serif; background: #fff; color: #1a1a1a; margin: 0; padding: 20px; }
              .receipt-box { border: 2px solid #00545f; padding: 30px; border-radius: 12px; background: #fafdf2; max-width: 650px; margin: 0 auto; }
            </style>
          </head>
          <body>
            <div class="receipt-box">
              ${docElem.innerHTML}
            </div>
            <script>
              window.onload = function() {
                window.focus();
                window.print();
              };
            </script>
          </body>
          </html>
        `);
        printWin.document.close();
        return;
      }
    }
    window.print();
  };

  const handleDownload = () => {
    const docHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Receipt - ${receipt.receiptNumber}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fafdf2; color: #00434c; margin: 0; padding: 30px; display: flex; justify-content: center; }
    .receipt-card { max-width: 650px; width: 100%; border: 3px solid #00545f; border-radius: 16px; padding: 35px; background: #ffffff; box-shadow: 0 10px 25px rgba(0,84,95,0.08); }
    .header { text-align: center; border-bottom: 2px solid #ecffb6; padding-bottom: 20px; margin-bottom: 20px; }
    .title { color: #00545f; font-size: 22px; font-weight: 800; margin: 0; }
    .badge { display: inline-block; background: #00545f; color: #d6fb00; font-weight: 800; padding: 6px 18px; border-radius: 20px; font-size: 12px; margin-top: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; font-size: 13px; }
    .amount-box { background: #fafdf2; border: 2px dashed #00545f; border-radius: 12px; padding: 18px; text-align: center; margin: 25px 0; }
    .amount-val { font-size: 32px; font-weight: 900; color: #00545f; }
    .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px; border-top: 1px solid #ecffb6; padding-top: 15px; font-size: 11px; color: #557277; }
    .print-bar { text-align: center; margin-bottom: 20px; }
    .btn { background: #00545f; color: #d6fb00; padding: 10px 22px; font-weight: 800; border: none; border-radius: 10px; cursor: pointer; }
    @media print { .print-bar { display: none; } body { padding: 0; background: #fff; } .receipt-card { box-shadow: none; } }
  </style>
</head>
<body>
  <div style="width: 100%; max-width: 650px;">
    <div class="print-bar">
      <button class="btn" onclick="window.print()">🖨️ Print Receipt / Save as PDF</button>
    </div>
    <div class="receipt-card">
      <div class="header">
        <div style="font-size: 26px; color: #00545f; margin-bottom: 5px;">☪</div>
        <h1 class="title">${receipt.mahalName}</h1>
        <div style="font-size: 12px; color: #4b6b70; margin-top: 4px;">${settings.address} • Reg: ${settings.registrationNumber}</div>
        <div class="badge">Official Contribution Receipt</div>
      </div>
      <div class="meta-grid">
        <div><strong>Receipt No:</strong> ${receipt.receiptNumber}</div>
        <div><strong>Date:</strong> ${receipt.paymentDate}</div>
        <div><strong>Payer Name:</strong> ${displayMemberName}</div>
        <div><strong>Member ID:</strong> ${receipt.memberId}</div>
        <div><strong>Family ID:</strong> ${receipt.familyId}</div>
        <div><strong>Period:</strong> ${receipt.monthName}</div>
      </div>
      <div class="amount-box">
        <div style="font-size: 12px; color: #00545f; font-weight: 800; text-transform: uppercase;">Amount Paid</div>
        <div class="amount-val">₹${receipt.amount.toLocaleString('en-IN')}</div>
        <div style="font-size: 11px; color: #4b6b70; margin-top: 4px;">Status: COMPLETED (Verified via ${receipt.paymentMethod})</div>
      </div>
      <div class="footer">
        <div>
          <div>Txn ID: <strong>${receipt.transactionId}</strong></div>
          <div style="color: #00545f; font-weight: bold; margin-top: 4px;">✓ Authenticated Official Digital Seal</div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: bold; color: #00545f;">${receipt.signatureOfficer}</div>
          <div>Secretariat Treasurer</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([docHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Mahal_Receipt_${receipt.receiptNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Mahal Receipt ${receipt.receiptNumber}`,
          text: `Official Contribution Receipt for ₹${receipt.amount} (${receipt.monthName}) issued to ${displayMemberName}.`,
          url: window.location.href,
        });
      } catch (e) {
        // User cancelled share
      }
    } else {
      navigator.clipboard?.writeText(
        `Mahal Receipt ${receipt.receiptNumber} - Payer: ${displayMemberName}, Amount: ₹${receipt.amount}, Period: ${receipt.monthName}`
      );
      alert('Receipt summary copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-[#ecffb6] my-8 animate-in fade-in zoom-in duration-200">
        {/* Modal Top Bar */}
        <div className="no-print bg-[#00545f] text-white p-4 px-6 flex items-center justify-between border-b border-[#ecffb6]/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#d6fb00] text-[#00545f] flex items-center justify-center font-bold text-sm shadow">
              ✓
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Payment Receipt Details</h3>
              <p className="text-[11px] text-[#ecffb6] font-mono">
                {receipt.receiptNumber} • Verified
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#003a42] hover:bg-[#00262b] text-[#d6fb00] rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer border border-[#d6fb00]/30"
              title="Download Receipt File"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#d6fb00] hover:bg-[#c2e400] text-[#00545f] rounded-xl text-xs font-black shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.common.print}</span>
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 text-[#ecffb6] hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#ecffb6] hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div id="printable-receipt-document" className="p-8 space-y-6 overflow-y-auto bg-[#fafdf2] text-[#00434c]">
          {/* Mahal Header */}
          <div className="text-center border-b-2 border-[#00545f]/20 pb-5">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-[#00545f] text-[#d6fb00] flex items-center justify-center font-serif font-black text-2xl shadow-sm border border-[#d6fb00]/40">
                M
              </div>
              <div className="text-left">
                <h2 className="font-serif font-black text-xl text-[#00545f] tracking-tight leading-tight">
                  {settings.mahalName}
                </h2>
                <p className="text-xs font-malayalam font-bold text-[#3d686e]">
                  {settings.mahalNameMalayalam}
                </p>
              </div>
            </div>
            <p className="text-[11px] text-[#4b6b70]">
              {settings.address} • Reg No: {settings.registrationNumber}
            </p>
            <div className="mt-3 inline-block bg-[#00545f] text-[#d6fb00] px-4 py-1 rounded-full text-xs font-black tracking-wider uppercase border border-[#d6fb00]/30">
              Monthly Contribution Official Receipt
            </div>
          </div>

          {/* Receipt Info Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-white p-5 rounded-2xl border border-[#ecffb6] shadow-xs">
            <div>
              <span className="text-[#557277] text-[10px] uppercase font-bold tracking-wider">Receipt No</span>
              <p className="font-mono font-bold text-sm text-[#00545f]">{receipt.receiptNumber}</p>
            </div>
            <div>
              <span className="text-[#557277] text-[10px] uppercase font-bold tracking-wider">Date & Time</span>
              <p className="font-medium text-[#00434c]">{receipt.paymentDate}</p>
            </div>
            <div>
              <span className="text-[#557277] text-[10px] uppercase font-bold tracking-wider">Member Name (Payer)</span>
              <p className="font-extrabold text-sm text-[#00545f]">{displayMemberName}</p>
            </div>
            <div>
              <span className="text-[#557277] text-[10px] uppercase font-bold tracking-wider">Member ID / Family ID</span>
              <p className="font-mono font-bold text-[#00434c]">{receipt.memberId} / {receipt.familyId}</p>
            </div>
          </div>

          {/* Line Item Table */}
          <div className="border border-[#ecffb6] rounded-2xl overflow-hidden bg-white shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#f0f8ed] text-[#00545f] font-bold border-b border-[#ecffb6]">
                <tr>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4 text-center">Period</th>
                  <th className="py-2.5 px-4 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ecffb6]/40">
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#00434c]">
                    Monthly Mahal Contribution (മാസവരി വിഹിതം)
                    <p className="text-[10px] font-normal text-[#557277]">Credited to Mahal General Welfare Fund</p>
                  </td>
                  <td className="py-3 px-4 text-center font-medium text-[#00434c]">
                    {receipt.monthName}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[#00545f]">
                    ₹{receipt.amount.toLocaleString('en-IN')}.00
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-[#fafdf2] font-bold border-t border-[#ecffb6]">
                <tr>
                  <td colSpan={2} className="py-3 px-4 text-[#00434c] uppercase tracking-wider text-right">
                    Total Amount Paid:
                  </td>
                  <td className="py-3 px-4 text-right text-base font-black text-[#00545f]">
                    ₹{receipt.amount.toLocaleString('en-IN')}.00
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Verification & Signatures */}
          <div className="grid grid-cols-2 gap-4 items-end pt-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white border border-[#ecffb6] rounded-xl p-1 flex items-center justify-center shadow-xs">
                <QrCode className="w-full h-full text-[#00545f]" />
              </div>
              <div className="text-[10px] text-[#4b6b70] space-y-0.5 font-mono">
                <p>TXN: {receipt.transactionId}</p>
                <p>METHOD: {receipt.paymentMethod}</p>
                <p className="text-[#00545f] font-sans font-bold flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00545f]" /> Digitally Authenticated
                </p>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="h-9 flex items-center justify-end">
                <span className="font-serif italic font-semibold text-[#00545f] text-sm border-b border-[#00545f]/30 pb-0.5">
                  C.M. Abdul Azeez
                </span>
              </div>
              <p className="font-bold text-[#00545f]">{receipt.signatureOfficer}</p>
              <p className="text-[10px] text-[#557277]">{settings.mahalName}</p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="border-t border-[#ecffb6] pt-3 text-center text-[10px] text-[#557277]">
            This is a computer-generated official receipt verified by the Mahal Connect Core Register.
            For any queries, contact {settings.phone} or email {settings.email}.
          </div>
        </div>

        {/* Modal Bottom Action (Hidden on print) */}
        <div className="no-print p-4 bg-white border-t border-[#ecffb6] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-[#00545f] bg-[#fafdf2] border border-[#ecffb6] rounded-xl hover:bg-[#ecffb6] cursor-pointer"
          >
            {t.common.close}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-5 py-2 bg-[#003a42] hover:bg-[#00262b] text-[#d6fb00] font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer border border-[#d6fb00]/30"
          >
            <Download className="w-4 h-4" />
            <span>Download Receipt</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2 bg-[#00545f] hover:bg-[#003a42] text-[#d6fb00] font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t.common.print} / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
