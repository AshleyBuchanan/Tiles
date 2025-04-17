const { prototype } = require('events');
const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const app = express();
const host = 'localhost';
const port = 3000;

app.use(methodOverride('__method'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('tiles');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.listen(port, () => {
    console.log(`listening on ${host}:${port}.`);
});

https://ibex.nebula.to/aed0dd25f83265c2023b09f014b2e78463d0f40b.mp4?md5=cZZUbmLKg8v7-m4vFvzh8g&expires=1744859319&fn=aed0dd25f83265c2023b09f014b2e78463d0f40b.mp4