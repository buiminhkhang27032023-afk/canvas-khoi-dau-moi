# Canvas Khởi Đầu Mới (SeeCut Studio)

Dự án độc lập lưu trữ trọn vẹn sơ đồ Canvas **"khởi đầu mới"** (`prj_06d6f1c9496a`), bao gồm toàn bộ:
- **55 Nodes** (Nhân vật Thắng, Linh, nhà bếp, phòng họp, prompt kịch bản, các node voice, video).
- **54 Liên kết (Edges)** nối giữa các node.
- **Toàn bộ hình ảnh tham chiếu (100 files):** ảnh góc nhìn trước/sau/nghiêng, trang phục, bố cục bếp, phòng họp.
- **Toàn bộ file âm thanh và video đã render:** các đoạn thoại giọng mẫu và các video tạo bởi Seedance.

## Cấu trúc thư mục
- `canvas_khoi_dau_moi.json`: Bản cấu hình dữ liệu nodes, edges và database records.
- `assets/prj_06d6f1c9496a/`: Toàn bộ kho file ảnh, âm thanh và video của Canvas.
- `NHAP-CANVAS-VAO-MAY.bat`: File nhấp đúp 1 chạm để nạp Canvas vào SeeCut Studio trên máy mới.
- `import_canvas.js` / `import_canvas.py`: Công cụ nhập tự động vào database `studio.db`.

## Hướng dẫn nạp vào máy khác
1. Clone hoặc tải repo này về máy mới:
   ```bash
   git clone https://github.com/buiminhkhang27032023-afk/canvas-khoi-dau-moi.git
   ```
2. Copy thư mục này (hoặc nội dung bên trong) vào thư mục dự án SeeCut Studio trên máy đó.
3. Nhấp đúp vào:
   👉 **`NHAP-CANVAS-VAO-MAY.bat`**
4. Mở trình duyệt tại:
   `http://localhost:3210/canvas/prj_06d6f1c9496a`
