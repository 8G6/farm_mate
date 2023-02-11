const fileUpload    = require('express-fileupload');
const express       = require('express')
const ExifImage     = require('exif').ExifImage
const bodyParser = require('body-parser')


const PORT = process.env.PORT || 3030;
let pos,er='';

const app = express();
app.set('view engine', 'ejs')

function cal(lant){
    return lant[0] + (lant[1]/60) + (lant[2]/3600)
}

function verify(latlon){
    return (latlon[0] + latlon[1] + latlon[2])!=0
}

function getUrl(gps){
    let lat    = gps.GPSLatitude
    let lon    = gps.GPSLongitude
    let cordD  = `${lat[0]}°${lat[1]}'${lat[2]}\"${gps.GPSLatitudeRef},${lon[0]}°${lon[1]}'${lon[2]}\"${gps.GPSLongitudeRef}`
    let cordA  = `${cal(lat)},${cal(lon)}`
    return {
        cordA:cordA,
        cordD:cordD
    }
}

app.use(fileUpload());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('body',{
        zoom:14,
        cordA:'47.50737,19.04611',
        cordD:'',
        er:"No files uploaded"
    })
})
 
app.post('/upload', function (req, res) {
    
    let sampleFile;
    let uploadPath;
 
    if (!req.files || Object.keys(req.files).length === 0) {
        res.render('body',{
            zoom:14,
            cordA:'47.50737,19.04611',
            cordD:'',
            er:"No files uploaded"
        })
    }
  
    sampleFile = req.files.file;
    uploadPath = __dirname + '/uploads/' + sampleFile.name;
 
    sampleFile.mv(uploadPath, function(err){
        if (err){
            res.render('body',{
                zoom:14,
                cordA:'47.50737,19.04611',
                cordD:'',
                er:err
            })
        }
        try {
            new ExifImage({ image : __dirname + '/uploads/' + sampleFile.name }, async(er, exifData)=>{
                if (er){
                    er="EXIF data is corroupted or source of the image is social media platforms like facebook , twitter etc. They delete EXIF data due to privacy concerns"
                    res.render('body',{
                        zoom:14,
                        cordA:'47.50737,19.04611',
                        cordD:'',
                        er:er
                    })
                }
                else{
                    if(!exifData.gps){
                        er = "GPS info not found"
                        res.render('body',{
                            zoom:14,
                            cordA:'47.50737,19.04611',
                            cordD:'',
                            er:er
                        })
                    }
                    if(!exifData.gps.GPSLongitude || !exifData.gps.GPSLatitude){
                        er = "GPS Longitude or GPS Latitude Missing"
                        res.render('body',{
                            zoom:14,
                            cordA:'47.50737,19.04611',
                            cordD:'',
                            er:er
                        })
                    }
                    if(!verify(exifData.gps.GPSLongitude) && !verify(exifData.gps.GPSLatitude)){
                        er = "GPS accecs  was given to camera,but GPS was off while capturing this"
                        res.render('body',{
                            zoom:14,
                            cordA:'47.50737,19.04611',
                            cordD:'',
                            er:er
                        })
                    }
                    if(verify(exifData.gps.GPSLatitude) && verify(exifData.gps.GPSLatitude)){
                        console.log(exifData)
                        pos = getUrl(exifData.gps)
                        res.render('body',{
                            zoom:req.body.zoom,
                            cordA:pos.cordA,
                            cordD:pos.cordD,
                            er:''
                        })
                    }
                }
            });
           
           
        } catch (er) {
            console.log('er: ' + er.message);
        }
    });
});
 
app.listen(PORT,()=>{
    console.log(`Server Started @ ${PORT}`)
})