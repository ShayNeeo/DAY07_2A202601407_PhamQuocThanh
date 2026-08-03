import React, { useState } from 'react';
import type { ChunkRecord } from '../types';

interface ABFilterSimulatorProps {
  chunks: ChunkRecord[];
}

export const ABFilterSimulator: React.FC<ABFilterSimulatorProps> = ({ chunks }) => {
  const [selectedQuery, setSelectedQuery] = useState(
    'Các quy định áp dụng riêng cho sinh viên khi bị trùng lịch học phần?'
  );
  const [filterKey, setFilterKey] = useState('audience');
  const [filterValue, setFilterValue] = useState('student');

  // Compute Unfiltered Top 3
  const unfilteredResults = React.useMemo(() => {
    return chunks
      .map((c) => {
        const queryWords = selectedQuery.toLowerCase().split(/\s+/);
        const matchCount = queryWords.filter((w) => c.content.toLowerCase().includes(w)).length;
        const score = Number((matchCount * 0.08 + (c.id.length % 10) * 0.01).toFixed(4));
        return { ...c, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [chunks, selectedQuery]);

  // Compute Pre-Filtered Top 3
  const preFilteredResults = React.useMemo(() => {
    const filtered = chunks.filter((c) => c.metadata[filterKey] === filterValue);

    return filtered
      .map((c) => {
        const queryWords = selectedQuery.toLowerCase().split(/\s+/);
        const matchCount = queryWords.filter((w) => c.content.toLowerCase().includes(w)).length;
        const score = Number((matchCount * 0.08 + (c.id.length % 10) * 0.01).toFixed(4));
        return { ...c, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [chunks, selectedQuery, filterKey, filterValue]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card-dark p-6 rounded-3xl border border-[#00E676]/30 shadow-emerald-glow">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <i className="fa-solid fa-filter text-[#00E676]"></i>
          Mô Phỏng A/B: Pre-Filtering (Lọc Trước) vs Unfiltered Search (Không Lọc)
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Đánh giá trực quan mức độ triệt tiêu nhiễu dữ liệu khi áp dụng bộ lọc Metadata đối tượng (<code className="text-[#00E676] font-mono font-bold">audience = 'student'</code>) trước khi tìm kiếm độ tương đồng Vector.
        </p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 font-mono text-xs">
          <div className="md:col-span-8">
            <label className="block text-slate-400 mb-1 font-bold">Câu Hỏi Thử Nghiệm:</label>
            <input
              type="text"
              value={selectedQuery}
              onChange={(e) => setSelectedQuery(e.target.value)}
              className="w-full bg-[#0D0F12] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-[#00E676] font-sans"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-slate-400 mb-1 font-bold">Lọc Metadata (Pre-Filter):</label>
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="w-full bg-[#0D0F12] border border-slate-800 rounded-xl p-2.5 text-[#00E676] font-bold outline-none focus:border-[#00E676]"
            >
              <option value="student">audience = 'student' (Sinh viên)</option>
              <option value="faculty">audience = 'faculty' (Giảng viên)</option>
              <option value="staff">audience = 'staff' (Cán bộ)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Panel A: Pre-Filtered Search */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-card-dark p-6 rounded-3xl border border-[#00E676]/40 space-y-3 shadow-emerald-glow">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#00E676] shadow-[0_0_8px_#00E676]"></span>
                <h3 className="text-sm font-bold text-white font-mono uppercase">PHƯƠNG ÁN A: PRE-FILTERED SEARCH</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#0A3A2A] text-[#00E676] border border-[#00E676]/40 font-mono text-[10px] font-bold">
                Chỉ chứa {filterValue}
              </span>
            </div>

            <div className="space-y-3">
              {preFilteredResults.map((r, idx) => (
                <div key={idx} className="bg-[#0D0F12] p-4 rounded-2xl border border-[#00E676]/30 space-y-1 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#00E676] font-bold">[{idx + 1}] {r.doc_id}</span>
                    <span className="text-[#00F5A0] font-bold">Score: {r.score}</span>
                  </div>
                  <div className="text-slate-300 text-xs font-sans leading-relaxed pt-1">{r.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel B: Unfiltered Search */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-card-dark p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <h3 className="text-sm font-bold text-slate-300 font-mono uppercase">PHƯƠNG ÁN B: UNFILTERED SEARCH</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800 font-mono text-[10px] font-bold">
                Chứa mọi audience
              </span>
            </div>

            <div className="space-y-3">
              {unfilteredResults.map((r, idx) => (
                <div key={idx} className="bg-[#0D0F12] p-4 rounded-2xl border border-slate-800 space-y-1 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-bold">[{idx + 1}] {r.doc_id}</span>
                    <span className="text-slate-400">Score: {r.score}</span>
                  </div>
                  <div className="text-slate-400 text-xs font-sans leading-relaxed pt-1">{r.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
