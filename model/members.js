const db = require("../index");

//회원가입 로직
function makeId(user_id, password, name, telephone, email, address) {
  const sql =
    "insert into members(user_id, password, name, telephone, email, address) values (?,?,?,?,?,?)";

  console.log(user_id, password, name, telephone, email, address);
  db.query(
    sql,
    [user_id, password, name, telephone, email, address],
    (error, result) => {
      if (error) throw error;
      console.log(result);
    }
  );
}

//회원 확인 로직
function checkedId(user_id) {
  const sql = "select user_id from members where user_id = ?";

  const promise = new Promise((resolve, reject) => {
    db.query(sql, [user_id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
  return promise;
}

//로그인 로직
function login(user_id, password) {
  const sql = "select * from members where user_id=? and password =?";

  const promise = new Promise((resolve, reject) => {
    db.query(sql, [user_id, password], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
  return promise;
}

//데이터베이스 토큰 저장
function token(user_id, log_in_date, expires_date, refreshToken) {
  const sql =
    "insert into log_in_confirm(user_id, log_in_date, expires_date, refresh_token) values(?,now(),date_add(now(), interval 14 day),?)";

  const promise = new Promise((resolve, reject) => {
    db.query(
      sql,
      [user_id, log_in_date, expires_date, refreshToken],
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      }
    );
  });
  return promise;
}

//리프레쉬 토큰을 가져오는 로직
function refreshGet(user_id) {
  const sql = "select refresh_token from log_in_confirm where user_id=?";

  const promise = new Promise((resolve, reject) => {
    db.query(sql, [user_id], (error, result) => {
      if (error) {
        reject(error);
      }
      console.log(result);
      resolve(result);
    });
  });
  return promise;
}

//데이터 베이스 업데이트
function updateToken(user_id, refreshToken) {
  const sql =
    "update log_in_confirm set expires_date = date_add(now(), interval 3 day), refresh_token = ? where user_id = ?";

  console.log(user_id, refreshToken);
  const promise = new Promise((resolve, reject) => {
    db.query(sql, [refreshToken, user_id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
  return promise;
}
module.exports = {
  db,
  makeId,
  login,
  token,
  refreshGet,
  updateToken,
  checkedId,
};
