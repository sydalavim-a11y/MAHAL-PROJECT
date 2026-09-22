import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  CreditCard,
  FileText,
  HeartHandshake,
  Lock,
  MessageCircle,
  PhoneCall,
  X,
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'general' | 'dues' | 'certificates' | 'welfare' | 'security';
  questionEn: string;
  questionMl: string;
  answerEn: string;
  answerMl: string;
  tags: string[];
}

export const FaqSection: React.FC = () => {
  const { language, setActiveTab, setOpenAuthModal } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const faqList: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'general',
      questionEn: 'What is the Noor Mahal Digital Portal and who can use it?',
      questionMl: 'എന്താണ് നൂർ മഹൽ ഡിജിറ്റൽ പോർട്ടൽ? ആർക്കൊക്കെ ഉപയോഗിക്കാം?',
      answerEn:
        'Noor Mahal Digital Portal is the unified, paperless administration platform of Noor-ul-Huda Mahallu Jama-ath (Waqf Reg: KL-PKD/2024/088). It connects all residents, registered households, Pravasi (NRI) expatriates, and committee leaders into one secure digital system. Any resident can register their household, track contributions, apply for certificates, and seek community aid.',
      answerMl:
        'നൂറുൽ ഹുദാ മഹല്ല് ജമാഅത്തിന്റെ (വഖഫ് രജി: KL-PKD/2024/088) ഔദ്യോഗിക ഡിജിറ്റൽ ഭരണ സംവിധാനമാണ് നൂർ മഹൽ പോർട്ടൽ. മഹല്ല് നിവാസികൾ, കുടുംബങ്ങൾ, പ്രവാസികൾ, കമ്മിറ്റി ഭാരവാഹികൾ എന്നിവരെ ഒരു കുടക്കീഴിൽ ഒന്നിപ്പിക്കാനും മാസവരി, സർട്ടിഫിക്കറ്റുകൾ, ക്ഷേമനിധി എന്നിവ സുതാര്യമാക്കാനും ഇത് സഹായിക്കുന്നു.',
      tags: ['Portal', 'About', 'Registration'],
    },
    {
      id: 'faq-2',
      category: 'dues',
      questionEn: 'How can I pay monthly dues (Masavari) online?',
      questionMl: 'മാസവരി (Masavari) ഓൺലൈനായി എങ്ങനെ അടയ്ക്കാം?',
      answerEn:
        'Registered members can sign in, open their Member Dashboard or Public Services page, and click "Pay Monthly Dues". We support instant UPI (Google Pay, PhonePe, Paytm, BHIM), debit/credit cards, and direct Net Banking. An official, tamper-proof digital receipt with transaction ID is generated immediately and stored in your profile.',
      answerMl:
        'മെമ്പർ ഡാഷ്‌ബോർഡിലോ സേവന പേജിലോ കയറി "Pay Monthly Dues" ക്ലിക്ക് ചെയ്താൽ UPI (Google Pay, PhonePe), കാർഡുകൾ, നെറ്റ് ബാങ്കിംഗ് വഴി നേരിട്ട് മാസവരി അടയ്ക്കാം. തൽക്ഷണം ഔദ്യോഗിക പേയ്‌മെന്റ് രസീതും ലഭിക്കും.',
      tags: ['Payment', 'UPI', 'Receipts', 'Dues'],
    },
    {
      id: 'faq-3',
      category: 'certificates',
      questionEn: 'How do I apply for Nikah NOC, Marriage, or Death Certificates?',
      questionMl: 'നിക്കാഹ് NOC, വിവാഹ, മരണ സർട്ടിഫിക്കറ്റുകൾക്ക് എങ്ങനെ അപേക്ഷിക്കാം?',
      answerEn:
        'Under the "Services" or "Nikah" section, select your desired document application form. Fill in the bride & groom details, attach required identity documents, and submit online. The Mahal Khateeb and General Secretary review and digitally sign the application within 24 to 48 hours.',
      answerMl:
        '"സേവനങ്ങൾ" അല്ലെങ്കിൽ "നിക്കാഹ്" മെനുവിൽ നിന്ന് ആവശ്യമായ അപേക്ഷ തിരഞ്ഞെടുത്ത് വിവരങ്ങൾ നൽകുക. മഹല്ല് ഖത്തീബും ജനറൽ സെക്രട്ടറിയും പരിശോധിച്ച് 24-48 മണിക്കൂറിനകം ഡിജിറ്റൽ ഒപ്പോടു കൂടി സർട്ടിഫിക്കറ്റ് അനുവദിക്കും.',
      tags: ['Nikah', 'Certificates', 'Marriage', 'NOC'],
    },
    {
      id: 'faq-4',
      category: 'certificates',
      questionEn: 'What is the QR Code verification system on Noor Mahal certificates?',
      questionMl: 'സർട്ടിഫിക്കറ്റുകളിലെ ക്യുആർ കോഡ് വേരിഫിക്കേഷൻ എങ്ങനെ പ്രവർത്തിക്കുന്നു?',
      answerEn:
        'Every certificate issued by Noor Mahal contains a cryptographically signed QR code. Anyone (passports offices, embassies, other mahals, or government agencies) can scan the QR code or enter the certificate number on our homepage "Verify Document" tool to instantly view its authenticity, issue timestamp, and official signatory seal.',
      answerMl:
        'നൂർ മഹൽ നൽകുന്ന എല്ലാ സർട്ടിഫിക്കറ്റുകളിലും സുരക്ഷിതമായ ഒരു ക്യുആർ കോഡ് ഉണ്ട്. പാസ്‌പോർട്ട് ഓഫീസ്, എംബസികൾ, മറ്റ് മഹല്ലുകൾ എന്നിവർക്ക് വെബ്‌സൈറ്റിലെ "Verify Document" വഴി സർട്ടിഫിക്കറ്റിന്റെ ആധികാരികത തത്സമയം പരിശോധിക്കാം.',
      tags: ['Verification', 'QR Code', 'Authenticity', 'Security'],
    },
    {
      id: 'faq-5',
      category: 'general',
      questionEn: 'Can Pravasi (NRI) family members use the portal from abroad?',
      questionMl: 'വിദേശത്തുള്ള പ്രവാസികൾക്ക് പോർട്ടൽ ഉപയോഗിക്കാൻ സാധിക്കുമോ?',
      answerEn:
        'Yes, completely. Noor Mahal portal is accessible worldwide on all mobile and desktop browsers. Pravasi family members can monitor their family register, clear monthly dues via international or domestic cards/UPI, donate to welfare projects, and receive all community announcements in real time.',
      answerMl:
        'തീർച്ചയായും. ലോകത്തെവിടെയിരുന്നും പ്രവാസികൾക്ക് പോർട്ടൽ ഉപയോഗിക്കാം. കുടുംബത്തിന്റെ മാസവരി അടയ്ക്കാനും, മഹല്ല് പരിപാടികളും അറിയിപ്പുകളും തത്സമയം അറിയാനും പ്രവാസികൾക്ക് സാധിക്കും.',
      tags: ['Pravasi', 'NRI', 'Global Access'],
    },
    {
      id: 'faq-6',
      category: 'welfare',
      questionEn: 'How does the Medical Aid & Zakat Relief assistance program work?',
      questionMl: 'ചികിത്സാ സഹായവും സകാത്ത് വിതരണവും എങ്ങനെ നടപ്പിലാക്കുന്നു?',
      answerEn:
        'Constituents facing medical emergencies, surgery expenses, educational fees, or widow/orphan hardships can submit a confidential relief request through the Welfare portal. The Noor Mahal Relief Committee reviews applications discreetly, conducts fair verification, and disburses funds directly to hospital bills or applicant accounts without compromising privacy.',
      answerMl:
        'ചികിത്സാ സഹായം, ഡയാലിസിസ് പെൻഷൻ, വിദ്യാഭ്യാസ സ്കോളർഷിപ്പ്, വിധവാ സഹായം എന്നിവ ആവശ്യമുള്ളവർക്ക് ക്ഷേമനിധി പേജ് വഴി അപേക്ഷ സമർപ്പിക്കാം. ഭരണസമിതി അതീവ രഹസ്യമായി വിവരങ്ങൾ പരിശോധിച്ച് അർഹരായവർക്ക് സഹായം എത്തിച്ചുനൽകുന്നു.',
      tags: ['Welfare', 'Medical Aid', 'Zakat', 'Relief'],
    },
    {
      id: 'faq-7',
      category: 'security',
      questionEn: 'Is my personal and household data secure?',
      questionMl: 'വ്യക്തിഗത വിവരങ്ങളും കുടുംബ രേഖകളും എത്രത്തോളം സുരക്ഷിതമാണ്?',
      answerEn:
        'Yes. All communications are protected with 256-bit SSL encryption. Household records, member contact details, and financial transactions are strictly segregated by role-based access control. Only authorized committee personnel with verified administrative credentials can access central administrative records.',
      answerMl:
        'അതെ. 256-ബിറ്റ് എസ്എസ്എൽ എൻക്രിപ്ഷൻ വഴി എല്ലാ വിവരങ്ങളും അതീവ സുരക്ഷിതമാണ്. മെമ്പർമാരുടെ സ്വകാര്യ വിവരങ്ങൾ പൂർണ്ണ സുരക്ഷിതത്വത്തോടെ സൂക്ഷിക്കുകയും സുതാര്യമായി കൈകാര്യം ചെയ്യുകയും ചെയ്യുന്നു.',
      tags: ['Privacy', 'Encryption', 'Security', 'GDPR'],
    },
    {
      id: 'faq-8',
      category: 'dues',
      questionEn: 'What should I do if my payment was debited but the receipt was not generated?',
      questionMl: 'തുക ബാങ്കിൽ നിന്ന് ഡെബിറ്റ് ആയിട്ടും രസീത് വന്നില്ലെങ്കിൽ എന്തുചെയ്യണം?',
      answerEn:
        'Bank gateways occasionally take 5 to 10 minutes to deliver settlement webhooks. If your transaction status does not update, simply message our committee WhatsApp hotline (+91 98460 12345) with your UPI UTR or Transaction ID. Our finance desk will verify and manually issue the receipt within one business hour.',
      answerMl:
        'സാങ്കേതിക തടസ്സങ്ങൾ കാരണം തുക പിൻവലിക്കപ്പെടുകയും രസീത് വരാതിരിക്കുകയും ചെയ്താൽ UPI UTR നമ്പർ സഹിതം കമ്മിറ്റി വാട്സാപ്പ് നമ്പറിലേക്ക് (+91 98460 12345) സന്ദേശം അയക്കുക. ഉടനടി പരിശോധിച്ച് പരിഹാരം കാണുന്നതാണ്.',
      tags: ['Payment Issue', 'Support', 'Receipts'],
    },
    {
      id: 'faq-9',
      category: 'security',
      questionEn: 'How can committee members access the Central Admin Console?',
      questionMl: 'കമ്മിറ്റി ഭാരവാഹികൾക്ക് അഡ്മിൻ പാനലിലേക്ക് എങ്ങനെ പ്രവേശിക്കാം?',
      answerEn:
        'Authorized office bearers (President, General Secretary, Treasurer, and designated IT coordinators) can log in using their registered committee credentials (e.g., rumaispkdr@gmail.com). Upon verification, the central administrative controls, collection ledgers, and document approval queue become active.',
      answerMl:
        'അംഗീകൃത ഭരണസമിതി അംഗങ്ങൾക്ക് (പ്രസിഡന്റ്, ജനറൽ സെക്രട്ടറി, ട്രഷറർ) ഔദ്യോഗിക ജിമെയിൽ ലോഗിൻ വഴി സെൻട്രൽ അഡ്മിൻ കൺസോളിലേക്ക് പ്രവേശിക്കാം. അവിടെ നിന്നാണ് അപേക്ഷകൾ അംഗീകരിക്കലും കണക്കുകൾ പരിശോധിക്കലും നടക്കുന്നത്.',
      tags: ['Admin', 'Console', 'Leadership'],
    },
    {
      id: 'faq-10',
      category: 'general',
      questionEn: 'How do I add newborn babies or newly married spouses to my family register?',
      questionMl: 'കുടുംബ രജിസ്റ്ററിൽ പുതിയ അംഗങ്ങളെയോ കുട്ടികളെയോ എങ്ങനെ ചേർക്കാം?',
      answerEn:
        'Sign in to your Member Dashboard, click on "My Household / Family Book", and choose "Request Member Addition". Upload the birth certificate or Nikah confirmation. The registrar will approve the update and refresh your official Mahal Book household record.',
      answerMl:
        'മെമ്പർ ഡാഷ്‌ബോർഡിലെ "കുടുംബ പുസ്തകം (Family Book)" ഓപ്പൺ ചെയ്ത് "Add Member" വഴി ജനന സർട്ടിഫിക്കറ്റോ നിക്കാഹ് രേഖയോ സമർപ്പിച്ചാൽ മതിയാകും.',
      tags: ['Mahal Book', 'Family', 'Household'],
    },
  ];

  const categories = [
    { id: 'all', labelEn: 'All Questions', labelMl: 'എല്ലാ ചോദ്യങ്ങളും', icon: Sparkles },
    { id: 'general', labelEn: 'General & Portal', labelMl: 'പൊതുവായവ', icon: HelpCircle },
    { id: 'dues', labelEn: 'Monthly Dues (Masavari)', labelMl: 'മാസവരി & ഫീസ്', icon: CreditCard },
    { id: 'certificates', labelEn: 'Nikah & Certificates', labelMl: 'സർട്ടിഫിക്കറ്റുകൾ', icon: FileText },
    { id: 'welfare', labelEn: 'Welfare & Zakat', labelMl: 'ക്ഷേമനിധി & സകാത്ത്', icon: HeartHandshake },
    { id: 'security', labelEn: 'Security & Admin', labelMl: 'സുരക്ഷ & അഡ്മിൻ', icon: Lock },
  ];

  const filteredFaqs = useMemo(() => {
    return faqList.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        item.questionEn.toLowerCase().includes(q) ||
        item.questionMl.toLowerCase().includes(q) ||
        item.answerEn.toLowerCase().includes(q) ||
        item.answerMl.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [faqList, selectedCategory, searchQuery]);

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="scroll-mt-24 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00545f]/10 text-[#00545f] text-xs font-black uppercase tracking-wider mb-4 border border-[#00545f]/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{language === 'ml' ? 'സഹായ കേന്ദ്രം' : 'Knowledge & Help Center'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black font-serif text-[#00545f] tracking-tight mb-3">
            {language === 'ml' ? 'പതിവായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ (FAQ)' : 'Frequently Asked Questions'}
          </h2>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {language === 'ml'
              ? 'നൂർ മഹൽ പോർട്ടലിന്റെ സേവനങ്ങൾ, മാസവരി പേയ്‌മെന്റ്, സർട്ടിഫിക്കറ്റ് അപേക്ഷകൾ, ക്ഷേമനിധി സഹായങ്ങൾ എന്നിവയെക്കുറിച്ചുള്ള സമഗ്രമായ വിവരങ്ങൾ ഇവിടെ ലഭ്യമാണ്.'
              : 'Find clear answers regarding Noor Mahal membership, monthly dues, authenticated digital certificates, welfare relief, and portal security.'}
          </p>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          {/* Live Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
              <Search className="w-5 h-5 text-[#00545f]" />
            </div>
            <input
              id="faq-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'ml'
                  ? 'ചോദ്യങ്ങൾ തിരയുക... (ഉദാ: മാസവരി, നിക്കാഹ്, രസീത്, സർട്ടിഫിക്കറ്റ്)'
                  : 'Search questions, keywords, or topics (e.g. Masavari, Nikah, Receipt, UPI, NRI)...'
              }
              className="w-full pl-12 pr-10 py-3.5 bg-white border border-stone-200 focus:border-[#00545f] focus:ring-4 focus:ring-[#00545f]/10 rounded-2xl text-sm text-stone-900 shadow-sm transition-all outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`faq-cat-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer shrink-0 shadow-2xs ${
                    isActive
                      ? 'bg-[#00545f] text-white shadow-md'
                      : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#d6fb00]' : 'text-stone-500'}`} />
                  <span>{language === 'ml' ? cat.labelMl : cat.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-4xl mx-auto space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center shadow-xs">
              <HelpCircle className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <h3 className="font-bold text-stone-800 text-base mb-1">
                {language === 'ml' ? 'ചോദ്യങ്ങൾ കണ്ടെത്തിയില്ല' : 'No matching questions found'}
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
                {language === 'ml'
                  ? 'നിങ്ങൾ തിരഞ്ഞ വാക്കിന് അനുയോജ്യമായ ഉത്തരങ്ങൾ ലഭ്യമല്ല. തിരച്ചിൽ വാക്ക് മാറ്റി നോക്കുക അല്ലെങ്കിൽ മഹല്ലിനോട് നേരിട്ട് ചോദിക്കുക.'
                  : 'Try searching with different keywords or ask our 24/7 AI Mahal Assistant directly.'}
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isExpanded = expandedId === faq.id;
              const question = language === 'ml' ? faq.questionMl : faq.questionEn;
              const answer = language === 'ml' ? faq.answerMl : faq.answerEn;

              return (
                <div
                  key={faq.id}
                  id={faq.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
                    isExpanded
                      ? 'border-[#00545f]/40 ring-2 ring-[#00545f]/5 shadow-md'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full px-5 py-4 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="w-6 h-6 rounded-lg bg-[#00545f]/10 text-[#00545f] text-xs font-black flex items-center justify-center shrink-0 mt-0.5 font-mono">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
                          {question}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          {faq.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isExpanded ? 'bg-[#00545f] text-white rotate-180' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-stone-100 text-stone-700 text-xs sm:text-sm leading-relaxed animate-in fade-in duration-150">
                      <p className="bg-stone-50/70 p-4 rounded-xl border border-stone-100 font-normal">
                        {answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom CTA Card: Still Need Assistance */}
        <div className="max-w-4xl mx-auto mt-12 bg-gradient-to-br from-[#00545f] to-[#00363e] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#d6fb00]/30 relative overflow-hidden">
          <div className="relative z-10 space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d6fb00] text-[#00545f] text-[11px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ml' ? 'കൂടുതൽ ചോദ്യങ്ങൾ ഉണ്ടോ?' : 'Still Have Questions?'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
              {language === 'ml' ? 'മഹല്ല് കൺസൾട്ടേഷനും സഹായവും' : 'Ask Noor Mahal AI or Contact Committee Office'}
            </h3>
            <p className="text-xs text-[#ecffb6] max-w-lg leading-relaxed">
              {language === 'ml'
                ? 'നിങ്ങളുടെ ചോദ്യങ്ങൾക്ക് 24/7 തൽക്ഷണ ഉത്തരം നൽകാൻ ഞങ്ങളുടെ എഐ അസിസ്റ്റന്റ് സദാ സജ്ജമാണ്, അല്ലെങ്കിൽ ഓഫീസുമായി നേരിട്ട് ബന്ധപ്പെടാം.'
                : 'Get instantaneous answers from our 24/7 Ask Mahal AI Assistant or speak directly with the general secretary and office coordinators.'}
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              id="faq-btn-ask-ai"
              type="button"
              onClick={() => setActiveTab('ask-mahal')}
              className="px-4 py-2.5 bg-[#d6fb00] hover:bg-[#c2e400] text-[#00545f] font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#00545f]" />
              <span>{language === 'ml' ? 'മഹല്ലിനോട് ചോദിക്കാം' : 'Launch Ask Mahal AI'}</span>
            </button>

            <button
              id="faq-btn-contact-office"
              type="button"
              onClick={() => setActiveTab('contact')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-[#d6fb00]" />
              <span>{language === 'ml' ? 'ഓഫീസുമായി ബന്ധപ്പെടുക' : 'Contact Office'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
