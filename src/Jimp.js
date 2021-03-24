const Jimp = require('jimp');

module.exports = async function (inf, tam) {
  const background = await Jimp.read('./src/assets/templates/Background.png');

  const font1 = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
  var directories = [];

  inf.map(async function (a, b) {
      if (b < tam) {
        await Jimp.read(a.image || './assets/templates/none.png')
          .then(function (image) {
              image.clone().resize(1080, 1080).blur(80)
                .composite(background, 0, 0)
                .composite(image.resize(200, 200).blur(2), 83, 138)
                .print(font1, 313, 128, a.source)
                .print(font1, 313, 190, 'ACESSOS:')
                .print(font1, 313, 222, a.searches)
                .print(font1, 144, 507, ' - '+a.query, 895)
                .print(font1, 144, 599, a.context, 795)
                .print(font1, 144, 700, a.snippet, 890)
                .write(`./src/assets/feed/${a.query.toLowerCase().replace(/ /g, '-')}.jpg`);

              directories.push({
                query: a.query,
                searches: a.context,
                url: a.url,
                source: a.source,
                snippet: a.snippet,
                diretory: `./src/assets/feed/${a.query.toLowerCase().replace(/ /g, '-')}.jpg`
              });
              console.log(`• [${a.query.toLowerCase().replace(/ /g, '-')}.jpg] - Ok`);
            })
          .catch(function (err) {
              console.log(`• [${a.query.toLowerCase().replace(/ /g, '-')}.jpg] - Error`);
              console.error(err);
              return Promise.resolve('Jimp is not responding...');
            });
      };
    });
  return directories;
};