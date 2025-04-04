const express=require('express');
const axios=require('axios');
const cors=require('cors');
require('dotenv');

const app=express();
const PORT=process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('mangadex api backend is running');
})

app.listen(PORT,()=>{
console.log(`server is now running in https://localhost:${PORT}`);
})


