import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const TicketModal = ({ isOpen, onClose, ticketData }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  useEffect(() => {
    if (isOpen && ticketData) {
      // Tạo dữ liệu cho mã QR (thông tin vé)
      const qrData = JSON.stringify({
        maVe: ticketData.maVe || `VE${Date.now()}`,
        tenPhim: ticketData.tenPhim,
        ngayDat: ticketData.ngayDat,
        danhSachGhe: ticketData.danhSachGhe,
        giaVe: ticketData.giaVe,
        timestamp: new Date().toISOString()
      });

      // Tạo mã QR
      QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      .then(url => {
        setQrCodeDataUrl(url);
      })
      .catch(err => {
        console.error('Lỗi tạo mã QR:', err);
      });
    }
  }, [isOpen, ticketData]);

  if (!isOpen || !ticketData) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Thông Tin Vé</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bên trái - Thông tin vé */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-lg text-white">
                <h3 className="text-xl font-bold mb-2">{ticketData.tenPhim}</h3>
                <p className="text-yellow-100">Mã vé: {ticketData.maVe || `VE${Date.now()}`}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Thông Tin Suất Chiếu</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày đặt:</span>
                      <span className="font-medium text-gray-800">
                        {new Date(ticketData.ngayDat).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giờ đặt:</span>
                      <span className="font-medium text-gray-800">
                        {new Date(ticketData.ngayDat).toLocaleTimeString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Thông Tin Ghế</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Danh sách ghế:</span>
                      <span className="font-medium text-gray-800">
                        {ticketData.danhSachGhe?.map(ghe => ghe.tenGhe).join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số lượng ghế:</span>
                      <span className="font-medium text-gray-800">
                        {ticketData.danhSachGhe?.length || 0} ghế
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Thông Tin Thanh Toán</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giá vé:</span>
                      <span className="font-medium text-gray-800">
                        {ticketData.giaVe ? `${ticketData.giaVe.toLocaleString()} đ` : 'Chưa có thông tin'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng tiền:</span>
                      <span className="font-bold text-lg text-orange-600">
                        {ticketData.giaVe && ticketData.danhSachGhe 
                          ? `${(ticketData.giaVe * ticketData.danhSachGhe.length).toLocaleString()} đ`
                          : 'Chưa có thông tin'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bên phải - Mã QR */}
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-lg">
                {qrCodeDataUrl ? (
                  <img 
                    src={qrCodeDataUrl} 
                    alt="Mã QR vé" 
                    className="w-48 h-48 mx-auto"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <div className="text-4xl mb-2">📱</div>
                      <div className="text-sm">Đang tạo mã QR...</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center space-y-3">
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-800 mb-2">📋 Hướng Dẫn Sử Dụng</h4>
                  <p className="text-sm text-yellow-700">
                    Đưa mã QR này cho nhân viên để xác nhận vé khi vào rạp
                  </p>
                </div>

                <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-2">ℹ️ Lưu Ý</h4>
                  <ul className="text-sm text-blue-700 text-left space-y-1">
                    <li>• Mã QR chỉ có hiệu lực một lần sử dụng</li>
                    <li>• Vui lòng đến rạp trước giờ chiếu 15 phút</li>
                    <li>• Mang theo giấy tờ tùy thân để đối chiếu</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
