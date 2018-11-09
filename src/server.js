const os = require('os'),
    ip = require('ip'),
    fs = require('fs'),
    moment = require('moment-timezone'),
    express = require('express');

const exec = require('child_process').exec;
const CronJob = require('cron').CronJob;

const scan_shell = process.env.SCAN_SHELL || '';

const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var sockets = {};

// express
app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(express.static('captures'));

app.get('/', function (req, res) {
    let host = os.hostname();
    let date = moment().tz('Asia/Seoul').format();
    res.render('index.ejs', {host: host, date: date, server: ip.address(), client: req.ip.split(':').pop()});
});

io.on('connection', function(socket) {
    sockets[socket.id] = socket;
    console.log('Total clients connected : ', Object.keys(sockets).length);

    socket.on('disconnect', function() {
        delete sockets[socket.id];

        // no more sockets
        if (Object.keys(sockets).length == 0) {
            app.set('watchingFile', false);
            fs.unwatchFile('./captures/images/image.jpg');
            fs.unwatchFile('./static/qr.json');
        }
    });

    socket.on('start-stream', function() {
        startStreaming(io);
    });
});

http.listen(3000, function () {
    console.log('Listening on port 3000!');
});

function startStreaming(io) {
    if (app.get('watchingFile')) {
        io.sockets.emit('liveStream', '/images/image.jpg?_t=' + (Math.random() * 100000));
        io.sockets.emit('QR', 'start');
        return;
    }

    console.log('Watching for changes...');

    app.set('watchingFile', true);

    fs.watchFile('./captures/images/image.jpg', function() {
        io.sockets.emit('liveStream', '/images/image.jpg?_t=' + (Math.random() * 100000));
    });
    fs.watchFile('./static/qr.json', function() {
        fs.readFile('./static/qr.json', function(data, err) {
            if (err) {
                io.sockets.emit('QR', 'error');
                return;
            }
            io.sockets.emit('QR', data);
        });
    });
}

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
