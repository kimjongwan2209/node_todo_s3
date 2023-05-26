const db = require("../index");

//todo글 작성
function createPost(user_id, post) {
  const sql =
    "insert into post_table(user_id, post, post_date) values(?,?,now())";

  db.query(sql, [user_id, post], (error, result) => {
    if (error) {
      console.log(error);
      throw error;
    }
    return result;
  });
}

//내가 쓴 todo글 조회
function findPost(user_id) {
  const sql =
    "select * from post_table WHERE post_table.user_id = ? order by post_date asc";

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

//todo 글 중요도 순으로 정렬조회
function findImportant(user_id) {
  const sql =
    "select * from post_table WHERE post_table.user_id = ? order by important desc, post_date asc";

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

//todo글 수정
function update(user_id, post_id, post) {
  const sql =
    "update post_table set post = ? where user_id = ? and post_id = ?";

  const promise = new Promise((resolve, reject) => {
    db.query(sql, [post, user_id, post_id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
  return promise;
}

//todo글 중요도 수정
function importantUpdate(user_id, post_id, important) {
  const sql =
    "update post_table set important = ? where user_id = ? and post_id = ?";

  const promise = new Promise((resolve, reject) => {
    db.query(sql, [important, user_id, post_id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
  return promise;
}

//todo글 제거
function deletePost(user_id, post_id) {
  const sql = "delete from post_table where user_id=? and post_id= ? ";
  const promise = new Promise((resolve, reject) => {
    db.query(sql, [user_id, post_id], (error, result) => {
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
  createPost,
  update,
  importantUpdate,
  findPost,
  findImportant,
  deletePost,
};
