const express = require('express')
const router = express.Router()
//const { Video } = require("../models/User");

const { auth } = require("../middleware/auth")
const multer = require('multer')
var ffmpeg = require('fluent-ffmpeg')


// Multer Options
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4' || ext !== '.jpg') {
            return cb(res.status(400).end('only jpg, mp4 is allowed'), false)
        }
        cb(null, true)
    }
})

const upload = multer({ storage: storage }).single('file')


//=================================
//             Video
//=================================


router.post("/uploadfiles", (req, res) => {
    // 비디오 파일을 서버에 저장한다.

    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, url: res.req.file.path, filename: res.req.file.filename })
    })
})

router.post("/thumbnail", (req, res) => {
    let filePath = ""
    let fileDuration = ""

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function(err, metadata) {
        console.dir(metadata)
        console.log(metadata.format.duration)
        fileDuration = metadata.format.duration
    })

    // thumbnail 생성
    ffmpeg(req.body.url)
    .on('filenames', function(filenames) {
        console.log('Will generate ' + filenames.join(', '))
        console.log(filenames)

        filePath = 'uploads/thumbnails/' + filenames[0]
    })
    .on('end', function() {
        console.log('Screenshots taken')
        return res.json({ success: true, url: filePath, filename: filenames, fileDuration: fileDuration })
    })
    .on('error', function(err) {
        console.error(err)
        return res.json({ success: false, err})
    })
    .screenshots({
        count: 3,
        folder: 'uploads/thumbnails',
        size: '320x240',
        filename: 'thumbnail-%b.png'
    })

})

module.exports = router;
