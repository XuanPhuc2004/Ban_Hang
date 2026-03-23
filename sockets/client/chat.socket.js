// const Chat = require("../../models/chat.model");


// module.exports = (res) => {
//   const userId = res.locals.user.id;
//   const fullName = res.locals.user.fullName;
//   // socket
//   _io.on("connection", (socket) => {
//     socket.on("CLIENT_SEND_MESSAGE", async (content) => {
//       // luu vao db
//       const chat = new Chat({
//         user_id: userId,
//         content: content
//       });
//       await chat.save();

//       // tra data ve client
//       _io.emit("SERVER_RETURN_MESSAGE", {
//         userId: userId,
//         fullName: fullName,
//         content: content
//       });
//     });

//     // typing
//     socket.on("CLIENT_SEND_TYPING", async (type) => {
//       socket.broadcast.emit("SERVER_RETURN_TYPING",  {
//         userId: userId,
//         fullName: fullName,
//         type: type
//       });
//     });


//   });
// }












const Chat = require("../../models/chat.model");

module.exports = (io) => {
  io.on("connection", (socket) => {

    const userId = socket.handshake.auth.userId;
    const fullName = socket.handshake.auth.fullName;

    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      const chat = new Chat({
        user_id: userId,
        content: content
      });

      await chat.save();

      io.emit("SERVER_RETURN_MESSAGE", {
        userId,
        fullName,
        content
      });
    });

    socket.on("CLIENT_SEND_TYPING", (type) => {
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        userId,
        fullName,
        type
      });
    });
  });
};