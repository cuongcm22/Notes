const fs = require('fs');
const path = require('path');

// Helper function to write the updated HTML content to the file
const writeFileAsync = (filepath, content) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filepath, content, 'utf8', (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

async function updateHTMLEditor(pathHtmlFile, newHtmlContent) {
    try {
        
        // Check if the file exists
        if (!fs.existsSync(pathHtmlFile)) {
            return res.status(404).json({ message: 'File not found!' });
        }

        // Update the file content with the new HTML content
        await writeFileAsync(pathHtmlFile, newHtmlContent);

        // Return a success message after the file has been updated
        return true
    } catch (error) {
        console.error('Error in updateHTMLEditor:', error);
        return false
    }
}

module.exports = updateHTMLEditor;
