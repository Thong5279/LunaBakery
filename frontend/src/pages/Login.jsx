import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import loginImage from "../assets/login.jpg";
import { loginUser } from "../redux/slices/authSlice"; // Import the login action
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch from react-redux
import { mergeCart } from "../redux/slices/cartSlice";
import { FaGoogle } from "react-icons/fa";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch(); // Import useDispatch from react-redux
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId, loading } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  //lay tham so chuyen huong va kiem tra
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password })); // Dispatch the login action
  };

  // Function to handle Google login
  const handleGoogleLogin = () => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';
    window.location.href = `${backendURL}/api/auth/google`;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left: Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-8 md:p-16 bg-white shadow-xl relative z-10">
        <form
          className="w-full max-w-md bg-white p-10 rounded-3xl shadow-lg border border-gray-200 transition-all"
          onSubmit={handleSubmit}
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-pink-500">Luna Bakery</h2>
          </div>
          <h3 className="text-2xl font-semibold text-center mb-4">
            Xin chào 👋
          </h3>
          <p className="text-center text-gray-500 mb-6">
            Vui lòng đăng nhập tên tài khoản và mật khẩu để tiếp tục
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#db2777]"
              placeholder="Nhập email của bạn"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#db2777]"
              placeholder="Nhập mật khẩu"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-50 hover:bg-pink-200 text-[#db2777] p-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-xl"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc</span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 p-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-xl border border-gray-300 flex items-center justify-center"
          >
            <FaGoogle className="mr-2 text-red-500" />
            Đăng nhập với Google
          </button>
          <p className="mt-6 text-center text-sm text-gray-600">
            Chưa có tài khoản?
            <Link to={`/register?redirect=${encodeURIComponent(redirect)}`}>
              <span className="text-pink-500 font-semibold hover:underline ml-1">
                Đăng ký ngay
              </span>
            </Link>
          </p>
        </form>
      </div>

      {/* Right: Image */}
      <div className="hidden md:flex w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <img
          src={loginImage}
          alt="Login Background"
          className="w-full h-full object-cover object-center scale-105 filter blur-[1px] brightness-90 transition duration-500"
        />
        <div className="absolute bottom-6 left-6 text-white z-20">
          <h2 className="text-2xl font-semibold drop-shadow-lg">
            Welcome to Luna 🍰
          </h2>
          <p className="text-sm drop-shadow-md text-gray-100">
            Không chỉ là bánh – là nghệ thuật
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
