import React, { useState } from 'react';

export const LessonTutor: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'module1' | 'module2' | 'module3' | 'module4'>('module1');

  return (
    <div className="space-y-6">
      {/* Module Header & Selector */}
      <div className="glass-card-dark p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#00E676]/30 shadow-emerald-glow">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-[#0A3A2A] text-[#00E676] font-mono text-xs border border-[#00E676]/40 font-bold">
              BÀI GIẢNG CHUYÊN SÂU GIÁO SƯ (100% TIẾNG VIỆT)
            </span>
            <span className="text-xs font-mono text-slate-400">Lab 07 — K3 Data Foundations</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1.5 font-sans">
            Giáo Trình Thuật Toán & Logic Kỹ Thuật Kiến Trúc RAG
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Phân tích chi tiết toán học, thuật toán phân tách văn bản, cơ chế xếp hạng vector, kỹ thuật chống bốc phét prompt và chuẩn đoán lỗi hệ thống.
          </p>
        </div>

        {/* Module Switcher Tabs */}
        <div className="flex flex-wrap gap-2 bg-[#161B22] p-1.5 rounded-2xl border border-slate-800 text-xs font-mono">
          {[
            { id: 'module1', label: 'Bài 1: Chunking Strategies', icon: 'fa-scissors' },
            { id: 'module2', label: 'Bài 2: Vector DB & Pre-Filter', icon: 'fa-layer-group' },
            { id: 'module3', label: 'Bài 3: Prompt & Grounding', icon: 'fa-robot' },
            { id: 'module4', label: 'Bài 4: Diagnostic Checklist', icon: 'fa-stethoscope' }
          ].map((m) => {
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id as any)}
                className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 font-semibold ${
                  isActive
                    ? 'bg-[#00E676] text-black font-bold shadow-emerald-glow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <i className={`fa-solid ${m.icon}`}></i>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MODULE 1: CHUNKING MATH & STRATEGIES */}
      {activeModule === 'module1' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card-dark p-6 rounded-3xl border border-[#00E676]/20 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0A3A2A] text-[#00E676] flex items-center justify-center text-lg font-bold border border-[#00E676]/40 shadow-emerald-glow">
                1
              </div>
              <h3 className="text-base font-bold text-white">FixedSizeChunker (Kích Thước Cố Định)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tách văn bản dựa trên số ký tự hoặc số token cố định (ví dụ 100 ký tự/chunk, overlap 20 ký tự). Đơn giản, tốc độ xử lý nhanh tuyệt đối.
              </p>
              <div className="bg-[#0D0F12] p-3 rounded-2xl border border-slate-800 text-[11px] font-mono text-[#00E676]">
                ⚠️ Rủi ro: Có thể cắt đôi một câu quy định ngay giữa chừng, làm hỏng cú pháp ngữ nghĩa.
              </div>
            </div>

            <div className="glass-card-dark p-6 rounded-3xl border border-[#00E676]/30 space-y-3 shadow-emerald-glow">
              <div className="w-10 h-10 rounded-2xl bg-[#00E676] text-black flex items-center justify-center text-lg font-bold shadow-lg">
                2
              </div>
              <h3 className="text-base font-bold text-white">SentenceChunker (Tách Theo Câu - Khuyên Dùng)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sử dụng Regex Regex Lookbehind <code className="text-[#00E676] font-mono">(?&lt;=[.!?])\s+</code> để tôn trọng ranh giới câu. Nhóm N câu hoàn chỉnh vào một chunk.
              </p>
              <div className="bg-[#0A3A2A] p-3 rounded-2xl border border-[#00E676]/40 text-[11px] font-mono text-[#00E676]">
                ✅ Ưu điểm: Bảo toàn trọn vẹn ngữ nghĩa điều khoản học thuật VinUni.
              </div>
            </div>

            <div className="glass-card-dark p-6 rounded-3xl border border-[#00E676]/20 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0A3A2A] text-[#1DE9B6] flex items-center justify-center text-lg font-bold border border-[#1DE9B6]/40">
                3
              </div>
              <h3 className="text-base font-bold text-white">RecursiveChunker (Đệ Quy Cấu Trúc)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Thử nghiệm phân tách theo thứ tự ưu tiên: Dấu ngắt đoạn Markdown (`\n\n`), Dấu ngắt dòng (`\n`), Dấu câu (`. `), và Dấu cách (` `).
              </p>
              <div className="bg-[#0D0F12] p-3 rounded-2xl border border-slate-800 text-[11px] font-mono text-[#1DE9B6]">
                🎯 Tối ưu: Dành cho các tài liệu Markdown dài có tiêu đề H1/H2 rõ ràng.
              </div>
            </div>
          </div>

          {/* Deep Dive Formula */}
          <div className="glass-card-dark p-6 rounded-3xl border border-[#00E676]/20 space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-calculator text-[#00E676]"></i>
              Công Thức Toán Học Tính Toán Độ Tương Đồng Cosine (Cosine Similarity Math)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Mô hình <code className="text-[#00E676] font-mono">Gemini Embedding 2</code> mã hóa câu văn thành Vector 3,072 chiều. Độ tương đồng góc giữa Vector câu hỏi <code className="text-[#1DE9B6]">u</code> và Vector chunk <code className="text-[#00E5FF]">v</code> được tính bằng công thức:
            </p>
            <div className="bg-[#0D0F12] p-4 rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm text-[#00E676] text-center tracking-wider">
              Similarity(u, v) = (u · v) / (||u||₂ × ||v||₂) = (∑ uᵢ vᵢ) / (√(∑ uᵢ²) × √(∑ vᵢ²))
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: VECTOR STORE & FILTERING */}
      {activeModule === 'module2' && (
        <div className="glass-card-dark p-6 rounded-3xl border border-[#00E676]/20 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-filter text-[#00E676]"></i>
            So Sánh Kiến Trúc Pre-Filtering (Lọc Trước) vs Post-Filtering (Lọc Sau)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-[#0A3A2A]/80 p-5 rounded-2xl border border-[#00E676]/40 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#00E676] text-black font-mono text-[10px] font-bold">
                PRE-FILTERING (LỌC TRƯỚC VÙNG NỘI DUNG)
              </span>
              <h4 className="text-sm font-bold text-white">Lọc Metadata Trước Khi Tính Vector Search</h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                Hệ thống thực hiện câu lệnh SQL/Metadata Filter <code className="text-[#00E676] font-mono">WHERE audience = 'student'</code> TRƯỚC, loại bỏ hoàn toàn các tài liệu dành cho giảng viên/cán bộ. Sau đó mới tính độ tương đồng Cosine trên không gian vector đã được thu hẹp.
              </p>
              <div className="text-[11px] font-mono text-[#00F5A0] font-bold">
                ✅ Kết quả: Triệt tiêu 100% nhiễu tài liệu sai đối tượng (Noise Reduction).
              </div>
            </div>

            <div className="bg-[#161B22] p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] font-bold">
                POST-FILTERING (LỌC SAU KHI SEARCH)
              </span>
              <h4 className="text-sm font-bold text-slate-200">Tìm Kiếm Top-K Vector Toàn Bộ Rồi Mới Lọc</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hệ thống lấy Top-3 Vector có độ tương đồng cao nhất trên toàn bộ DB, sau đó mới lọc theo metadata. Nếu Top-3 ban đầu chứa nhiều tài liệu ngoài đối tượng, số lượng chunk thu được sau khi lọc sẽ bị thiếu hụt nghiêm trọng.
              </p>
              <div className="text-[11px] font-mono text-amber-400 font-bold">
                ⚠️ Hạn chế: Dễ bỏ sót các đoạn quy định quan trọng.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: PROMPT ENGINEERING & GROUNDING */}
      {activeModule === 'module3' && (
        <div className="glass-card-dark p-6 rounded-3xl border border-[#00E676]/20 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-shield-halved text-[#00E676]"></i>
            Kỹ Thuật Chống "Bốc Phét" (Anti-Hallucination Prompt Engineering)
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Để đảm bảo mô hình <code className="text-[#00E676] font-mono">gemma-4-26b-a4b-it</code> trả lời chính xác 100% theo dữ liệu cào thực tế từ VinUni Registrar, chúng ta sử dụng chỉ thị hệ thống Strict Grounding Prompt:
          </p>

          <div className="bg-[#0D0F12] p-4 rounded-2xl border border-slate-800 font-mono text-xs text-[#00E676] space-y-2 leading-relaxed">
            <div className="text-slate-400">// Strict Grounding System Prompt Wrapper:</div>
            <div>"Bạn là Giáo sư Chuyên gia Tư vấn Quy định Học thuật Đại học VinUni.</div>
            <div>Hãy trả lời câu hỏi của người dùng CHỈ dựa trên Ngữ cảnh được cung cấp dưới đây.</div>
            <div>- Bắt buộc trả lời hoàn toàn bằng TIẾNG VIỆT, văn phong lịch sự, trang trọng.</div>
            <div>- Trích dẫn chính xác tên tài liệu [Source N] cho từng ý trả lời.</div>
            <div className="text-[#00F5A0] font-bold">- Nếu Ngữ cảnh không đủ bằng chứng, bắt buộc trả lời: 'Tôi không có đủ thông tin trong tài liệu để trả lời.'"</div>
          </div>
        </div>
      )}

      {/* MODULE 4: DIAGNOSTIC CHECKLIST */}
      {activeModule === 'module4' && (
        <div className="glass-card-dark p-6 rounded-3xl border border-[#00E676]/20 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-stethoscope text-[#00E676]"></i>
            Bảng Chuẩn Đoán Lỗi Hệ Thống RAG (Diagnostic Checklist)
          </h3>
          
          <div className="space-y-3">
            {[
              { error: '1. Mô hình trả lời "Tôi không có đủ thông tin"', cause: 'Thiếu file văn bản tương ứng trong kho tài liệu ban đầu hoặc Top-K quá nhỏ.', fix: 'Bổ sung file quy định vào data/k3_university/ và tăng Top-K từ 3 lên 5.' },
              { error: '2. Trả lời bị nhầm lẫn giữa quy định Sinh viên và Giảng viên', cause: 'Chưa áp dụng Pre-Filter Metadata làm xuất hiện nhiễu tài liệu.', fix: 'Bật tùy chọn Pre-Filter với metadata filter audience="student".' },
              { error: '3. Chunk bị cắt nửa chừng làm mất nội dung câu', cause: 'Sử dụng FixedSizeChunker với kích thước quá ngắn.', fix: 'Chuyển sang SentenceChunker ngắt theo dấu chấm câu.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#161B22] p-4 rounded-2xl border border-slate-800 space-y-1 font-mono text-xs">
                <div className="text-[#00E676] font-bold">{item.error}</div>
                <div className="text-slate-300">🔍 Nguyên nhân: {item.cause}</div>
                <div className="text-[#1DE9B6]">🛠️ Khắc phục: {item.fix}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
