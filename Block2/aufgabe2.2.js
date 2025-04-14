const fs = require('node:fs').promises;
function leseDateiInhalt(filepath){
    return fs.readFile(filepath,'utf-8')
}
leseDateiInhalt('beispiel.txt')
  .then(inhalt => {
    console.log('Länge des Inhalts:', inhalt.length);
  })
  .catch(err => {
    console.error('Fehler:', err);
  });