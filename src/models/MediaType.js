"use strict";

export default (sequelize, DataTypes) => {
  const MediaType = sequelize.define(
    "MediaType",
    {
      MediaTypeId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Name: {
        type: DataTypes.STRING(120),
        allowNull: true,
        default: null,
      },
    },
    {
      tableName: "mediatype",
      timestamps: false,
    }
  );

  MediaType.associate = (models) => {
    MediaType.hasMany(models.Track, { foreignKey: "MediaTypeId" });
  };

  return MediaType;
};
