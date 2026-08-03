# Báo Cáo Cá Nhân — Lab 7: Embedding & Vector Store

**Họ tên:** Phạm Quốc Thanh
**MSSV / Nhóm:** 2A202601407 — K3 (Trưởng nhóm)
**Ngày:** 03/08/2026

> **Nộp 1 bản / sinh viên.** Phần nhóm (lựa chọn tài liệu, thiết kế chiến lược, bộ câu hỏi đánh giá, demo) nộp chung 1 bản trong `REPORT_NHOM.md`. Chi tiết thang điểm: `docs/SCORING.md`.

**Tổng điểm phần cá nhân: 60** = Khởi động (5) + Hướng tiếp cận (10) + Hoàn thiện code (30) + Dự đoán độ tương tự (5) + Kết quả truy xuất của tôi (10).

---

## 1. Khởi động (Warm-up) — Cá nhân (5 điểm)

### Độ tương tự Cosine (Cosine Similarity) (Bài tập 1.1)

**Độ tương tự cosine cao (High cosine similarity) nghĩa là gì?**
> Độ tương tự cosine cao có nghĩa là hai vector nhúng (text embeddings) chỉ về cùng một hướng trong không gian đa chiều, đại diện cho việc hai đoạn văn bản có nội dung và ý nghĩa ngữ nghĩa rất tương đồng với nhau.

**Ví dụ có độ tương tự CAO:**
- Câu A: "Sinh viên cần nộp đơn xin chuyển đổi chuyên ngành tại Phòng Registrar I114."
- Câu B: "Người học có nguyện vọng đổi ngành nộp thủ tục hồ sơ trực tiếp tại Văn phòng Quản lý Đào tạo I114."
- Tại sao tương đồng: Cả hai câu đều diễn đạt cùng một ý nghĩa quy định về thủ tục và địa điểm nộp đơn chuyển đổi chuyên ngành VinUni.

**Ví dụ có độ tương tự THẤP:**
- Câu A: "Tiêu chuẩn xét cấp Học bổng Tài năng 100% là GPA từ 3.8/4.0 trở lên."
- Câu B: "Mô hình ngôn ngữ Gemma 4 hỗ trợ xử lý ngữ cảnh đa ngôn ngữ 26B tham số."
- Tại sao khác: Câu A đề cập đến chính sách học bổng học thuật VinUni, trong khi câu B thuộc lĩnh vực trí tuệ nhân tạo và kiến trúc LLM.

**Tại sao độ tương tự cosine (cosine similarity) được ưu tiên hơn khoảng cách Euclid (Euclidean distance) cho text embeddings?**
> Độ tương tự cosine chỉ tập trung đo góc giữa hai vector mà không phụ thuộc vào độ dài (magnitude) của chúng. Do độ dài của các đoạn văn quy định VinUni có thể biến thiên ngắn dài khác nhau, khoảng cách Euclid bị ảnh hưởng bởi số lượng từ trong khi Cosine Similarity phản ánh độ tương đồng về ngữ nghĩa một cách khách quan và chính xác hơn.

### Bài toán tính toán Chunking (Bài tập 1.2)

**Tài liệu 10,000 ký tự, chunk_size=500, overlap=50. Bao nhiêu chunks?**
> *Trình bày phép tính:*
> - Độ dài bước nhảy (step): `chunk_size - overlap` = 500 - 50 = 450 ký tự.
> - Công thức: `math.ceil((10000 - 50) / 450)` = `math.ceil(9950 / 450)` = `math.ceil(22.111)` = 23.
> *Đáp án:* **23 chunks**.

**Nếu độ chồng chéo (overlap) tăng lên 100, số lượng chunk thay đổi thế nào? Tại sao muốn độ chồng chéo nhiều hơn?**
> Phép tính khi `overlap=100`: `step` = 500 - 100 = 400. `math.ceil((10000 - 100) / 400)` = `math.ceil(9900 / 400)` = `math.ceil(24.75)` = 25 chunks (tăng thêm 2 chunks). Tăng độ chồng chéo giúp giữ trọn vẹn ngữ cảnh ở ranh giới giữa các chunk, tránh việc ý nghĩa hoặc điều khoản quy định quan trọng bị cắt ngang làm giảm chất lượng truy xuất.

---

## 2. Hướng tiếp cận của tôi (My Approach) — Cá nhân (10 điểm)

### Các hàm chia nhỏ (Chunking Functions)

**`SentenceChunker.chunk`** — hướng tiếp cận:
> Sử dụng Lookbehind Regex `re.split(r'(?<=[.!?])\s+|\n+', text)` để phân tách câu dựa trên ranh giới các dấu chấm, chấm cảm, chấm hỏi hoặc xuống dòng. Xử lý loại bỏ các đoạn rỗng, sau đó gom các câu đã làm sạch thành các chunk chứa tối đa `max_sentences_per_chunk` câu (mặc định 2 câu). Đảm bảo giữ trọn vẹn từng câu điều khoản quy định VinUni.

**`RecursiveChunker.chunk` / `_split`** — hướng tiếp cận:
> Áp dụng thuật toán chia đệ quy với danh sách ưu tiên dấu phân cách `["\n\n", "\n", ". ", " ", ""]`. Với các đoạn vượt quá `chunk_size`, tiếp tục gọi đệ quy với dấu phân cách kế tiếp và gộp các sub-chunks lại sao cho tổng độ dài mỗi chunk không vượt `chunk_size`.

### Lớp EmbeddingStore

**`add_documents` + `search`** — hướng tiếp cận:
> Trong `add_documents`, mỗi `Document` được nhúng thành vector (thông qua `MockEmbedder` hash MD5 64D hoặc `gemini-embedding-2` 3072D API) và lưu dưới dạng dictionary record chứa `id`, `content`, `metadata` (bổ sung `doc_id`). Trong `search`, vector query được tính độ tương đồng Cosine Similarity với mọi vector trong store, sắp xếp giảm dần theo score và trả về top-k.

**`search_with_filter` + `delete_document`** — hướng tiếp cận:
> Trong `search_with_filter`, tiến hành tiền lọc (pre-filter) danh sách records dựa trên `metadata_filter` (ví dụ `audience: student`) trước khi thực hiện similarity search. Với `delete_document`, duyệt qua store và lọc bỏ tất cả các chunk thuộc `doc_id` cần xóa.

### Tác tử KnowledgeBaseAgent

**`answer`** — hướng tiếp cận:
> Gọi `store.search(question, top_k)` để thu thập top-k chunk liên quan nhất. Ghép các nội dung chunk lại thành ngữ cảnh `Context:\n...` rồi gửi tới LLM `gemma-4-26b-a4b-it` với Strict Grounding Prompt để sinh câu trả lời Tiếng Việt chính xác kèm trích dẫn `[Source N]`.

---

## 3. Hoàn thiện code (Core Implementation) — Cá nhân (30 điểm)

### Kết Quả Kiểm Thử Thực Tế (Test Results)

```
============================= test session starts ==============================
platform linux -- Python 3.11.15, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/shayneeo/Downloads/Documents/Coding/AI_in_Action/Day_8/Morning/K3-Day07-Data-Foundations
collected 42 items

tests/test_solution.py::TestProjectStructure::test_root_main_entrypoint_exists PASSED [  2%]
tests/test_solution.py::TestProjectStructure::test_src_package_exists PASSED [  4%]
tests/test_solution.py::TestClassBasedInterfaces::test_chunker_classes_exist PASSED [  7%]
tests/test_solution.py::TestClassBasedInterfaces::test_mock_embedder_exists PASSED [  9%]
tests/test_solution.py::TestFixedSizeChunker::test_chunks_respect_size PASSED [ 11%]
tests/test_solution.py::TestFixedSizeChunker::test_correct_number_of_chunks_no_overlap PASSED [ 14%]
tests/test_solution.py::TestFixedSizeChunker::test_empty_text_returns_empty_list PASSED [ 16%]
tests/test_solution.py::TestFixedSizeChunker::test_no_overlap_no_shared_content PASSED [ 19%]
tests/test_solution.py::TestFixedSizeChunker::test_overlap_creates_shared_content PASSED [ 21%]
tests/test_solution.py::TestFixedSizeChunker::test_returns_list PASSED   [ 23%]
tests/test_solution.py::TestFixedSizeChunker::test_single_chunk_if_text_shorter PASSED [ 26%]
tests/test_solution.py::TestSentenceChunker::test_chunks_are_strings PASSED [ 28%]
tests/test_solution.py::TestSentenceChunker::test_respects_max_sentences PASSED [ 30%]
tests/test_solution.py::TestSentenceChunker::test_returns_list PASSED    [ 33%]
tests/test_solution.py::TestSentenceChunker::test_single_sentence_max_gives_many_chunks PASSED [ 35%]
tests/test_solution.py::TestRecursiveChunker::test_chunks_within_size_when_possible PASSED [ 38%]
tests/test_solution.py::TestRecursiveChunker::test_empty_separators_falls_back_gracefully PASSED [ 40%]
tests/test_solution.py::TestRecursiveChunker::test_handles_double_newline_separator PASSED [ 42%]
tests/test_solution.py::TestRecursiveChunker::test_returns_list PASSED   [ 45%]
tests/test_solution.py::TestEmbeddingStore::test_add_documents_increases_size PASSED [ 47%]
tests/test_solution.py::TestEmbeddingStore::test_add_more_increases_further PASSED [ 50%]
tests/test_solution.py::TestEmbeddingStore::test_initial_size_is_zero PASSED [ 52%]
tests/test_solution.py::TestEmbeddingStore::test_search_results_have_content_key PASSED [ 54%]
tests/test_solution.py::TestEmbeddingStore::test_search_results_have_score_key PASSED [ 57%]
tests/test_solution.py::TestEmbeddingStore::test_search_results_sorted_by_score_descending PASSED [ 59%]
tests/test_solution.py::TestEmbeddingStore::test_search_returns_at_most_top_k PASSED [ 61%]
tests/test_solution.py::TestEmbeddingStore::test_search_returns_list PASSED [ 64%]
tests/test_solution.py::TestKnowledgeBaseAgent::test_answer_non_empty PASSED [ 66%]
tests/test_solution.py::TestKnowledgeBaseAgent::test_answer_returns_string PASSED [ 69%]
tests/test_solution.py::TestComputeSimilarity::test_identical_vectors_return_1 PASSED [ 71%]
tests/test_solution.py::TestComputeSimilarity::test_opposite_vectors_return_minus_1 PASSED [ 73%]
tests/test_solution.py::TestComputeSimilarity::test_orthogonal_vectors_return_0 PASSED [ 76%]
tests/test_solution.py::TestComputeSimilarity::test_zero_vector_returns_0 PASSED [ 78%]
tests/test_solution.py::TestCompareChunkingStrategies::test_counts_are_positive PASSED [ 80%]
tests/test_solution.py::TestCompareChunkingStrategies::test_each_strategy_has_count_and_avg_length PASSED [ 83%]
tests/test_solution.py::TestCompareChunkingStrategies::test_returns_three_strategies PASSED [ 85%]
tests/test_solution.py::TestEmbeddingStoreSearchWithFilter::test_filter_by_department PASSED [ 88%]
tests/test_solution.py::TestEmbeddingStoreSearchWithFilter::test_no_filter_returns_all_candidates PASSED [ 90%]
tests/test_solution.py::TestEmbeddingStoreSearchWithFilter::test_returns_at_most_top_k PASSED [ 92%]
tests/test_solution.py::TestEmbeddingStoreDeleteDocument::test_delete_reduces_collection_size PASSED [ 95%]
tests/test_solution.py::TestEmbeddingStoreDeleteDocument::test_delete_returns_false_for_nonexistent_doc PASSED [ 97%]
tests/test_solution.py::TestEmbeddingStoreDeleteDocument::test_delete_returns_true_for_existing_doc PASSED [100%]

============================== 42 passed in 0.05s ==============================
```

**Số lượng bài test vượt qua (pass):** **42** / 42

---

## 4. Dự đoán độ tương tự (Similarity Predictions) — Cá nhân (5 điểm)

| Cặp | Câu A | Câu B | Dự đoán | Điểm thực tế (`MockEmbedder`) | Đúng? |
|------|-----------|-----------|---------|--------------|-------|
| 1 | Lập trình Python rất thú vị. | Python là ngôn ngữ lập trình phổ biến. | cao | 0.0858 | Đúng |
| 2 | Thư viện mở cửa từ 8h đến 21h. | Đăng ký môn học qua cổng thông tin sinh viên. | thấp | -0.0284 | Đúng |
| 3 | Học bổng khuyến khích học tập. | Chính sách trợ cấp cho sinh viên. | cao | 0.2781 | Đúng |
| 4 | Mèo là động vật nuôi trong nhà. | Mô hình ngôn ngữ lớn xử lý văn bản. | thấp | -0.0220 | Đúng |
| 5 | Quy định về thời hạn đóng học phí. | Thời gian nộp lệ phí học tập. | cao | -0.1075 | Bất ngờ |

**Kết quả bất ngờ nhất:** Cặp số 5 có kết quả tương đồng âm (`-0.1075`) do `MockEmbedder` sử dụng MD5 hash ngẫu nhiên theo chuỗi ký tự thay vì mô hình ngữ nghĩa thực sự.

---

## 5. Kết quả truy xuất thực tế từ Live API Gemini Embedding 2 & Gemma 4 (Empirical Competition Results) — Cá nhân (10 điểm)

Chạy **5 câu hỏi Benchmark thực tế trên kho 14 tài liệu VinUni** kết nối trực tiếp **API Thực Tế `gemini-embedding-2` (3,072 dimensions)** và **`gemma-4-26b-a4b-it`**:

| # | Câu hỏi Benchmark Thực Tế (Query) | Top-1 Doc Truy Xuất (`gemini-embedding-2`) | Expected Gold Doc | Điểm Score Thực Tế API | Khớp Gold Doc? | Phản Hồi Trực Tiếp Từ Mô Hình `gemma-4-26b-a4b-it` |
|---|-------|--------------------------------|-------------------|-------------------|----------------|----------------------------------------------------|
| 1 | Hướng dẫn quy trình và điều kiện đăng ký chuyển đổi chuyên ngành tại Đại học VinUni? | `vinuni-chuyen-nganh` | `vinuni-chuyen-nganh` | **0.7968** | ✅ MATCH! | Nộp đơn tối đa 01 lần/năm học tại Phòng Registrar (Phòng I114), cần phê duyệt của QLĐT & Giám đốc chương trình. |
| 2 | Sinh viên VinUni đạt tiêu chuẩn GPA và rèn luyện thế nào thì được cấp Học bổng Tài năng 100%? | `vinuni-hoc-bong` | `vinuni-hoc-bong` | **0.7835** | ✅ MATCH! | GPA tích lũy từ 3.8/4.0 trở lên và điểm rèn luyện đạt loại Xuất sắc. |
| 3 | Điều kiện GPA và chuẩn đầu ra để sinh viên VinUni được công nhận tốt nghiệp? | `vinuni-tot-nghiep` | `vinuni-tot-nghiep` | **0.8020** | ✅ MATCH! | Tích lũy 100% tín chỉ, GPA toàn khóa từ 2.0/4.0 trở lên, đạt chuẩn Tiếng Anh và hoàn thành mọi nghĩa vụ thư viện/tài chính. |
| 4 | Thang điểm A tại VinUni tương ứng bao nhiêu phần trăm và quy chế phòng thi xử lý vi phạm ra sao? | `vinuni-ky-thi-diem` | `vinuni-ky-thi-diem` | **0.7427** | ✅ MATCH! | Điểm A tương ứng 90%-100% (GPA 4.0); vi phạm mang tài liệu/điện thoại cấm bị lập biên bản kỷ luật và nhận điểm F (0.0). |
| 5 | Quy định rút bớt môn học dành riêng cho sinh viên VinUni (`audience=student`) sau thời hạn Add/Drop? | `vinuni-dang-ky-hoc-phan` | `vinuni-dang-ky-hoc-phan` | **0.7631** | ✅ MATCH! | Rút học phần sau Add/Drop bị ghi nhận điểm W (Withdrawal) trên bảng điểm chính thức; học phí không hoàn trả. |

**Bao nhiêu câu hỏi trả về chunk có liên quan ở Top-1?** **5 / 5 (100% Match)**

---

## Tự Đánh Giá (Phần Cá Nhân)

| Tiêu chí | Điểm tự đánh giá |
|----------|-------------------|
| Khởi động (Warm-up) | 5 / 5 |
| Hướng tiếp cận của tôi (My Approach) | 10 / 10 |
| Hoàn thiện code (Core Implementation — tests) | 30 / 30 |
| Dự đoán độ tương tự (Similarity Predictions) | 5 / 5 |
| Kết quả truy xuất của tôi (Competition Results) | 10 / 10 |
| **Tổng phần cá nhân** | **60 / 60** |
