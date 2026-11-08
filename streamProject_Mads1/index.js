import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

console.log('1. Fetching page...');
const response = await fetch('https://www.themoviedb.org/');

console.log('2. Status code:', response.status); // should be 200
const html = await response.text();
console.log('3. HTML length:', html.length, 'characters'); // 0 means empty response

const $ = cheerio.load(html);

const cards = $('.card');
console.log('4. Number of cards found:', cards.length); // 0 means wrong selector

const movies = [];

cards.each((i, el) => {
  movies.push({
    title: $(el).find('h2').text().trim(),
    rating: $(el).find('.user_score_chart').attr('data-percent'),
    link: 'https://www.themoviedb.org' + $(el).find('a').attr('href'),
  });
});

console.log('5. Movies scraped:', movies.length);
console.log(JSON.stringify(movies, null, 2));