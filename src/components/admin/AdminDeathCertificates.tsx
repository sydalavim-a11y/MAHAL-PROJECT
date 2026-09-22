import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DeathCertificateApplication, Certificate } from '../../types';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Download,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  Award,
} from 'lucide-react';

export const AdminDeathCertificates: React.FC = () => {
  const {
    deathCertificateApplications,
    approveDeathCertificateApplication,
    rejectDeathCertificateApplication,
    setActiveCertificateModal,
    certificates,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<DeathCertificateApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredApps = (deathCertificateApplications || []).filter((app) => {
    if (statusFilter !== 'ALL' && app.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        app.deceasedName.toLowerCase().includes(q) ||
        app.applicationNumber.toLowerCase().includes(q) ||
        app.applicantName.toLowerCase().includes(q) ||
        app.burialQabarstan.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = deathCertificateApplications?.filter((a) => a.status === 'SUBMITTED').length || 0;
  const approvedCount = deathCertificateApplications?.filter((a) => a.status === 'APPROVED' || a.status === 'CERTIFICATE_ISSUED').length || 0;

  const handleApprove = (app: DeathCertificateApplication) => {
    const cert = approveDeathCertificateApplication(app.id, adminNotes || 'Burial and registry verified against Qabarstan records.');
    setActionSuccess(`Death Certificate #${cert.certificateNumber} issued successfully for late ${app.deceasedName}. Applicant has been notified to download.`);
    setSelectedApp(null);
    setAdminNotes('');
    setTimeout(() => setActionSuccess(null), 5000);
  };

  const handleReject = (app: DeathCertificateApplication) => {
    if (!adminNotes) {
      alert('Please provide reason for rejection.');
      return;
    }
    rejectDeathCertificateApplication(app.id, adminNotes);
    setActionSuccess(`Application #${app.applicationNumber} has been rejected.`);
    setSelectedApp(null);
    setAdminNotes('');
    setTimeout(() => setActionSuccess(null), 5000);
  };

  const handleViewIssuedCertificate = (certNumber?: string) => {
    if (!certNumber) return;
    const found = certificates.find((c) => c.certificateNumber === certNumber || c.details.certificateNumber === certNumber);
    if (found) {
      setActiveCertificateModal(found);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
              Civil Status & Burial Registry
            </span>
            {pendingCount > 0 && (
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                {pendingCount} Pending Review
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black font-serif text-stone-900 mt-1">
            Death Certificate Verification & Approval Desk
          </h2>
          <p className="text-xs text-stone-500">
            മരണ & ഖബറടക്ക സർട്ടിഫിക്കറ്റ് പരിശോധന • Review burial register records, approve applications, and issue authenticated digital certificates.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 text-center">
            <span className="text-[10px] text-stone-500 font-bold uppercase">Total Approved</span>
            <p className="text-lg font-black text-emerald-800 font-mono">{approvedCount}</p>
          </div>
          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-center">
            <span className="text-[10px] text-amber-700 font-bold uppercase">Pending Verification</span>
            <p className="text-lg font-black text-amber-800 font-mono">{pendingCount}</p>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-[#00545f] text-[#d6fb00]'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All ({deathCertificateApplications?.length || 0})
          </button>
          <button
            onClick={() => setStatusFilter('SUBMITTED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'SUBMITTED'
                ? 'bg-amber-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('APPROVED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'APPROVED'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Approved ({approvedCount})
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search deceased name, app #, applicant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none w-full sm:w-64"
          />
        </div>
      </div>

      {/* Applications Grid / Table */}
      <div className="grid grid-cols-1 gap-4">
        {filteredApps.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-400 text-xs">
            No death certificate applications found matching this status.
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-stone-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-stone-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-stone-100 text-stone-800 px-2.5 py-0.5 rounded border border-stone-200">
                      {app.applicationNumber}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        app.status === 'APPROVED' || app.status === 'CERTIFICATE_ISSUED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : app.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    Late {app.deceasedName}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Age: {app.deceasedAge} yrs • Gender: {app.deceasedGender} • Date of Demise: <strong>{app.dateOfDeath}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {app.status === 'SUBMITTED' ? (
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-4 py-2 bg-[#00545f] hover:bg-[#00434c] text-[#d6fb00] font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Review & Approve</span>
                    </button>
                  ) : (
                    app.certificateNumber && (
                      <button
                        onClick={() => handleViewIssuedCertificate(app.certificateNumber)}
                        className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Award className="w-4 h-4 text-emerald-700" />
                        <span>View Certificate ({app.certificateNumber})</span>
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <span className="text-[10px] font-semibold text-stone-500 uppercase block">Burial Place & Date</span>
                  <p className="font-bold text-stone-800 mt-0.5">{app.burialQabarstan}</p>
                  <p className="text-[11px] text-stone-600">Buried: {app.burialDate} ({app.burialTime || 'Standard rites'})</p>
                  {app.qabrNumber && (
                    <p className="text-[10px] font-mono text-emerald-700">Qabr #{app.qabrNumber}</p>
                  )}
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <span className="text-[10px] font-semibold text-stone-500 uppercase block">Demise Location & Cause</span>
                  <p className="font-bold text-stone-800 mt-0.5">{app.placeOfDeath}</p>
                  <p className="text-[11px] text-stone-600">Cause: {app.causeOfDeath || 'Natural'}</p>
                  {app.doctorHospitalCertificateNo && (
                    <p className="text-[10px] font-mono text-stone-500">Doc Ref: {app.doctorHospitalCertificateNo}</p>
                  )}
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <span className="text-[10px] font-semibold text-stone-500 uppercase block">Applicant (Kin)</span>
                  <p className="font-bold text-stone-800 mt-0.5">{app.applicantName} ({app.applicantRelation})</p>
                  <p className="text-[11px] text-stone-600">Contact: {app.applicantPhone}</p>
                  <p className="text-[10px] text-stone-400">Submitted on: {app.createdAt.split('T')[0]}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review & Approval Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-xl overflow-hidden flex flex-col">
            <div className="bg-[#00545f] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-white">
                  Review Burial Records & Issue Death Certificate
                </h3>
                <p className="text-xs text-[#ecffb6]">
                  Application #{selectedApp.applicationNumber} • Late {selectedApp.deceasedName}
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1.5 text-[#ecffb6] hover:text-white rounded-xl hover:bg-[#003a42] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs overflow-y-auto max-h-[80vh]">
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                <span className="font-bold text-amber-900 text-[11px] uppercase tracking-wider block">
                  Qabarstan Burial Verification Checklist
                </span>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  Verify that Janazah prayers were conducted and recorded under Mahal Qabarstan records at <strong>{selectedApp.burialQabarstan}</strong> on <strong>{selectedApp.burialDate}</strong>. Approving will automatically generate an official digitally signed certificate with official certificate number and QR seal, instantly ready for the family to download.
                </p>
              </div>

              <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-stone-500">Deceased:</span>
                    <p className="font-bold text-stone-900">{selectedApp.deceasedName} ({selectedApp.deceasedAge} yrs, {selectedApp.deceasedGender})</p>
                  </div>
                  <div>
                    <span className="text-stone-500">Date of Demise:</span>
                    <p className="font-bold text-stone-900">{selectedApp.dateOfDeath} ({selectedApp.timeOfDeath || 'N/A'})</p>
                  </div>
                  <div>
                    <span className="text-stone-500">Place of Demise:</span>
                    <p className="font-bold text-stone-900">{selectedApp.placeOfDeath}</p>
                  </div>
                  <div>
                    <span className="text-stone-500">Burial Qabarstan:</span>
                    <p className="font-bold text-stone-900">{selectedApp.burialQabarstan}</p>
                  </div>
                  <div>
                    <span className="text-stone-500">Burial Date & Time:</span>
                    <p className="font-bold text-stone-900">{selectedApp.burialDate} • {selectedApp.burialTime || 'Standard'}</p>
                  </div>
                  <div>
                    <span className="text-stone-500">Applicant:</span>
                    <p className="font-bold text-stone-900">{selectedApp.applicantName} ({selectedApp.applicantRelation}) - {selectedApp.applicantPhone}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  Committee Verification Notes / Registry Reference
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Verified with Qabarstan Muqri Register Vol 4, Page 88. Approved for official issuance."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => handleReject(selectedApp)}
                  className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold cursor-pointer"
                >
                  Reject Application
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(selectedApp)}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Issue Certificate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
