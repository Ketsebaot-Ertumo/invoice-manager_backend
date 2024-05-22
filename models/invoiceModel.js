module.exports = (sequelize, DataTypes) => {
    const Invoice = sequelize.define('Invoice', {
        invoice_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            unique: true,
        },
        client_name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'User'
        },
        client_email: {
            type: DataTypes.STRING,
            // allowNull: false,
            defaultValue: '',
            validate: {
                isEmail: true,
            },
            set(value) {
                if (value) {
                    this.setDataValue('client_email', value.toLowerCase());
                }
            },
        },
        client_phone: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        client_company: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        item_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            // unique: true,
        },
        total: {
            type: DataTypes.DECIMAL(10, 4),
            allowNull: false,
            defaultValue: 0
        },
        exp_date: {
            type: DataTypes.DATEONLY,
        }
        }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
        });
    
        return Invoice;
  };