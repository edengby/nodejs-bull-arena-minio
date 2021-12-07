fs = require('fs');
const Queue = require('bull');
const Minio = require('minio');
const filesQueue = new Queue('files', process.env.REDIS_URL);
const foldersQueue = new Queue('folders', process.env.REDIS_URL);

console.log('app 2 started');

const minioClient = new Minio.Client({
    endPoint: 'minio-server',
    port: 9098,
    useSSL: false,
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY
});

filesQueue.process('file_upload', function (job, done) {
    console.log('app 2 got messages: '+job.id);
    console.log(job.data.fileName);
    //save the file to local directory

    const bucket = job.data.bucket;
    const fileName = job.data.fileName;
    const basicPath = './attachments/'
    const savePath = basicPath+fileName;
    minioClient.fGetObject(bucket, fileName, savePath, (err) =>{
        if(err) {
            console.log(err);
            done({error: 'could not save the file'}, 'failed');
        }
        console.log('Successfully downloaded file '+savePath);
        const fileContent = fs.readFileSync(savePath, 'utf8');
        console.log('File content: '+fileContent);
        done(null, 'success');
    });


});

