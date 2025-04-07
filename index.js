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
  
    app.get('/api/manga/:id/chapters', async (req, res) => {
      const { id } = req.params;
    
      try {
        const response = await axios.get(`https://api.mangadex.org/manga/${id}/feed`, {
          params: {
            translatedLanguage: ['en'],
            order: { readableAt: 'desc' },
            limit: 20
          }
        });
    
        res.json(response.data);
      } catch (error) {
        console.error('Error fetching manga feed:', error.message);
        res.status(500).json({ error: 'Failed to fetch manga feed' });
      }
    });
    
    app.get('/api/chapter/:id', async (req, res) => {
      const { id } = req.params;
    
      try {
        const response = await axios.get(`https://api.mangadex.org/chapter/${id}`);
        res.json(response.data);
      } catch (error) {
        console.error('Error fetching chapter:', error.message);
        res.status(500).json({ error: 'Failed to fetch chapter' });
      }
    });
    

    app.get('/api/author/:id', async (req, res) => {
      const { id } = req.params;
    
      try {
        const response = await axios.get(`https://api.mangadex.org/author/${id}`);
        res.json(response.data);
      } catch (error) {
        console.error('Error fetching author:', error.message);
        res.status(500).json({ error: 'Failed to fetch author' });
      }
    });

    app.get('/api/manga/:id/cover', async (req, res) => {
      const { id } = req.params;
    
      try {
        const response = await axios.get(`https://api.mangadex.org/cover`, {
          params: {
            manga: id,
            limit: 1,
            order: { createdAt: 'desc' }
          }
        });
    
        const coverFileName = response.data.data[0]?.attributes?.fileName;
    
        if (!coverFileName) {
          return res.status(404).json({ error: 'Cover not found' });
        }
    
        const coverUrl = `https://uploads.mangadex.org/covers/${id}/${coverFileName}`;
        res.json({ coverUrl });
      } catch (error) {
        console.error('Error fetching cover:', error.message);
        res.status(500).json({ error: 'Failed to fetch cover' });
      }
    });
     
    app.get('/api/genre/:tagId', async (req, res) => {
      const { tagId } = req.params;
    
      try {
        const response = await axios.get('https://api.mangadex.org/manga', {
          params: {
            includedTags: [tagId],
            availableTranslatedLanguage: ['en'],
            limit: 10,
            order: {
              relevance: 'desc'
            }
          }
        });
    
        res.json(response.data);
      } catch (error) {
        console.error('Error fetching manga by genre:', error.message);
        res.status(500).json({ error: 'Failed to fetch manga by genre' });
      }
    });

    //to make easir for the frontend
    app.get('/api/genres', (req, res) => {
      const genres = [
        { name: 'Action', id: '391b0423-d847-456f-aff0-8b0cfc03066b' },
        { name: 'Romance', id: '423e2eae-a7a2-4a8b-ac03-a8351462d71d' },
        { name: 'Comedy', id: '4d32cc48-9f00-4cca-9ccc-3fc2ada36143' },
        { name: 'Drama', id: 'cd1f8e67-1f93-4d09-bb6e-d6b3cabd2d5b' },
        { name: 'Fantasy', id: 'cdc58593-87dd-415e-bbc0-2ec27bf404cc' },
        { name: 'Sci-Fi', id: '256c8bd9-4904-4360-bf4f-508a76d67183' }
      ];
      res.json({ genres });
    });
    
    
app.listen(PORT,()=>{
console.log(`server is now running in https://localhost:${PORT}`);
})


//to get id for test curl "https://api.mangadex.org/chapter?limit=1&translatedLanguage[]=en&order[readableAt]=desc"

