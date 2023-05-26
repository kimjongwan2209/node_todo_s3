const db = require("../index");
const express = require("express");
const router = express.Router();
const aws = require("aws-sdk");
const fs = require("fs");
const https = require("https");

require("dotenv").config();

const key_id = process.env.ACCESSKEYID;
const secret_key = process.env.SECRETACCESSKEY;
const region_address = process.env.REGION;

const s3 = new aws.S3({
  accessKeyId: key_id,
  secretAccessKey: secret_key,
  region: region_address,
});

function s3upload(introImage) {
  let p = new Promise((resolve, reject) => {
    fetch(introImage).then((res) => {
      let filename = introImage.split("/").slice(-1)[0];
      var file = fs.createWriteStream(filename);
      https.get(introImage, function (response) {
        response.pipe(file);
        file.on("finish", function () {
          const param = {
            Bucket: "jongjongbucket",
            Key: filename,
            Body: fs.createReadStream(filename),
            contentType: "image/jpg",
          };
          s3.upload(param, (error, data) => {
            if (error) {
              console.log("upload s3 error", error);
            }
            resolve(data);
          });
        });
      });
    });
  });
  return p;
}

//profile 작성
function createProfile(user_id, user_name, introText, introImage) {
  let p = s3upload(introImage);
  p.then((data) => {
    const sql =
      "insert into profile_table(user_id, user_name, introText, introImage) values(?,?,?,?)";

    db.query(
      sql,
      [user_id, user_name, introText, data.Location],
      (error, result) => {
        if (error) {
          console.log(error);
        }
      }
    );
  });
  return p;
}

//profile 조회
function findProfile(user_id) {
  const sql = "select * from profile_table WHERE profile_table.user_id = ?";

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

//profile 확인로직
function checkedProfile(user_id) {
  const sql = "select user_id from profile_table WHERE user_id = ?";

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

//profile 수정
function update(user_id, user_name, introText, introImage) {
  let p = s3upload(introImage);
  p.then((data) => {
    const sql =
      "update profile_table set user_name = ?, introText=?, introImage=? where user_id = ?";

    db.query(
      sql,
      [user_name, introText, data.Location, user_id],
      (error, result) => {
        if (error) {
          console.log(error);
        }
      }
    );
  });
  return p;
}

module.exports = { db, createProfile, findProfile, update, checkedProfile };
