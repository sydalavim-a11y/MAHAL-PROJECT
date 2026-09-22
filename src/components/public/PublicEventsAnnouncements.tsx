import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Bell, Clock, MapPin, Sparkles, Share2, User } from 'lucide-react';

export const PublicEventsAnnouncements: React.FC = () => {
  const { t, events, announcements } = useApp();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0B3D2E] bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          Community Gazette
        </span>
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-stone-900">
          {t.nav.events} & Official Circulars
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Stay connected with upcoming congregational gatherings, Friday khutbah topics, Madrasa updates, and community welfare initiatives.
        </p>
      </div>

      {/* Events Section */}
      <div className="space-y-6">
        <h2 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#0B3D2E]" />
          <span>Upcoming Community Programs (പരിപാടികൾ)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-stone-300 transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {evt.isRegistrationOpen ? 'Registration Open' : 'Open Congregation'}
                  </span>
                  <span className="text-xs font-mono font-semibold text-stone-500">{evt.date}</span>
                </div>

                <h3 className="font-serif font-bold text-base text-stone-900 leading-snug">
                  {evt.title}
                </h3>
                {evt.titleMalayalam && (
                  <p className="text-xs font-malayalam font-bold text-[#0B3D2E]">
                    {evt.titleMalayalam}
                  </p>
                )}

                <p className="text-xs text-stone-600 leading-relaxed">{evt.description}</p>
                
                {evt.speakerOrChiefGuest && (
                  <p className="text-xs text-amber-800 font-medium flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Speaker: {evt.speakerOrChiefGuest}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-stone-500 pt-3 border-t border-stone-100">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#0B3D2E]" />
                  <span>{evt.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0B3D2E]" />
                  <span className="truncate">{evt.venue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Announcements / Circulars Section */}
      <div className="space-y-6">
        <h2 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-600" />
          <span>Official Mahal Circulars & Notices (അറിയിപ്പുകൾ)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="bg-white rounded-2xl border border-amber-200/80 bg-gradient-to-br from-white to-amber-50/20 p-6 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  {ann.priority} PRIORITY
                </span>
                <span className="text-xs font-mono text-stone-400">{ann.publishedDate}</span>
              </div>

              <h3 className="font-serif font-bold text-base text-stone-900">{ann.title}</h3>
              {ann.titleMalayalam && (
                <p className="text-xs font-malayalam font-bold text-amber-900">{ann.titleMalayalam}</p>
              )}

              <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line">{ann.content}</p>

              <div className="pt-2 text-[11px] text-stone-400">
                Issued by: <strong className="text-stone-700">{ann.author}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
