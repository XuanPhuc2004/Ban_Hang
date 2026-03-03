const md5 = require("md5");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

// [GET] /admin/account
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Account.find(find).select("-password -token");

  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false,
    });
    record.role = role;
  }

  res.render("admin/pages/accounts/index", {
    pageTitle: "Danh sách tài khoản",
    records: records,
  });
};

// [GET] /admin/account/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });

  res.render("admin/pages/accounts/create", {
    pageTitle: "Tạo mới tài khoản",
    roles: roles,
  });
};

// [POST] /admin/account/create
module.exports.createPost = async (req, res) => {
  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });

  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`)
    res.redirect(req.get("referer"));
  } else {
    req.body.password = md5(req.body.password);
    const record = new Account(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [GET] /admin/account/EDIT/:id

module.exports.edit = async (req, res) => {
  let find = {
    _id: req.params.id,
    deleted: false,
  };

  try {
    const data = await Account.findOne(find);

    const role = await Role.find({
      deleted: false,
    });

    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh sửa tài khoản",
      data: data,
      roles: role,
    });

  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  const emailExist = await Account.findOne({
    _id: {$ne: id},
    email: req.body.email,
    deleted: false,
  });

  if(emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`)
  } else {
    if(req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
  
    await Account.updateOne({_id: id}, req.body);
    req.flash("success", "Cập nhật tài khoản thành công!");
  }
  res.redirect(req.get("referer"));
};


// [GET] /admin/account/detail/:id

module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const account = await Account.findOne({
      _id: id,
      deleted: false,
    }).select("-password -token");

    if(!account) {
      req.flash("error", "Tài khoản không tồn tại!");
      res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }

    const role = await Role.findOne({
      _id: account.role_id,
      deleted: false,
    });

    account.role = role;

    res.render("admin/pages/accounts/detail", {
      pageTitle: "Chi tiết tài khoản",
      account,
    });

  } catch (error) {
    req.flash("error", "Không tồn tại trang này!");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
}


// [DELETE] /admin/account/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    await Account.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );

    req.flash("success", "Xóa tài khoản thành công!");
    res.redirect(req.get("referer") || `${systemConfig.prefixAdmin}/accounts`);
  } catch (error) {
    req.flash("error", "Xóa tài khoản không thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};
