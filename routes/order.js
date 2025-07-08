const Order = require("../models/Order");
const Product = require("../models/Product"); 
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("./verifyToken");

const router = require("express").Router();

// CREATE ORDER & DEDUCT STOCK
router.post("/", verifyToken, async (req, res) => {
  try {
    // Validate stock before placing the order
    for (const item of req.body.products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found.` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Only ${product.stock} left in stock for ${product.title}.`,
        });
      }
    }

    // Create the order
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();

    // Deduct stock from each product
    await Promise.all(
      req.body.products.map(async (item) => {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      })
    );

    res.status(200).json(savedOrder);
  } catch (err) {
    console.error("Order creation failed:", err);
    res.status(500).json({ message: "Order could not be created", error: err });
  }
});


//UPDATE ORDER
router.put("/:id", verifyTokenAndAdmin, async (req, res)=>{
    try{
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, 
            {
                $set: req.body,
            },
            { new: true }
        ); 
        res.status(200).json(updatedOrder);
    }catch (err) {
        res.status(500).json(err);
    }    
});

// DELETE ORDER
router.delete("/:id", verifyTokenAndAdmin, async (req, res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been successfully deleted. ")
    }catch (err) {
        res.status(500).json(err);
    }
});

// GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res)=>{
    try{
        const orders = await Order.find({userId: req.params.userId});
        res.status(200).json(orders);
    }catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL 

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try{
        const orders = await Order.find();
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const productId = req.query.pid;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() -1 ));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() -1 ));

    try{
        const income = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte:previousMonth}, 
                    ...(productId && {
                        products:{ $elemMatch: { productId } },
                }), 
            } 
        },
        { 
            $project : {
                month : { $month : "$createdAt" },
                sales:"$amount",
                },
            },
            { 
                $group: {
                    _id:"$month",
                    total:{$sum: "$sales"},
                },
            },
        ]);
        res.status(200).json(income);
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;