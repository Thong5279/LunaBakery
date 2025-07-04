import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import IngredientGrid from "./IngredientGrid";
import { 
  fetchIngredientDetails, 
  fetchSimilarIngredients, 
  clearSelectedIngredient 
} from "../../redux/slices/ingredientsSlice";
import { addToCart } from "../../redux/slices/cartSlice";

const IngredientDetails = ({ ingredientId }) => {
  const { id: routeID } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedIngredient, similarIngredients, loading, error } = useSelector((state) => state.ingredients);
  const { user, guestId } = useSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const idToFetch = ingredientId || routeID;

  // Format price function
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  // Get stock status with styling
  const getStockStatus = (quantity) => {
    if (quantity === 0) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
          ❌ Hết hàng
        </span>
      );
    } else if (quantity <= 10) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
          ⚠️ Sắp hết ({quantity})
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
          ✅ Còn hàng ({quantity})
        </span>
      );
    }
  };

  useEffect(() => {
    if (idToFetch && idToFetch !== "undefined") {
      console.log("✅ Đang fetch nguyên liệu bằng ID:", idToFetch);
      dispatch(fetchIngredientDetails(idToFetch));
    }

    // Cleanup when component unmounts
    return () => {
      dispatch(clearSelectedIngredient());
    };
  }, [idToFetch, dispatch]);

  useEffect(() => {
    if (selectedIngredient?.images?.length > 0) {
      setMainImage(selectedIngredient.images[0]);
    } else {
      setMainImage("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5Oxgo8L3RleHQ+PC9zdmc+");
    }
    
    // Fetch similar ingredients when selected ingredient is loaded
    if (selectedIngredient?.category && selectedIngredient?._id) {
      dispatch(fetchSimilarIngredients({ 
        id: selectedIngredient._id, 
        category: selectedIngredient.category 
      }));
    }
  }, [selectedIngredient, dispatch]);

  const handleQuantityChange = (action) => {
    setQuantity((prev) => (action === "plus" ? prev + 1 : Math.max(1, prev - 1)));
  };

  const handleAddToCart = () => {
    if (selectedIngredient.quantity === 0) {
      toast.error("Nguyên liệu này hiện đang hết hàng.");
      return;
    }

    setButtonDisabled(true);
    dispatch(
      addToCart({
        productId: idToFetch,
        quantity,
        size: "Mặc định", // Ingredients don't have sizes
        flavor: "Mặc định", // Ingredients don't have flavors
        guestId,
        userId: user?._id,
      })
    )
      .then(() => {
        toast.success("Đã thêm vào giỏ hàng!");
      })
      .finally(() => setButtonDisabled(false));
  };

  const handleGoBack = () => {
    navigate('/ingredients');
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-10">
      <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
      <p className="text-red-600">{error}</p>
      <button
        onClick={handleGoBack}
        className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
      >
        Quay lại danh sách nguyên liệu
      </button>
    </div>
  );

  return selectedIngredient ? (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
        {/* Back button */}
        <motion.button
          onClick={handleGoBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-6 font-medium"
        >
          <FaArrowLeft className="w-4 h-4" />
          Quay lại danh sách nguyên liệu
        </motion.button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Hình ảnh */}
          <div className="md:w-1/2 space-y-4">
            <div className="overflow-hidden rounded-lg shadow-lg group">
              <img
                src={mainImage}
                alt="Main Ingredient"
                className="w-full h-auto object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto">
              {selectedIngredient.images && selectedIngredient.images.length > 0 ? (
                selectedIngredient.images.map((img, i) => (
                  <div key={i} className="overflow-hidden rounded-lg group">
                    <img
                      src={img}
                      onClick={() => setMainImage(img)}
                      className={`w-20 h-20 object-cover rounded-lg border cursor-pointer transition-transform duration-300 group-hover:scale-110 ${
                        mainImage === img ? "border-pink-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                ))
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center">
                  <span className="text-xs text-gray-500">No Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Thông tin */}
          <div className="md:w-1/2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-pink-600 mb-2">{selectedIngredient.name}</h1>
              {/* Category badge */}
              <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-pink-50 text-pink-700 border border-pink-200">
                {selectedIngredient.category}
              </span>
            </div>

            {/* SKU */}
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Mã sản phẩm:</span> {selectedIngredient.sku}
              </p>
            </div>

            {/* Stock status */}
            <div>
              {getStockStatus(selectedIngredient.quantity)}
            </div>

            {/* Hiển thị giá */}
            <div className="space-y-1">
              {selectedIngredient.discountPrice > 0 && selectedIngredient.discountPrice < selectedIngredient.price ? (
                <>
                  <p className="text-3xl text-pink-500 font-bold">
                    {formatPrice(selectedIngredient.discountPrice)}
                  </p>
                  <p className="text-xl text-gray-500 line-through">
                    {formatPrice(selectedIngredient.price)}
                  </p>
                  <p className="text-sm text-green-600 font-medium">
                    Tiết kiệm: {formatPrice(selectedIngredient.price - selectedIngredient.discountPrice)}
                  </p>
                </>
              ) : (
                <p className="text-3xl text-pink-500 font-bold">
                  {formatPrice(selectedIngredient.discountPrice || selectedIngredient.price)}
                </p>
              )}
            </div>

            <p className="text-gray-600">{selectedIngredient.description}</p>

            {/* Supplier info */}
            {selectedIngredient.supplier && (
              <div>
                <p className="font-semibold text-pink-500 mb-1">Nhà cung cấp:</p>
                <p className="text-gray-700">{selectedIngredient.supplier}</p>
              </div>
            )}

            {/* Notes */}
            {selectedIngredient.notes && (
              <div>
                <p className="font-semibold text-pink-500 mb-1">Ghi chú:</p>
                <p className="text-gray-700 text-sm">{selectedIngredient.notes}</p>
              </div>
            )}

            {/* Quantity selector */}
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-700">Số lượng:</span>
              <button 
                onClick={() => handleQuantityChange("minus")}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition-colors"
              >
                -
              </button>
              <span className="px-4 py-1 border rounded">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange("plus")}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition-colors"
              >
                +
              </button>
            </div>

            {/* Add to cart button */}
            <motion.button
              onClick={handleAddToCart}
              disabled={buttonDisabled || selectedIngredient.quantity === 0}
              whileTap={{ scale: 0.95 }}
              className={`bg-pink-500 text-white px-6 py-3 rounded-full w-full font-semibold transition ${
                buttonDisabled || selectedIngredient.quantity === 0 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:bg-pink-600"
              }`}
            >
              <FaShoppingCart className="inline mr-2" />
              {selectedIngredient.quantity === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
            </motion.button>
          </div>
        </div>

        {/* Nguyên liệu tương tự */}
        {similarIngredients.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-pink-500 mb-6 text-center">🌟 Nguyên liệu tương tự 🌟</h2>
            <IngredientGrid ingredients={similarIngredients} loading={false} error={null} />
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default IngredientDetails; 