/**
 * Requires 
 */

const express = require('express');
const path = require('path');
const fileSystem = require('fs');

/**
 * Initializations
 */

const app = express();
const validTypes = ['doctors', 'hospitals', 'users'];
/**
 * Routes
 */

app.get('/:type/:img', (req, res, next) => {

    const type = req.params.type;
    const img = req.params.img;


    if (validTypes.indexOf(type) === -1) {
        return res.status(400).json({
            ok: false,
            message: 'Invalid type',
            errors: { message: `Must send a valid type: ${ validTypes.join(', ') }` },
        });

    }

    const imgPath = path.resolve(__dirname, `../uploads/${type}/${img}`);
    const noImgPath = path.resolve(__dirname, '../assets/no-img.jpg');

    if (fileSystem.existsSync(imgPath)) {
        res.sendFile(imgPath);
    } else {
        res.sendFile(noImgPath);
    }

});

module.exports = app;