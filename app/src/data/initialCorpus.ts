import type { RawDocument, TriplesRecord, BenchmarkQuery } from '../types';

// Complete Corpus: Thành An (Muscar1a) Real VinUni Crawled Data (14 Documents)
export const INITIAL_DOCUMENTS: RawDocument[] = [
  {
    id: 'vinuni-chuyen-nganh',
    title: 'Hướng dẫn Đăng ký & Chuyển ngành VinUni',
    metadata: {
      doc_id: 'vinuni-chuyen-nganh',
      title: 'Hướng dẫn Đăng ký & Chuyển ngành VinUni',
      audience: 'student',
      department: 'academic-affairs',
      language: 'vi',
      source_url: 'https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/chuyen-nganh/',
      retrieved_at: '2026-08-03',
      document_version: '2026.1'
    },
    content: `Trang này hướng dẫn sinh viên cách đăng ký thay đổi chuyên ngành, ngành phụ hoặc chuyển đổi chương trình học tại Đại học VinUni.

## Quy trình & Điều kiện Đăng ký Chuyên ngành
1. **Điều kiện:** Không phải sinh viên năm nhất hoặc năm cuối; đáp ứng tiêu chí tuyển sinh của chuyên ngành mới; không bị đình chỉ kỷ luật.
2. **Tần suất:** Được nộp đơn đăng ký chuyển đổi chuyên ngành tối đa 1 lần/năm học.
3. **Phê duyệt:** Cần sự phê duyệt từ Phòng Quản lý Đào tạo, Giám đốc Chương trình và Viện trưởng.
4. **Nộp hồ sơ:** Điền biểu mẫu nội bộ đơn xin chuyển ngành và nộp về Phòng Registrar (Phòng I114).`
  },
  {
    id: 'vinuni-hoc-bong',
    title: 'Chính sách Học bổng & Hỗ trợ Tài chính VinUni',
    metadata: {
      doc_id: 'vinuni-hoc-bong',
      title: 'Chính sách Học bổng & Hỗ trợ Tài chính VinUni',
      audience: 'student',
      department: 'student-affairs',
      language: 'vi',
      source_url: 'https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/hoc-bong-ho-tro-tai-chinh/',
      retrieved_at: '2026-08-03',
      document_version: '2026.1'
    },
    content: `Đại học VinUni cấp các mức học bổng tài năng và hỗ trợ tài chính cho sinh viên hệ chính quy dựa trên thành tích học tập và hoàn cảnh gia đình.

## Các mức Học bổng Tài năng
- Học bổng 100% (Full Scholarship): Dành cho sinh viên xuất sắc đạt GPA từ 3.8/4.0 trở lên và điểm rèn luyện loại Xuất sắc.
- Học bổng 80% & 50%: Dành cho sinh viên đạt GPA từ 3.2/4.0 trở lên và điểm rèn luyện loại Tốt.

## Điều kiện duy trì học bổng
Sinh viên cần duy trì GPA tích lũy theo yêu cầu hàng năm và không bị kỷ luật học tập để tiếp tục nhận học bổng cho các học kỳ tiếp theo.`
  },
  {
    id: 'vinuni-dang-ky-hoc-phan',
    title: 'Thời khóa biểu & Đăng ký học phần VinUni',
    metadata: {
      doc_id: 'vinuni-dang-ky-hoc-phan',
      title: 'Thời khóa biểu & Đăng ký học phần VinUni',
      audience: 'student',
      department: 'academic-affairs',
      language: 'vi',
      source_url: 'https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/thoi-khoa-bieu-dang-ky-hoc-phan/',
      retrieved_at: '2026-08-03',
      document_version: '2026.1'
    },
    content: `Chào mừng bạn đến với trang đăng ký môn học VinUni. Tại đây, bạn sẽ được hướng dẫn cách chuẩn bị, đăng ký và quản lý kế hoạch học tập tại VinUni.

## Quy trình đăng ký môn học (SIS)
1. **Chuẩn bị:** Tra cứu danh sách môn mở trong kỳ và tham khảo ý kiến Cố vấn học tập (Academic Advisor).
2. **Đăng ký chính thức (Registration Period):** Truy cập hệ thống SIS trong thời gian mở cổng đăng ký để chọn môn học.
3. **Điều chỉnh (Add/Drop Period):** Trong 1-2 tuần đầu học kỳ, sinh viên có thể thêm hoặc bớt môn học mà không bị ghi nhận vào bảng điểm.

## Rút bớt môn học & Hủy đăng ký
Sinh viên rút môn học sau giai đoạn Add/Drop sẽ bị ghi nhận điểm W (Withdrawal) trên bảng điểm chính thức.`
  },
  {
    id: 'vinuni-tot-nghiep',
    title: 'Quy định tốt nghiệp & Cấp bằng VinUni',
    metadata: {
      doc_id: 'vinuni-tot-nghiep',
      title: 'Quy định tốt nghiệp & Cấp bằng VinUni',
      audience: 'student',
      department: 'academic-affairs',
      language: 'vi',
      source_url: 'https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/tot-nghiep/',
      retrieved_at: '2026-08-03',
      document_version: '2026.1'
    },
    content: `Hướng dẫn quy trình xét tốt nghiệp, chuẩn bị hồ sơ và nhận bằng cử nhân tại Đại học VinUni.

## Điều kiện công nhận tốt nghiệp
1. Hoàn thành 100% tổng số tín chỉ bắt buộc và tự chọn theo chương trình đào tạo.
2. Đạt điểm trung bình tích lũy GPA từ 2.0/4.0 trở lên và không còn môn nợ.
3. Đạt chuẩn đầu ra ngoại ngữ Tiếng Anh (IELTS/TOEFL) và hoàn thành các nghĩa vụ tài chính, thư viện.

## Lễ tốt nghiệp & Cấp văn bằng
Bằng tốt nghiệp và bảng điểm chính thức sẽ được trao trực tiếp tại Lễ Tốt nghiệp hàng năm hoặc cấp qua Phòng Registrar.`
  },
  {
    id: 'vinuni-ky-thi-diem',
    title: 'Kỳ thi, Đánh giá & Thang điểm VinUni',
    metadata: {
      doc_id: 'vinuni-ky-thi-diem',
      title: 'Kỳ thi, Đánh giá & Thang điểm VinUni',
      audience: 'student',
      department: 'testing-quality',
      language: 'vi',
      source_url: 'https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/ky-thi-diem/',
      retrieved_at: '2026-08-03',
      document_version: '2026.1'
    },
    content: `Quy định kiểm tra giữa kỳ, thi kết thúc học phần và thang điểm xếp loại học thuật VinUni.

## Thang điểm 4.0 & Xếp loại
- Điểm A (4.0): Xuất sắc (90-100%)
- Điểm B (3.0): Khá (80-89%)
- Điểm C (2.0): Trung bình (70-79%)
- Điểm F (0.0): Không đạt (<60%)

## Quy chế phòng thi
Thí sinh phải mang thẻ sinh viên VinUni khi vào phòng thi. Không được mang thiết bị di động, đồng hồ thông minh hoặc tài liệu chưa được cho phép. Vi phạm sẽ bị lập biên bản kỷ luật và nhận điểm F.`
  },
  {
    id: 'vinuni-cap-bang-diem-chung-nhan',
    title: 'Yêu cầu cấp Bảng điểm & Giấy chứng nhận VinUni',
    metadata: {
      doc_id: 'vinuni-cap-bang-diem-chung-nhan',
      title: 'Yêu cầu cấp Bảng điểm & Giấy chứng nhận VinUni',
      audience: 'student',
      department: 'academic-affairs',
      language: 'vi',
      source_url: 'https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/yeu-cau-cap-bang-diem-va-chung-nhan/',
      retrieved_at: '2026-08-03',
      document_version: '2026.1'
    },
    content: `Sinh viên có thể đăng ký cấp Bảng điểm tạm thời, Giấy xác nhận sinh viên chính quy hoặc Giấy chứng nhận hoàn thành chương trình qua Cổng dịch vụ một cửa Registrar.

Thời gian xử lý hồ sơ thông thường từ 2-3 ngày làm việc kể từ khi nhận đủ lệ phí và yêu cầu trực tuyến.`
  },
  {
    id: 'vinuni-bieu-mau-don-tu',
    title: 'Biểu mẫu & Đơn từ Học thuật VinUni',
    metadata: {
      doc_id: 'vinuni-bieu-mau-don-tu',
      title: 'Biểu mẫu & Đơn từ Học thuật VinUni',
      audience: 'student',
      department: 'academic-affairs',
      language: 'vi',
      source_url: 'https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/bieu-mau-don-tu/',
      retrieved_at: '2026-08-03',
      document_version: '2026.1'
    },
    content: `Tổng hợp các mẫu đơn xin tạm nghỉ học, đơn xin phúc khảo điểm thi, đơn xin chuyển ngành và đơn đề nghị miễn giảm học phần.

Tất cả các biểu mẫu phải có chữ ký của sinh viên và xác nhận từ Cố vấn học tập trước khi gửi về văn phòng Registrar.`
  },
  {
    id: 'vinuni-chuyen-doi-tin-chi',
    title: 'Quy định Chuyển đổi tín chỉ & Học phần tương đương',
    metadata: {
      doc_id: 'vinuni-chuyen-doi-tin-chi',
      title: 'Quy định Chuyển đổi tín chỉ & Học phần tương đương',
      audience: 'student',
      department: 'academic-affairs',
      language: 'vi',
      source_url: 'https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/chuyen-doi-tin-chi/',
      retrieved_at: '2026-08-03',
      document_version: '2026.1'
    },
    content: `Sinh viên tham gia chương trình trao đổi quốc tế hoặc đã học tại các trường đại học đối tác có thể nộp hồ sơ xin chuyển đổi tín chỉ tương đương.

Hội đồng thẩm định học thuật VinUni sẽ đánh giá đề cương môn học và điểm số đạt được (từ C trở lên) để công nhận số tín chỉ tương đương.`
  },
  {
    id: 'vinuni-chinh-sach-quy-dinh',
    title: 'Chính sách & Quy định Học thuật Chung VinUni',
    metadata: {
      doc_id: 'vinuni-chinh-sach-quy-dinh',
      title: 'Chính sách & Quy định Học thuật Chung VinUni',
      audience: 'all',
      department: 'academic-affairs',
      language: 'vi',
      source_url: 'https://registrar.vinuni.edu.vn/vi/chinh-sach-quy-dinh/',
      retrieved_at: '2026-08-03',
      document_version: '2026.1'
    },
    content: `Các chính sách về liêm chính học thuật, phòng chống gian lận và quy tắc ứng xử văn minh trong môi trường đại học VinUni.

Mọi hành vi đạo văn (plagiarism) hoặc gian lận thi cử sẽ bị xử lý kỷ luật từ mức cảnh cáo học tập đến buộc thôi học.`
  },
  {
    id: 'vinuni-dat-phong-hoc',
    title: 'Dịch vụ Đặt phòng học & Không gian nhóm VinUni',
    metadata: {
      doc_id: 'vinuni-dat-phong-hoc',
      title: 'Dịch vụ Đặt phòng học & Không gian nhóm VinUni',
      audience: 'all',
      department: 'facility-management',
      language: 'vi',
      source_url: 'https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/dat-phong-hoc/',
      retrieved_at: '2026-08-03',
      document_version: '2026.1'
    },
    content: `Sinh viên và giảng viên có thể đặt phòng thảo luận nhóm, phòng tự học và hội trường thông qua hệ thống đặt phòng trực tuyến VinUni Room Booking.

Thời gian sử dụng tối đa mỗi lượt đặt là 3 giờ và cần xác nhận nhận phòng trước 15 phút.`
  },
  {
    id: 'vinuni-ho-tro-giang-vien',
    title: 'Hướng dẫn & Hỗ trợ Giảng viên VinUni',
    metadata: {
      doc_id: 'vinuni-ho-tro-giang-vien',
      title: 'Hướng dẫn & Hỗ trợ Giảng viên VinUni',
      audience: 'faculty',
      department: 'academic-affairs',
      language: 'vi',
      source_url: 'https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/ho-tro-giang-vien/',
      retrieved_at: '2026-08-03',
      document_version: '2026.1'
    },
    content: `Quy trình nộp bảng điểm môn học, cập nhật điểm giữa kỳ và quản lý danh sách lớp học dành riêng cho Giảng viên VinUni.

Giảng viên cần hoàn thành nhập điểm lên hệ thống SIS trong vòng 7 ngày sau khi kết thúc đợt đánh giá môn học.`
  },
  {
    id: 'vinuni-cau-hoi-thuong-gap',
    title: 'Những câu hỏi thường gặp về Học thuật VinUni',
    metadata: {
      doc_id: 'vinuni-cau-hoi-thuong-gap',
      title: 'Những câu hỏi thường gặp về Học thuật VinUni',
      audience: 'all',
      department: 'academic-affairs',
      language: 'vi',
      source_url: 'https://registrar.vinuni.edu.vn/vi/nhung-cau-hoi-thuong-gap/',
      retrieved_at: '2026-08-03',
      document_version: '2026.1'
    },
    content: `Giải đáp các thắc mắc phổ biến về đăng ký môn, cấp lại thẻ sinh viên, quy trình xin hoãn thi và liên hệ cố vấn học tập VinUni.`
  },
  {
    id: 'vinuni-tam-nghi-thoi-hoc-hoc-lai',
    title: 'Quy trình Tạm nghỉ học, Bảo lưu & Thôi học VinUni',
    metadata: {
      doc_id: 'vinuni-tam-nghi-thoi-hoc-hoc-lai',
      title: 'Quy trình Tạm nghỉ học, Bảo lưu & Thôi học VinUni',
      audience: 'student',
      department: 'academic-affairs',
      language: 'vi',
      source_url: 'https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/tam-nghi-thoi-hoc-hoc-lai/',
      retrieved_at: '2026-08-03',
      document_version: '2026.1'
    },
    content: `Hướng dẫn thủ tục nộp đơn bảo lưu kết quả học tập, tạm nghỉ học có thời hạn và các quy định thôi học tại Đại học VinUni.`
  },
  {
    id: 'vinuni-thong-bao-quyet-dinh',
    title: 'Các Quyết định & Thông báo Học vụ VinUni',
    metadata: {
      doc_id: 'vinuni-thong-bao-quyet-dinh',
      title: 'Các Quyết định & Thông báo Học vụ VinUni',
      audience: 'all',
      department: 'academic-affairs',
      language: 'vi',
      source_url: 'https://registrar.vinuni.edu.vn/vi/hoc-thuat-dich-vu/thong-bao-quyet-dinh/',
      retrieved_at: '2026-08-03',
      document_version: '2026.1'
    },
    content: `Cập nhật thông báo mở cổng đăng ký môn học SIS, thời gian Add/Drop và lịch học kỳ mới nhất từ Phòng Quản lý Đào tạo VinUni.`
  }
];

// Mined Knowledge Graph Triples from Thành An's (Muscar1a) ETL Engine
export const AN_EXTRACTED_TRIPLES: TriplesRecord[] = [
  { id: 't00', subject: 'Đăng ký Chuyên ngành VinUni', relation: 'ĐIỀU KIỆN & THỦ TỤC', object: 'Tối đa 1 lần/năm học, nộp đơn qua Phòng Registrar I114', source_doc: 'vinuni-chuyen-nganh', confidence: 0.99 },
  { id: 't0', subject: 'Học bổng Tài năng VinUni', relation: 'PHÂN MỨC XÉT TRAO', object: '100% (GPA >= 3.8 & Rèn luyện Xuất sắc), 80% & 50% (GPA >= 3.2)', source_doc: 'vinuni-hoc-bong', confidence: 0.99 },
  { id: 't1', subject: 'Cổng SIS VinUni', relation: 'ĐĂNG KÝ HỌC PHẦN', object: 'Đăng ký chính thức & Add/Drop 1-2 tuần đầu', source_doc: 'vinuni-dang-ky-hoc-phan', confidence: 0.99 },
  { id: 't2', subject: 'Rút môn sau Add/Drop', relation: 'GHI NHẬN BẢNG ĐIỂM', object: 'Điểm W (Withdrawal)', source_doc: 'vinuni-dang-ky-hoc-phan', confidence: 0.97 },
  { id: 't3', subject: 'Đầu ra Tốt nghiệp VinUni', relation: 'YÊU CẦU GPA', object: 'GPA tích lũy >= 2.0/4.0 & Đạt chuẩn Anh văn', source_doc: 'vinuni-tot-nghiep', confidence: 0.98 },
  { id: 't4', subject: 'Thang điểm 4.0 VinUni', relation: 'PHÂN LOẠI ĐIỂM A', object: 'Xuất sắc (90-100%) tương ứng GPA 4.0', source_doc: 'vinuni-ky-thi-diem', confidence: 0.96 },
  { id: 't5', subject: 'Mang thiết bị cấm vào phòng thi', relation: 'HÌNH PHẠT KỶ LUẬT', object: 'Lập biên bản kỷ luật & Nhận điểm F', source_doc: 'vinuni-ky-thi-diem', confidence: 0.99 },
  { id: 't6', subject: 'Cấp Bảng điểm & Giấy xác nhận', relation: 'THỜI GIAN XỬ LÝ', object: '2-3 ngày làm việc qua Cổng Registrar', source_doc: 'vinuni-cap-bang-diem-chung-nhan', confidence: 0.95 },
  { id: 't7', subject: 'Đơn xin chuyển ngành / Tạm nghỉ', relation: 'YÊU CẦU CHỮ KÝ', object: 'Chữ ký sinh viên & Xác nhận Cố vấn học tập', source_doc: 'vinuni-bieu-mau-don-tu', confidence: 0.98 },
  { id: 't8', subject: 'Chuyển đổi tín chỉ quốc tế', relation: 'ĐIỀU KIỆN ĐIỂM SỐ', object: 'Điểm số môn học đạt từ C trở lên', source_doc: 'vinuni-chuyen-doi-tin-chi', confidence: 0.97 },
  { id: 't9', subject: 'Đạo văn & Gian lận', relation: 'HÌNH PHẠT KỶ LUẬT', object: 'Xử lý từ Cảnh cáo học tập đến Buộc thôi học', source_doc: 'vinuni-chinh-sach-quy-dinh', confidence: 0.99 },
  { id: 't10', subject: 'Đặt phòng học nhóm', relation: 'THỜI GIAN TỐI ĐA', object: '3 giờ / lượt đặt qua VinUni Room Booking', source_doc: 'vinuni-dat-phong-hoc', confidence: 0.94 }
];

export const BENCHMARK_QUERIES: BenchmarkQuery[] = [
  {
    id: 1,
    query: 'Hướng dẫn quy trình và điều kiện đăng ký chuyển đổi chuyên ngành tại Đại học VinUni?',
    gold_answer: 'Tối đa 1 lần/năm học, nộp đơn tại Phòng Registrar (Phòng I114) kèm phê duyệt từ QLĐT và Giám đốc chương trình.',
    gold_doc_id: 'vinuni-chuyen-nganh',
    gold_substring: 'chuyên ngành'
  },
  {
    id: 2,
    query: 'Sinh viên VinUni đạt tiêu chuẩn GPA và rèn luyện thế nào thì được cấp Học bổng Tài năng 100%?',
    gold_answer: 'Đạt điểm GPA từ 3.8/4.0 trở lên và điểm rèn luyện đạt loại Xuất sắc.',
    gold_doc_id: 'vinuni-hoc-bong',
    gold_substring: 'GPA từ 3.8/4.0'
  },
  {
    id: 3,
    query: 'Điều kiện GPA và chuẩn đầu ra để sinh viên VinUni được công nhận tốt nghiệp?',
    gold_answer: 'Cần hoàn thành 100% tín chỉ, GPA tích lũy từ 2.0/4.0 trở lên, đạt chuẩn Tiếng Anh và không nợ thư viện/tài chính.',
    gold_doc_id: 'vinuni-tot-nghiep',
    gold_substring: 'GPA từ 2.0/4.0'
  },
  {
    id: 4,
    query: 'Thang điểm A tại VinUni tương ứng bao nhiêu phần trăm và quy chế phòng thi xử lý vi phạm ra sao?',
    gold_answer: 'Điểm A tương ứng 90-100% (GPA 4.0); vi phạm mang tài liệu/điện thoại bị lập biên bản và nhận điểm F.',
    gold_doc_id: 'vinuni-ky-thi-diem',
    gold_substring: 'Điểm A (4.0)'
  },
  {
    id: 5,
    query: 'Quy định rút bớt môn học dành riêng cho sinh viên VinUni sau thời hạn Add/Drop?',
    gold_answer: 'Sinh viên rút môn học sau giai đoạn Add/Drop sẽ bị ghi nhận điểm W (Withdrawal) trên bảng điểm chính thức.',
    gold_doc_id: 'vinuni-dang-ky-hoc-phan',
    gold_substring: 'điểm W',
    metadata_filter: { audience: 'student' }
  }
];
