const httpsRedirect = require('express-https-redirect');
const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'production';
const app = new express();
const compression = require('compression');
const serveStatic = require('serve-static');


// app.use('/', httpsRedirect(true));
app.use(compression());

app.use(serveStatic(path.join(__dirname, 'dist/logistics'), {
    maxAge: '31536000000',
    setHeaders: function (res, path) {
        if (serveStatic.mime.lookup(path) === 'text/html') {
            // Custom Cache-Control for HTML files
            res.setHeader('Cache-Control', 'max-age=0,no-cache,no-store,must-revalidate');
        }
    }
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/dist/logistics/index.html'));
});

app.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    console.info(`Server running on http://localhost:${port} ${env}`);
});
