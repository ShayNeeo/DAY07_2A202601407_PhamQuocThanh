"""
bench.py — Script đánh giá truy xuất (benchmark) cho Giai đoạn 2.

Chạy 5 câu hỏi đánh giá đã thống nhất trên tập tài liệu corpus `data/k3_university/`.
"""
from pathlib import Path
from src import _mock_embed, SentenceChunker, KnowledgeBaseAgent
from ingest import build_knowledge_base

DATA_DIR = Path("data/k3_university")

BENCHMARK_QUERIES = [
    {
        "id": 1,
        "query": "Sinh viên đạt kết quả học tập và rèn luyện thế nào thì được xét học bổng khuyến khích?",
        "filter": None,
    },
    {
        "id": 2,
        "query": "Thời hạn nộp học phí học kỳ I là khi nào và nếu nộp trễ hạn sẽ bị xử lý như thế nào?",
        "filter": None,
    },
    {
        "id": 3,
        "query": "Giờ đóng mở cổng ký túc xá và các hành vi bị cấm trong phòng nội trú là gì?",
        "filter": None,
    },
    {
        "id": 4,
        "query": "Điều kiện và thủ tục để sinh viên sử dụng dịch vụ mượn sách tại thư viện?",
        "filter": None,
    },
    {
        "id": 5,
        "query": "Các quy định áp dụng riêng cho sinh viên khi bị trùng lịch học phần?",
        "filter": {"audience": "student"},
    },
]


def run_benchmark():
    chunker = SentenceChunker(max_sentences_per_chunk=2)
    embedding_fn = _mock_embed

    print("=== BAT DAU RUN BENCHMARK ===")
    print(f"Strategy: SentenceChunker (max_sentences_per_chunk=2)")
    print(f"Corpus: {DATA_DIR}")

    store = build_knowledge_base(DATA_DIR, embedding_fn, chunker=chunker)
    total_chunks = store.get_collection_size()
    print(f"Tong so chunk da nap vao Vector Store: {total_chunks}\n")

    def simple_llm(prompt: str) -> str:
        return f"[Agent Answer] Context extracted successfully. ({len(prompt)} chars prompt)"

    agent = KnowledgeBaseAgent(store=store, llm_fn=simple_llm)

    for item in BENCHMARK_QUERIES:
        q_id = item["id"]
        query = item["query"]
        metadata_filter = item["filter"]

        print(f"--- Query {q_id}: {query} ---")
        if metadata_filter:
            print(f"    [Filter Applied]: {metadata_filter}")
            results = store.search_with_filter(query, top_k=3, metadata_filter=metadata_filter)
        else:
            results = store.search(query, top_k=3)

        print(f"    Top-3 Retrieved Chunks:")
        for idx, res in enumerate(results, 1):
            doc_id = res["metadata"].get("doc_id", res.get("id"))
            score = res.get("score", 0.0)
            preview = res.get("content", "").replace("\n", " ")[:80]
            print(f"      {idx}. [Score: {score:.4f}] doc_id: {doc_id} | Preview: {preview}...")

        answer = agent.answer(query, top_k=3)
        print(f"    Agent Response: {answer}\n")

    print("=== BENCHMARK HOAN THANH ===")


if __name__ == "__main__":
    run_benchmark()
