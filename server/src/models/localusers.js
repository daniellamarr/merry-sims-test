'use strict';
module.exports = (sequelize, DataTypes) => {
  const localUsers = sequelize.define('localUsers', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password:DataTypes.STRING,
    image: DataTypes.STRING,
    bio: DataTypes.STRING
  }, {});
  localUsers.associate = function(models) {
    // associations can be defined here
  };
  return localUsers;
};