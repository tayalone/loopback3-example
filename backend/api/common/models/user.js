"use strict";

const app = require("../../server/server");

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
};
