const os = require('os'),
    ip = require('ip'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    express = require('express');

var BinaryServer = require('binaryjs').BinaryServer;

const exec = require('child_process').exec;
const CronJob = require('cron').CronJob;

const scan_shell = process.env.SCAN_SHELL || '';

const path = require('path');
const MotionDetectionModule = require('pi-motion-detection');

const motionDetector = new MotionDetectionModule({
    captureDirectory: path.resolve(__dirname, 'captures'),
    continueAfterMotion: true,
    captureVideoOnMotion: false,
});

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('static'));
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

const job = new CronJob({
    cronTime: '*/3 * * * * *',
    onTick: function() {
        let date = moment().tz('Asia/Seoul').format();
        console.log(`scan start. ${date}`);

        const scan = exec(`${scan_shell}`);
        scan.stdout.on('data', data => {
            console.log(`data: ${data}`);
        });

        scan.stderr.on('data', data => {
            console.error(`Error: ${data}`);
        });
    },
    start: false,
    timeZone: 'Asia/Seoul'
});

if (scan_shell) {
    job.start();
}

var server = BinaryServer({port: 9001});

server.on('connection', function(client){
    console.log('BinaryJS connected');
    client.on('stream', function() {
        console.log('sending stream');
        var file = fs.createReadStream(path.resolve(__dirname, 'captures/images/image.jpg'));
        client.send(file);
    });
});

process.on('exit', function() {
    console.error('Fatal error. Exiting.');
});
