const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Bibliothek API',
    description: 'API Dokumentation für das Bibliothek-Projekt. Hier werden alle Endpunkte für Books und Lends dokumentiert.'
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http'],
  definitions: {
    Book: {
      isbn: '9783161484100',
      title: 'Der Herr der Ringe',
      author: 'J.R.R. Tolkien'
    },
    Lend: {
      id: 1,
      customer_id: 'K1001',
      isbn: '9783161484100',
      borrowed_at: '2025-04-15T12:00:00Z',
      returned_at: null
    }
  },
  tags: [
    { name: 'Book', description: 'Alle Endpunkte zur Verwaltung von Büchern' },
    { name: 'Lend', description: 'Alle Endpunkte zur Verwaltung von Ausleihen' }
  ]
};

const outputFile = './swagger.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger Dokumentation wurde erstellt. Starte jetzt den Server, um sie unter /swagger-ui/ aufzurufen.");
});
