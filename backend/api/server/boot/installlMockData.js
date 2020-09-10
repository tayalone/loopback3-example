"use strict";

module.exports = async function installlMockData(app) {
  try {
    console.log(
      `------------- run  installlMockData first time at app start -------------------------------`
    );
    if (false) {
      const { user, Role, RoleMapping, AccessToken, project } = app.models;

      await user.destroyAll();
      await Role.destroyAll();
      await RoleMapping.destroyAll();
      await AccessToken.destroyAll();
      await project.destroyAll();
      console.log(`done clear data`);

      // // ----------------- สร้าง role -----------------------------------
      const advertiserRole = await Role.create({
        name: "advertiser",
      });
      const adminRole = await Role.create({
        name: "admin",
      });
      const userRole = await Role.create({
        name: "user",
      });
      //// ------------------------------------------------------------------
      const user1 = await user.create({
        email: "a1@a.com",
        password: "1234567i",
        emailVerified: true,
        firstName: "a1_firstName",
        lastName: "a1_lastName",
      });

      await project.create([
        { name: "project1", budget: 100, userId: user1.id },
        { name: "project2", budget: 1000, userId: user1.id },
      ]);

      const advertiserUser = await user.create({
        email: "advertiser@a.com",
        password: "1234567i",
        emailVerified: true,
        firstName: "a1_firstName",
        lastName: "a1_lastName",
      });

      await RoleMapping.create({
        principalType: "USER",
        principalId: advertiserUser.id,
        roleId: advertiserRole.id,
      });

      const adminUser = await user.create({
        email: "admin@a.com",
        password: "1234567i",
        emailVerified: true,
        firstName: "a1_firstName",
        lastName: "a1_lastName",
      });
      await RoleMapping.create({
        principalType: "USER",
        principalId: adminUser.id,
        roleId: adminRole.id,
      });
    }
  } catch (e) {
    console.error(`error from installlMockData`);
  }
};
