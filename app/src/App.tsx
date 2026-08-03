import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { TeammateCredit } from './components/TeammateCredit';
import { LessonTutor } from './components/LessonTutor';
import { CorpusManager } from './components/CorpusManager';
import { ChunkingVisualizer } from './components/ChunkingVisualizer';
import { VectorStoreInspector } from './components/VectorStoreInspector';
import { ABFilterSimulator } from './components/ABFilterSimulator';
import { RAGPlayground } from './components/RAGPlayground';
import { KnowledgeGraphViewer } from './components/KnowledgeGraphViewer';

import { INITIAL_DOCUMENTS } from './data/initialCorpus';
import type { RawDocument, ChunkRecord } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('tutor');
  const [documents, setDocuments] = useState<RawDocument[]>(INITIAL_DOCUMENTS);

  // Multi-granularity Paragraph Chunking over all active documents
  const allChunks = useMemo<ChunkRecord[]>(() => {
    const records: ChunkRecord[] = [];

    documents.forEach((doc) => {
      const paragraphs = doc.content.split(/\n\n+/).filter((p) => p.trim().length > 0);
      let indexCounter = 0;

      paragraphs.forEach((p) => {
        const text = p.trim();
        if (text.length > 200) {
          const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
          for (let i = 0; i < sentences.length; i += 2) {
            const chunkText = sentences.slice(i, i + 2).join(' ');
            records.push({
              id: `${doc.id}-c${indexCounter}`,
              doc_id: doc.id,
              content: chunkText,
              metadata: { ...doc.metadata },
              chunk_index: indexCounter++,
            });
          }
        } else {
          records.push({
            id: `${doc.id}-c${indexCounter}`,
            doc_id: doc.id,
            content: text,
            metadata: { ...doc.metadata },
            chunk_index: indexCounter++,
          });
        }
      });
    });

    return records;
  }, [documents]);

  const handleAddDocument = (newDoc: RawDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  return (
    <div className="min-h-screen bg-[#0D0F12] text-slate-100 flex flex-col font-sans selection:bg-[#00E676] selection:text-black">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalDocs={documents.length}
        totalChunks={allChunks.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Only show TeammateCredit banner on default tab (01. Bài Giảng Giáo Sư) */}
        {activeTab === 'tutor' && <TeammateCredit />}

        {activeTab === 'tutor' && <LessonTutor />}

        {activeTab === 'corpus' && (
          <CorpusManager
            documents={documents}
            onAddDocument={handleAddDocument}
            onDeleteDocument={handleDeleteDocument}
          />
        )}

        {activeTab === 'chunking' && <ChunkingVisualizer />}

        {activeTab === 'vectorstore' && (
          <VectorStoreInspector chunks={allChunks} onDeleteDoc={handleDeleteDocument} />
        )}

        {activeTab === 'abfilter' && <ABFilterSimulator chunks={allChunks} />}

        {activeTab === 'rag' && <RAGPlayground chunks={allChunks} />}

        {activeTab === 'graph' && <KnowledgeGraphViewer />}
      </main>

      <footer className="glass-card-dark border-t border-slate-800/80 py-4 text-center text-xs font-mono text-slate-400">
        AGY RAG Studio Desktop — Nền Tảng Dữ Liệu K3 | Lead: Phạm Quốc Thanh (2A202601407) • ETL: Thành An (01017)
      </footer>
    </div>
  );
}

export default App;
