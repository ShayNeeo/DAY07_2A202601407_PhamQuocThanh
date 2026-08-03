import React, { useState, useMemo } from 'react';
import type { ChunkingStrategyType } from '../types';

export const ChunkingVisualizer: React.FC = () => {
  const [sampleText, setSampleText] = useState<string>(
    `Nhà trường xét trao học bổng khuyến khích học tập theo từng học kỳ cho sinh viên hệ chính quy đạt kết quả học tập từ loại Giỏi trở lên và điểm rèn luyện đạt loại Tốt trở lên.

Học bổng được chia làm 3 mức: Mức Khá (100% học phí), Mức Giỏi (120% học phí) và Mức Xuất sắc (150% học phí). Sinh viên bị kỷ luật từ mức khiển trách trở lên trong học kỳ sẽ không được xét học bổng.

Sinh viên đóng phí BHYT theo thông báo đầu năm học. Thẻ BHYT có giá trị sử dụng khám chữa bệnh tại các cơ sở y tế đã đăng ký ban đầu. Sinh viên thuộc diện chính sách được ngân sách hỗ trợ sẽ nộp minh chứng để hoàn phí.`
  );

  const [strategy, setStrategy] = useState<ChunkingStrategyType>('by_sentences');
  const [chunkSize, setChunkSize] = useState<number>(200);
  const [overlap, setOverlap] = useState<number>(30);
  const [maxSentences, setMaxSentences] = useState<number>(2);

  // Compute Chunks Realtime
  const computedChunks = useMemo(() => {
    if (!sampleText.trim()) return [];

    if (strategy === 'fixed_size') {
      const step = Math.max(1, chunkSize - overlap);
      const chunks: string[] = [];
      for (let start = 0; start < sampleText.length; start += step) {
        chunks.push(sampleText.slice(start, start + chunkSize));
        if (start + chunkSize >= sampleText.length) break;
      }
      return chunks;
    }

    if (strategy === 'by_sentences') {
      const sentences = sampleText
        .split(/(?<=[.!?])\s+|\n+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const chunks: string[] = [];
      for (let i = 0; i < sentences.length; i += maxSentences) {
        chunks.push(sentences.slice(i, i + maxSentences).join(' '));
      }
      return chunks;
    }

    if (strategy === 'recursive') {
      const paragraphs = sampleText.split(/\n\n+/).filter(Boolean);
      const chunks: string[] = [];
      let current = '';

      for (const p of paragraphs) {
        if ((current + '\n\n' + p).length <= chunkSize) {
          current = current ? current + '\n\n' + p : p;
        } else {
          if (current) chunks.push(current);
          if (p.length <= chunkSize) {
            current = p;
          } else {
            const sents = p.split(/(?<=[.!?])\s+/);
            for (const s of sents) {
              if ((current + ' ' + s).length <= chunkSize) {
                current = current ? current + ' ' + s : s;
              } else {
                if (current) chunks.push(current);
                current = s;
              }
            }
          }
        }
      }
      if (current) chunks.push(current);
      return chunks;
    }

    return [];
  }, [sampleText, strategy, chunkSize, overlap, maxSentences]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card-dark p-6 rounded-3xl border border-[#00E676]/30 shadow-emerald-glow">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <i className="fa-solid fa-scissors text-[#00E676]"></i>
          Engine Cắt Nhỏ Văn Bản Trực Quan (Chunking Strategy Visualizer)
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          So sánh trực quan 3 thuật toán phân tách chunk: Kích thước cố định (FixedSize), Ngắt theo ranh giới câu (SentenceChunker) và Phân tách đệ quy (RecursiveChunker).
        </p>
      </div>

      {/* Input & Parameters Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-card-dark p-6 rounded-3xl border border-[#00E676]/20 space-y-3">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block font-bold">
              1. Nhập Văn Bản Thử Nghiệm:
            </label>
            <textarea
              rows={8}
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              className="w-full bg-[#0D0F12] border border-slate-800 rounded-2xl p-3.5 text-slate-200 text-xs font-sans leading-relaxed outline-none focus:border-[#00E676]"
            />
          </div>

          {/* Strategy Selector Pills */}
          <div className="glass-card-dark p-6 rounded-3xl border border-[#00E676]/20 space-y-4">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block font-bold">
              2. Chọn Thuật Toán Chunking Strategy:
            </label>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {[
                { id: 'by_sentences', label: 'Sentence', icon: 'fa-align-left' },
                { id: 'fixed_size', label: 'FixedSize', icon: 'fa-text-width' },
                { id: 'recursive', label: 'Recursive', icon: 'fa-diagram-successor' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStrategy(s.id as any)}
                  className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-1.5 font-bold ${
                    strategy === s.id
                      ? 'bg-[#00E676] text-black border-[#00E676] shadow-emerald-glow'
                      : 'bg-[#161B22] text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <i className={`fa-solid ${s.icon} text-base`}></i>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            {/* Dynamic Tuning Parameters */}
            {strategy === 'by_sentences' && (
              <div className="pt-2 border-t border-slate-800 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Số Câu Tối Đa / Chunk (Max Sentences):</span>
                  <span className="text-[#00E676] font-bold">{maxSentences} câu</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={maxSentences}
                  onChange={(e) => setMaxSentences(Number(e.target.value))}
                  className="w-full accent-[#00E676]"
                />
              </div>
            )}

            {strategy === 'fixed_size' && (
              <div className="pt-2 border-t border-slate-800 space-y-3 font-mono text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Kích Thước Chunk (Chunk Size):</span>
                    <span className="text-[#00E676] font-bold">{chunkSize} ký tự</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={500}
                    step={10}
                    value={chunkSize}
                    onChange={(e) => setChunkSize(Number(e.target.value))}
                    className="w-full accent-[#00E676]"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Độ Phủ Gối (Overlap):</span>
                    <span className="text-[#1DE9B6] font-bold">{overlap} ký tự</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={overlap}
                    onChange={(e) => setOverlap(Number(e.target.value))}
                    className="w-full accent-[#1DE9B6]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Real-time Computed Chunks Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-card-dark p-6 rounded-3xl border border-[#00E676]/30 space-y-4 shadow-emerald-glow">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block font-bold">
                3. Kết Quả Cắt Nhỏ Thực Tế ({computedChunks.length} Chunks):
              </span>
              <span className="px-3 py-1 rounded-full bg-[#0A3A2A] text-[#00E676] border border-[#00E676]/40 font-mono text-xs font-bold">
                Strategy: {strategy}
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {computedChunks.map((chunk, idx) => (
                <div
                  key={idx}
                  className="bg-[#0D0F12] p-4 rounded-2xl border border-slate-800 space-y-2 relative group hover:border-[#00E676]/50 transition-all"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#00E676] font-bold">
                      [Chunk #{idx + 1}] — Length: {chunk.length} chars
                    </span>
                    <span className="text-slate-500">ID: chunk_{idx}</span>
                  </div>
                  <div className="text-slate-200 text-xs font-sans leading-relaxed">
                    {chunk}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
