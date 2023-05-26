const express = require("express");
const router = express.Router();
const Post = require("../model/post");
const authUsers = require("../middleware/authUsers");

//post 작성
router.post("/post/", authUsers, async (req, res) => {
  const { post } = req.body;
  const { user_id } = req.cookies;

  if (!post) {
    return res.status(412).json({ errorMessage: "할 일을 적어주세요." });
  }

  try {
    await Post.createPost(user_id, post);

    return res.status(200).json({
      message: "게시글을 생성하였습니다.",
    });
  } catch (error) {
    return res.status(400).json({
      message: "게시물 등록이 실패하였습니다.",
    });
  }
});

//내가 쓴 todo글 기본정렬
router.get("/postGet/:user_id", authUsers, async (req, res) => {
  const { user_id } = req.params;

  Post.findPost(user_id).then((result) => {
    console.log(result);
    if (result.length === 0) {
      return res.status(400).json({ message: "게시글이 없습니다." });
    }
    return res.status(200).json({ result });
  });
});

//중요도 순으로 정렬한 api
router.get("/importantGet/:user_id", authUsers, async (req, res) => {
  const { user_id } = req.params;

  Post.findImportant(user_id).then((result) => {
    console.log(result);
    if (result.length === 0) {
      return res.status(400).json({ message: "게시글이 없습니다." });
    }
    return res.status(200).json({ result });
  });
});

//중요도 설정 api
router.put("/postImportant/:post_id", authUsers, async (req, res) => {
  const { post_id } = req.params;
  const { important } = req.body;
  const { user_id } = req.cookies;

  Post.importantUpdate(user_id, post_id, important).then((result) => {
    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ message: "우선순위 지정에 실패하였습니다." });
    }
    if (important === "1") {
      return res.status(200).json({ message: "우선순위로 지정 되었습니다." });
    }
    if (important === "0") {
      return res.status(200).json({ message: "우선순위 해제 되었습니다." });
    }
  });
});

//todo글 수정
router.put("/post/:post_id", authUsers, async (req, res) => {
  const { post_id } = req.params;
  const { post } = req.body;
  const { user_id } = req.cookies;

  if (!post) {
    return res.status(412).json({ errorMessage: "할 일을 적어주세요." });
  }

  Post.update(user_id, post_id, post).then((result) => {
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "게시글 수정이 실패하였습니다." });
    }
    return res.status(200).json({ message: "게시글 수정이 완료 되었습니다." });
  });
});

//todo글 삭제
router.delete("/post/:post_id", authUsers, async (req, res) => {
  const { post_id } = req.params;
  const { user_id } = req.cookies;

  Post.deletePost(user_id, post_id).then((result) => {
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "게시글 삭제에 실패하였습니다." });
    }
    return res.status(200).json({ message: "게시글 삭제가 완료 되었습니다." });
  });
});

module.exports = router;
