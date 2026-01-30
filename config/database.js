// const mongoose = require("mongoose");

// module.exports.connect = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URL);
//     console.log("Connet Success");
//   } catch (error) {
//     console.log("Connet Error");
//   }
// }


const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URL, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = { connect };
