import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeliveryOrders, markCannotDeliver, markDelivered } from '../../redux/slices/deliveryOrderSlice';
import { toast } from 'sonner';
import ConfirmModal from '../Common/ConfirmModal';

const DeliveryOrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.deliveryOrders);
  const [showCannotDeliverModal, setShowCannotDeliverModal] = useState(false);
  const [showDeliveredModal, setShowDeliveredModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    dispatch(fetchDeliveryOrders());
  }, [dispatch]);

  const handleCannotDeliverClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCannotDeliverModal(true);
  };

  const handleCannotDeliverConfirm = async () => {
    try {
      await dispatch(markCannotDeliver(selectedOrderId)).unwrap();
      toast.success('Đã đánh dấu không thể giao hàng!');
      dispatch(fetchDeliveryOrders()); // Refresh orders
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra khi đánh dấu không thể giao hàng');
    } finally {
      setShowCannotDeliverModal(false);
      setSelectedOrderId(null);
    }
  };

  const handleMarkDeliveredClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowDeliveredModal(true);
  };

  const handleMarkDeliveredConfirm = async () => {
    try {
      await dispatch(markDelivered(selectedOrderId)).unwrap();
      toast.success('Đã giao hàng thành công!');
      dispatch(fetchDeliveryOrders()); // Refresh orders
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra khi đánh dấu giao hàng thành công');
    } finally {
      setShowDeliveredModal(false);
      setSelectedOrderId(null);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Ready':
        return 'Sẵn sàng giao hàng';
      case 'CannotDeliver':
        return 'Không thể giao hàng';
      case 'Delivered':
        return 'Đã giao hàng';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ready':
        return 'text-blue-600 bg-blue-100';
      case 'CannotDeliver':
        return 'text-red-600 bg-red-100';
      case 'Delivered':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600">Lỗi: {error}</p>
        <button 
          onClick={() => dispatch(fetchDeliveryOrders())}
          className="mt-2 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng - Nhân viên giao hàng</h1>
        <p className="text-gray-600 mt-1">
          Quản lý quá trình giao hàng
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Tổng đơn hàng</h3>
          <p className="text-3xl font-bold text-pink-600">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Chờ giao hàng</h3>
          <p className="text-3xl font-bold text-blue-600">
            {orders.filter(order => order.status === 'Ready').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Không thể giao</h3>
          <p className="text-3xl font-bold text-red-600">
            {orders.filter(order => order.status === 'CannotDeliver').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Đã giao hàng</h3>
          <p className="text-3xl font-bold text-green-600">
            {orders.filter(order => order.status === 'Delivered').length}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Danh sách đơn hàng</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa chỉ giao hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order._id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.user?.name}</div>
                      <div className="text-sm text-gray-500">{order.user?.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">{order.shippingAddress?.name}</div>
                      <div>{order.shippingAddress?.address}</div>
                      <div>{order.shippingAddress?.city}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.shippingAddress?.phonenumber || 'Chưa có'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    {order.status === 'Ready' && (
                      <>
                        <button
                          onClick={() => handleMarkDeliveredClick(order._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Đã giao hàng
                        </button>
                        <button
                          onClick={() => handleCannotDeliverClick(order._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Không thể giao
                        </button>
                      </>
                    )}
                    {order.status === 'CannotDeliver' && (
                      <span className="text-xs text-red-500">
                        Giao hàng thất bại
                      </span>
                    )}
                    {order.status === 'Delivered' && (
                      <span className="text-xs text-green-500">
                        Hoàn thành giao hàng
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {orders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Không có đơn hàng nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Cannot Deliver Modal */}
      <ConfirmModal
        isOpen={showCannotDeliverModal}
        onClose={() => setShowCannotDeliverModal(false)}
        onConfirm={handleCannotDeliverConfirm}
        title="Không thể giao hàng"
        message="Bạn có chắc chắn không thể giao đơn hàng này? Vui lòng đảm bảo đã thử mọi cách liên hệ với khách hàng."
        type="danger"
        confirmText="Không thể giao"
        cancelText="Thử lại"
      />

      {/* Delivered Modal */}
      <ConfirmModal
        isOpen={showDeliveredModal}
        onClose={() => setShowDeliveredModal(false)}
        onConfirm={handleMarkDeliveredConfirm}
        title="Xác nhận giao hàng thành công"
        message="Bạn có chắc chắn đã giao hàng thành công? Khách hàng đã nhận được đơn hàng và hài lòng với sản phẩm?"
        type="success"
        confirmText="Đã giao thành công"
        cancelText="Kiểm tra lại"
      />
    </div>
  );
};

export default DeliveryOrderManagement; 