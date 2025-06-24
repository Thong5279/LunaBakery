import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";
import { fetchUserOrders } from "../redux/slices/orderSlice";
import { 
  FaUser, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaShoppingBag, 
  FaSignOutAlt,
  FaCrown,
  FaEye,
  FaEdit,
  FaTimes,
  FaSave,
  FaPhone,
  FaMapMarkerAlt,
  FaCamera
} from "react-icons/fa";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { orders, loading } = useSelector((state) => state.orders);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // State for editing profile
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      dispatch(fetchUserOrders());
      // Populate form data with current user info
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || ""
      });
    }
  }, [user, navigate, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Reset form data when canceling
    if (isEditing) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || ""
      });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    
    try {
      const token = localStorage.getItem('userToken');
      const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';
      
      const response = await fetch(`${backendURL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Update localStorage
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        // Refresh page to update user data
        window.location.reload();
      } else {
        const error = await response.json();
        alert(error.message || 'Có lỗi xảy ra khi cập nhật thông tin');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setUpdateLoading(false);
      setIsEditing(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh hợp lệ');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File ảnh không được vượt quá 5MB');
      return;
    }

    setAvatarLoading(true);
    
    try {
      const token = localStorage.getItem('userToken');
      const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';
      
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${backendURL}/api/users/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        // Update user in localStorage
        const currentUser = JSON.parse(localStorage.getItem('userInfo'));
        currentUser.avatar = data.avatar;
        localStorage.setItem('userInfo', JSON.stringify(currentUser));
        // Refresh page to update UI
        window.location.reload();
      } else {
        const error = await response.json();
        alert(error.message || 'Có lỗi xảy ra khi upload ảnh');
      }
    } catch (error) {
      console.error('Upload avatar error:', error);
      alert('Có lỗi xảy ra khi upload ảnh');
    } finally {
      setAvatarLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa xác định";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Chưa xác định";
    return date.toLocaleDateString("vi-VN", {
      year: "numeric", 
      month: "long",
      day: "numeric"
    });
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      admin: "Quản trị viên",
      customer: "Khách hàng",
      manager: "Quản lý",
      baker: "Thợ làm bánh",
      shipper: "Nhân viên giao hàng"
    };
    return roleLabels[role] || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: "bg-red-100 text-red-800",
      customer: "bg-blue-100 text-blue-800",
      manager: "bg-purple-100 text-purple-800",
      baker: "bg-orange-100 text-orange-800",
      shipper: "bg-green-100 text-green-800"
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  // Thống kê đơn hàng
  const orderStats = {
    total: orders?.length || 0,
    paid: orders?.filter(order => order.isPaid).length || 0,
    pending: orders?.filter(order => !order.isPaid).length || 0,
    totalSpent: orders?.reduce((sum, order) => sum + order.totalPrice, 0) || 0
  };

  const recentOrders = orders?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  {/* Camera overlay */}
                  <label className="absolute bottom-0 right-0 bg-pink-500 hover:bg-pink-600 text-white rounded-full p-2 cursor-pointer shadow-lg transition-colors">
                    <FaCamera className="text-sm" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={avatarLoading}
                    />
                  </label>
                  
                  {/* Loading overlay */}
                  {avatarLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</h1>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user?.role)}`}>
                  <FaCrown className="mr-1" />
                  {getRoleLabel(user?.role)}
                </span>
              </div>

              <div className="space-y-4">
                {!isEditing ? (
                  <>
                    <div className="flex items-center text-gray-600">
                      <FaEnvelope className="mr-3 text-pink-500" />
                      <span className="text-sm">{user?.email}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <FaPhone className="mr-3 text-pink-500" />
                      <div>
                        <p className="text-xs text-gray-500">Số điện thoại</p>
                        <p className="text-sm font-medium">{user?.phone || "Chưa cập nhật"}</p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-3 text-pink-500" />
                      <div>
                        <p className="text-xs text-gray-500">Địa chỉ</p>
                        <p className="text-sm font-medium">{user?.address || "Chưa cập nhật"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="mr-3 text-pink-500" />
                      <div>
                        <p className="text-xs text-gray-500">Tham gia ngày</p>
                        <p className="text-sm font-medium">{formatDate(user?.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <FaShoppingBag className="mr-3 text-pink-500" />
                      <div>
                        <p className="text-xs text-gray-500">Tổng đơn hàng</p>
                        <p className="text-sm font-medium">{orderStats.total} đơn</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Tên</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Số điện thoại</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Địa chỉ</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Nhập địa chỉ"
                      />
                    </div>
                  </form>
                )}
              </div>

              <div className="mt-6 space-y-3">
                {!isEditing ? (
                  <>
                    <button 
                      onClick={handleEditToggle}
                      className="w-full flex items-center justify-center bg-blue-50 text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                    >
                      <FaEdit className="mr-2" />
                      Chỉnh sửa thông tin
                    </button>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center bg-pink-50 text-pink-600 py-3 px-4 rounded-lg hover:bg-pink-100 transition-colors font-medium"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="submit"
                      onClick={handleUpdateProfile}
                      disabled={updateLoading}
                      className="flex items-center justify-center bg-green-50 text-green-600 py-3 px-4 rounded-lg hover:bg-green-100 transition-colors font-medium disabled:opacity-50"
                    >
                      {updateLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                      ) : (
                        <FaSave className="mr-2" />
                      )}
                      {updateLoading ? "Đang lưu..." : "Lưu"}
                    </button>
                    
                    <button 
                      onClick={handleEditToggle}
                      disabled={updateLoading}
                      className="flex items-center justify-center bg-gray-50 text-gray-600 py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
                    >
                      <FaTimes className="mr-2" />
                      Hủy
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Order Statistics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê đơn hàng</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{orderStats.total}</p>
                  <p className="text-xs text-gray-600">Tổng đơn</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{orderStats.paid}</p>
                  <p className="text-xs text-gray-600">Đã thanh toán</p>
                </div>
                <div className="col-span-2 text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-xl font-bold text-purple-600">
                    {orderStats.totalSpent.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND"
                    })}
                  </p>
                  <p className="text-xs text-gray-600">Tổng chi tiêu</p>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Đơn hàng gần đây</h2>
                <Link 
                  to="/my-orders"
                  className="text-pink-600 hover:text-pink-700 font-medium text-sm flex items-center"
                >
                  <FaEye className="mr-1" />
                  Xem tất cả
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Đang tải...</p>
                </div>
              ) : recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium text-gray-900">Đơn hàng #{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {order.totalPrice.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND"
                            })}
                          </p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            order.isPaid 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <img
                          src={order.orderItems[0].image}
                          alt={order.orderItems[0].name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{order.orderItems[0].name}</p>
                          {order.orderItems.length > 1 && (
                            <p className="text-xs text-gray-500">
                              +{order.orderItems.length - 1} sản phẩm khác
                            </p>
                          )}
                        </div>
                        <Link
                          to={`/order/${order._id}`}
                          className="text-pink-600 hover:text-pink-700 text-sm font-medium"
                        >
                          Chi tiết →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
                  <p className="text-gray-500 mb-6">Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm thôi!</p>
                  <Link 
                    to="/collections/all"
                    className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                  >
                    Bắt đầu mua sắm
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;