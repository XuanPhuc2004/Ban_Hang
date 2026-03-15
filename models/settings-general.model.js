const { default: mongoose } = require("mongoose");

const settingSchema = new mongoose.Schema({
  websiteName: String,
  logo: String,
  phone: String,
  email: String,
  address: String,
  coppyright: String,
  
}, {
  timestamps: true
});

const SettingGeneral = mongoose.model("SettingGeneral", settingSchema, "setting-general");

module.exports = SettingGeneral;
