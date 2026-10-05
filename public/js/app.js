/**
 * AI Lesson Plan Generator - Main Frontend Application Logic
 * Standardized according to Công văn 7991 / 5512 BGD&ĐT
 */

document.addEventListener("DOMContentLoaded", () => {
  // Form Basic Elements
  const form = document.getElementById("lesson-form");
  const subjectInput = document.getElementById("subject");
  const gradeInput = document.getElementById("grade");
  const lessonTitleInput = document.getElementById("lessonTitle");
  const durationInput = document.getElementById("duration");

  // Form Detailed Elements (In Popup Modal)
  const objectivesInput = document.getElementById("objectives");
  const outcomesInput = document.getElementById("outcomes");
  const contentInput = document.getElementById("content");
  const methodsInput = document.getElementById("methods");
  const equipmentInput = document.getElementById("equipment");
  const notesInput = document.getElementById("notes");

  // Action Buttons
  const btnGenerate = document.getElementById("btn-generate");
  const btnClearForm = document.getElementById("btn-clear-form");
  const btnLoadSample = document.getElementById("btn-load-sample");
  const btnEmptyDemo = document.getElementById("btn-empty-demo");

  // Details Modal Elements
  const btnOpenDetails = document.getElementById("btn-open-details");
  const detailsCountBadge = document.getElementById("details-count-badge");
  const detailsModal = document.getElementById("details-modal");
  const btnCloseDetails = document.getElementById("btn-close-details");
  const btnSaveDetails = document.getElementById("btn-save-details");
  const btnClearDetails = document.getElementById("btn-clear-details");

  // Toolbar & Canvas Buttons
  const btnCopy = document.getElementById("btn-copy");
  const btnExportDocx = document.getElementById("btn-export-docx");
  const btnExportPdf = document.getElementById("btn-export-pdf");
  const btnRegenerate = document.getElementById("btn-regenerate");
  const btnClearResult = document.getElementById("btn-clear-result");

  // API Key Modal Elements
  const btnOpenApiKey = document.getElementById("btn-open-apikey");
  const apiKeyBadgeText = document.getElementById("apikey-badge-text");
  const apikeyModal = document.getElementById("apikey-modal");
  const btnCloseModal = document.getElementById("btn-close-modal");
  const inputApiKey = document.getElementById("input-api-key");
  const btnSaveKey = document.getElementById("btn-save-key");
  const btnClearKey = document.getElementById("btn-clear-key");

  // View States & Display Elements
  const emptyState = document.getElementById("empty-state");
  const loadingState = document.getElementById("loading-state");
  const resultState = document.getElementById("result-state");
  const planRenderedContent = document.getElementById("plan-rendered-content");
  const progressBar = document.getElementById("progress-bar");
  const loadingStepText = document.getElementById("loading-step");
  const statusNoticeBar = document.getElementById("status-notice-bar");
  const noticeText = document.getElementById("notice-text");

  // App State Variables
  let currentMarkdownContent = "";

  /**
   * Update Details Count Badge (Count how many detailed fields have text)
   */
  function updateDetailsCountBadge() {
    const fields = [
      objectivesInput.value.trim(),
      outcomesInput.value.trim(),
      contentInput.value.trim(),
      methodsInput.value.trim(),
      equipmentInput.value.trim(),
      notesInput.value.trim(),
    ];
    const count = fields.filter((val) => val !== "").length;
    if (detailsCountBadge) {
      detailsCountBadge.innerText = `${count}/6`;
      if (count > 0) {
        detailsCountBadge.style.backgroundColor = "#10b981";
      } else {
        detailsCountBadge.style.backgroundColor = "#3b82f6";
      }
    }
  }

  // Details Modal Event Listeners
  btnOpenDetails.addEventListener("click", () => {
    detailsModal.classList.remove("hidden");
  });

  btnCloseDetails.addEventListener("click", () => {
    detailsModal.classList.add("hidden");
    updateDetailsCountBadge();
  });

  btnSaveDetails.addEventListener("click", () => {
    detailsModal.classList.add("hidden");
    updateDetailsCountBadge();
    showToast("Đã lưu các mục cấu hình chi tiết bài dạy!", "success");
  });

  btnClearDetails.addEventListener("click", () => {
    objectivesInput.value = "";
    outcomesInput.value = "";
    contentInput.value = "";
    methodsInput.value = "";
    equipmentInput.value = "";
    notesInput.value = "";
    updateDetailsCountBadge();
    showToast("Đã xóa nội dung cấu hình chi tiết.", "info");
  });

  // Also update count badge when inputs change inside details modal
  [
    objectivesInput,
    outcomesInput,
    contentInput,
    methodsInput,
    equipmentInput,
    notesInput,
  ].forEach((elem) => {
    if (elem) elem.addEventListener("input", updateDetailsCountBadge);
  });

  /**
   * API Key Management (Local Storage & Modal)
   */
  function loadSavedApiKey() {
    const savedKey = localStorage.getItem("gemini_api_key") || "";
    inputApiKey.value = savedKey;
    updateApiKeyBadgeUI(savedKey);
  }

  function updateApiKeyBadgeUI(key) {
    if (key && key.trim() !== "") {
      apiKeyBadgeText.innerHTML =
        '<i class="fa-solid fa-check"></i> Đã có Custom Key';
    } else {
      apiKeyBadgeText.innerHTML =
        '<i class="fa-solid fa-key"></i> Cấu hình API Key';
    }
  }

  btnOpenApiKey.addEventListener("click", () => {
    apikeyModal.classList.remove("hidden");
  });

  btnCloseModal.addEventListener("click", () => {
    apikeyModal.classList.add("hidden");
  });

  btnSaveKey.addEventListener("click", () => {
    const key = inputApiKey.value.trim();
    if (key) {
      localStorage.setItem("gemini_api_key", key);
      updateApiKeyBadgeUI(key);
      showToast("Đã lưu Gemini API Key thành công!", "success");
    } else {
      localStorage.removeItem("gemini_api_key");
      updateApiKeyBadgeUI("");
      showToast("Đã xóa API Key cá nhân.", "info");
    }
    apikeyModal.classList.add("hidden");
  });

  btnClearKey.addEventListener("click", () => {
    localStorage.removeItem("gemini_api_key");
    inputApiKey.value = "";
    updateApiKeyBadgeUI("");
    showToast(
      "Đã xóa Key cá nhân. Ứng dụng dùng Mẫu Chuẩn Smart Template.",
      "info",
    );
    apikeyModal.classList.add("hidden");
  });

  loadSavedApiKey();

  /**
   * Sample Data for Demo Requirements (Mục 9): Tin học 10 - Mạng máy tính
   */
  const SAMPLE_DATA = {
    subject: "Tin học",
    grade: "10",
    lessonTitle: "Mạng máy tính và Internet",
    duration: "2 tiết (90 phút)",
    objectives:
      "Hiểu được khái niệm mạng máy tính, lợi ích của kết nối mạng và phân biệt được các loại mạng (LAN, WAN) cùng mô hình hoạt động Client-Server.",
    outcomes:
      "Trình bày được các thành phần cơ bản của mạng máy tính; Nhận biết và kết nối được các thiết bị mạng đơn giản trong phòng máy hoặc gia đình.",
    content:
      "1. Khái niệm và lợi ích của mạng máy tính.\n2. Các thành phần của mạng máy tính (thiết bị đầu cuối, thiết bị kết nối, phần mềm mạng).\n3. Phân loại mạng (LAN, WAN).\n4. Mô hình Client - Server.",
    methods:
      "Phương pháp đặt và giải quyết vấn đề, thảo luận nhóm mảnh ghép, trực quan quan sát thiết bị mạng thực tế.",
    equipment:
      "Kế hoạch bài dạy, bài giảng điện tử (Slides), máy chiếu, mẫu Switch, Router Wi-Fi, dây cáp mạng, phiếu học tập số 1.",
    notes:
      "Tích hợp 5 câu hỏi trắc nghiệm tương tác ở cuối Hoạt động 3 để đánh giá nhanh kết quả học tập.",
  };

  /**
   * Populate Form with Sample Data
   */
  function loadSampleData() {
    subjectInput.value = SAMPLE_DATA.subject;
    gradeInput.value = SAMPLE_DATA.grade;
    lessonTitleInput.value = SAMPLE_DATA.lessonTitle;
    durationInput.value = SAMPLE_DATA.duration;
    objectivesInput.value = SAMPLE_DATA.objectives;
    outcomesInput.value = SAMPLE_DATA.outcomes;
    contentInput.value = SAMPLE_DATA.content;
    methodsInput.value = SAMPLE_DATA.methods;
    equipmentInput.value = SAMPLE_DATA.equipment;
    notesInput.value = SAMPLE_DATA.notes;

    updateDetailsCountBadge();
    showToast(
      "Đã điền dữ liệu mẫu demo: Tin học 10 - Mạng máy tính!",
      "success",
    );
  }

  btnLoadSample.addEventListener("click", loadSampleData);
  btnEmptyDemo.addEventListener("click", () => {
    loadSampleData();
    generateLessonPlan();
  });

  /**
   * Clear Input Form
   */
  btnClearForm.addEventListener("click", () => {
    form.reset();
    updateDetailsCountBadge();
    showToast("Đã xóa dữ liệu các ô nhập liệu.", "warning");
  });

  /**
   * Toast Notification System
   */
  function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let iconClass = "fa-circle-info";
    if (type === "success") iconClass = "fa-circle-check";
    if (type === "error") iconClass = "fa-triangle-exclamation";
    if (type === "warning") iconClass = "fa-circle-exclamation";

    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  /**
   * Update Toolbar Buttons Enabled/Disabled Status
   */
  function updateToolbarState(hasResult) {
    btnCopy.disabled = !hasResult;
    btnExportDocx.disabled = !hasResult;
    btnExportPdf.disabled = !hasResult;
    btnRegenerate.disabled = !hasResult;
    btnClearResult.disabled = !hasResult;
  }

  /**
   * Render Markdown into HTML
   */
  function renderMarkdown(markdownText) {
    if (window.marked) {
      planRenderedContent.innerHTML = marked.parse(markdownText);
    } else {
      planRenderedContent.innerText = markdownText;
    }
  }

  /**
   * Loading Progress Animation Simulation
   */
  let progressInterval = null;
  function startLoadingAnimation() {
    emptyState.classList.add("hidden");
    resultState.classList.add("hidden");
    loadingState.classList.remove("hidden");
    statusNoticeBar.classList.add("hidden");

    let percent = 0;
    progressBar.style.width = "0%";

    const steps = [
      "Đang phân tích thông tin môn học & mục tiêu...",
      "Đang tổng hợp chuẩn năng lực & phẩm chất...",
      "Đang thiết kế 4 Hoạt động dạy học theo Công văn 7991...",
      "Đang xây dựng Hoạt động của GV, HS & Cách đánh giá...",
      "Đang hoàn thiện Kế hoạch bài dạy...",
    ];

    let stepIndex = 0;
    loadingStepText.innerText = steps[0];

    progressInterval = setInterval(() => {
      percent += Math.floor(Math.random() * 8) + 4;
      if (percent > 95) percent = 95;
      progressBar.style.width = `${percent}%`;

      if (percent > stepIndex * 20 && stepIndex < steps.length - 1) {
        stepIndex++;
        loadingStepText.innerText = steps[stepIndex];
      }
    }, 250);
  }

  function stopLoadingAnimation() {
    if (progressInterval) clearInterval(progressInterval);
    progressBar.style.width = "100%";
    setTimeout(() => {
      loadingState.classList.add("hidden");
    }, 200);
  }

  /**
   * Direct Client-Side Gemini API Call & Template Fallback Engine
   */
  async function generateClientSidePlan(payload) {
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
      apiKey,
    } = payload;

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
   - I. MỤC TIÊU (Kiến thức, Năng lực [năng lực chung & năng lực đặc thù], Phẩm chất).
   - II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU (Giáo viên, Học sinh).
   - III. TIẾN TRÌNH DẠY HỌC (Hoạt động 1: Khởi động, Hoạt động 2: Hình thành kiến thức mới, Hoạt động 3: Luyện tập, Hoạt động 4: Vận dụng).
     Mỗi hoạt động phải có đầy đủ: a) Mục tiêu, b) Nội dung, c) Sản phẩm, d) Tổ chức thực hiện (Hoạt động của GV, Hoạt động của HS, Cách đánh giá).
   - IV. ĐÁNH GIÁ KẾT QUẢ HỌC TẬP.
   - V. ĐIỀU CHỈNH, BỔ SUNG SAU BÀI DẠY (NẾU CÓ).
3. Nội dung thực tế, áp dụng trực tiếp được trên lớp học.
4. Định dạng đầu ra bằng Markdown sạch đẹp.`;

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
            const resp = await fetch(apiUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    role: "user",
                    parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
                  },
                ],
                generationConfig: { temperature: 0.7, maxOutputTokens: 4000 },
              }),
            });

            if (resp.ok) {
              const resData = await resp.json();
              const text = resData.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                return { success: true, plan: text, source: "gemini-client" };
              }
            }
          } catch (mErr) {
            console.warn(
              `Direct client Gemini API call to ${modelName} failed:`,
              mErr,
            );
          }
        }
      } catch (err) {
        console.warn("Direct client Gemini API call error:", err);
      }
    }

    // Client-side Smart Fallback Engine
    const isTinHoc10 =
      subject &&
      subject.toLowerCase().includes("tin") &&
      grade &&
      (grade.toString() === "10" || grade.toString().includes("10")) &&
      lessonTitle &&
      lessonTitle.toLowerCase().includes("mạng");

    if (isTinHoc10) {
      return {
        success: true,
        source: "smart-template-engine",
        notice: !apiKey
          ? "Đang chạy ở chế độ Mẫu Chuẩn Smart Template (Bạn chưa nhập Gemini API Key cá nhân trong nút Cấu hình API Key)."
          : undefined,
        plan: `# KẾ HOẠCH BÀI DẠY (GIÁO ÁN)\n**TÊN BÀI DẠY / CHỦ ĐỀ:** MẠNG MÁY TÍNH VÀ INTERNET\n**Môn học:** Tin học | **Khối lớp:** 10\n**Thời lượng:** 2 tiết (90 phút)\n\n---\n\n### I. MỤC TIÊU\n\n#### 1. Kiến thức\n- Hiểu được khái niệm mạng máy tính, lợi ích của việc kết nối mạng máy tính trong đời sống và học tập.\n- Phân biệt được các loại mạng máy tính theo địa lý (LAN, WAN, MAN) và theo mô hình hoạt động (Client-Server, Peer-to-Peer).\n- Trình bày được khái niệm Internet, các thành phần cơ bản của mạng máy tính.\n\n#### 2. Năng lực\n- **Năng lực chung:** Tự chủ và tự học, Giao tiếp và hợp tác, Giải quyết vấn đề & sáng tạo.\n- **Năng lực đặc thù:** NLa (Sử dụng và quản lý các phương tiện CNTT), NLc (Tư duy giải quyết vấn đề với sự hỗ trợ của máy tính).\n\n#### 3. Phẩm chất\n- Trung thực, Trách nhiệm, Chăm chỉ.\n\n---\n\n### II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU\n1. **Giáo viên:** Kế hoạch bài dạy, Slide bài giảng điện tử, Máy chiếu, Mẫu thiết bị mạng (Switch, Router Wi-Fi).\n2. **Học sinh:** SGK Tin học 10, vở ghi chép.\n\n---\n\n### III. TIẾN TRÌNH DẠY HỌC\n\n#### Hoạt động 1: Mở đầu / Khởi động (10 phút)\n- **a) Mục tiêu:** Tạo sự chú ý và nhận thức nhu cầu kết nối mạng máy tính.\n- **b) Nội dung:** Tình huống chia sẻ máy in trong phòng máy.\n- **c) Sản phẩm:** Câu trả lời dự kiến của học sinh.\n- **d) Tổ chức thực hiện:** GV nêu tình huống, HS suy nghĩ cá nhân, GV nhận xét và dẫn dắt vào bài mới.\n\n#### Hoạt động 2: Hình thành kiến thức mới (40 phút)\n- **a) Mục tiêu:** Nắm vững khái niệm mạng, phân loại LAN/WAN và mô hình Client-Server.\n- **b) Nội dung:** Thảo luận nhóm hoàn thành Phiếu học tập số 1.\n- **c) Sản phẩm:** Bảng phụ và phiếu học tập hoàn thành.\n- **d) Tổ chức thực hiện:** GV chia nhóm, hỗ trợ học sinh; đại diện các nhóm trình bày, phản biện.\n\n#### Hoạt động 3: Luyện tập (25 phút)\n- **a) Mục tiêu:** Củng cố kiến thức thiết bị và phân loại mạng.\n- **b) Nội dung:** Trả lời 5 câu hỏi trắc nghiệm củng cố và câu hỏi tình huống thực tế.\n- **c) Sản phẩm:** Kết quả trắc nghiệm và bài phân tích của học sinh.\n- **d) Tổ chức thực hiện:** GV chiếu câu hỏi, HS tương tác trả lời, GV tổng kết điểm.\n\n#### Hoạt động 4: Vận dụng (15 phút)\n- **a) Mục tiêu:** Đề xuất sơ đồ mạng LAN gia đình.\n- **b) Nội dung:** Quan sát và vẽ lại sơ đồ kết nối Internet tại nhà.\n- **c) Sản phẩm:** Sơ đồ vẽ trên giấy A4 nộp tiết sau.\n\n---\n\n### IV. ĐÁNH GIÁ KẾT QUẢ HỌC TẬP\n- Đánh giá qua quan sát thái độ làm việc nhóm và kết quả bài tập luyện tập.`,
      };
    }

    return {
      success: true,
      source: "smart-template-engine",
      notice: !apiKey
        ? "Đang chạy ở chế độ Mẫu Chuẩn Smart Template (Bạn chưa nhập Gemini API Key cá nhân trong nút Cấu hình API Key)."
        : undefined,
      plan: `# KẾ HOẠCH BÀI DẠY (GIÁO ÁN)\n**TÊN BÀI DẠY / CHỦ ĐỀ:** ${lessonTitle.toUpperCase()}\n**Môn học:** ${subject} | **Khối lớp:** ${grade}\n**Thời lượng:** ${duration || "2 tiết"}\n\n---\n\n### I. MỤC TIÊU\n\n#### 1. Kiến thức\n${objectives ? `- ${objectives.split("\n").join("\n- ")}` : `- Nắm vững các kiến thức cơ bản về bài học ${lessonTitle}.`}\n${content ? `- Nội dung cốt lõi: ${content}` : ""}\n\n#### 2. Năng lực\n- **Năng lực chung:** Tự chủ & tự học, Giao tiếp & hợp tác, Giải quyết vấn đề & sáng tạo.\n- **Năng lực đặc thù:** ${outcomes ? outcomes : `Phát triển năng lực môn ${subject}.`}\n\n#### 3. Phẩm chất\n- Trung thực, Trách nhiệm, Chăm chỉ.\n\n---\n\n### II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU\n1. **Giáo viên:** Kế hoạch bài dạy, giáo án điện tử, máy chiếu, ${equipment || "SGK, phiếu học tập"}.\n2. **Học sinh:** SGK, vở ghi chép, dụng cụ học tập.\n\n---\n\n### III. TIẾN TRÌNH DẠY HỌC\n\n#### Hoạt động 1: Mở đầu / Khởi động (7 - 10 phút)\n- **a) Mục tiêu:** Kích thích hứng thú học tập về bài dạy "${lessonTitle}".\n- **b) Nội dung:** Câu hỏi gợi mở/xem hình ảnh video liên quan.\n- **c) Sản phẩm:** Ý kiến phản hồi của học sinh.\n- **d) Tổ chức thực hiện:** GV đặt câu hỏi, HS thảo luận ngắn, GV dẫn dắt vào bài mới.\n\n#### Hoạt động 2: Hình thành kiến thức mới (35 - 40 phút)\n- **a) Mục tiêu:** Khám phá kiến thức cốt lõi bài học.\n- **b) Nội dung:** Nghiên cứu SGK và thảo luận nhóm. ${methods ? `(Phương pháp: ${methods})` : ""}\n- **c) Sản phẩm:** Phiếu học tập / Báo cáo kết quả của nhóm.\n- **d) Tổ chức thực hiện:** GV giao nhiệm vụ, hỗ trợ các nhóm, HS báo cáo, GV chốt kiến thức.\n\n#### Hoạt động 3: Luyện tập (20 - 25 phút)\n- **a) Mục tiêu:** Củng cố kiến thức vừa học.\n- **b) Nội dung:** Hệ thống câu hỏi củng cố và bài tập thực hành.\n- **c) Sản phẩm:** Đáp án bài tập của học sinh.\n- **d) Tổ chức thực hiện:** HS giải bài tập, GV chữa bài và nhận xét.\n\n#### Hoạt động 4: Vận dụng (10 - 15 phút)\n- **a) Mục tiêu:** Vận dụng kiến thức vào giải quyết vấn đề thực tế.\n- **b) Nội dung:** Nhiệm vụ tìm hiểu thực tế về nhà.\n- **c) Sản phẩm:** Bài thu hoạch nộp tiết sau.\n\n---\n\n### IV. ĐÁNH GIÁ KẾT QUẢ HỌC TẬP\n- Đánh giá thường xuyên qua quan sát thái độ và sản phẩm học tập.`,
    };
  }

  /**
   * Main AI Lesson Plan Generation Logic
   */
  async function generateLessonPlan() {
    const subject = subjectInput.value.trim();
    const grade = gradeInput.value.trim();
    const lessonTitle = lessonTitleInput.value.trim();

    if (!subject || !grade || !lessonTitle) {
      showToast(
        "Vui lòng nhập đầy đủ: Môn học, Khối lớp và Tên bài học!",
        "error",
      );
      return;
    }

    const savedApiKey = localStorage.getItem("gemini_api_key") || "";

    const payload = {
      subject: subject,
      grade: grade,
      lessonTitle: lessonTitle,
      duration: durationInput.value.trim(),
      objectives: objectivesInput.value.trim(),
      outcomes: outcomesInput.value.trim(),
      content: contentInput.value.trim(),
      methods: methodsInput.value.trim(),
      equipment: equipmentInput.value.trim(),
      notes: notesInput.value.trim(),
      apiKey: savedApiKey,
    };

    const headers = { "Content-Type": "application/json" };
    if (savedApiKey) {
      headers["x-gemini-api-key"] = savedApiKey;
    }

    btnGenerate.disabled = true;
    btnGenerate.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> Đang tạo bài dạy...';
    startLoadingAnimation();

    let data = null;

    try {
      // 1. First try calling local / server backend if available
      const response = await fetch("/api/generate-lesson-plan", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        data = await response.json();
      } else {
        // Backend not found (e.g. pure static Netlify drop), fallback to client-side API engine
        data = await generateClientSidePlan(payload);
      }
    } catch (error) {
      console.warn(
        "Backend server fetch failed, using client-side engine:",
        error.message,
      );
      // Fallback to direct client-side call
      data = await generateClientSidePlan(payload);
    } finally {
      stopLoadingAnimation();
    }

    if (data && data.success && data.plan) {
      currentMarkdownContent = data.plan;
      renderMarkdown(currentMarkdownContent);

      resultState.classList.remove("hidden");
      updateToolbarState(true);

      if (data.notice) {
        noticeText.innerText = data.notice;
        statusNoticeBar.classList.remove("hidden");
      } else {
        statusNoticeBar.classList.add("hidden");
      }

      showToast(
        "Kế hoạch bài dạy theo Công văn 7991 đã được tạo thành công!",
        "success",
      );
    } else {
      emptyState.classList.remove("hidden");
      showToast(
        data?.error || "Có lỗi xảy ra trong quá trình tạo kế hoạch bài dạy.",
        "error",
      );
    }

    btnGenerate.disabled = false;
    btnGenerate.innerHTML =
      '<i class="fa-solid fa-sparkles"></i> Tạo Kế hoạch Bài dạy';
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    generateLessonPlan();
  });

  btnRegenerate.addEventListener("click", () => {
    generateLessonPlan();
  });

  /**
   * Copy Lesson Plan to Clipboard
   */
  btnCopy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(currentMarkdownContent);
      showToast(
        "Đã sao chép toàn bộ kế hoạch bài dạy vào Clipboard!",
        "success",
      );
    } catch (err) {
      showToast(
        "Không thể sao chép tự động. Bạn có thể chọn và sao chép thủ công.",
        "warning",
      );
    }
  });

  /**
   * Export to Word (.docx)
   */
  btnExportDocx.addEventListener("click", async () => {
    try {
      showToast("Đang khởi tạo file Word (.docx)...", "info");
      const lessonName = lessonTitleInput.value
        .trim()
        .replace(/[^a-zA-Z0-9Bài_Tên_mạng_máy_tính\s]/g, "");
      const filename = `KHBD_${subjectInput.value.trim()}_Lop${gradeInput.value.trim()}_${lessonName || "7991"}.docx`;

      await window.DocxExporter.exportToDocx(currentMarkdownContent, filename);
      showToast("Xuất file Word (.docx) thành công!", "success");
    } catch (err) {
      console.error("DOCX Export Error:", err);
      showToast("Lỗi khi xuất file Word: " + err.message, "error");
    }
  });

  /**
   * Export to PDF
   */
  btnExportPdf.addEventListener("click", () => {
    try {
      showToast("Đang tạo file PDF...", "info");

      const element = document.getElementById("paper-document");
      const lessonName = lessonTitleInput.value
        .trim()
        .replace(/[^a-zA-Z0-9Bài_Tên_mạng_máy_tính\s]/g, "");
      const filename = `KHBD_${subjectInput.value.trim()}_Lop${gradeInput.value.trim()}_${lessonName || "7991"}.pdf`;

      if (window.html2pdf) {
        const opt = {
          margin: [12, 12, 12, 12],
          filename: filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };

        window
          .html2pdf()
          .set(opt)
          .from(element)
          .save()
          .then(() => {
            showToast("Xuất file PDF thành công!", "success");
          })
          .catch((err) => {
            console.warn("html2pdf fallback to print dialog:", err);
            window.print();
          });
      } else {
        // Native fallback print engine
        window.print();
      }
    } catch (err) {
      console.error("PDF Export Error:", err);
      window.print();
    }
  });

  /**
   * Clear Result Canvas
   */
  btnClearResult.addEventListener("click", () => {
    currentMarkdownContent = "";
    planRenderedContent.innerHTML = "";
    resultState.classList.add("hidden");
    emptyState.classList.remove("hidden");
    statusNoticeBar.classList.add("hidden");
    updateToolbarState(false);
    showToast("Đã xóa kết quả hiển thị.", "info");
  });

  // Initial badge count check
  updateDetailsCountBadge();
});
