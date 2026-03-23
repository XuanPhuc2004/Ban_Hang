const User = require("../../models/user.model");


// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  const userId = res.locals.user.id;


  const users = await User.find({
    _id: {$ne: userId}, // tim ra cái id không bằng cái hiện tại
    status: "active",
    deleted: false
  }).select("fullName avatar id");



  res.render("client/pages/users/not-friend" , {
    pageTitle: "Danh sách người dùng",
    users: users,
  });
}