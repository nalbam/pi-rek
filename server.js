const os = require('os'),
    ip = require('ip'),
    fs = require('fs'),
    express = require('express'),
    zbarimg = require('node-zbarimg');

const cron = require('cron').CronJob;
const PiCamera = require('pi-camera');

const port = process.env.PORT || '3000';

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var sockets = {};

// express
app.set('view engine', 'ejs');
app.use(express.static('static'));

app.get('/', function (req, res) {
    let host = os.hostname();
    res.render('index.ejs', { host: host, port: port, server: ip.address() });
});

const myCamera = new PiCamera({
    mode: 'photo',
    output: `${__dirname}/static/snap.jpg`,
    width: 640,
    height: 480,
    nopreview: true,
});

io.on('connection', function (socket) {
    console.log('connection : ', socket.id);
    sockets[socket.id] = socket;

    socket.on('disconnect', function () {
        console.log('disconnect : ', socket.id);
        delete sockets[socket.id];

        // no more sockets
        if (Object.keys(sockets).length == 0) {
            app.set('watchingFile', false);
            fs.unwatchFile('./static/snap.jpg');
        }
    });

    socket.on('start-stream', function () {
        console.log('start-stream : ', socket.id);
        startStreaming(io);
    });
});

http.listen(port, function () {
    console.log(`Listening on port ${port}!`);
});

function startStreaming(io) {
    if (app.get('watchingFile')) {
        io.sockets.emit('liveStream', 'snap.jpg?_t=' + (Math.random() * 100000));
        return;
    }

    console.log('Watching for changes...');

    app.set('watchingFile', true);

    fs.watchFile('./static/snap.jpg', function () {
        io.sockets.emit('liveStream', 'snap.jpg?_t=' + (Math.random() * 100000));
    });
}

function scanJob() {
    myCamera.snap().then((result) => {
        zbarimg('static/snap.jpg', function (err, code) {
            console.log(code);
            io.sockets.emit('detected', code);
        })
    }).catch((error) => {
        console.error(`failure. ${error}`);
    });
}

const job = new cron({
    cronTime: '*/3 * * * * *',
    onTick: function () {
        scanJob();
    },
    start: false,
    timeZone: 'Asia/Seoul'
});

job.start();
