//  Quy đổi trạng thái từ server -> tiếng Việt để hiển thị
export const statusMapServerToUI = {
  "pending": "Chờ xác nhận",
  "confirmed": "Đã xác nhận",
  "in progress": "Đang thực hiện",
  "awaiting_customer_approval": "Chờ khách xác nhận báo giá",
  "approved": "đã duyệt",
  "waiting for payment": "Chờ thanh toán",
  "completed": "Hoàn tất",
  "processing": "Khách đã xác nhận",
};


//  Quy đổi hành động trên UI -> trạng thái server
export const statusMapUIToServer = {
  batdau: "in-progress",          // khi kỹ thuật viên ấn "Bắt đầu"
  baogia: "awaiting-customer-approval",  // sau khi báo giá xong
  xacnhankhach: "in-progress",           // khách xác nhận báo giá
  daduyet: "approved",
  hoanthanh: "waiting-for-payment", // khi kỹ thuật viên ấn "Hoàn tất"
  thanhtoan: "completed",          // khi khách hàng thanh toán
};