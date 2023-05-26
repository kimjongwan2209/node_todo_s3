const express = require("express");
const router = express.Router();
const profile = require("../model/profile");
const authUsers = require("../middleware/authUsers");

//profile 생성
router.post("/profile/", authUsers, async (req, res) => {
  const { user_name, introText, introImage } = req.body;
  const { user_id } = req.cookies;

  if (!user_name) {
    return res.status(412).json({ errorMessage: "닉네임을 확인해주세요." });
  }

  profile.checkedProfile(user_id).then((result) => {
    if (result.length === 0) {
      profile
        .createProfile(user_id, user_name, introText, introImage)
        .then((result) => {
          console.log(result);
          return res.status(200).json({
            message: "프로필을 생성하였습니다.",
          });
        });
    } else {
      return res.status(400).json({
        message: "중복된 프로필입니다.",
      });
    }
  });
});

//profile 조회
router.get("/profileGet/:user_id", authUsers, async (req, res) => {
  const { user_id } = req.params;

  profile.findProfile(user_id).then((result) => {
    console.log(result);
    if (result.length === 0) {
      return res
        .status(400)
        .json({ message: "프로필이 존재하지 않는 회원입니다." });
    }
    return res.status(200).json(result);
  });
});

//profile 수정
router.put("/reprofile/", authUsers, async (req, res) => {
  const { user_id } = req.cookies;
  const { user_name, introText, introImage } = req.body;

  if (!user_name) {
    return res.status(412).json({ errorMessage: "닉네임을 확인해주세요." });
  }

  profile.update(user_id, user_name, introText, introImage).then((result) => {
    console.log(result);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "게시글 수정이 실패하였습니다." });
    }
    return res.status(200).json({ message: "게시글 수정이 완료 되었습니다." });
  });
});

module.exports = router;
