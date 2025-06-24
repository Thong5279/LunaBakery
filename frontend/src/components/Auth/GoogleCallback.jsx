import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCallback = () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get('token');
      const userString = urlParams.get('user');
      const error = urlParams.get('error');

      if (error) {
        console.error('Google OAuth error:', error);
        alert('Đăng nhập Google thất bại. Vui lòng thử lại.');
        navigate('/login');
        return;
      }

      if (token && userString) {
        try {
          const user = JSON.parse(decodeURIComponent(userString));
          
          // Lưu token và user info vào localStorage
          localStorage.setItem('userToken', token);
          localStorage.setItem('userInfo', JSON.stringify(user));
          
          // Refresh page để cập nhật Redux state
          window.location.href = '/';
          
        } catch (error) {
          console.error('Error parsing user data:', error);
          alert('Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại.');
          navigate('/login');
        }
      } else {
        console.error('Missing token or user data');
        alert('Thiếu thông tin đăng nhập. Vui lòng thử lại.');
        navigate('/login');
      }
    };

    handleCallback();
  }, [location, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Đang xử lý đăng nhập...</p>
        <p className="text-gray-500 text-sm mt-2">Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  );
};

export default GoogleCallback; 