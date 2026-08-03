import React, { useState } from 'react';
import { AN_EXTRACTED_TRIPLES } from '../data/initialCorpus';

export const KnowledgeGraphViewer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTriples = AN_EXTRACTED_TRIPLES.filter(
    (t) =>
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.relation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.object.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.source_doc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="glass-card-dark p-6 rounded-3xl border border-[#00E676]/30 shadow-emerald-glow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-diagram-project text-[#00E676]"></i>
              Trình Khám Phá Đồ Thị Tri Thức (Knowledge Graph & Triples Mining)
            </h2>
            <span className="px-3 py-1 text-[10px] font-mono font-bold bg-[#0A3A2A] text-[#00E676] border border-[#00E676]/40 rounded-full">
              ETL: Thành An (01017) Data Integration
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Trực quan hóa tập tam diện <code className="text-[#00E676] font-mono font-bold">(Subject, Relation, Object)</code> được trích xuất tự động từ kho văn bản quy định VinUni.
          </p>
        </div>

        <div className="relative font-mono text-xs">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-slate-400"></i>
          <input
            type="text"
            placeholder="Tìm kiếm tam diện Triples..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#0D0F12] border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-slate-200 outline-none focus:border-[#00E676] w-64"
          />
        </div>
      </div>

      {/* Triples Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTriples.map((t) => (
          <div
            key={t.id}
            className="glass-card-dark rounded-2xl p-5 border border-slate-800 hover:border-[#00E676]/50 transition-all space-y-3 relative overflow-hidden group shadow-soft"
          >
            <div className="flex items-center justify-between font-mono text-xs border-b border-slate-800 pb-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#0A3A2A] text-[#00E676] font-bold border border-[#00E676]/40">
                {t.source_doc}
              </span>
              <span className="text-[#00F5A0] text-[11px] font-bold">
                Confidence: {(t.confidence * 100).toFixed(0)}%
              </span>
            </div>

            {/* Triple Structure Component */}
            <div className="space-y-2 text-xs font-mono">
              <div className="bg-[#0D0F12] p-2.5 rounded-xl border border-slate-800 text-white font-bold flex items-center justify-between">
                <span className="text-slate-400 text-[10px] uppercase">Subject:</span>
                <span className="text-[#00E676] truncate max-w-[200px]">{t.subject}</span>
              </div>

              <div className="flex justify-center my-0.5">
                <span className="px-3 py-0.5 rounded-full bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/30 text-[10px] font-bold">
                  ↓ {t.relation}
                </span>
              </div>

              <div className="bg-[#0D0F12] p-2.5 rounded-xl border border-slate-800 text-slate-200 flex items-center justify-between font-sans">
                <span className="text-slate-400 text-[10px] font-mono uppercase">Object:</span>
                <span className="text-right truncate max-w-[200px]">{t.object}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
