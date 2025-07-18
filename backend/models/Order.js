const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'itemType'  // Sử dụng refPath để tham chiếu động
    },
    itemType: {
        type: String,
        required: true,
        enum: ['Product', 'Ingredient'],
        default: 'Product'
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    size : String,      // Nếu sản phẩm có size
    flavor : String,    // Nếu sản phẩm có hương vị
    quantity: {
        type: Number,
        required: true
    }
},
{ _id: false } // Không tạo _id riêng cho từng item
);

const statusHistorySchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        enum: ['pending', 'approved', 'baking', 'ready', 'shipping', 'delivered', 'cancelled', 'cannot_deliver']
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    note: {
        type: String
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItems: [orderItemSchema],  
    shippingAddress: {
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        phonenumber: {
            type: String,
        },
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    isDelivered: {
        type: Boolean,
        default: false,
    },
    deliveredAt: {
        type: Date,
    },
    paymentStatus: {
        type: String,
        default: 'pending'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'baking', 'ready', 'shipping', 'delivered', 'cancelled', 'cannot_deliver'],
        default: 'pending',
    },
    cancelReason: {
        type: String,
        default: null
    },
    cannotDeliverReason: {
        type: String,
        default: null
    },
    statusHistory: [statusHistorySchema]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);