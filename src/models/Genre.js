"use strict";

export default (sequelize, DataTypes) => {
  const Genre = sequelize.define(
    "Genre",
    {
      GenreId: {
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
      tableName: "genre",
      timestamps: false,
    }
  );

  Genre.associate = (models) => {
    Genre.hasMany(models.Track, { foreignKey: "GenreId" });
  };

  return Genre;
};
