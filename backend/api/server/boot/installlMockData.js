"use strict";

module.exports = async function installlMockData(app) {
  try {
    console.log(
      `------------- run  installlMockData first time at app start -------------------------------`
    );
    const { user, Role, RoleMapping, AccessToken } = app.models;

    await user.destroyAll();
    await Role.destroyAll();
    await RoleMapping.destroyAll();
    await AccessToken.destroyAll();
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
  } catch (e) {
    console.error(`error from installlMockData`);
  }
};
