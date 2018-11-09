const path = require('path');
const MotionDetectionModule = require('pi-motion-detection');

const motionDetector = new MotionDetectionModule({
    captureDirectory: path.resolve(__dirname, 'captures'),
});

motionDetector.on('motion', () => {
    console.log('motion!');
});

motionDetector.on('error', (error) => {
    console.log(error);
});

motionDetector.watch();
