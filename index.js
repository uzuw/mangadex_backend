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

//to get the recent chapters 
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

//to search the manga
app.get('/api/search', async (req, res) => {
      const { title } = req.query;
    
      if (!title) {
        return res.status(400).json({ error: 'Title query parameter is required' });
      }
    
      try {
        const response = await axios.get('https://api.mangadex.org/manga', {
          params: {
            title,
            limit: 10,
            order: { relevance: 'desc' },
            availableTranslatedLanguage: ['en']
          }
        });
    
        res.json(response.data);
      } catch (error) {
        console.error('Error searching manga:', error.message);
        res.status(500).json({ error: 'Failed to search manga ' });
      }
    });

//search manga using id
app.get('/api/manga/:id', async (req, res) => {
      const { id } = req.params;
    
      try {
        const response = await axios.get(`https://api.mangadex.org/manga/${id}`);
        res.json(response.data);
      } catch (error) {
        console.error('Error fetching manga details:', error.message);
        res.status(500).json({ error: 'Failed to fetch manga details' });
      }
    });
    
    app.get('/api/chapter/:id/pages', async (req, res) => {
      const { id } = req.params;
    
      try {
        const chapterRes = await axios.get(`https://api.mangadex.org/at-home/server/${id}`);
        const imageBaseURL = chapterRes.data.baseUrl;
        const { hash, data } = chapterRes.data.chapter;
    
        const pages = data.map((filename) => `${imageBaseURL}/data/${hash}/${filename}`);
    
        res.json({ pages });
      } catch (error) {
        console.error('Error fetching chapter pages:', error.message);
        res.status(500).json({ error: 'Failed to fetch chapter pages' });
      }
    });
    
    
app.get('/api/languages', (req, res) => {
      // Static list from MangaDex docs — you can update as needed
      const languages = [
        { code: 'en', name: 'English' },
        { code: 'ja', name: 'Japanese' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' }
        // Add more if you want
      ];
    
      res.json({ languages });
    });
    

app.listen(PORT,()=>{
console.log(`server is now running in https://localhost:${PORT}`);
})


//to get id for test curl "https://api.mangadex.org/chapter?limit=1&translatedLanguage[]=en&order[readableAt]=desc"

