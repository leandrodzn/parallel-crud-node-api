"use strict";

export default (sequelize, DataTypes) => {
  const Track = sequelize.define(
    "Track",
    {
      TrackId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Name: {
        type: DataTypes.STRING(200),
        allowNull: true,
        default: null,
      },
      AlbumId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: null,
      },
      MediaTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      GenreId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: null,
      },
      Composer: {
        type: DataTypes.STRING(220),
        allowNull: true,
        default: null,
      },
      Milliseconds: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Bytes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: null,
      },
      UnitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: "track",
      timestamps: false,
    }
  );

  Track.associate = (models) => {
    Track.belongsTo(models.Album, { foreignKey: "AlbumId" });
  };

  return Track;
};
