//  Quy đổi trạng thái từ server -> tiếng Việt để hiển thị
export const statusMapServerToUI = {
  "confirmed": "Đã xác nhận",
  "in-progress": "Đang thực hiện",
  "waiting-for-payment": "Chờ thanh toán",
  "completed": "Hoàn tất",
  "pending": "Chờ xác nhận",
};

//  Quy đổi hành động trên UI -> trạng thái server
export const statusMapUIToServer = {
  batdau: "in-progress",          // khi kỹ thuật viên ấn "Bắt đầu"
  hoanthanh: "waiting-for-payment", // khi kỹ thuật viên ấn "Hoàn thành"
  thanhtoan: "completed",          // khi khách hàng thanh toán
};