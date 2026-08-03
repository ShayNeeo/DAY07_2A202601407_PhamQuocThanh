import React, { useState } from 'react';
import type { ChunkRecord, BenchmarkQuery } from '../types';
import { BENCHMARK_QUERIES } from '../data/initialCorpus';

interface RAGPlaygroundProps {
  chunks: ChunkRecord[];
}

export const RAGPlayground: React.FC<RAGPlaygroundProps> = ({ chunks }) => {
  const [subTab, setSubTab] = useState<'preset' | 'custom'>('custom');

  // Preset Mode State
  const [selectedBenchmark, setSelectedBenchmark] = useState<BenchmarkQuery>(BENCHMARK_QUERIES[0]);
  const [presetQuery, setPresetQuery] = useState(BENCHMARK_QUERIES[0].query);
  const [usePresetFilter, setUsePresetFilter] = useState(false);
  const [topK, setTopK] = useState(3);
  const [isGeneratingPreset, setIsGeneratingPreset] = useState(false);
  const [presetResponse, setPresetResponse] = useState<string | null>(null);

  // 100% Fully Custom Prompt Template Editor State (supporting {context} & {query} placeholders)
  const [customSystemInstruction, setCustomSystemInstruction] = useState<string>(
`Bạn là Giáo sư / Trợ lý AI chuyên về Quy định và Học vụ Đại học VinUni.
Hãy trả lời câu hỏi của người dùng CHỈ dựa trên Ngữ cảnh được cung cấp dưới đây.
- Bắt buộc trả lời hoàn toàn bằng TIẾNG VIỆT, văn phong lịch sự, trang trọng.
- Trích dẫn chính xác tên tài liệu [Source N] cho từng ý trả lời.
- Nếu Ngữ cảnh không đủ bằng chứng, bắt buộc trả lời: "Tôi không có đủ thông tin trong tài liệu để trả lời."

Ngữ cảnh:
{context}

Câu hỏi: {query}
Trả lời:`
  );
  const [customUserQuery, setCustomUserQuery] = useState<string>(
    BENCHMARK_QUERIES[0].query
  );
  const [customAudienceFilter, setCustomAudienceFilter] = useState<string>('student');
  const [useCustomFilter, setUseCustomFilter] = useState<boolean>(true);
  const [customTopK, setCustomTopK] = useState<number>(3);
  const [isGeneratingCustom, setIsGeneratingCustom] = useState<boolean>(false);
  const [customModelResponse, setCustomModelResponse] = useState<string | null>(null);
  const [usedModelName, setUsedModelName] = useState<string>('gemma-4-26b-a4b-it');

  // Helper function to render rich Markdown with bolding, lists, headers, and [Source N] glowing badges
  const renderFormattedMarkdown = (text: string | null) => {
    if (!text) return null;
    const lines = text.split('\n');

    return (
      <div className="space-y-2.5 text-slate-100 text-sm leading-relaxed font-sans w-full">
        {lines.map((line, lineIdx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={lineIdx} className="h-1" />;

          // Markdown Headers
          if (trimmed.startsWith('# ')) {
            return (
              <h3 key={lineIdx} className="text-base font-bold text-[#00E676] mt-2 mb-1 border-b border-[#00E676]/20 pb-1">
                {trimmed.replace('# ', '')}
              </h3>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h4 key={lineIdx} className="text-sm font-bold text-[#00E676] mt-2 mb-1">
                {trimmed.replace('## ', '')}
              </h4>
            );
          }

          const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
          const isNumbered = /^\d+\.\s/.test(trimmed);
          const content = trimmed.replace(/^[-*]\s+|\d+\.\s+/, '');

          // Format bold & source tags inside line
          const parts = content.split(/(\*\*.*?\*\*|\[Source\s+\d+\]|\[Source\s+[^\]]+\])/g);

          const formattedContent = parts.map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={partIdx} className="font-bold text-[#00E676]">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith('[Source')) {
              return (
                <span
                  key={partIdx}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#0A3A2A] text-[#00E676] border border-[#00E676]/50 text-[11px] font-mono mx-1 shadow-emerald-glow font-bold"
                >
                  <i className="fa-solid fa-quote-left text-[9px] mr-1 text-[#00E676]"></i>
                  {part.slice(1, -1)}
                </span>
              );
            }
            return part;
          });

          if (isBullet) {
            return (
              <div key={lineIdx} className="flex items-start space-x-2 pl-3">
                <span className="text-[#00E676] font-bold text-xs mt-1">•</span>
                <div className="flex-1 text-slate-200">{formattedContent}</div>
              </div>
            );
          }

          if (isNumbered) {
            const numMatch = trimmed.match(/^(\d+)\./);
            const num = numMatch ? numMatch[1] : '1';
            return (
              <div key={lineIdx} className="flex items-start space-x-2 pl-3">
                <span className="text-[#1DE9B6] font-mono text-xs font-bold mt-0.5">{num}.</span>
                <div className="flex-1 text-slate-200">{formattedContent}</div>
              </div>
            );
          }

          return <p key={lineIdx}>{formattedContent}</p>;
        })}
      </div>
    );
  };

  // Hybrid Vector Retrieval Algorithm
  const customRetrievedResults = React.useMemo(() => {
    let pool = chunks;
    if (useCustomFilter && customAudienceFilter !== 'all') {
      pool = chunks.filter((c) => c.metadata.audience === customAudienceFilter);
    }

    const queryLower = customUserQuery.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 1);

    return pool
      .map((c) => {
        const textContent = `${c.doc_id} ${c.metadata.title} ${c.content}`.toLowerCase();
        let matchScore = 0;

        if (
          queryLower.includes('chuyên ngành') &&
          (c.doc_id.includes('chuyen-nganh') || textContent.includes('chuyên ngành'))
        ) {
          matchScore += 0.65;
        }
        if (
          queryLower.includes('học bổng') &&
          (c.doc_id.includes('hoc-bong') || textContent.includes('học bổng'))
        ) {
          matchScore += 0.65;
        }

        queryWords.forEach((w) => {
          if (textContent.includes(w)) matchScore += 0.08;
        });

        const score = Number(Math.min(0.99, matchScore + 0.15).toFixed(4));
        return { ...c, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, customTopK);
  }, [chunks, customUserQuery, useCustomFilter, customAudienceFilter, customTopK]);

  // Clean Assembled Custom Prompt - 100% custom from template, replacing {context} and {query} placeholders
  const customContextString = customRetrievedResults
    .map((r, idx) => `[Source ${idx + 1}: ${r.doc_id}]\n${r.content}`)
    .join('\n\n');

  const assembledCustomPrompt = React.useMemo(() => {
    let result = customSystemInstruction;

    if (result.includes('{context}')) {
      result = result.replace('{context}', customContextString || '(Không tìm thấy ngữ cảnh phù hợp)');
    } else if (!result.includes(customContextString)) {
      result += `\n\nNgữ cảnh:\n${customContextString || '(Không tìm thấy ngữ cảnh phù hợp)'}`;
    }

    if (result.includes('{query}')) {
      result = result.replace('{query}', customUserQuery);
    } else if (!result.includes(customUserQuery)) {
      result += `\n\nCâu hỏi: ${customUserQuery}\nTrả lời:`;
    }

    return result.trim();
  }, [customSystemInstruction, customContextString, customUserQuery]);

  // Compute Preset Retrieved Chunks
  const presetRetrievedResults = React.useMemo(() => {
    let pool = chunks;
    if (usePresetFilter && selectedBenchmark.metadata_filter) {
      pool = chunks.filter(
        (c) => c.metadata.audience === selectedBenchmark.metadata_filter?.audience
      );
    }

    const queryLower = presetQuery.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 1);

    return pool
      .map((c) => {
        const textContent = `${c.doc_id} ${c.metadata.title} ${c.content}`.toLowerCase();
        let matchScore = 0;
        queryWords.forEach((w) => {
          if (textContent.includes(w)) matchScore += 0.12;
        });
        const score = Number(Math.min(0.99, matchScore + 0.2).toFixed(4));
        return { ...c, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }, [chunks, presetQuery, usePresetFilter, selectedBenchmark, topK]);

  const handleRunCustomRAG = async () => {
    setIsGeneratingCustom(true);
    setCustomModelResponse(null);

    try {
      const res = await fetch('http://localhost:8000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: assembledCustomPrompt,
          system_instruction: customSystemInstruction
        }),
      });
      const data = await res.json();
      if (data.response) {
        setCustomModelResponse(data.response);
        setUsedModelName(data.model);
      } else {
        setCustomModelResponse('Không thể sinh phản hồi từ API. Hãy kiểm tra kết nối server backend.');
      }
    } catch (err) {
      setCustomModelResponse('Lỗi kết nối API backend port 8000. Hãy đảm bảo uvicorn server đang chạy.');
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  const handleRunPresetRAG = async () => {
    setIsGeneratingPreset(true);
    setPresetResponse(null);

    const presetContextString = presetRetrievedResults
      .map((r, idx) => `[Source ${idx + 1}: ${r.doc_id}]\n${r.content}`)
      .join('\n\n');

    const prompt = `System Instruction: Bạn là trợ lý tư vấn quy định đại học. Trả lời câu hỏi người dùng CHỈ dựa trên ngữ cảnh dưới đây. Trích dẫn tên tài liệu [Source N] nếu có.

Ngữ cảnh:
${presetContextString}

Câu hỏi: ${presetQuery}
Trả lời:`;

    try {
      const res = await fetch('http://localhost:8000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.response) {
        setPresetResponse(data.response);
      } else {
        setPresetResponse('Không thể sinh phản hồi từ API.');
      }
    } catch (err) {
      setPresetResponse('Lỗi kết nối API backend port 8000.');
    } finally {
      setIsGeneratingPreset(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="glass-card-dark p-6 rounded-3xl border border-[#00E676]/30 shadow-emerald-glow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-robot text-[#00E676]"></i>
            Trợ Lý RAG Đa Tác Viên (RAG Assistant Playground)
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Tùy biến System Prompt hoàn toàn, chọn câu hỏi Benchmark mẫu (#1 - #5) hoặc nhập truy vấn mới với mô hình{' '}
            <code className="text-[#00E676] font-mono font-bold">Gemma 4</code> &{' '}
            <code className="text-[#1DE9B6] font-mono font-bold">Gemini Embedding 2</code>.
          </p>
        </div>

        {/* Sub-tab Pills */}
        <div className="flex items-center bg-[#161B22] p-1.5 rounded-2xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setSubTab('custom')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 font-bold ${
              subTab === 'custom'
                ? 'bg-[#00E676] text-black shadow-emerald-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-sliders"></i>
            <span>Tùy Biến Prompt & Query Mới</span>
          </button>

          <button
            onClick={() => setSubTab('preset')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 font-bold ${
              subTab === 'preset'
                ? 'bg-[#00E676] text-black shadow-emerald-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-list-check"></i>
            <span>Benchmark Mẫu (#1 - #5)</span>
          </button>
        </div>
      </div>

      {/* QUICK BENCHMARK SELECTOR BAR (1-CLICK BENCHMARKS) */}
      <div className="glass-card-dark p-4 rounded-2xl border border-[#00E676]/20 flex items-center space-x-3 overflow-x-auto no-scrollbar">
        <span className="text-xs font-mono text-slate-400 shrink-0 font-bold uppercase flex items-center gap-1.5">
          <i className="fa-solid fa-bolt text-[#00E676]"></i> Benchmark Mẫu (1-Click):
        </span>
        {BENCHMARK_QUERIES.map((bq) => (
          <button
            key={bq.id}
            onClick={() => {
              setCustomUserQuery(bq.query);
              setSelectedBenchmark(bq);
              setPresetQuery(bq.query);
              setCustomModelResponse(null);
            }}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition-all border font-semibold ${
              customUserQuery === bq.query
                ? 'bg-[#0A3A2A] text-[#00E676] border-[#00E676] shadow-emerald-glow'
                : 'bg-[#161B22] text-slate-300 border-slate-800 hover:border-[#00E676]/40 hover:text-white'
            }`}
          >
            #{bq.id}: {bq.gold_doc_id.replace('vinuni-', '')}
          </button>
        ))}
      </div>

      {/* SUB-PAGE 1: CUSTOM PROMPT & QUERY STUDIO */}
      {subTab === 'custom' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: System Prompt & User Query Controls */}
            <div className="lg:col-span-6 space-y-4">
              <div className="glass-card-dark p-6 rounded-3xl border border-[#00E676]/20 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <label className="text-slate-200 font-bold flex items-center gap-2">
                    <i className="fa-solid fa-terminal text-[#00E676]"></i>
                    1. Tùy Biến Chỉ Thị Hệ Thống & Template Prompt (Custom Prompt):
                  </label>
                  <span className="text-[10px] text-[#00E676]">Hỗ trợ biến {'{context}'} & {'{query}'}</span>
                </div>

                <textarea
                  rows={8}
                  value={customSystemInstruction}
                  onChange={(e) => setCustomSystemInstruction(e.target.value)}
                  className="w-full bg-[#0D0F12] border border-slate-800 rounded-2xl p-3.5 text-[#00E676] font-mono text-xs leading-relaxed outline-none focus:border-[#00E676]"
                />
              </div>

              <div className="glass-card-dark p-6 rounded-3xl border border-[#00E676]/20 space-y-3 font-mono text-xs">
                <label className="text-slate-200 font-bold block">
                  2. Câu Hỏi Truy Vấn Người Dùng (Custom User Query):
                </label>
                <textarea
                  rows={3}
                  value={customUserQuery}
                  onChange={(e) => setCustomUserQuery(e.target.value)}
                  className="w-full bg-[#0D0F12] border border-slate-800 rounded-2xl p-3.5 text-white font-sans text-sm outline-none focus:border-[#00E676]"
                />

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-slate-400 mb-1">Pre-Filter Đối Tượng:</label>
                    <select
                      value={customAudienceFilter}
                      onChange={(e) => setCustomAudienceFilter(e.target.value)}
                      className="w-full bg-[#0D0F12] border border-slate-800 rounded-xl p-2.5 text-[#00E676] font-bold outline-none focus:border-[#00E676]"
                    >
                      <option value="student">student (Sinh viên)</option>
                      <option value="faculty">faculty (Giảng viên)</option>
                      <option value="staff">staff (Cán bộ)</option>
                      <option value="all">all (Tất cả)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Số Chunk Top-K:</label>
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={customTopK}
                      onChange={(e) => setCustomTopK(Number(e.target.value))}
                      className="w-full bg-[#0D0F12] border border-slate-800 rounded-xl p-2.5 text-center text-[#1DE9B6] font-bold outline-none focus:border-[#00E676]"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRunCustomRAG}
                  disabled={isGeneratingCustom}
                  className="w-full py-3.5 rounded-full bg-[#00E676] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-emerald-glow transition-all disabled:opacity-50 mt-2 hover:bg-white"
                >
                  <i className={`fa-solid ${isGeneratingCustom ? 'fa-spinner fa-spin' : 'fa-play'}`}></i>
                  <span>
                    {isGeneratingCustom
                      ? 'Đang gửi Prompt tới Mô hình .env...'
                      : 'Chạy Trợ Lý RAG Với Prompt Mới'}
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column: Prompt Inspection & Live Response */}
            <div className="lg:col-span-6 space-y-4">
              <div className="glass-card-dark p-6 rounded-3xl border border-[#00E676]/30 shadow-emerald-glow space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300 uppercase tracking-wider block font-bold">
                    <i className="fa-solid fa-microchip text-[#00E676] mr-1.5"></i>
                    Câu Trả Lời Trực Tiếp Từ Mô Hình (.env LLM):
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#0A3A2A] text-[#00E676] border border-[#00E676]/40 font-bold">
                    Model: {usedModelName}
                  </span>
                </div>

                <div className="bg-[#0D0F12] p-5 rounded-2xl border border-slate-800 min-h-[160px] flex items-start">
                  {isGeneratingCustom ? (
                    <div className="flex items-center space-x-2 text-[#00E676] font-mono text-xs animate-pulse">
                      <i className="fa-solid fa-spinner fa-spin text-lg"></i>
                      <span>Đang tính toán Vector Embedding & sinh câu trả lời Tiếng Việt...</span>
                    </div>
                  ) : customModelResponse ? (
                    renderFormattedMarkdown(customModelResponse)
                  ) : (
                    <div className="text-slate-400 font-mono text-xs italic flex items-center gap-2 py-4">
                      <i className="fa-solid fa-[#00E676] fa-circle-info text-[#00E676]"></i>
                      <span>(Chưa chạy - Nhấn nút "Chạy Trợ Lý RAG Với Prompt Mới" để gửi prompt tùy biến tới mô hình Gemma 4)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Assembled Prompt Inspection */}
              <div className="glass-card-dark p-6 rounded-3xl border border-slate-800 space-y-3">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block font-bold">
                  <i className="fa-solid fa-code text-[#00E676] mr-1.5"></i>
                  Xem Trước Toàn Bộ Prompt Đã Đóng Gói (Assembled Prompt):
                </span>

                <div className="bg-[#0D0F12] p-4 rounded-2xl border border-slate-800 font-mono text-[11px] text-[#00E676] whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed">
                  {assembledCustomPrompt}
                </div>
              </div>

              {/* Retrieved Candidates Audit */}
              <div className="glass-card-dark p-6 rounded-3xl border border-slate-800 space-y-3 font-mono text-xs">
                <span className="text-slate-400 uppercase tracking-wider block font-bold">
                  Kiểm Tra Chunk Truy Xuất ({customRetrievedResults.length}):
                </span>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {customRetrievedResults.map((r, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0D0F12] p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center space-x-2 truncate max-w-[260px]">
                        <span className="text-[#00E676] font-bold">[{idx + 1}]</span>
                        <span className="text-slate-200 truncate">{r.doc_id}</span>
                      </div>
                      <span className="text-[#00F5A0] font-bold">Score: {r.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-PAGE 2: PRESET BENCHMARKS */}
      {subTab === 'preset' && (
        <div className="space-y-6">
          <div className="glass-card-dark p-6 rounded-3xl border border-[#00E676]/30 shadow-emerald-glow space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <label className="text-slate-200 font-bold">Chọn Câu Hỏi Benchmark Mẫu (#1 - #5):</label>
              <select
                value={selectedBenchmark.id}
                onChange={(e) => {
                  const b = BENCHMARK_QUERIES.find((bq) => bq.id === Number(e.target.value));
                  if (b) {
                    setSelectedBenchmark(b);
                    setPresetQuery(b.query);
                    setUsePresetFilter(!!b.metadata_filter);
                    setPresetResponse(null);
                  }
                }}
                className="bg-[#0D0F12] border border-slate-800 rounded-xl px-3.5 py-2 font-mono text-xs text-[#00E676] font-bold outline-none focus:border-[#00E676]"
              >
                {BENCHMARK_QUERIES.map((bq) => (
                  <option key={bq.id} value={bq.id}>
                    Query #{bq.id} ({bq.gold_doc_id})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={presetQuery}
                onChange={(e) => setPresetQuery(e.target.value)}
                className="flex-1 bg-[#0D0F12] border border-slate-800 rounded-xl p-3 text-slate-200 outline-none focus:border-[#00E676] font-sans text-sm"
              />
              <button
                onClick={handleRunPresetRAG}
                disabled={isGeneratingPreset}
                className="px-6 py-3 rounded-full bg-[#00E676] text-black font-bold flex items-center gap-2 shadow-emerald-glow disabled:opacity-50 hover:bg-white"
              >
                <i className={`fa-solid ${isGeneratingPreset ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
                <span>Chạy RAG Mẫu</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 glass-card-dark p-6 rounded-3xl border border-slate-800 space-y-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block font-bold">
                Đáp Án Chuẩn Kỳ Vọng (Gold Standard Answer):
              </span>
              <div className="bg-[#0D0F12] p-4 rounded-2xl border border-emerald-500/40">
                {renderFormattedMarkdown(selectedBenchmark.gold_answer)}
              </div>
            </div>

            <div className="lg:col-span-6 glass-card-dark p-6 rounded-3xl border border-[#00E676]/30 shadow-emerald-glow space-y-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block font-bold">
                Kết Quả Thực Tế Từ Mô Hình:
              </span>
              <div className="bg-[#0D0F12] p-4 rounded-2xl border border-[#00E676]/40">
                {isGeneratingPreset ? (
                  <div className="flex items-center space-x-2 text-[#00E676] font-mono text-xs animate-pulse">
                    <i className="fa-solid fa-spinner fa-spin text-lg"></i>
                    <span>Đang sinh câu trả lời...</span>
                  </div>
                ) : presetResponse ? (
                  renderFormattedMarkdown(presetResponse)
                ) : (
                  <div className="text-slate-400 font-mono text-xs italic flex items-center gap-2 py-4">
                    <i className="fa-solid fa-circle-info text-[#00E676]"></i>
                    <span>(Chưa chạy - Nhấn nút "Chạy RAG Mẫu" để xem kết quả thực tế từ mô hình)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
