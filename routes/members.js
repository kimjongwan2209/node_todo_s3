const express = require("express");
const router = express.Router();
const members = require("../model/members");
const jwt = require("jsonwebtoken");
const authUsers = require("../middleware/authUsers");

//회원가입 api

router.post("/members", async (req, res) => {
  const { user_id, password, name, telephone, email, address } = req.body;

  if (!(user_id && password && name && telephone && email && address)) {
    return res.status(412).json({ errorMessage: "입력값을 확인해주세요." });
  }

  //아이디, 패스워드, 이메일 제한요건

  const create_user_id = /^[a-zA-z0-9]{3,12}$/;

  if (!create_user_id.test(user_id)) {
    return res
      .status(412)
      .json({ errorMessage: "아이디 형식이 일치하지 않습니다." });
  }
  if (password.length < 4) {
    return res
      .status(412)
      .json({ errorMessage: "비밀번호 형식이 올바르지 않습니다." });
  }

  if (password.includes(user_id)) {
    return res
      .status(412)
      .json({ errorMessage: "패스워드에 닉네임이 포함되어 있습니다." });
  }

  const create_email = /^[a-zA-Z0-9]+@[a-z]+\.[a-z]{2,3}$/;

  if (!create_email.test(email)) {
    return res
      .status(412)
      .json({ errorMessage: "이메일 형식이 올바르지 않습니다." });
  }

  members.checkedId(user_id).then((result) => {
    if (result.length === 0) {
      members.makeId(user_id, password, name, telephone, email, address);
      return res.status(200).json({ message: "회원가입이 완료 되었습니다." });
    } else {
      return res
        .status(400)
        .json({ errorMessage: "사용 할 수 없는 아이디 입니다." });
    }
  });
});

//로그인 api

let tokenObject = {};

router.post("/login/", async (req, res) => {
  const { user_id, password } = req.body;
  if (!(user_id && password)) {
    return res.status(412).json({ errorMessage: "입력값을 확인해주세요." });
  }
  try {
    const accessToken = jwt.sign({ user_id: members.user_id }, "secret", {
      expiresIn: "1200s",
    });
    const refreshToken = jwt.sign({}, "secret", {
      expiresIn: "3d",
    });
    members.login(user_id, password).then((result) => {
      if (result.length == 0) {
        return res.status(400).json({ message: "로그인에 실패하였습니다." });
      }
      members.refreshGet(user_id).then((result) => {
        if (!result[0]["refresh_token"]) {
          members.token(user_id, refreshToken).then((result) => {
            return res.status(200).json({ message: "토큰발급완료" });
          });
        }
        if (result[0]["refresh_token"]) {
          members.updateToken(user_id, refreshToken).then((result) => {
            return res.status(200).json({ message: "로그인 되었습니다." });
          });
        }
      });
      // 토큰 생성, 쿠키에 기록
      tokenObject[refreshToken] = user_id;
      res.cookie("accessToken", accessToken);
      res.cookie("refreshToken", refreshToken);
      res.cookie("user_id", user_id);
    });
  } catch (err) {
    res.status(400).send({ message: err + " : login failed" });
  }
});

module.exports = router;
