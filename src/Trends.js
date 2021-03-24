const googleTrends = require('google-trends-api');

module.exports = googleTrends.dailyTrends({ geo: 'BR', hl: 'pt-br' })
  .then(function (results) {
    var listTrends = [];
    //Substituindo caracteres codificados
    function format(string) {
      return string.replace(/&quot;/g, '"').replace(/&nbsp;/g, '').replace(/&#39;/g, `'`);
    };
    JSON.parse(results).default.trendingSearchesDays[0]
      .trendingSearches.map(function (a) {
          listTrends.push({
            query: a.title.query
              .toUpperCase(),
            image: a.image.imageUrl,
            searches: a.formattedTraffic
              .replace('+', 'MAIS')
              .toUpperCase(),
            context: format(a.articles[0].title),
            source: a.articles[0].source
              .toUpperCase(),
            url: a.articles[0].url,
            snippet: format(a.articles[0].snippet),
          });
        });
    console.log(listTrends);
    return listTrends;
  })
  .catch(function (err) {
    console.log(err)
    return Promise.resolve('Trends is not responding...');
  });
