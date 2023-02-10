const fileUpload      = require('express-fileupload');
const express         = require('express')
const ExifImage       = require('exif').ExifImage
const { promisify }   = require('util')
const write           = promisify(require('fs').writeFile)

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
    return `https://www.google.com/maps/@${cal(lat)},${cal(lon)},100m/data=!3m1!1e3`
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
 
    sampleFile.mv(uploadPath, function(err){
        if (err)
            return res.status(500).send(err);
 
        try {
            new ExifImage({ image : __dirname + '/uploads/' + sampleFile.name }, async(error, exifData)=>{
                if (error)
                res.send('Error: '+error.message);
                else{
                    url = getUrl(exifData.gps)
                    await write('map.html',`
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Map</title>
                        </head>
                        <body>
                        <script>
                            function verify(obj){
                                return (obj[0] + obj[1] + obj[2]) == 0
                            }

                            let exif = ${JSON.stringify(exifData)}
                            let url = '${url}'
                            
                            if(url.length>51){
                                alert("Allow Popup to see the map")
                                window.open(url)
                            }
                            else{
                                if(exif){
                                    if(exif.gps=={}){
                                        alert("Image EXIF GPS info is empty")
                                    }
                                    else if(verify(exif.gps.GPSLongitude) && verify(exif.gps.GPSLatitude)){
                                        alert("While taking this image, GPS Access  was given to camera but GPS was off")
                                    }
                                    else{
                                        alert("EXIF GPS info is not present in image")
                                    }
                                }
                                else{
                                    alert("Image doesnot contain EXIF data")
                                }
                                
                            }
                        </script>
                        </body>
                        </html>
                    `)
                    await new Promise(function(resolve) { 
                        setTimeout(resolve, 1000)
                    });
                    res.sendFile(__dirname + '/map.html')
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