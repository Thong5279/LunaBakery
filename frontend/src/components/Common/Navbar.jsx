import React, { useState } from "react";
import { FiShoppingCart, FiUser, FiSearch, FiX, FiMic } from "react-icons/fi";
import { HiMenu } from "react-icons/hi";
import { FaHeart, FaCookieBite } from "react-icons/fa";
import { Link } from "react-router-dom";
import Searchbar from "./Searchbar";
import CartDrawer from "../Layout/CartDrawer";
import VoiceSearchModal from "./VoiceSearchModal";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-pink-50 via-rose-50 to-red-50 shadow-lg sticky top-0 z-40 backdrop-blur-sm border-b border-pink-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo bên trái */}
          <div className="text-2xl font-bold text-pink-600 tracking-wide hover:scale-105 transition-transform duration-300">
            <Link to={"/"} className="flex items-center gap-2">
              <img src="https://s1.aigei.com/src/img/gif/9c/9c4918a5e46448649534c632e8596fcf.gif?imageMogr2/auto-orient/thumbnail/!282x282r/gravity/Center/crop/282x282/quality/85/%7CimageView2/2/w/282&e=2051020800&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:bGDEkSIp468d-4_SLIaaDP558dQ=" alt="Luna Bakery Logo" className="w-8 h-8" />
              Luna Bakery
              <img src="https://s1.aigei.com/src/img/gif/9c/9c4918a5e46448649534c632e8596fcf.gif?imageMogr2/auto-orient/thumbnail/!282x282r/gravity/Center/crop/282x282/quality/85/%7CimageView2/2/w/282&e=2051020800&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:bGDEkSIp468d-4_SLIaaDP558dQ=" alt="Luna Bakery Logo" className="w-8 h-8" />
            </Link>
          </div>

          {/* Menu chính (ẩn trên mobile) */}
          <div className="hidden md:block">
            <ul className="flex gap-8 font-medium">
              <li className="hover:scale-105 transition-transform duration-300">
                <Link 
                  to={"/"} 
                  className="text-gray-700 hover:text-pink-600 cursor-pointer transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-white/50"
                >
                  Trang chủ
                </Link>
              </li>
              <li className="hover:scale-105 transition-transform duration-300">
                <Link
                  to={"collections/all"}
                  className="text-gray-700 hover:text-pink-600 cursor-pointer transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-white/50"
                >
                  Sản phẩm
                </Link>
              </li>
              <li className="hover:scale-105 transition-transform duration-300">
                <Link 
                  to={"/ingredients"} 
                  className="text-gray-700 hover:text-pink-600 cursor-pointer transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-white/50"
                >
                  Nguyên liệu
                </Link>
              </li>
              <li className="hover:scale-105 transition-transform duration-300">
                <Link 
                  to={"/contact"} 
                  className="text-gray-700 hover:text-pink-600 cursor-pointer transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-white/50"
                >
                  Liên hệ
                </Link>
              </li>
              <li className="hover:scale-105 transition-transform duration-300">
                <Link 
                  to={"/about"} 
                  className="text-gray-700 hover:text-pink-600 cursor-pointer transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-white/50"
                >
                  Giới Thiệu
                </Link>
              </li>
            </ul>
          </div>

          {/* Icon bên phải */}
          <div className="flex items-center gap-4">
            {/* Role badges */}
            {user && user.role === "admin" && (
              <div className="hover:scale-105 transition-transform duration-300">
                <Link
                  to={"/admin"}
                  className="bg-pink-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-pink-600 transition-colors duration-300"
                >
                  Admin
                </Link>
              </div>
            )}
            {user && user.role === "manager" && (
              <div className="hover:scale-105 transition-transform duration-300">
                <Link
                  to={"/manager"}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors duration-300"
                >
                  Quản lý
                </Link>
              </div>
            )}
            {user && user.role === "baker" && (
              <div className="hover:scale-105 transition-transform duration-300">
                <Link
                  to={"/baker"}
                  className="bg-orange-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors duration-300"
                >
                  Thợ làm bánh
                </Link>
              </div>
            )}
            {user && user.role === "shipper" && (
              <div className="hover:scale-105 transition-transform duration-300">
                <Link
                  to={"/delivery"}
                  className="bg-green-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-green-600 transition-colors duration-300"
                >
                  Giao hàng
                </Link>
              </div>
            )}

            {/* User Profile */}
            <div className="hover:scale-110 transition-transform duration-300">
              <Link to={"/profile"}>
                <FiUser
                  className="text-xl text-gray-700 hover:text-pink-600 cursor-pointer transition-colors duration-300"
                  title="Tài khoản"
                />
              </Link>
            </div>

            {/* Wishlist */}
            <div className="hover:scale-110 transition-transform duration-300">
              <Link to={"/wishlist"}>
                <FaHeart
                  className="text-xl text-gray-700 hover:text-pink-600 cursor-pointer transition-colors duration-300"
                  title="Danh sách yêu thích"
                />
              </Link>
            </div>

            {/* Cart */}
            <div className="hover:scale-110 transition-transform duration-300 relative">
              <button onClick={toggleCartDrawer}>
                <FiShoppingCart className="text-xl text-gray-700 hover:text-pink-600 cursor-pointer transition-colors duration-300" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>

            {/* Voice Search */}
            <div className="hover:scale-110 transition-transform duration-300">
              <button
                onClick={() => setVoiceModalOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Tìm kiếm bằng giọng nói"
              >
                <FiMic className="text-xl text-gray-700 hover:text-pink-600 cursor-pointer transition-colors duration-300" />
              </button>
            </div>

            {/* Search */}
            <div className="overflow-hidden">
              <Searchbar />
            </div>

            {/* Mobile Menu Button */}
            <div 
              className="md:hidden hover:scale-110 transition-transform duration-300"
            >
              <HiMenu
                className="text-2xl cursor-pointer text-gray-700 hover:text-pink-600 transition-colors duration-300"
                title="Menu"
                onClick={() => setIsMenuOpen(true)}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 sm:w-1/2 md:w-1/3 
        bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 transform shadow-2xl z-50 border-l border-pink-200 transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b border-pink-200">
          <h2 className="text-xl font-bold text-pink-600">
            Menu
          </h2>
          <button
            className="hover:scale-110 transition-transform duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            <FiX className="text-2xl cursor-pointer text-gray-700 hover:text-red-500 transition-colors duration-300" />
          </button>
        </div>

        <ul className="flex flex-col gap-2 p-6">
          <li className="hover:translate-x-2 transition-transform duration-300">
            <Link 
              to={"/"} 
              className="block text-gray-700 hover:text-pink-600 cursor-pointer transition-colors duration-300 px-4 py-3 rounded-lg hover:bg-white/50 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Trang chủ
            </Link>
          </li>
          <li className="hover:translate-x-2 transition-transform duration-300">
            <Link
              to={"collections/all"}
              className="block text-gray-700 hover:text-pink-600 cursor-pointer transition-colors duration-300 px-4 py-3 rounded-lg hover:bg-white/50 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Sản phẩm
            </Link>
          </li>
          <li className="hover:translate-x-2 transition-transform duration-300">
            <Link 
              to={"/ingredients"} 
              className="block text-gray-700 hover:text-pink-600 cursor-pointer transition-colors duration-300 px-4 py-3 rounded-lg hover:bg-white/50 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Nguyên liệu
            </Link>
          </li>
          <li className="hover:translate-x-2 transition-transform duration-300">
            <Link 
              to={"/wishlist"} 
              className="block text-gray-700 hover:text-pink-600 cursor-pointer transition-colors duration-300 px-4 py-3 rounded-lg hover:bg-white/50 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Yêu thích
            </Link>
          </li>
          <li className="hover:translate-x-2 transition-transform duration-300">
            <Link 
              to={"/about"} 
              className="block text-gray-700 hover:text-pink-600 cursor-pointer transition-colors duration-300 px-4 py-3 rounded-lg hover:bg-white/50 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Về chúng tôi
            </Link>
          </li>
          <li className="hover:translate-x-2 transition-transform duration-300">
            <Link 
              to={"/contact"} 
              className="block text-gray-700 hover:text-pink-600 cursor-pointer transition-colors duration-300 px-4 py-3 rounded-lg hover:bg-white/50 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Liên hệ
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay khi menu mở */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />
      
      {/* Voice Search Modal */}
      <VoiceSearchModal 
        isOpen={voiceModalOpen} 
        onClose={() => setVoiceModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;
