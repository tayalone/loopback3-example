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
};
