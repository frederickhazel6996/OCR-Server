var express = require('express');
var router = express.Router();
const multer = require('multer');

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
const chalk = require('chalk');
const jimp = require('jimp');
const TS = require('tesseract.js');
const { response } = require('express');
const worker = TS.createWorker({
    logger: m => console.log(m)
});

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});
router.post('/uploads', upload.single('file'), async function (req, res, next) {
    try {
        const file = req.file;
        const { language } = req.body;
        const image = await jimp.read(file.buffer);
        await image.greyscale();
        var buffer = '';
        image.getBufferAsync(jimp.MIME_JPEG).then(data => (buffer = data));

        if (language === 'english') {
            await worker.load();
            await worker.loadLanguage('eng+fra');
            await worker.initialize('eng+fra');
        }

        if (language === 'french') {
            await worker.load();
            await worker.loadLanguage('eng+fra');
            await worker.initialize('eng+fra');
        }

        if (language === 'german') {
            await worker.load();
            await worker.loadLanguage('eng+deu');
            await worker.initialize('eng+deu');
        }

        if (language === 'italian') {
            await worker.load();
            await worker.loadLanguage('eng+ita');
            await worker.initialize('eng+ita');
        }

        if (language === 'spanish') {
            await worker.load();
            await worker.loadLanguage('eng+spa');
            await worker.initialize('eng+spa');
        }

        const {
            data: { text }
        } = await worker.recognize(buffer);
        console.log(text);

        res.status(200).send(text);
    } catch (err) {
        return res.status(422).send('Server Down');
    }
});

module.exports = router;
