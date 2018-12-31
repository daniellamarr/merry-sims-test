'use strict';
module.exports = (sequelize, DataTypes) => {
  const facebookUsers = sequelize.define('facebookUsers', {
    facebookId: DataTypes.BIGINT,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    image: DataTypes.STRING
  }, {});
  facebookUsers.associate = function(models) {
    // associations can be defined here
  };
  return facebookUsers;
};