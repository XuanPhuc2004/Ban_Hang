const User = require("../../models/user.model");

module.exports = (res) => {
  _io.on("connection", (socket) => {
    // chức năng gửi yêu cầu
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // console.log(myUserId); // id cua A
      // console.log(userId); // id cua B

      // them id cua A vao acceptFriends cua B
      const existIdAinB = await User.findOne({
        _id: userId,
        acceptFriend: myUserId, // trong accep co id ong A chua
      });

      if (!existIdAinB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: { acceptFriend: myUserId },
          }
        );
      }

      // them id cua B vao requestFriends cua A
      const existIdBinA = await User.findOne({
        _id: myUserId,
        requestFriend: userId, // trong requesy co id ong B chua
      });

      if (!existIdBinA) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $push: { requestFriend: userId },
          }
        );
      }

      // lấy ra độ dài cảu acceptFriend của B trả về cho B 
      const infoUserB = await User.findOne({
        _id: userId
      });
      const lengthAcceptFriends = infoUserB.acceptFriend.length;
      
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userId,
        lengthAcceptFriends: lengthAcceptFriends
      });

      // lấy info của A trả về cho B 
      const infoUserA = await User.findOne({
        _id: myUserId
      }).select("_id fullName");

      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
        userId: userId,
        infoUserA: infoUserA
      });
    });

    // chức năng hủy gửi yêu cầu
    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // console.log(myUserId); // id cua A
      // console.log(userId); // id cua B

      // Xóa id cua A trong acceptFriends cua B
      const existIdAinB = await User.findOne({
        _id: userId,
        acceptFriend: myUserId, // trong accep co id ong A chua
      });

      if (existIdAinB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { acceptFriend: myUserId },
          }
        );
      }

      // xóa id cua B trong requestFriends cua A
      const existIdBinA = await User.findOne({
        _id: myUserId,
        requestFriend: userId, // trong requesy co id ong B chua
      });

      if (existIdBinA) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $pull: { requestFriend: userId },
          }
        );
      }

      // lấy ra độ dài cảu acceptFriend của B trả về cho B 
      const infoUserB = await User.findOne({
        _id: userId
      });
      const lengthAcceptFriends = infoUserB.acceptFriend.length;
      
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userId,
        lengthAcceptFriends: lengthAcceptFriends
      });

      // lấy Id của A và trả về cho b
      socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
        userIdB: userId,
        userIdA: myUserId
      });
    });


    // chức năng từ chối kết bạn
    socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // console.log(myUserId); // id cua B
      // console.log(userId); // id cua A

      // Xóa id cua A trong acceptFriends cua B
      const existIdAinB = await User.findOne({
        _id: myUserId,
        acceptFriend: userId, // trong accep co id ong A chua
      });

      if (existIdAinB) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $pull: { acceptFriend: userId },
          }
        );
      }

      // xóa id cua B trong requestFriends cua A
      const existIdBinA = await User.findOne({
        _id: userId,
        requestFriend: myUserId, // trong requesy co id ong B chua
      });

      if (existIdBinA) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { requestFriend: myUserId },
          }
        );
      }
    });

    // chức năng chấp nhận kết bạn
    socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // console.log(myUserId); // id cua B
      // console.log(userId); // id cua A

      // thêm {user_id, room_chat_id} của A vào friendList của B
      // Xóa id cua A trong acceptFriends cua B
      const existIdAinB = await User.findOne({
        _id: myUserId,
        acceptFriend: userId, // trong accep co id ong A chua
      });

      if (existIdAinB) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $push: {
              friendList: { user_id: userId, room_chat_id:"" },
            },
            $pull: { acceptFriend: userId },
          }
        );
      }

      // thêm {user_id, room_chat_id} của B vào friendList của A
      // xóa id cua B trong requestFriends cua A
      const existIdBinA = await User.findOne({
        _id: userId,
        requestFriend: myUserId, // trong requesy co id ong B chua
      });

      if (existIdBinA) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: {
              friendList: { user_id: myUserId, room_chat_id: "" },
            },
            $pull: { requestFriend: myUserId },
          }
        );
      }
    });
  });
};
