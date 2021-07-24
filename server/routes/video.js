const express = require('express');
const router = express.Router();
const { Video } = require("../models/User");

const { auth } = require("../middleware/auth");

//=================================
//             Video
//=================================


router.post("/uploadfiles", (req, res) => {
    // 비디오 파일을 서버에 저장한다.
    
});

module.exports = router;
