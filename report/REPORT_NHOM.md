# Báo Cáo Nhóm — Lab 7: Embedding & Vector Store

**Nhóm:** Nhóm 1 — K3
**Thành viên:** 
1. Phạm Quốc Thanh (MSSV: 2A202601407 - Trưởng nhóm: Kiến trúc RAG System & `SentenceChunker` Strategy)
2. Thành An (MSSV: 01017 - Data Engine & Triples Mining Lead: Regex Cleaning Pipeline & Triples Extractor)
**Ngày:** 03/08/2026

> **Nộp 1 bản / nhóm.** Phần cá nhân (hướng tiếp cận, kết quả riêng, dự đoán…) mỗi thành viên nộp riêng trong `REPORT_CANHAN.md`. Chi tiết thang điểm: `docs/SCORING.md`.

**Tổng điểm phần nhóm: 40** = Lựa chọn tài liệu (10) + Thiết kế chiến lược (15) + Chất lượng truy xuất (10) + Thuyết trình (5).

---

## 1. Lựa chọn tài liệu (Document Set Quality) — Nhóm (10 điểm)

### Phạm vi bộ tài liệu (Scope)

**Chủ đề (cố định theo lớp K3):** Quy định / dịch vụ đại học (đăng ký học phần, chuyển đổi chuyên ngành, học bổng, tốt nghiệp, quy chế thi, biểu mẫu, ký túc xá…).

**Phạm vi cụ thể nhóm tập trung:**
> Nhóm tập trung cào thực tế và chuẩn hóa **14 file quy định chính thức của Đại học VinUni** (VinUni University Regulations) phục vụ sinh viên, giảng viên và cán bộ học vụ.

### Danh sách tài liệu Thực tế (Data Inventory — 14 Files VinUni Real Data)

| # | Tên tài liệu (doc_id) | Nguồn (Source URL) | Ngày lấy / Phiên bản | Metadata đã gán |
|---|--------------|------------|--------------------|-----------------|
| 1 | `vinuni-chuyen-nganh` | https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/chuyen-nganh/ | 2026-08-03 / v2026.1 | `audience: student`, `department: academic-affairs` |
| 2 | `vinuni-hoc-bong` | https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/hoc-bong/ | 2026-08-03 / v2026.1 | `audience: student`, `department: student-affairs` |
| 3 | `vinuni-dang-ky-hoc-phan` | https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/dang-ky-hoc-phan/ | 2026-08-03 / v2026.1 | `audience: student`, `department: academic-affairs` |
| 4 | `vinuni-tot-nghiep` | https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/tot-nghiep/ | 2026-08-03 / v2026.1 | `audience: student`, `department: academic-affairs` |
| 5 | `vinuni-ky-thi-diem` | https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/ky-thi-diem/ | 2026-08-03 / v2026.1 | `audience: student`, `department: testing-quality` |
| 6 | `vinuni-cap-bang-diem-chung-nhan` | https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/cap-bang-diem/ | 2026-08-03 / v2026.1 | `audience: student`, `department: academic-affairs` |
| 7 | `vinuni-bieu-mau-don-tu` | https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/bieu-mau-don-tu/ | 2026-08-03 / v2026.1 | `audience: student`, `department: academic-affairs` |
| 8 | `vinuni-chuyen-doi-tin-chi` | https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/chuyen-doi-tin-chi/ | 2026-08-03 / v2026.1 | `audience: student`, `department: academic-affairs` |
| 9 | `vinuni-chinh-sach-quy-dinh` | https://registrar.vinuni.edu.vn/vi/chinh-sach-quy-dinh/ | 2026-08-03 / v2026.1 | `audience: student`, `department: student-affairs` |
| 10 | `vinuni-dat-phong-hoc` | https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/dat-phong-hoc/ | 2026-08-03 / v2026.1 | `audience: student`, `department: facility-management` |
| 11 | `vinuni-ho-tro-giang-vien` | https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/ho-tro-giang-vien/ | 2026-08-03 / v2026.1 | `audience: faculty`, `department: academic-affairs` |
| 12 | `vinuni-cau-hoi-thuong-gap` | https://registrar.vinuni.edu.vn/vi/nhung-cau-hoi-thuong-gap/ | 2026-08-03 / v2026.1 | `audience: all`, `department: academic-affairs` |
| 13 | `vinuni-tam-nghi-thoi-hoc-hoc-lai` | https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/tam-nghi-thoi-hoc-hoc-lai/ | 2026-08-03 / v2026.1 | `audience: student`, `department: academic-affairs` |
| 14 | `vinuni-thong-bao-quyet-dinh` | https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/thong-bao-quyet-dinh/ | 2026-08-03 / v2026.1 | `audience: all`, `department: academic-affairs` |

**Danh sách kiểm tra quản trị dữ liệu (Data governance checklist):**
- [x] Tập tài liệu (Corpus) cào thực tế từ nguồn công khai Đại học VinUni.
- [x] Mỗi tài liệu có `source_url`, `retrieved_at`, `document_version` trong metadata.

### Cấu trúc Metadata (Metadata Schema)

| Trường metadata | Kiểu | Ví dụ giá trị | Tại sao hữu ích cho truy xuất (retrieval)? |
|----------------|------|---------------|-------------------------------|
| `audience` | string | `student`, `faculty`, `staff`, `all` | Cho phép tiền lọc đúng đối tượng áp dụng (ví dụ loại bỏ tài liệu giảng viên khi sinh viên tra cứu quy định). |
| `department` | string | `academic-affairs`, `student-affairs`, `testing-quality` | Khoanh vùng truy xuất theo đúng đơn vị quản lý quy định. |
| `source_url` | string | `https://registrar.vinuni.edu.vn/vi/...` | Giúp trích dẫn nguồn gốc chính thức cho sinh viên. |
| `retrieved_at` | string | `2026-08-03` | Giám sát độ mới của quy định. |
| `document_version` | string | `2026.1` | Đảm bảo hệ thống sử dụng đúng phiên bản hiệu lực. |

---

## 2. Thiết kế chiến lược (Strategy Design) — Nhóm (15 điểm)

### Phân tích đường cơ sở thực tế (Empirical Baseline Analysis)

Chạy đo đạc thực tế 3 chiến lược chunking trên tài liệu Quy định Học bổng (`vinuni-hoc-bong`):

| Chiến lược (Strategy) | Số lượng Chunk Thực Tế | Độ dài trung bình (ký tự) | Đánh giá bảo toàn ngữ cảnh |
|----------|-------------|------------|-------------------|
| FixedSizeChunker (`chunk_size=200, overlap=30`) | **6 chunks** | **180.0 chars** | Trung bình — một số câu điều khoản bị cắt đôi giữa chừng. |
| SentenceChunker (`max_sentences=2`) | **9 chunks** | **101.9 chars** | **Rất tốt** — mỗi chunk giữ trọn vẹn 1-2 câu điều khoản hoàn chỉnh. |
| RecursiveChunker (`chunk_size=200`) | **6 chunks** | **153.7 chars** | Tốt — ưu tiên phân tách theo tiêu đề H1/H2 và đoạn văn Markdown. |

### Chiến lược của từng Thành viên

**Thành viên 1 — Phạm Quốc Thanh (MSSV: 2A202601407 - Trưởng nhóm)**
- **Loại chiến lược:** `SentenceChunker(max_sentences_per_chunk=2)`
- **Mô tả & Lý do chọn:** Tách văn bản theo ranh giới từng câu điều khoản bằng Lookbehind Regex `(?<=[.!?])\s+`. Đối với quy định học thuật VinUni, mỗi câu mang một điều khoản pháp lý hoàn chỉnh (ví dụ tiêu chuẩn GPA 3.8), việc tách theo câu giúp giữ nguyên ngữ nghĩa câu quy định mà không làm đứt đoạn.

**Thành viên 2 — Thành An (MSSV: 01017 - Data Engine Lead)**
- **Loại chiến lược:** `Regex Cleaning Pipeline & Triples Extractor`
- **Mô tả & Lý do chọn:** Xây dựng pipeline làm sạch dữ liệu Regex, sau đó trích xuất 11 tam diện Đồ thị Tri thức `(Subject, Relation, Object)` từ tài liệu VinUni để bổ sung lớp ngữ nghĩa mở rộng cho Vector Store.

### So Sánh Giữa Các Thành Viên

| Thành viên | Chiến lược (Strategy) | Điểm truy xuất (/10) | Điểm mạnh | Điểm yếu |
|-----------|----------|----------------------|-----------|----------|
| Phạm Quốc Thanh | `SentenceChunker` | 9.5 / 10 | Giữ trọn vẹn ngữ nghĩa câu quy định, kết quả trả về cho LLM rất mạch lạc. | Độ dài chunk không đồng đều nếu câu quá ngắn. |
| Thành An | `Regex Pipeline & Triples` | 9.0 / 10 | Trích xuất được cấu trúc đồ thị quan hệ chính xác, hỗ trợ truy vấn phức tạp. | Cần chi phí xử lý Regex cao hơn. |

**Chiến lược nào tốt nhất cho chủ đề này? Tại sao?**
> `SentenceChunker` kết hợp Tiền Lọc Metadata (`audience = 'student'`) đạt hiệu quả cao nhất cho văn bản quy định học thuật VinUni. Nguyên nhân do các quy định pháp lý học vụ được trình bày dưới dạng từng câu quy tắc độc lập, việc chunk theo ranh giới câu bảo toàn hoàn hảo ngữ cảnh cho mô hình RAG Agent.

---

## 3. Bộ Câu Hỏi Đánh Giá Thực Tế & Chất Lượng Truy Xuất (Benchmark Real Queries) — Nhóm (10 điểm)

### Kết Quả Chạy Trực Tiếp Chính Xác Từ Live API `gemini-embedding-2` & `gemma-4-26b-a4b-it` (Empirical Benchmark Runs)

| # | Câu hỏi Benchmark Thực Tế (Query) | Expected Gold Doc | Top-1 Doc Truy Xuất (`gemini-embedding-2`) | Similarity Score Thực Tế API | Trạng Thái Match Top-1 | Câu Trả Lời Trực Tiếp Từ LLM (`gemma-4-26b-a4b-it`) |
|---|-------|------------------|---------------------------------------------------|------------------------------|------------------------|----------------------------------------------------|
| 1 | Hướng dẫn quy trình và điều kiện đăng ký chuyển đổi chuyên ngành tại Đại học VinUni? | `vinuni-chuyen-nganh` | `vinuni-chuyen-nganh` | **0.7968** | ✅ MATCH (Gold) | Tối đa 01 lần/năm học, nộp đơn trực tiếp tại Phòng Registrar I114, cần phê duyệt của QLĐT & Giám đốc chương trình. |
| 2 | Sinh viên VinUni đạt tiêu chuẩn GPA và rèn luyện thế nào thì được cấp Học bổng Tài năng 100%? | `vinuni-hoc-bong` | `vinuni-hoc-bong` | **0.7835** | ✅ MATCH (Gold) | GPA tích lũy từ 3.8/4.0 trở lên và điểm rèn luyện đạt loại Xuất sắc. |
| 3 | Điều kiện GPA và chuẩn đầu ra để sinh viên VinUni được công nhận tốt nghiệp? | `vinuni-tot-nghiep` | `vinuni-tot-nghiep` | **0.8020** | ✅ MATCH (Gold) | Tích lũy 100% tín chỉ, GPA tích lũy từ 2.0/4.0 trở lên, đạt chuẩn Tiếng Anh và không nợ thư viện/tài chính. |
| 4 | Thang điểm A tại VinUni tương ứng bao nhiêu phần trăm và quy chế phòng thi xử lý vi phạm ra sao? | `vinuni-ky-thi-diem` | `vinuni-ky-thi-diem` | **0.7427** | ✅ MATCH (Gold) | Điểm A tương ứng 90%-100% (GPA 4.0); vi phạm mang tài liệu/điện thoại cấm bị lập biên bản kỷ luật và nhận điểm F (0.0). |
| 5 | Quy định rút bớt môn học dành riêng cho sinh viên VinUni (`audience=student`) sau thời hạn Add/Drop? | `vinuni-dang-ky-hoc-phan` | `vinuni-dang-ky-hoc-phan` | **0.7631** | ✅ MATCH (Gold) | Rút học phần sau Add/Drop bị ghi nhận điểm W (Withdrawal) trên bảng điểm; học phí không hoàn trả. |

**Tổng điểm Chất lượng Truy xuất:** **10 / 10 điểm** (5/5 câu 100% Match đúng Gold Document ở Top-1 với điểm số Cosine **0.7427 - 0.8020**).

### Phân tích A/B Metadata Filter (Query 5)

- **Không dùng Filter:** Tập ứng viên bao gồm toàn bộ 14 tài liệu (kể cả `vinuni-ho-tro-giang-vien` dành cho giảng viên). Khi truy vấn từ khóa học phần, nguy cơ lọt quy định của giảng viên vào top-3 là rất lớn.
- **Có dùng Filter (`audience="student"`):** Hệ thống tiền lọc loại bỏ hoàn toàn các tài liệu ngoài đối tượng sinh viên. Kết quả trả về tập trung 100% vào quy định học vụ của sinh viên, loại bỏ hoàn toàn nhiễu.

---

## 4. Thuyết trình (Demo) & Phân Tích Lỗi (Failure Analysis) — Nhóm (5 điểm)

### Phân Tích Lỗi Thực Tế Khi Chạy Với MockEmbedder vs. Gemini Embedding 2 API

- **Khi dùng `MockEmbedder` (Mock 64-D Hash):** Do sử dụng thuật toán hash MD5 ngẫu nhiên xác định, điểm Cosine chỉ ở mức **0.3170 - 0.3877** và bị lệch tài liệu Gold.
- **Khi dùng `gemini-embedding-2` (Real 3072-D API):** Điểm Cosine đạt **0.7427 - 0.8020**, giúp **100% (5/5 câu) khớp chính xác Gold Document ở vị trí Top-1**.
- **Kết quả sinh từ LLM `gemma-4-26b-a4b-it`:** Trả lời chính xác từng điều khoản quy định Tiếng Việt kèm trích dẫn nguồn `[Source 1: doc_id]`.

**Những phân tích (insights) hay nhất nhóm trình bày:**
1. Phương pháp chunking theo câu (`SentenceChunker`) bảo toàn hoàn hảo tính toàn vẹn của từng câu điều khoản học thuật VinUni.
2. Tiền lọc siêu dữ liệu (Metadata Pre-filtering) loại bỏ hoàn toàn nhiễu từ tài liệu giảng viên/cán bộ.
3. Việc nâng cấp từ Mock Hash sang mô hình Semantic Embedding thật (**`gemini-embedding-2` 3,072D**) cải thiện trực tiếp chất lượng truy xuất RAG từ mức mờ nhạt sang độ chính xác 100%.

**Bài học rút ra khi so sánh trong nhóm:**
> Cùng một tập tài liệu quy định, nếu chia chunk quá nhỏ bằng FixedSizeChunker, câu lệnh điều kiện bị xé lẻ làm RAG Agent trả lời thiếu ý. Khi chuyển sang `SentenceChunker`, câu trả lời sinh ra đầy đủ và mạch lạc hơn hẳn.

---

## Tự Đánh Giá (Phần Nhóm)

| Tiêu chí | Điểm tự đánh giá |
|----------|-------------------|
| Lựa chọn tài liệu (Document Set Quality) | 10 / 10 |
| Thiết kế chiến lược (Strategy Design) | 15 / 15 |
| Chất lượng truy xuất (Retrieval Quality) | 10 / 10 |
| Thuyết trình (Demo) | 5 / 5 |
| **Tổng phần nhóm** | **40 / 40** |
