const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const members = require("../model/members");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const [authType, authToken] = (authorization || "").split(" ");

  if (!authToken || authType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
    return;
  }
  try {
    const myToken = verifyToken(authToken);
    if (myToken == "jwt expired") {
      // access token 만료
      const userInfo = jwt.decode(authToken, "secret");
      const user_id = userInfo.user_id;
      let refresh_token;
      members.login(user_id).then((u) => {
        // refresh 토큰을 가지고 오는 코드
        refresh_token = u.refresh_token;
        const myRefreshToken = verifyToken(refresh_token);
        if (myRefreshToken == "jwt expired") {
          res.status(400).send({ errorMessage: "로그인이 필요합니다." });
        } else {
          const myNewToken = jwt.sign({ user_id: u.user_id }, "secret", {
            expiresIn: "1200s",
          });
          res.send({ message: "new token", myNewToken });
        }
      });
    } else {
      const { user_id } = jwt.verify(authToken, "secret");
      members.login(user_id).then((u) => {
        res.locals.members = u;
        next();
      });
    }
  } catch (err) {
    res.status(401).send({ errorMessage: err + " : 로그인이 필요합니다." });
  }
};

function verifyToken(token) {
  try {
    return jwt.verify(token, "secret");
  } catch (error) {
    return error.message;
  }
}
