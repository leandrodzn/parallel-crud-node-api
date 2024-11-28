"use strict";

export default (sequelize, DataTypes) => {
  const Album = sequelize.define(
    "Album",
    {
      AlbumId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Title: {
        type: DataTypes.STRING(160),
        allowNull: true,
        default: null,
      },
      ArtistId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "album",
      timestamps: false,
    }
  );

  Album.associate = (models) => {
    Album.belongsTo(models.Artist, { foreignKey: "ArtistId" });
  };

  return Album;
};
