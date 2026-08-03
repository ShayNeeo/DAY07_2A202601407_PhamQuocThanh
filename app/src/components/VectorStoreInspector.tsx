import React, { useState } from 'react';
import type { ChunkRecord } from '../types';

interface VectorStoreInspectorProps {
  chunks: ChunkRecord[];
  onDeleteDoc: (docId: string) => void;
}

export const VectorStoreInspector: React.FC<VectorStoreInspectorProps> = ({ chunks, onDeleteDoc }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [audienceFilter, setAudienceFilter] = useState<string>('all');

  const filteredChunks = chunks.filter((chunk) => {
    const matchesSearch =
      chunk.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chunk.doc_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAudience = audienceFilter === 'all' || chunk.metadata.audience === audienceFilter;

    return matchesSearch && matchesAudience;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="glass-card-dark p-6 rounded-3xl border border-[#00E676]/30 shadow-emerald-glow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-layer-group text-[#00E676]"></i>
            Vector DB Store & Chunk Inspector (Kiểm Tra Không Gian Vector)
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Kiểm tra chi tiết toàn bộ <code className="text-[#00E676] font-mono font-bold">{chunks.length} Vector Chunk Records</code> đang hoạt động trong bộ nhớ Vector Store.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-slate-400"></i>
            <input
              type="text"
              placeholder="Lọc từ khóa / doc_id..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#0D0F12] border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-slate-200 outline-none focus:border-[#00E676] w-64"
            />
          </div>

          <select
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value)}
            className="bg-[#0D0F12] border border-slate-800 rounded-xl px-3.5 py-2 text-[#00E676] font-bold outline-none focus:border-[#00E676]"
          >
            <option value="all">Tất Cả Audience</option>
            <option value="student">student (Sinh viên)</option>
            <option value="faculty">faculty (Giảng viên)</option>
            <option value="staff">staff (Cán bộ)</option>
          </select>
        </div>
      </div>

      {/* Grid of Stored Chunk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChunks.map((chunk, idx) => (
          <div
            key={chunk.id || idx}
            className="glass-card-dark p-5 rounded-2xl border border-slate-800 hover:border-[#00E676]/50 transition-all flex flex-col justify-between space-y-3 relative group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono border-b border-slate-800/80 pb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#0A3A2A] text-[#00E676] border border-[#00E676]/40 font-bold truncate max-w-[160px]">
                  {chunk.doc_id}
                </span>
                <span className="text-[#1DE9B6] font-bold">Vector 3072D</span>
              </div>

              <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400">
                <span>Chunk #{chunk.chunk_index}</span>
                <span>•</span>
                <span>Audience: {chunk.metadata.audience}</span>
              </div>

              <p className="text-slate-200 text-xs font-sans leading-relaxed line-clamp-4 pt-1">
                {chunk.content}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400">Length: {chunk.content.length} chars</span>
              <button
                onClick={() => onDeleteDoc(chunk.doc_id)}
                className="text-slate-500 hover:text-red-400 transition-colors"
              >
                Xóa Doc <i className="fa-solid fa-trash text-[10px] ml-1"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
