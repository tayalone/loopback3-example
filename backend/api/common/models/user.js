"use strict";

const app = require("../../server/server");

const promiseMultiParty = require("../../server/libs/promiseMultiparty");
const uploadImageS3Async = require("../../server/libs/aws/uploadImageS3Async");

module.exports = function (User) {
  User.observe("after save", async function bindRoleAfterSave(ctx) {
    if (ctx.isNewInstance) {
      const { Role, RoleMapping } = app.models;
      const role = await Role.findOne({ where: { name: "user" } });
      await RoleMapping.create({
        principalType: "USER",
        principalId: ctx.instance.id,
        roleId: role.id,
      });
    }
    return;
  });

  //step1
  User.testAuth = async (req, res) => {
    try {
      return res.send({ message: "OK" });
    } catch (e) {
      console.log(`cath from Business.getInfoByIdentify`, e);
      return res.status(400).send({
        message: "error from testAuth",
        key: "testAuth".toUpperCase(),
      });
    }
  };
  //step2
  User.remoteMethod("testAuth", {
    http: { path: "/test-auth", verb: "get" },
    accepts: [
      { arg: "req", type: "object", http: { source: "req" } },
      { arg: "res", type: "object", http: { source: "res" } },
    ],
  });

  User.testAuthAdmin = async (req, res) => {
    try {
      return res.send({ message: "OK" });
    } catch (e) {
      console.log(`cath from Business.getInfoByIdentify`, e);
      return res.status(400).send({
        message: "error from testAuth",
        key: "testAuth".toUpperCase(),
      });
    }
  };
  User.remoteMethod("testAuthAdmin", {
    http: { path: "/test-auth-admin", verb: "get" },
    accepts: [
      { arg: "req", type: "object", http: { source: "req" } },
      { arg: "res", type: "object", http: { source: "res" } },
    ],
  });
  User.testAuthAdvertiser = async (req, res) => {
    try {
      return res.send({ message: "OK" });
    } catch (e) {
      console.log(`cath from Business.getInfoByIdentify`, e);
      return res.status(400).send({
        message: "error from testAuth",
        key: "testAuth".toUpperCase(),
      });
    }
  };
  User.remoteMethod("testAuthAdvertiser", {
    http: { path: "/test-auth-advertiser", verb: "get" },
    accepts: [
      { arg: "req", type: "object", http: { source: "req" } },
      { arg: "res", type: "object", http: { source: "res" } },
    ],
  });

  User.testUploadImage = async (req, res) => {
    try {
      const { fields, files } = await promiseMultiParty(req);
      console.log(`fields`, fields);
      console.log(`files`, files);

      const image = files.image[0];
      const dimensions = fields.dimensions[0];

      const ressult = await uploadImageS3Async(
        image,
        dimensions,
        "test-loppback3/"
      );

      //image, dimensions, awsPath

      const { isSuccess } = ressult;
      if (isSuccess) {
        const { result } = ressult;
        const newImage = result.reduce((acc, data) => {
          const { type } = data;
          const tmpAcc = { ...acc };
          tmpAcc[type] = data;
          return tmpAcc;
        }, {});

        return res.send({ message: "OK", newImage: newImage });
      } else {
        return res.status(500).send({
          message: "upload failed",
          key: "upload_failed".toUpperCase(),
        });
      }

      return res.send({ message: "OK", ressult });
    } catch (e) {
      console.log("e", e);
      return res
        .status(500)
        .send({ message: "error from Users/test-upload-image" });
    }
  };
  User.remoteMethod("testUploadImage", {
    http: { path: "/test-upload-image", verb: "post" },
    accepts: [
      { arg: "req", type: "object", http: { source: "req" } },
      { arg: "res", type: "object", http: { source: "res" } },
    ],
  });
  User.testUpdateDataByBodyParams = async (
    req,
    res,
    options,
    firstName,
    address,
    color
  ) => {
    try {
      return res.send({ message: "OK", firstName, address, color });
    } catch (e) {
      console.log("e", e);
      return res
        .status(500)
        .send({ message: "error from Users/test-upload-image" });
    }
  };
  User.remoteMethod("testUpdateDataByBodyParams", {
    http: { path: "/test-update-data-by-body-params", verb: "post" },
    accepts: [
      { arg: "req", type: "object", http: { source: "req" } },
      { arg: "res", type: "object", http: { source: "res" } },
      { arg: "options", type: "object", http: "optionsFromRequest" },
      { arg: "firstName", type: "string", required: true },
      { arg: "address", type: "object", required: true },
      { arg: "color", type: "array", required: true },
    ],
  });
};
