import React from 'react';
import { useApp } from '../../context/AppContext';
import { Certificate } from '../../types';
import { X, Printer, ShieldCheck, QrCode, Award, CheckCircle2, Download, Heart, FileText } from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const { t, settings, profiles, setOpenNikahModal, setOpenDeathCertModal } = useApp();

  // Dynamically synchronize the certificate holder's name with their active profile record
  const liveProfile = profiles.find((p) => p.memberId === certificate.memberId);
  const displayMemberName = liveProfile?.name || certificate.memberName;

  const handlePrint = () => {
    const docElem = document.getElementById('printable-certificate-document');
    if (docElem) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${certificate.title} - ${certificate.certificateNumber}</title>
            <style>
              @page { size: A4 portrait; margin: 15mm; }
              body { font-family: system-ui, -apple-system, sans-serif; background: #fff; color: #003a42; margin: 0; padding: 20px; }
              .cert-container { border: 6px double #00545f; padding: 30px; border-radius: 14px; background: #fafdf2; }
              .text-center { text-align: center; }
              .title { color: #00545f; font-size: 24px; font-weight: bold; margin: 6px 0; }
              .badge { display: inline-block; background: #00545f; color: #d6fb00; font-weight: bold; padding: 6px 20px; border-radius: 20px; margin: 12px 0; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0; padding: 15px; background: #ffffff; border: 1px solid #ecffb6; border-radius: 10px; }
              .footer { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
            </style>
          </head>
          <body>
            <div class="cert-container">
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
        printWindow.document.close();
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
  <title>${certificate.title} - ${certificate.certificateNumber}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fafdf2; color: #00434c; margin: 0; padding: 30px; display: flex; justify-content: center; }
    .cert-frame { max-width: 750px; width: 100%; border: 8px double #00545f; padding: 40px; background: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,84,95,0.12); position: relative; }
    .header { text-align: center; border-bottom: 2px solid #ecffb6; padding-bottom: 25px; margin-bottom: 25px; }
    .logo-badge { width: 52px; height: 52px; margin: 0 auto 10px; background: #00545f; color: #d6fb00; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: bold; border: 2px solid #d6fb00; }
    .mahal-title { color: #00545f; font-size: 26px; font-weight: 800; margin: 0; }
    .mahal-sub { color: #3d686e; font-size: 13px; margin-top: 5px; }
    .cert-type { display: inline-block; background: #00545f; color: #d6fb00; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; padding: 8px 24px; border-radius: 30px; margin-top: 15px; border: 1px solid #d6fb00; }
    .meta-row { display: flex; justify-content: space-between; font-size: 12px; color: #3d686e; margin-bottom: 20px; border-bottom: 1px dashed #ecffb6; padding-bottom: 10px; }
    .bismillah { text-align: center; font-style: italic; color: #3d686e; font-size: 15px; margin: 20px 0; }
    .content-body { font-size: 14px; line-height: 1.8; text-align: justify; margin: 25px 0; color: #003a42; }
    .highlight { color: #00545f; font-weight: bold; text-decoration: underline; text-decoration-color: #d6fb00; }
    .record-box { background: #fafdf2; border: 1px solid #ecffb6; border-radius: 12px; padding: 16px; margin: 20px 0; }
    .record-title { font-size: 11px; font-weight: bold; text-transform: uppercase; color: #00545f; margin-bottom: 10px; border-bottom: 1px solid #ecffb6; padding-bottom: 5px; }
    .record-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; }
    .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; padding-top: 20px; border-top: 2px solid #ecffb6; }
    .hash { font-family: monospace; font-size: 10px; color: #3d686e; }
    .signature { text-align: right; }
    .sig-name { font-weight: bold; color: #00545f; font-size: 14px; }
    .sig-role { font-size: 11px; color: #3d686e; }
    .print-btn-bar { text-align: center; margin-bottom: 20px; }
    .print-btn { background: #00545f; color: #d6fb00; padding: 10px 20px; font-weight: bold; border: none; border-radius: 10px; cursor: pointer; }
    @media print { .print-btn-bar { display: none; } body { padding: 0; background: #fff; } .cert-frame { box-shadow: none; border-width: 4px; } }
  </style>
</head>
<body>
  <div style="width: 100%; max-width: 750px;">
    <div class="print-btn-bar">
      <button class="print-btn" onclick="window.print()">🖨️ Print or Save as PDF</button>
    </div>
    <div class="cert-frame">
      <div class="header">
        <div class="logo-badge">☪</div>
        <h1 class="mahal-title">${settings.mahalName}</h1>
        <div class="mahal-sub">${settings.address} • Reg: ${settings.registrationNumber}</div>
        <div class="cert-type">${certificate.title}</div>
      </div>
      <div class="meta-row">
        <span>Certificate No: <strong>${certificate.certificateNumber}</strong></span>
        <span>Issue Date: <strong>${certificate.issueDate}</strong></span>
      </div>
      <div class="bismillah">"In the name of Allah, Most Gracious, Most Merciful"</div>
      <div class="content-body">
        ${
          certificate.type === 'DEATH'
            ? `This is to solemnly attest and record in the official Civil and Burial Register of ${settings.mahalName} that <strong>${certificate.details.DeceasedName || 'the deceased'}</strong> departed to Allah's mercy on <strong>${certificate.details.DateOfDeath || certificate.issueDate}</strong> and was laid to rest with Islamic Janazah rites at <strong>${certificate.details.BurialQabarstan || 'Mahal Central Qabarstan'}</strong>. Issued upon formal registration by kin <span class="highlight">${displayMemberName}</span>.`
            : `This is to solemnly certify that <span class="highlight">${displayMemberName}</span>, bearing Member ID <strong>${certificate.memberId}</strong>, residing under Family Unit <strong>${certificate.familyId}</strong>, is a registered and bonafide constituent of ${settings.mahalName}.`
        }
      </div>
      <div class="record-box">
        <div class="record-title">Official Registry Details</div>
        <div class="record-grid">
          ${Object.entries(certificate.details).map(([k, v]) => `<div><span style="color:#3d686e; text-transform:capitalize;">${k.replace(/([A-Z])/g, ' $1')}:</span> <strong>${v}</strong></div>`).join('')}
        </div>
      </div>
      <div class="footer">
        <div>
          <div class="hash">VERIFICATION HASH: ${certificate.verificationHash}</div>
          <div style="font-size:11px; color:#00545f; font-weight:bold; margin-top:4px;">✓ Authenticated Official Digital Seal</div>
        </div>
        <div class="signature">
          <div class="sig-name">${certificate.issuedBy}</div>
          <div class="sig-role">Mahal Committee Secretariat</div>
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
    link.download = `Mahal_Certificate_${certificate.certificateNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#ecffb6] w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print bg-[#00545f] text-white p-4 flex items-center justify-between border-b border-[#ecffb6]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#003a42] border border-[#d6fb00]/40 flex items-center justify-center text-[#d6fb00]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#d6fb00]">
                Digital Certificate Engine
              </span>
              <span className="ml-2 text-[10px] bg-[#d6fb00] text-[#00545f] px-2 py-0.5 rounded-full font-bold">
                VERIFIED
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                setOpenDeathCertModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              title="Apply for Death & Burial Certificate"
            >
              <FileText className="w-3.5 h-3.5 text-amber-200" />
              <span className="hidden sm:inline">Apply Death Cert</span>
            </button>
            <button
              onClick={() => {
                onClose();
                setOpenNikahModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              title="Apply for Marital / Nikah Certificate"
            >
              <Heart className="w-3.5 h-3.5 text-rose-200" />
              <span className="hidden sm:inline">Apply Marital Cert</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#003a42] hover:bg-[#002d33] text-[#ecffb6] rounded-xl text-xs font-bold transition-colors cursor-pointer border border-[#ecffb6]/30"
              title="Download Certificate HTML"
            >
              <Download className="w-3.5 h-3.5 text-[#d6fb00]" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#d6fb00] hover:bg-[#c5e800] text-[#00545f] rounded-xl text-xs font-black shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.common.print}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#ecffb6] hover:text-white rounded-xl hover:bg-[#003a42] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div
          id="printable-certificate-document"
          className="p-6 sm:p-8 overflow-y-auto bg-[#fafdf2] text-[#00434c] relative border-8 border-double border-[#00545f]/30 m-3 rounded-2xl"
        >
          {/* Watermark Emblem */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <span className="text-9xl font-serif font-bold text-[#00545f]">MAHAL</span>
          </div>

          {/* Header */}
          <div className="text-center pb-6 border-b border-[#ecffb6] relative">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#00545f] text-[#d6fb00] flex items-center justify-center font-serif font-black text-2xl shadow border-2 border-[#d6fb00] mb-2">
              ☪
            </div>
            <h2 className="font-serif font-black text-2xl text-[#00545f] tracking-tight">
              {settings.mahalName}
            </h2>
            <p className="text-xs font-malayalam font-bold text-[#3d686e] mt-0.5">
              {settings.mahalNameMalayalam}
            </p>
            <p className="text-[11px] text-[#3d686e] mt-1">
              {settings.address} • Reg: {settings.registrationNumber}
            </p>

            <div className="mt-4 inline-block bg-[#00545f] text-[#d6fb00] font-serif font-bold text-sm tracking-widest uppercase px-6 py-1.5 rounded-full shadow-sm border border-[#d6fb00]/40">
              {certificate.title}
            </div>
          </div>

          {/* Body Content */}
          <div className="py-6 space-y-4 text-xs leading-relaxed text-[#003a42]">
            <div className="flex justify-between items-center text-[11px] text-[#3d686e] border-b border-[#ecffb6] pb-2">
              <span>
                Certificate No: <strong className="text-[#00545f] font-mono font-bold">{certificate.certificateNumber}</strong>
              </span>
              <span>
                Issue Date: <strong className="text-[#00545f] font-mono font-bold">{certificate.issueDate}</strong>
              </span>
            </div>

            <p className="text-sm text-center font-serif italic text-[#3d686e] py-1">
              "In the name of Allah, Most Gracious, Most Merciful"
            </p>

            {certificate.type === 'DEATH' ? (
              <p className="text-justify indent-6 text-[#003a42] leading-normal text-sm">
                This is to solemnly attest and officially record in the Civil and Burial Register of {settings.mahalName} that <strong className="text-base text-[#00545f] font-serif underline decoration-[#d6fb00] decoration-2">{certificate.details.DeceasedName || 'the deceased'}</strong> departed to Allah's mercy on <strong className="font-mono font-bold text-[#00545f]">{certificate.details.DateOfDeath || certificate.issueDate}</strong> and was laid to eternal rest with Islamic Janazah rites at <strong className="font-bold text-[#00545f]">{certificate.details.BurialQabarstan || 'Central Qabarstan'}</strong>. Issued upon formal registry application by kin <strong className="font-bold text-[#00545f]">{displayMemberName}</strong> (Member ID: {certificate.memberId}).
              </p>
            ) : (
              <p className="text-justify indent-6 text-[#003a42] leading-normal text-sm">
                This is to solemnly certify that <strong className="text-base text-[#00545f] font-serif underline decoration-[#d6fb00] decoration-2">{displayMemberName}</strong>,
                bearing Member ID <strong className="font-mono font-bold text-[#00545f]">{certificate.memberId}</strong>, residing under Family Register <strong className="font-mono font-bold text-[#00545f]">{certificate.familyId}</strong>,
                is a bonafide and duly registered constituent of {settings.mahalName}.
              </p>
            )}

            {/* Dynamic Specific Details */}
            <div className="bg-white border border-[#ecffb6] rounded-2xl p-4 my-3 space-y-2 shadow-xs">
              <h4 className="text-[11px] font-bold text-[#00545f] uppercase tracking-wider border-b border-[#ecffb6] pb-1">
                Official Register Records
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(certificate.details).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-[#3d686e] text-[10px] uppercase font-semibold">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <p className="font-bold text-[#00545f]">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-[#3d686e] leading-normal">
              This certificate has been issued from the official digital repository of the Mahallu Jama-ath upon verification of all registered community credentials and monthly contribution standing.
            </p>
          </div>

          {/* Footer & Signatories */}
          <div className="pt-6 border-t border-[#ecffb6] flex items-end justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white border border-[#ecffb6] rounded-xl p-1.5 flex items-center justify-center shadow-xs">
                <QrCode className="w-full h-full text-[#00545f]" />
              </div>
              <div className="text-[10px] text-[#3d686e] space-y-0.5">
                <p className="font-mono font-bold text-[#00545f]">HASH: {certificate.verificationHash}</p>
                <p className="text-[#00545f] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00545f]" /> Official Digital Seal
                </p>
                <p className="text-[#3d686e]/80">Verify at: mahalconnect/verify</p>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="h-10 flex items-center justify-end">
                <span className="font-serif italic font-bold text-[#00545f] text-sm border-b border-[#00545f]/30 pb-0.5">
                  C.M. Abdul Azeez Master
                </span>
              </div>
              <p className="text-xs font-bold text-[#00545f]">{certificate.issuedBy}</p>
              <p className="text-[10px] text-[#3d686e] font-medium">President / General Secretary</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="no-print p-4 bg-[#fafdf2] border-t border-[#ecffb6] flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={() => {
              onClose();
              setOpenDeathCertModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
            title="Apply for Death & Burial Certificate"
          >
            <FileText className="w-4 h-4 text-amber-200" />
            <span>Apply Death Cert</span>
          </button>
          <button
            onClick={() => {
              onClose();
              setOpenNikahModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
            title="Apply for Marital / Nikah Certificate"
          >
            <Heart className="w-4 h-4 text-rose-200" />
            <span>Apply Marital Cert</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-[#00545f] bg-white border border-[#ecffb6] rounded-xl hover:bg-[#ecffb6]/40 cursor-pointer transition-colors"
          >
            {t.common.close}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#00545f] hover:bg-[#003a42] text-[#ecffb6] font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#d6fb00]" />
            <span>Download HTML</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2 bg-[#d6fb00] hover:bg-[#c5e800] text-[#00545f] font-black text-xs rounded-xl shadow transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t.common.print} / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
