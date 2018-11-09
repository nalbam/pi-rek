const os = require('os'),
    ip = require('ip'),
    moment = require('moment-timezone'),
    express = require('express');

const path = require('path');
const MotionDetectionModule = require('pi-motion-detection');

const motionDetector = new MotionDetectionModule({
    captureDirectory: path.resolve(__dirname, 'captures'),
});

const app = express();
app.set('view engine', 'ejs');
app.use('/favicon.ico', express.static('views/favicon.ico'));
app.use(express.static('captures'));

app.get('/', function (req, res) {
    let host = os.hostname();
    let date = moment().tz('Asia/Seoul').format();
    res.render('index.ejs', {host: host, date: date, server: ip.address(), client: req.ip.split(':').pop()});
});

app.listen(3000, function () {
    console.log('Listening on port 3000!');
});

motionDetector.on('motion', () => {
    console.log('motion!');
});

motionDetector.on('error', (error) => {
    console.log(error);
});

motionDetector.watch();
