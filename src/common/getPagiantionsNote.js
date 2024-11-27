const {
    User,
    Note
} = require('../models/models')

async function getPaginationNote(req, res) {
    try {
        const { pagination, totalItems } = req.params;
        const page = parseInt(pagination);  // Current page
        const total = parseInt(totalItems); // Total items (passed from front-end or calculated)
        const perPage = 10;  // Number of items per page
        const skip = (page - 1) * perPage; // Number of items to skip

        // Query to get the notes based on the pagination and limit
        const notes = await Note.find()
            .sort({ createdAt: -1 }) // Sort by createdAt descending (newest first)
            .skip(skip)
            .limit(perPage);

        const totalPages = Math.ceil(total / perPage);
        const showingStart = skip + 1;
        const showingEnd = Math.min(skip + perPage, total);

        // Return pagination info and notes
        return {
            notes,
            pagination: {
                showing: `${showingStart} to ${showingEnd} of ${total} Entries`,
                totalPages,
                currentPage: page,
            }
        };
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching paginated notes');
    }
}

module.exports = getPaginationNote;
