import React, { useEffect, useState } from 'react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  totalDocs: number;
  totalChunks: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, totalDocs, totalChunks }) => {
  const [apiOnline, setApiOnline] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'online') setApiOnline(true);
      })
      .catch(() => setApiOnline(false));
  }, []);

  const tabs = [
    { id: 'tutor', num: '01', label: 'Bài Giảng Giáo Sư', icon: 'fa-graduation-cap' },
    { id: 'corpus', num: '02', label: 'Quản Lý Văn Bản', icon: 'fa-database' },
    { id: 'chunking', num: '03', label: 'Engine Cắt Nhỏ', icon: 'fa-scissors' },
    { id: 'vectorstore', num: '04', label: 'Kiểm Tra Vector DB', icon: 'fa-layer-group' },
    { id: 'abfilter', num: '05', label: 'Pre-Filter A/B', icon: 'fa-filter' },
    { id: 'rag', num: '06', label: 'Trợ Lý RAG', icon: 'fa-robot' },
    { id: 'graph', num: '07', label: 'Đồ Thị Tri Thức', icon: 'fa-diagram-project' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0D0F12]/95 backdrop-blur-2xl border-b border-[#00E676]/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
        
        {/* Top Desktop Profile & Control Bar */}
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: User Avatar & Profile Greeting */}
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00E676] to-[#00E5FF] p-[2px] shadow-emerald-glow">
                <div className="w-full h-full bg-[#161B22] rounded-full flex items-center justify-center text-[#00E676] font-bold text-sm">
                  <i className="fa-solid fa-user-shield"></i>
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00E676] border-2 border-[#0D0F12] rounded-full"></span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Hi, Phạm Quốc Thanh <span className="text-[#00E676]">👋</span>
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#0A3A2A] text-[#00E676] border border-[#00E676]/40">
                  Lead 2A202601407
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                AGY RAG Studio K3 • ETL: <strong className="text-[#1DE9B6]">Thành An (01017)</strong>
              </p>
            </div>
          </div>

          {/* Right: Status Badges, Bell & Action Controls */}
          <div className="flex items-center space-x-3 text-xs font-mono">
            {/* Live Model Badge */}
            <div className={`px-3 py-1.5 rounded-full border flex items-center space-x-2 transition-all ${
              apiOnline ? 'bg-[#0A3A2A]/90 text-[#00E676] border-[#00E676]/40 shadow-emerald-glow' : 'bg-[#161B22] text-slate-400 border-slate-800'
            }`}>
              <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-[#00E676] animate-pulse shadow-[0_0_10px_#00E676]' : 'bg-slate-500'}`}></span>
              <span className="font-semibold">{apiOnline ? 'Gemma 4 & Gemini Embed 2' : 'System Offline'}</span>
            </div>

            {/* Notification Bell */}
            <button className="w-9 h-9 rounded-full bg-[#161B22] border border-slate-800 text-slate-300 hover:text-[#00E676] hover:border-[#00E676]/40 flex items-center justify-center transition-all">
              <i className="fa-solid fa-bell text-sm"></i>
            </button>

            {/* Theme Toggle Button */}
            <button className="w-9 h-9 rounded-full bg-[#0A3A2A]/80 border border-[#00E676]/40 text-[#00E676] flex items-center justify-center transition-all shadow-emerald-glow">
              <i className="fa-solid fa-moon text-sm"></i>
            </button>
          </div>
        </div>

        {/* Hero Knowledge Assets & Vector Metric Card */}
        <div className="glass-card-dark rounded-3xl p-4 border border-[#00E676]/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-[#00E676]/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

          {/* RAG Multi-Agent Embedding Stats */}
          <div className="relative z-10 text-center md:text-left">
            <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold block">
              SYSTEM EMBEDDING & KNOWLEDGE OVERVIEW
            </span>
            <div className="flex items-center justify-center md:justify-start space-x-3 mt-0.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#00E676] tracking-tight font-sans">
                3,072-D VECTORS <span className="text-xs font-mono text-slate-400 font-normal">Gemini Embed 2</span>
              </h2>
              <span className="px-2.5 py-1 rounded-full bg-[#00F5A0]/20 text-[#00F5A0] border border-[#00F5A0]/40 text-xs font-mono font-bold">
                Cosine ~0.99 ↗
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-1">
              Active Corpus: <strong className="text-white">{totalDocs} Docs</strong> • <strong className="text-[#1DE9B6]">{totalChunks} Chunks</strong> • <strong className="text-[#00E5FF]">11 Triples</strong>
            </p>
          </div>

          {/* 4 Circular RAG Action Buttons */}
          <div className="flex items-center space-x-4 relative z-10 shrink-0">
            {[
              { id: 'tutor', label: 'Bài Giảng', icon: 'fa-graduation-cap' },
              { id: 'corpus', label: 'Văn Bản', icon: 'fa-database' },
              { id: 'vectorstore', label: 'Vector DB', icon: 'fa-layer-group' },
              { id: 'rag', label: 'Trợ Lý RAG', icon: 'fa-robot' },
            ].map((act) => (
              <button
                key={act.id}
                onClick={() => setActiveTab(act.id)}
                className="flex flex-col items-center group"
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 shadow-emerald-glow ${
                  activeTab === act.id
                    ? 'bg-[#00E676] text-black font-bold scale-105'
                    : 'bg-[#161B22] border border-slate-700 text-slate-300 group-hover:border-[#00E676] group-hover:text-[#00E676]'
                }`}>
                  <i className={`fa-solid ${act.icon} text-sm`}></i>
                </div>
                <span className="text-[11px] font-medium text-slate-300 mt-1">{act.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Category Navigation Pills */}
        <nav className="flex space-x-2 overflow-x-auto py-1 no-scrollbar border-t border-slate-800/60 pt-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-[#00E676] text-black font-bold shadow-emerald-glow'
                    : 'bg-[#161B22] text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-black/20 text-black font-bold' : 'text-slate-500 bg-slate-900'
                }`}>
                  {tab.num}
                </span>
                <i className={`fa-solid ${tab.icon}`}></i>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};
