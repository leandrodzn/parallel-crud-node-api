"use strict";

export default (sequelize, DataTypes) => {
  const Artist = sequelize.define(
    "Artist",
    {
      ArtistId: {
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
      tableName: "artist",
      timestamps: false,
    }
  );

  Artist.associate = (models) => {
    Artist.hasMany(models.Album, { foreignKey: "ArtistId" });
  };

  return Artist;
};
