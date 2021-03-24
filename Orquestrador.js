const express = require('express');
const cors = require("cors");
const app = express();
const knex = require('./src/database');

const HistoricPostsController = require('./src/controllers/HistoricPostsController');

app.use(express.json());
app.use(cors());

app.get('/', HistoricPostsController.index);
app.get('/post', async (req, res, next) => {
  const {postNumber} = req.query;
  const key = req.headers['key'];
  key === process.env.KEY? res.json(await startProcess(postNumber)): res.json("err: you don't have access")
});
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ error: error.message});
});

app.listen(process.env.PORT || 8877);

async function startProcess(postNumber) {
  const Trends = await require('./src/Trends');
  if (Trends != Promise.resolve('Trends is not responding...')) {
    const Jimp = await require('./src/Jimp')(Trends, postNumber || 3);
    if (Jimp != Promise.resolve('Jimp is not responding...')) {
      const Instagram = await require('./src/Instagram')(Jimp);
      if (Instagram != Promise.resolve('Jimp is not responding...')) {
        const fs = require('fs');
        fs.readdirSync('./src/assets/feed').forEach((file)=> {
          fs.unlink('./src/assets/feed/'+ file, function(){
            console.log('• Deleted File');
          });
        })
        console.log('• Posts successfully completed at', new Date().toLocaleTimeString('pt-BR'));
        await knex('post').insert({
          posts: Instagram
         }).then(()=> console.log([Instagram])).catch((err)=> console.log(err));
      };
    };
  };
};
