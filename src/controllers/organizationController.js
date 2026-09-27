const Organization = require("../models/organization");

const createOrganization = async (req, res) => {
    try {
        const { name, type, address, contact } = req.body;

        const organization = await Organization.create({
            name,
            type,
            address,
            contact
        });

        res.status(201).json({
            success: true,
            message: "Organization created successfully",
            organization
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create organization",
            error: error.message
        });
    }
};

module.exports = {
    createOrganization
};