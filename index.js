import express from 'express';
import bodyparser from 'body-parser';
import mongoose from 'mongoose';
import productRouter from './routes/productRoute.js';
import userRouter from './routes/userRoute.js';
import jwt from "jsonwebtoken";
import orderRouter from './routes/orderRoute.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();


//(app.use)
const app= express();
app.use(cors())
app.use(bodyparser.json())

app.use(
    (req,res,next)=>{
        const tokenString = req.header("Authorization")
        if(tokenString !=null){
            const token = tokenString.replace("Bearer ","")

            jwt.verify(token,process.env.JWT_KEY,
                (err,decoded)=>{
                    if(decoded !=null){
                        req.user = decoded
                        nect()
                    }
                    else{
                        res.status(403).json({
                            message:"invalid token"
                        })
                    }
                }
            )

        }
        //guest user(no authorization send)
        else{
            next()
        }

    }
)

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("connected to mongodb")
})
.catch(()=>{
    console.log("error connecting to mongodb")  
})

app.use('api/products',productRouter)
app.use('api/users',userRouter)
app.use('api/orders',orderRouter)

app.listen(3000,
    ()=>{
        console.log("server started at port 3000")
    }
)