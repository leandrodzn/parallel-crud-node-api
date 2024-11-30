"use strict";

export default (sequelize, DataTypes) => {
  const InvoiceLine = sequelize.define(
    "InvoiceLine",
    {
      InvoiceLineId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      InvoiceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      TrackId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      UnitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      Quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "invoiceline",
      timestamps: false,
    }
  );

  InvoiceLine.associate = (models) => {
    InvoiceLine.belongsTo(models.Track, { foreignKey: "TrackId" });
  };

  return InvoiceLine;
};
