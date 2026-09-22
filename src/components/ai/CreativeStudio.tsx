import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Copy, Check, Save, Wand2, FileText, Image, RefreshCw } from 'lucide-react';

export const CreativeStudio: React.FC = () => {
  const { language, settings, saveCreativeProject } = useApp();
  const [topic, setTopic] = useState('Ramadan Food Kit Distribution & Community Iftar Drive 2026');
  const [projectType, setProjectType] = useState<'POSTER_COPY' | 'KHUTBAH_OUTLINE' | 'OFFICIAL_CIRCULAR' | 'WHATSAPP_BROADCAST'>('POSTER_COPY');
  const [outputLanguage, setOutputLanguage] = useState<'BOTH' | 'MALAYALAM' | 'ENGLISH'>('BOTH');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string>(
    `✨ നൂറുൽ ഹുദാ മഹല്ല് ജമാഅത്ത് ✨\n📢 റമളാൻ ഫുഡ് കിറ്റ് വിതരണവും സമൂഹ ഇഫ്താറും 2026\n\nപ്രിയ മഹല്ല് നിവാസികളേ,\nവിശുദ്ധ റമളാനിന്റെ പുണ്യദിനങ്ങളിൽ മഹല്ലിലെ നിർദ്ധന കുടുംബങ്ങൾക്കായി ഒരുക്കുന്ന ഭക്ഷ്യധാന്യ കിറ്റ് വിതരണവും സമൂഹ ഇഫ്താറും ഏപ്രിൽ 2 ഞായറാഴ്ച അസർ നമസ്കാരാനന്തരം മസ്ജിദ് ഓഡിറ്റോറിയത്തിൽ വെച്ച് നടക്കും.\n\nതീയതി: 2026 ഏപ്രിൽ 2, ഞായർ\nസമയം: വൈകുന്നേരം 4:30 PM\nവേദി: നൂറുൽ ഹുദാ കമ്മ്യൂണിറ്റി ഓഡിറ്റോറിയം\n\nനിങ്ങളുടെ സകാത്ത്, സ്വദഖ സംഭാവനകൾ മഹല്ല് ഓഫീസിലോ ഓൺലൈൻ പോർട്ടൽ വഴിയോ ഏൽപ്പിക്കാവുന്നതാണ്.\n\nബന്ധപ്പെടുക: +91 495 2381234\nമഹല്ല് കണക്ട് ഡിജിറ്റൽ പോർട്ടൽ: mahalconnect.org`
  );
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setIsLoading(true);
    setCopied(false);
    setSaved(false);

    try {
      const res = await fetch('/api/ai/creative-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          type: projectType,
          language: outputLanguage,
          mahalName: settings.mahalName,
        }),
      });

      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      setGeneratedResult(data.content || 'Content generated successfully.');
    } catch (e) {
      // Fallback
      setGeneratedResult(
        `[${settings.mahalName.toUpperCase()} - OFFICIAL ANNOUNCEMENT]\n\nSubject: ${topic}\n\nNotice to all valued members:\nIn accordance with the decision of the Mahal Managing Committee, this event is scheduled for upcoming congregation. All residents are cordially invited to participate and cooperate.\n\nDate: Coming Friday\nVenue: Main Prayer Hall & Auditorium\nBy Order: General Secretary, ${settings.mahalName}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    saveCreativeProject({
      title: topic,
      programType: projectType,
      date: new Date().toLocaleDateString(),
      venue: settings.mahalName,
      audience: 'All Mahal Families & Community Members',
      englishPosterCopy: generatedResult,
      malayalamPosterCopy: generatedResult,
      whatsAppBlast: generatedResult,
      instagramCaption: generatedResult,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A227] to-[#A3821C] text-stone-950 flex items-center justify-center shadow font-bold">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#0B3D2E]">Mahal Creative Studio & AI Drafter</h3>
            <p className="text-xs text-stone-500">Draft notices, Friday khutbah summaries, posters, and WhatsApp announcements</p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full">
          AI Power Tool
        </span>
      </div>

      <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="md:col-span-3">
          <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            Event, Topic, or Announcement Subject
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Free Medical Camp & Blood Donation, Pre-Marital Course, Friday Khutbah..."
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0B3D2E] focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            Content Format
          </label>
          <select
            value={projectType}
            onChange={(e) => setProjectType(e.target.value as any)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
          >
            <option value="POSTER_COPY">Social Media & Poster Copy</option>
            <option value="WHATSAPP_BROADCAST">WhatsApp Broadcast Message</option>
            <option value="OFFICIAL_CIRCULAR">Formal Mahal Circular</option>
            <option value="KHUTBAH_OUTLINE">Friday Khutbah Points & Notes</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            Language Output
          </label>
          <select
            value={outputLanguage}
            onChange={(e) => setOutputLanguage(e.target.value as any)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
          >
            <option value="BOTH">Bilingual (English + Malayalam)</option>
            <option value="MALAYALAM">Malayalam Only (മലയാളം)</option>
            <option value="ENGLISH">English Only</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#0B3D2E] hover:bg-emerald-950 text-[#C9A227] font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Composing Content...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Content</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generated Content Box */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Generated Output Preview
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg border border-stone-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-lg border border-emerald-300 transition-colors"
            >
              {saved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saved ? 'Saved to Projects' : 'Save Project'}</span>
            </button>
          </div>
        </div>

        <div className="bg-[#FAF9F5] border border-stone-300 rounded-xl p-5 text-xs text-stone-800 font-mono whitespace-pre-line leading-relaxed max-h-80 overflow-y-auto">
          {generatedResult}
        </div>
      </div>
    </div>
  );
};
