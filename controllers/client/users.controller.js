const User = require("../../models/user.model");

const usersSocket = require("../../sockets/client/users.socket");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  // socket
  usersSocket(res);
  // end socket

  const userId = res.locals.user.id;
  const myUser = await User.findOne({
    _id: userId,
  });

  const requestFriends = myUser.requestFriend;
  const acceptFriend = myUser.acceptFriend;
  const friendList = myUser.friendList;
  const friendListId = friendList.map(item => item.user_id);

  const users = await User.find({
    $and: [
      {
        _id: { $ne: userId }, // tim ra cái id không bằng cái hiện tại
      },
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriend } },
      { _id: { $nin: friendListId } },
    ],

    // loai tru
    status: "active",
    deleted: false,
  }).select("fullName avatar _id");

  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users,
  });
};

// [GET] users/request
module.exports.request = async (req, res) => {
  // socket
  usersSocket(res);
  // end socket

  const userId = res.locals.user.id;
  const myUser = await User.findOne({
    _id: userId,
  });

  const requestFriends = myUser.requestFriend;
  const acceptFriend = myUser.acceptFriend;

  const users = await User.find({
    _id: { $in: requestFriends },

    // loai tru
    status: "active",
    deleted: false,
  }).select("fullName avatar _id");

  res.render("client/pages/users/request", {
    pageTitle: "Lời mời đã gửi",
    users: users,
  });
};

// [GET] users/accept
module.exports.accept = async (req, res) => {
  // socket
  usersSocket(res);
  // end socket

  const userId = res.locals.user.id;
  const myUser = await User.findOne({
    _id: userId,
  });

  const acceptFriend = myUser.acceptFriend;

  const users = await User.find({
    _id: { $in: acceptFriend },

    // loai tru
    status: "active",
    deleted: false,
  }).select("fullName avatar _id");

  res.render("client/pages/users/accept", {
    pageTitle: "Lời mời đã nhận",
    users: users,
  });
};

// [GET] users/friends
module.exports.friends = async (req, res) => {
  // socket
  usersSocket(res);
  // end socket

  const userId = res.locals.user.id;
  const myUser = await User.findOne({
    _id: userId,
  });

  const friendList = myUser.friendList;
  const friendListId = friendList.map((item) => item.user_id);

  const users = await User.find({
    _id: { $in: friendListId },
    status: "active",
    deleted: false,
  }).select("fullName avatar id statusOnline");

  for (const user of users) {
    const infoFriend = friendList.find(friend => friend.user_id == user.id);
    user.infoFriend = infoFriend;
  }

  res.render("client/pages/users/friends", {
    pageTitle: "Danh sách bạn bè",
    users: users,
  });
};
