import React, { useState } from 'react';
import type { RawDocument } from '../types';

interface CorpusManagerProps {
  documents: RawDocument[];
  onAddDocument: (doc: RawDocument) => void;
  onDeleteDocument: (docId: string) => void;
}

export const CorpusManager: React.FC<CorpusManagerProps> = ({
  documents,
  onAddDocument,
  onDeleteDocument,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<RawDocument | null>(documents[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newId, setNewId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newAudience, setNewAudience] = useState<'student' | 'faculty' | 'staff' | 'all'>('student');
  const [newDepartment, setNewDepartment] = useState('academic-affairs');
  const [newContent, setNewContent] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId || !newTitle || !newContent) return;

    const doc: RawDocument = {
      id: newId.toLowerCase().replace(/\s+/g, '-'),
      title: newTitle,
      metadata: {
        doc_id: newId.toLowerCase().replace(/\s+/g, '-'),
        title: newTitle,
        audience: newAudience,
        department: newDepartment,
        language: 'vi',
        source_url: `https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/${newId}`,
        retrieved_at: new Date().toISOString().split('T')[0],
        document_version: '2026.1',
      },
      content: newContent,
    };

    onAddDocument(doc);
    setSelectedDoc(doc);
    setShowAddModal(false);

    setNewId('');
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card-dark p-6 rounded-3xl border border-[#00E676]/30 shadow-emerald-glow">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-folder-tree text-[#00E676]"></i>
            Quản Lý Tập Văn Bản Quy Định (Corpus Manager — {documents.length} Files)
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Kiểm tra YAML Frontmatter Metadata, nguồn trích dẫn và quản lý tài liệu quy định VinUni cào thực tế.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-full bg-[#00E676] text-black font-bold text-xs hover:bg-white transition-all shadow-emerald-glow flex items-center gap-2 shrink-0"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Thêm Văn Bản Mới</span>
        </button>
      </div>

      {/* Grid: Document List & Metadata Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document List */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block font-bold">
            Danh Sách Văn Bản Quy Định ({documents.length}):
          </span>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {documents.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#0A3A2A] border-[#00E676] shadow-emerald-glow text-white'
                      : 'glass-card-dark border-slate-800 hover:border-[#00E676]/40 text-slate-300'
                  }`}
                >
                  <div className="truncate space-y-1">
                    <h3 className="text-xs sm:text-sm font-bold truncate">{doc.title}</h3>
                    <div className="flex items-center space-x-2 text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded-full bg-[#161B22] text-[#00E676] border border-[#00E676]/30">
                        {doc.id}
                      </span>
                      <span className="text-slate-400">Audience: {doc.metadata.audience}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDocument(doc.id);
                      if (selectedDoc?.id === doc.id) setSelectedDoc(null);
                    }}
                    className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-all ml-2"
                  >
                    <i className="fa-solid fa-trash text-xs"></i>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Document Details & YAML Inspector */}
        <div className="lg:col-span-7 space-y-4">
          {selectedDoc ? (
            <div className="glass-card-dark p-6 rounded-3xl border border-[#00E676]/30 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#0A3A2A] text-[#00E676] border border-[#00E676]/40 font-bold">
                    YAML FRONTMATTER INSPECTOR
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{selectedDoc.title}</h3>
                </div>
                <span className="text-xs font-mono text-[#1DE9B6] font-bold">id: {selectedDoc.id}</span>
              </div>

              {/* YAML Metadata Preview */}
              <div className="bg-[#0D0F12] p-4 rounded-2xl border border-slate-800 font-mono text-xs text-[#00E676] space-y-1">
                <div>---</div>
                <div>doc_id: {selectedDoc.metadata.doc_id}</div>
                <div>title: "{selectedDoc.metadata.title}"</div>
                <div>audience: {selectedDoc.metadata.audience}</div>
                <div>department: {selectedDoc.metadata.department}</div>
                <div>language: {selectedDoc.metadata.language}</div>
                <div>source_url: {selectedDoc.metadata.source_url}</div>
                <div>retrieved_at: {selectedDoc.metadata.retrieved_at}</div>
                <div>document_version: {selectedDoc.metadata.document_version}</div>
                <div>---</div>
              </div>

              {/* Full Raw Markdown Content */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block font-bold">
                  Nội Dung Văn Bản Thực Tế (Raw Text Content):
                </span>
                <div className="bg-[#0D0F12] p-4 rounded-2xl border border-slate-800 text-slate-200 text-xs font-sans leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
                  {selectedDoc.content}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card-dark p-8 rounded-3xl border border-slate-800 text-center text-slate-500 font-mono text-xs">
              Chọn một văn bản từ danh sách bên trái để kiểm tra chi tiết.
            </div>
          )}
        </div>
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card-dark p-6 rounded-3xl border border-[#00E676]/40 max-w-xl w-full space-y-4 shadow-emerald-glow">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-file-circle-plus text-[#00E676]"></i>
                Thêm Văn Bản Quy Định Mới
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <i className="fa-solid fa-xmark text-base"></i>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Doc ID (Unique Slug):</label>
                  <input
                    type="text"
                    required
                    placeholder="vinuni-quy-dinh-moi"
                    value={newId}
                    onChange={(e) => setNewId(e.target.value)}
                    className="w-full bg-[#0D0F12] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-[#00E676]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Đối Tượng (Audience):</label>
                  <select
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value as any)}
                    className="w-full bg-[#0D0F12] border border-slate-800 rounded-xl p-2.5 text-[#00E676] outline-none focus:border-[#00E676]"
                  >
                    <option value="student">student (Sinh viên)</option>
                    <option value="faculty">faculty (Giảng viên)</option>
                    <option value="staff">staff (Cán bộ)</option>
                    <option value="all">all (Tất cả)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tên Tiêu Đề Văn Bản:</label>
                <input
                  type="text"
                  required
                  placeholder="Quy định hỗ trợ học tập sinh viên VinUni"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0D0F12] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-[#00E676] font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nội Dung Văn Bản (Raw Markdown Text):</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Nhập nội dung các điều khoản quy định..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-[#0D0F12] border border-slate-800 rounded-xl p-3 text-slate-200 outline-none focus:border-[#00E676] font-sans text-xs"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[#00E676] text-black font-bold hover:bg-white shadow-emerald-glow"
                >
                  Thêm Vào Kho Corpus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
