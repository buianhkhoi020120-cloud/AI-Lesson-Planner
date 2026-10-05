const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/**
 * Generates a fallback lesson plan compliant with Công văn 7991/5512
 * when Gemini API key is not configured or encounters an API error.
 */
function generateFallbackLessonPlan(data) {
  const {
    subject,
    grade,
    lessonTitle,
    duration,
    objectives,
    outcomes,
    content,
    methods,
    equipment,
    notes,
  } = data;

  const isTinHoc10Network =
    subject &&
    subject.toLowerCase().includes("tin") &&
    grade &&
    (grade.toString() === "10" || grade.toString().includes("10")) &&
    lessonTitle &&
    lessonTitle.toLowerCase().includes("mạng");

  if (isTinHoc10Network) {
    return `# KẾ HOẠCH BÀI DẠY (GIÁO ÁN)
**TÊN BÀI DẠY / CHỦ ĐỀ:** MẠNG MÁY TÍNH VÀ INTERNET
**Môn học:** Tin học | **Khối lớp:** 10
**Thời lượng:** 2 tiết (90 phút)

---

### I. MỤC TIÊU

#### 1. Kiến thức
- Hiểu được khái niệm mạng máy tính, lợi ích của việc kết nối mạng máy tính trong đời sống và học tập.
- Phân biệt được các loại mạng máy tính theo địa lý (LAN, WAN, MAN) và theo mô hình hoạt động (Client-Server, Peer-to-Peer).
- Trình bày được khái niệm Internet, các thành phần cơ bản của mạng máy tính và các thiết bị kết nối mạng (Switch, Router, Modem, Cáp mạng, Wi-Fi).

#### 2. Năng lực
- **Năng lực chung:**
  - *Tự chủ và tự học:* Chủ động nghiên cứu tài liệu sách giáo khoa, tìm kiếm thông tin trên Internet để giải quyết nhiệm vụ bài học.
  - *Giao tiếp và hợp tác:* Phối hợp hiệu quả với các thành viên trong nhóm để thảo luận, hoàn thành bài tập nhóm và báo cáo kết quả.
  - *Giải quyết vấn đề và sáng tạo:* Đề xuất phương án thiết lập mạng LAN đơn giản cho phòng máy học tập.
- **Năng lực đặc thù (Năng lực Tin học - NLTH):**
  - *NLa (Sử dụng và quản lý các phương tiện CNTT):* Nhận biết và kết nối đúng các thiết bị mạng cơ bản.
  - *NLc (Tư duy giải quyết vấn đề với sự hỗ trợ của máy tính):* Hiểu nguyên lý truyền dữ liệu và cấu trúc mạng máy tính.

#### 3. Phẩm chất
- **Trung thực:** Trung thực trong quá trình thảo luận và báo cáo sản phẩm học tập.
- **Trách nhiệm:** Có ý thức bảo vệ tài sản, thiết bị phòng máy và sử dụng mạng Internet an toàn, văn minh.
- **Chăm chỉ:** Hăng hái phát biểu, tích cực tham gia các hoạt động nhóm.

---

### II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU

1. **Giáo viên:**
   - Kế hoạch bài dạy, bài giảng điện tử (Slides), máy chiếu.
   - Sơ đồ mô phỏng kiến trúc mạng LAN/WAN, video ngắn về lịch sử và nguyên lý hoạt động của Internet.
   - Mẫu thiết bị mạng thực tế hoặc hình ảnh: Cáp UTP, Hạt mạng RJ45, Switch, Router Wi-Fi, Card mạng.
2. **Học sinh:**
   - Sách giáo khoa Tin học 10, vở ghi chép.
   - Điện thoại thông minh/Máy tính bảng (nếu có) để tham gia khảo sát nhanh/quizz tương tác.

---

### III. TIẾN TRÌNH DẠY HỌC

#### Hoạt động 1: Mở đầu / Khởi động (10 phút)
*Tạo tình huống xuất phát & Kích thích trí tò mò*

- **a) Mục tiêu:** Tạo sự chú ý và giúp học sinh nhận thức được nhu cầu kết nối, chia sẻ dữ liệu giữa các máy tính trong thực tế.
- **b) Nội dung:** Giáo viên đưa ra tình huống: "Trường học muốn chia sẻ 1 máy in cho 40 máy tính phòng lab mà không cần chép file qua USB. Chúng ta phải làm thế nào?"
- **c) Sản phẩm:** Câu trả lời dự kiến của học sinh: Cần nối các máy tính lại thành một mạng chung.
- **d) Tổ chức thực hiện:**
  - **Hoạt động của GV:** Đặt vấn đề, chiếu slide hình ảnh phòng máy in lẻ và phòng máy có kết nối mạng. Yêu cầu HS suy nghĩ cá nhân trong 2 phút.
  - **Hoạt động của HS:** Quan sát hình ảnh, suy nghĩ và đại diện 2-3 HS đưa ra câu trả lời.
  - **Đánh giá:** GV nhận xét, khen ngợi tinh thần phát biểu và dẫn dắt vào bài mới: "Bài dạy: Mạng máy tính".

#### Hoạt động 2: Hình thành kiến thức mới (40 phút)
*Khám phá kiến thức cốt lõi*

- **a) Mục tiêu:** 
  - HS nắm vững khái niệm mạng máy tính và các thành phần chính (Thiết bị đầu cuối, Thiết bị kết nối, Phần mềm mạng).
  - Phân biệt mạng LAN và WAN; hiểu mô hình Client - Server.
- **b) Nội dung:** 
  - Đọc SGK kết hợp quan sát sơ đồ thiết bị mạng.
  - Thảo luận nhóm (4 nhóm) để hoàn thành Phiếu học tập số 1 (Phân loại mạng & Thiết bị mạng).
- **c) Sản phẩm:** Phiếu học tập số 1 đã điền đầy đủ thông tin của 4 nhóm, các câu trả lời ngắn trên bảng phụ.
- **d) Tổ chức thực hiện:**
  - **Hoạt động của GV:**
    + Giao nhiệm vụ cho 4 nhóm (Nhóm 1,2: Thành phần & Khái niệm mạng; Nhóm 3,4: Phân loại LAN/WAN & Mô hình Client-Server).
    + Quan sát, hướng dẫn các nhóm gặp khó khăn.
  - **Hoạt động của HS:**
    + Nhóm bầu nhóm trưởng, thư ký.
    + Đọc SGK, trao đổi, ghi kết quả vào bảng phụ/phiếu học tập.
    + Đại diện nhóm 1 và nhóm 3 lên trình bày (3 phút/nhóm); nhóm 2 và 4 nhận xét, phản biện.
  - **Đánh giá:** GV tổng hợp kiến thức trên slide, chuẩn hóa khái niệm Mạng máy tính, LAN, WAN, Client-Server và chốt đáp án phiếu học tập.

#### Hoạt động 3: Luyện tập (25 phút)
*Củng cố và khắc sâu kiến thức*

- **a) Mục tiêu:** Củng cố kiến thức về thiết bị mạng, phân loại mạng và nguyên lý hoạt động qua bài tập trắc nghiệm & tình huống thực tế.
- **b) Nội dung:** HS trả lời 5 câu hỏi trắc nghiệm tương tác (Kahoot/Quizizz hoặc bảng giơ tay) và 1 bài tập tình huống: "Phân tích mô hình mạng Wi-Fi tại gia đình em".
- **c) Sản phẩm:** Kết quả trắc nghiệm của lớp và bài phân tích mô hình mạng gia đình của cá nhân HS.
- **d) Tổ chức thực hiện:**
  - **Hoạt động của GV:** Chiếu câu hỏi trắc nghiệm và câu hỏi tình huống gia đình. Quan sát đáp án của HS.
  - **Hoạt động của HS:** Độc lập suy nghĩ, lựa chọn đáp án và giải thích lý do lựa chọn cho câu hỏi tình huống.
  - **Đánh giá:** GV tuyên dương HS có điểm số cao, giải thích lại các câu sai phổ biến.

#### Hoạt động 4: Vận dụng (15 phút)
*Mở rộng kiến thức vào thực tiễn*

- **a) Mục tiêu:** Vận dụng kiến thức để tìm hiểu và đề xuất sơ đồ mạng LAN tối ưu cho góc học tập hoặc gia đình.
- **b) Nội dung:** Nhiệm vụ về nhà: Sưu tầm hình ảnh các thiết bị mạng trong nhà (Router Wi-Fi, dây mạng), vẽ lại sơ đồ kết nối đơn giản của nhà mình.
- **c) Sản phẩm:** Sơ đồ kết nối mạng gia đình vẽ trên giấy A4 hoặc file trình chiếu/hình chụp.
- **d) Tổ chức thực hiện:**
  - **Hoạt động của GV:** Hướng dẫn tiêu chí hoàn thành bài tập vận dụng và thời hạn nộp vào tiết sau.
  - **Hoạt động của HS:** Ghi chép yêu cầu bài tập vào vở.
  - **Đánh giá:** GV ghi nhận thái độ tiếp thu và kết thúc tiết học.

---

### IV. ĐÁNH GIÁ KẾT QUẢ HỌC TẬP

- **Phương pháp đánh giá:** Đánh giá thường xuyên qua quan sát thái độ làm việc nhóm, đánh giá qua sản phẩm (Phiếu học tập) và kết quả bài tập luyện tập.
- **Công cụ đánh giá:** Bảng kiểm đánh giá hoạt động nhóm, hệ thống câu hỏi trắc nghiệm củng cố.

---

### V. ĐIỀU CHỈNH, BỔ SUNG SAU BÀI DẠY (NẾU CÓ)

- *Về thời lượng:* Cần điều chỉnh thời gian thảo luận nhóm ở Hoạt động 2 linh hoạt hơn nếu HS hỏi sâu về mô hình IP/MAC.
- *Về phương pháp:* Tăng cường cho HS quan sát thiết bị thật (Router/Switch cũ) để tăng tính trực quan sinh động.`;
  }

  // Generic fallback generator for any subject & grade
  return `# KẾ HOẠCH BÀI DẠY (GIÁO ÁN)
**TÊN BÀI DẠY / CHỦ ĐỀ:** ${lessonTitle.toUpperCase()}
**Môn học:** ${subject} | **Khối lớp:** ${grade}
**Thời lượng:** ${duration || "2 tiết"}

---

### I. MỤC TIÊU

#### 1. Kiến thức
${objectives ? `- ${objectives.split("\n").join("\n- ")}` : `- Nắm vững các kiến thức cơ bản về bài học ${lessonTitle}.\n- Vận dụng được lý thuyết vào các dạng bài tập và tình huống liên quan.`}
${content ? `- Hiểu rõ nội dung cốt lõi: ${content}` : ""}

#### 2. Năng lực
- **Năng lực chung:**
  - *Tự chủ và tự học:* Tự giác nghiên cứu tài liệu, chủ động hoàn thành các nhiệm vụ học tập được giao.
  - *Giao tiếp và hợp tác:* Tương tác hiệu quả với bạn học trong hoạt động nhóm, biết lắng nghe và tôn trọng ý kiến khác biệt.
  - *Giải quyết vấn đề và sáng tạo:* Phân tích tình huống học tập, đề xuất giải pháp phù hợp.
- **Năng lực đặc thù:**
  ${outcomes ? `- ${outcomes.split("\n").join("\n- ")}` : `- Phát triển năng lực môn ${subject} thông qua việc vận dụng kiến thức bài học ${lessonTitle} vào thực tiễn.`}

#### 3. Phẩm chất
- **Trung thực:** Trung thực trong học tập, kiểm tra và đánh giá kết quả của bản thân và bạn học.
- **Trách nhiệm:** Tích cực tham gia các hoạt động chung của lớp, có trách nhiệm với sản phẩm học tập cá nhân và nhóm.
- **Chăm chỉ:** Kiên trì thực hiện các nhiệm vụ học tập khó, hăng hái phát biểu xây dựng bài.

---

### II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU

1. **Giáo viên:**
   - Kế hoạch bài dạy, giáo án điện tử (PowerPoint/Canva), máy chiếu.
   - ${equipment || "Sách giáo khoa, phiếu học tập, tranh ảnh/video minh họa cho bài dạy."}
2. **Học sinh:**
   - Sách giáo khoa, vở ghi, dụng cụ học tập theo yêu cầu của môn học.

---

### III. TIẾN TRÌNH DẠY HỌC

#### Hoạt động 1: Mở đầu / Khởi động (7 - 10 phút)
- **a) Mục tiêu:** Kích thích sự tò mò, tạo hứng thú học tập và kết nối kiến thức cũ với bài mới: "${lessonTitle}".
- **b) Nội dung:** Giáo viên đặt câu hỏi gợi mở hoặc cho học sinh xem một hình ảnh/video ngắn liên quan đến bài học.
- **c) Sản phẩm:** Câu trả lời, phán đoán ban đầu của học sinh.
- **d) Tổ chức thực hiện:**
  - **Hoạt động của GV:** Nêu yêu cầu, quan sát và điều phối lớp học.
  - **Hoạt động của HS:** Phản hồi câu hỏi, thảo luận nhanh theo cặp đôi.
  - **Đánh giá:** GV nhận xét tinh thần tham gia và dẫn dắt chuyển tiếp vào bài mới.

#### Hoạt động 2: Hình thành kiến thức mới (35 - 40 phút)
- **a) Mục tiêu:** Giúp học sinh khám phá và làm chủ kiến thức trọng tâm của bài dạy.
- **b) Nội dung:** HS làm việc cá nhân kết hợp thảo luận nhóm nghiên cứu nội dung kiến thức bài học.
  ${methods ? `*Phương pháp áp dụng:* ${methods}` : ""}
- **c) Sản phẩm:** Phiếu học tập hoàn thành, sơ đồ tư duy hoặc phần trình bày của các nhóm.
- **d) Tổ chức thực hiện:**
  - **Hoạt động của GV:** Phân chia nhiệm vụ nhóm, cung cấp phiếu học tập, hỗ trợ học sinh khi cần thiết.
  - **Hoạt động của HS:** Đọc tài liệu SGK, trao đổi nhóm, ghi chép kết quả và đại diện trình bày.
  - **Đánh giá:** GV chuẩn hóa kiến thức, ghi bảng các nội dung quan trọng và đánh giá phần trình bày của nhóm.

#### Hoạt động 3: Luyện tập (20 - 25 phút)
- **a) Mục tiêu:** Củng cố kiến thức vừa học, rèn luyện kỹ năng giải quyết bài tập liên quan.
- **b) Nội dung:** Học sinh trả lời hệ thống câu hỏi củng cố và bài tập thực hành.
- **c) Sản phẩm:** Đáp án bài tập trong vở ghi hoặc bảng phụ của học sinh.
- **d) Tổ chức thực hiện:**
  - **Hoạt động của GV:** Giao bài tập, quan sát và sửa lỗi sai phổ biến.
  - **Hoạt động của HS:** Làm việc độc lập hoặc trao đổi theo cặp để giải bài tập.
  - **Đánh giá:** GV gọi đại diện HS chữa bài, nhận xét và cho điểm đánh giá.

#### Hoạt động 4: Vận dụng (10 - 15 phút)
- **a) Mục tiêu:** Mở rộng kiến thức, vận dụng bài học vào giải quyết vấn đề thực tế trong đời sống.
- **b) Nội dung:** Nhiệm vụ tìm hiểu nâng cao hoặc dự án nhỏ về nhà.
- **c) Sản phẩm:** Bài thu hoạch hoặc sản phẩm thực hành nộp vào tiết sau.
- **d) Tổ chức thực hiện:**
  - **Hoạt động của GV:** Hướng dẫn nhiệm vụ và tiêu chí đánh giá sản phẩm.
  - **Hoạt động của HS:** Lắng nghe, ghi chép yêu cầu.
  - **Đánh giá:** GV nhắc nhở và đánh giá chung tiết học.

---

### IV. ĐÁNH GIÁ KẾT QUẢ HỌC TẬP

- **Phương pháp:** Đánh giá thường xuyên qua quan sát thái độ, đánh giá qua sản phẩm học tập và câu hỏi trắc nghiệm.
- **Công cụ:** Phiếu đánh giá nhóm, thang đo thái độ, hệ thống bài tập củng cố.

---

### V. ĐIỀU CHỈNH, BỔ SUNG SAU BÀI DẠY (NẾU CÓ)

- Ghi nhận về thời lượng triển khai các hoạt động.
- Ghi nhận về khả năng tiếp thu của học sinh để điều chỉnh phương pháp ở các bài sau.
${notes ? `\n*Ghi chú bổ sung:* ${notes}` : ""}`;
}

// API Endpoint to generate lesson plan
app.post("/api/generate-lesson-plan", async (req, res) => {
  try {
    const {
      subject,
      grade,
      lessonTitle,
      duration,
      objectives,
      outcomes,
      content,
      methods,
      equipment,
      notes,
    } = req.body;

    if (!subject || !grade || !lessonTitle) {
      return res.status(400).json({
        success: false,
        error:
          "Vui lòng điền đầy đủ các thông tin bắt buộc: Môn học, Khối lớp và Tên bài học!",
      });
    }

    const apiKey =
      req.headers["x-gemini-api-key"] ||
      req.body.apiKey ||
      process.env.GEMINI_API_KEY;

    // If API key is present, attempt live AI generation using Gemini API
    if (
      apiKey &&
      apiKey.trim() !== "" &&
      apiKey !== "your_gemini_api_key_here"
    ) {
      try {
        const systemPrompt = `Bạn là một chuyên gia giáo dục xuất sắc tại Việt Nam. 
Hãy soạn một KẾ HOẠCH BÀI DẠY (GIÁO ÁN) hoàn chỉnh, chuyên nghiệp và chi tiết bám sát CÔNG VĂN 7991 (hoặc Công văn 5512) của Bộ Giáo dục và Đào tạo Việt Nam.

Quy tắc bắt buộc:
1. Ngôn ngữ: Tiếng Việt sư phạm chuẩn mực, rõ ràng, hiện đại.
2. Cấu trúc chuẩn xác gồm các mục:
   - TÊN BÀI DẠY / CHỦ ĐỀ, Môn học, Khối lớp, Thời lượng.
   - I. MỤC TIÊU ( Kiến thức, Năng lực [năng lực chung & năng lực đặc thù], Phẩm chất).
   - II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU (Giáo viên, Học sinh).
   - III. TIẾN TRÌNH DẠY HỌC (Hoạt động 1: Khởi động, Hoạt động 2: Hình thành kiến thức mới, Hoạt động 3: Luyện tập, Hoạt động 4: Vận dụng).
     Mỗi hoạt động phải có đầy đủ: a) Mục tiêu, b) Nội dung, c) Sản phẩm, d) Tổ chức thực hiện (Hoạt động của GV, Hoạt động của HS, Cách đánh giá).
   - IV. ĐÁNH GIÁ KẾT QUẢ HỌC TẬP.
   - V. ĐIỀU CHỈNH, BỔ SUNG SAU BÀI DẠY (NẾU CÓ).
3. Nội dung thực tế, áp dụng trực tiếp được trên lớp học, không viết lan man hoặc giả định số liệu không có căn cứ.
4. Định dạng đầu ra bằng Markdown sạch đẹp với tiêu đề h1, h2, h3 và danh sách bullet rõ ràng.`;

        const userPrompt = `Hãy tạo kế hoạch bài dạy dựa trên các thông tin sau:
- Môn học: ${subject}
- Khối lớp: ${grade}
- Tên bài học/Chủ đề: ${lessonTitle}
- Thời lượng: ${duration || "2 tiết"}
- Mục tiêu bài học giáo viên yêu cầu: ${objectives || "Theo chuẩn chương trình GDPT 2018"}
- Yêu cầu cần đạt: ${outcomes || "Theo nội dung bài học"}
- Nội dung kiến thức cốt lõi: ${content || "Kiến thức SGK mới"}
- Phương pháp dạy học mong muốn: ${methods || "Dạy học giải quyết vấn đề, thảo luận nhóm, trực quan"}
- Thiết bị & học liệu: ${equipment || "Máy chiếu, SGK, phiếu học tập"}
- Ghi chú thêm: ${notes || "Không có"}`;

        const candidateModels = [
          "gemini-3.5-flash-lite",
          "gemini-3.8-flash",
          "gemini-3.5-flash",
        ];

        for (const modelName of candidateModels) {
          try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    role: "user",
                    parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
                  },
                ],
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 4000,
                },
              }),
            });

            if (response.ok) {
              const result = await response.json();
              const generatedText =
                result.candidates?.[0]?.content?.parts?.[0]?.text;
              if (generatedText) {
                return res.json({
                  success: true,
                  source: "gemini-ai",
                  plan: generatedText,
                });
              }
            } else {
              const errorText = await response.text();
              console.warn(
                `Gemini API call to ${modelName} failed with status ${response.status}:`,
                errorText,
              );
            }
          } catch (mErr) {
            console.warn(`Error trying ${modelName}:`, mErr.message);
          }
        }
      } catch (aiErr) {
        console.warn(
          "Error during Gemini API call, switching to smart fallback:",
          aiErr.message,
        );
      }
    }

    // Fallback if no API key or API call failed
    const fallbackPlan = generateFallbackLessonPlan(req.body);
    return res.json({
      success: true,
      source: "smart-template-engine",
      plan: fallbackPlan,
      notice:
        !apiKey || apiKey === "your_gemini_api_key_here"
          ? "Đang chạy ở chế độ Mẫu Chuẩn Smart Template (chưa cấu hình API Key trong .env)."
          : undefined,
    });
  } catch (error) {
    console.error("Server error generating lesson plan:", error);
    res.status(500).json({
      success: false,
      error:
        "Có lỗi xảy ra trong quá trình sinh Kế hoạch bài dạy! Vui lòng thử lại.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 AI Lesson Plan Generator server running at:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`====================================================`);
});
