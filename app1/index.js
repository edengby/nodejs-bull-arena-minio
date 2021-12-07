fs = require('fs');
const Queue = require('bull');
const Minio = require('minio');
const filesQueue = new Queue('files', process.env.REDIS_URL);
const foldersQueue = new Queue('folders', process.env.REDIS_URL);

console.log('app 1 started');

//simulate file upload event
const basicPath = './attachments/'
const fileName = 'secret-data2.txt';
const filePath = basicPath+fileName;
const fileContent = 'This is a very secret data';
fs.writeFileSync(filePath, fileContent);
console.log('File was uploaded to the application.');

const minioClient = new Minio.Client({
    endPoint: 'minio-server',
    port: 9098,
    useSSL: false,
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY
});

//create bucket
const bucketName = 'bucket-1';
const region = 'us-and-a';
minioClient.makeBucket(bucketName, region, function (err) {
    if (err) {
        return console.log(err)
    }

    console.log('Bucket created successfully in '+region);
});

minioClient.fPutObject(bucketName, fileName, filePath, function(err, objInfo) {
    if (err) {
        return console.log(err)
    }
    console.log('File uploaded successfully.');
    console.log(JSON.stringify(objInfo));
    filesQueue.add('file_upload',
        {
            bucket : bucketName,
            fileName : fileName,
        });
});

filesQueue.on('completed', function (job, result) {
    // Job completed with output result!
    console.log('job completed: '+job.id)
    console.log(job.data)
})




