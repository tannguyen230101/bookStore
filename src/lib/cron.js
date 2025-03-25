import https from 'https';
import cron from 'cron';
import { ENV } from '../config';

const job = new cron.CronJob('*/14 * * * *', () => {
    https
        .get(ENV.API_URL, (res) => {
            if (res.statusCode === 200) {
                console.log('GET request sent successfully');
            } else {
                console.log('Ping to server failed');
            }
        })
        .on('error', (e) => {
            console.error("Error while sending request".e);
        }
    );
});

export default job;