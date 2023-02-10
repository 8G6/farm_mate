const fileUpload = require('express-fileupload');
const express    = require('express')
const ExifImage = require('exif').ExifImage

const PORT = process.env.PORT || 3030;
let url = ''

const app = express();
app.set('view engine', 'ejs')

function cal(lant){
    return lant[0] + (lant[1]/60) + (lant[2]/3600)
}
function getUrl(gps){
    lat = gps.GPSLatitude
    lon = gps.GPSLongitude
    return `https://www.google.com/maps/@${cal(lat)},${cal(lon)},14z`
}

app.use(fileUpload());
 
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})
 
app.post('/upload', function (req, res) {
    let sampleFile;
    let uploadPath;
 
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
 
    sampleFile = req.files.file;
    uploadPath = __dirname + '/uploads/' + sampleFile.name;
 
    sampleFile.mv(uploadPath, function (err) {
        if (err)
            return res.status(500).send(err);
 
        try {
            new ExifImage({ image : __dirname + '/uploads/' + sampleFile.name }, function (error, exifData) {
                if (error)
                res.send('Error: '+error.message);
                else{
                    url = getUrl(exifData.gps)
                    res.render('map',{url:url})
                    console.log(url)
                }
                    // Do something with your data!
            });
        } catch (error) {
            console.log('Error: ' + error.message);
        }
    });
});
 
app.listen(PORT,()=>{
    console.log(`Server Started @ ${PORT}`)
})