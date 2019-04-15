const rp = require('request-promise');
const $ = require('cheerio');
//const potusParse = require('./potusParse');
const url = 'http://www.assnat.qc.ca/fr/deputes/';

const potusParse = function(url) {
  return rp(url)
    .then(function(html) {
		liste = $('address.blockAdresseDepute', html).text().split("\n                \n                    ") ;
		liste = liste[liste.length -1].split("                    ") ;
		listeB =[] ;
		listeC =liste[liste.length -1];

	for (let i =0 ; i < liste.length-4; i++){
		if (liste[i] === '\n'){
		continue ;
		} listeB = listeB +liste[i];
	}     
	return {
	        nom: $('.enteteFicheDepute>h1', html).text(),
	        titre: $('.enteteFicheDepute ul>li:first-child', html).text(),
	        parti: $('.enteteFicheDepute ul>li:nth-child(2)', html).text(),
	//        adresse: $('.blockAdresseDepute address:last-child', html).text(),
	        adresse: listeB ,
	        courriel: listeC.slice(0,listeC.indexOf('\n'))
	      };
	    })
    .catch(function(err) {
      //handle error
    });
};

rp(url)
  .then(function(html) {
    //success!
    const wikiUrls = [];
    for (let i = 0; i < 125; i++) {
      wikiUrls.push($('#ListeDeputes>tbody>tr>td>a', html)[i].attribs.href);
    }
    return Promise.all(
      wikiUrls.map(function(url) {
        return potusParse('http://www.assnat.qc.ca' + url.replace('index','coordonnees'));
//        return console.log('http://www.assnat.qc.ca' + url.replace('index','coordonnees'));
      })
    );
  })
  .then(function(presidents) {
    console.log(presidents);
  })
  .catch(function(err) {
    //handle error
    console.log(err);
  });