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


app.get('/api/recent-chapters',async(req,res)=>{
    try{
        const response=await axios.get('https://api.mangadex.org/chapter',{
            params: {
              limit: 10,
              translatedLanguage: ['en'],
              order: {
                readableAt: 'desc'
              }
            }
          });
          res.json(response.data);
        } catch (error) {
          console.error('Error fetching recent chapters:', error.message);
          res.status(500).json({ error: 'Failed to fetch recent chapters' });
        }
    });

app.listen(PORT,()=>{
console.log(`server is now running in https://localhost:${PORT}`);
})


