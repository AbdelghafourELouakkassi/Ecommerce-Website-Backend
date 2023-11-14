require('dotenv').config()
const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SK);

app.use(express.json());
app.use(cors());


app.get('/',(req,res)=>{
  res.send('hello stripe')
})

// checkout api
app.post("/payment",async(req,res)=>{
    const {products} = req.body;
    const lineItems = products.map((product)=>({  
        price_data:{
            currency:"usd",
            product_data:{
                name:product.title,
                images:[product.image]
            },
            unit_amount:product.price*100,
        },
        quantity:product.quantity 
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
        success_url:`${process.env.FRONTEND_API}/Success`,
        cancel_url:`${process.env.FRONTEND_API}/Cancel`,
    });

    res.json({id:session.id})
 
})


app.listen(7000,()=>{
    console.log("server start on port 7000")
})
