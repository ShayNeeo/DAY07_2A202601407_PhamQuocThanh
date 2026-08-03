import React from 'react';

export const TeammateCredit: React.FC = () => {
  return (
    <div className="rounded-3xl p-6 banner-gradient text-white shadow-emerald-glow relative overflow-hidden mb-6 border border-[#00E676]/40">
      {/* Background Glow Mesh & 3D Glass Geometry Effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-[#00E5FF]/25 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      
      {/* 3D Glass Icon Decoration matching mobile mockups */}
      <div className="absolute -right-6 -bottom-6 w-48 h-48 opacity-20 pointer-events-none transform rotate-12">
        <i className="fa-solid fa-cube text-[160px] text-[#00E676]"></i>
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center space-x-2.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#00E676] text-black shadow-md">
              KARPAUS / AGY RAG STUDIO
            </span>
            <span className="text-xs font-mono text-slate-300">Bài Lab 07 — Biến Thể K3</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mt-1">
            THE FUTURE ASSETS OF RAG & K3 KNOWLEDGE
          </h2>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
            Ghi nhận đóng góp xuất sắc của đồng đội <strong className="text-[#00E676]">Thành An (MSSV: 01017)</strong> trong việc phát triển Data Engine, Pipeline làm sạch dữ liệu Regex & Module trích xuất Tam diện Đồ thị Tri thức (Triples Extractor). Tích hợp trực tiếp vào Kiến trúc RAG & Trình kiểm tra Vector Store của Trưởng nhóm <strong className="text-[#1DE9B6]">Phạm Quốc Thanh (2A202601407)</strong>.
          </p>
        </div>

        {/* Action Button & Badges matching promotional banner JOIN NOW button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <div className="flex flex-col space-y-1.5 font-mono text-xs">
            <span className="px-3.5 py-1.5 rounded-xl bg-[#0A3A2A]/90 text-[#00E676] border border-[#00E676]/40 flex items-center gap-2 font-bold shadow-sm">
              <i className="fa-solid fa-circle-check text-sm"></i> 14 File Văn Bản Real Data
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-[#022C22]/90 text-[#1DE9B6] border border-[#1DE9B6]/40 flex items-center gap-2 font-bold shadow-sm">
              <i className="fa-solid fa-project-diagram text-sm"></i> 11 Tam Diện Triples Mined
            </span>
          </div>

          <button className="px-6 py-3 rounded-full bg-[#00E676] text-black font-bold text-xs hover:bg-white transition-all shadow-emerald-glow flex items-center gap-2">
            <span>BẮT ĐẦU KHÁM PHÁ</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
