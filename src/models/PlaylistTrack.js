"use strict";

export default (sequelize, DataTypes) => {
  const PlaylistTrack = sequelize.define(
    "PlaylistTrack",
    {
      PlaylistId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      TrackId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      tableName: "playlisttrack",
      timestamps: false,
    }
  );

  PlaylistTrack.associate = (models) => {
    PlaylistTrack.belongsTo(models.Track, { foreignKey: "TrackId" });
  };

  return PlaylistTrack;
};
