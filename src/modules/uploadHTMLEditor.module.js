const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const uploadFolder = path.join(__dirname, '..', 'upload'); // Make sure this folder exists

// Helper function to write the HTML content to the file
const writeFileAsync = (filepath, content) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filepath, content, 'utf8', (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

async function uploadHTMLEditor(req, res) {
    try {
        const editorContent = req.body.editor;

        // Use Cheerio to parse the HTML
        const $ = cheerio.load(editorContent);
        // Remove unwanted elements (like div and svg)
        $('div, svg').remove();

        // Get the cleaned HTML content
        const cleanContent = $.html();

        // Generate a unique file name
        const fileIndex = fs.readdirSync(uploadFolder).length + 1;
        const timestamp = Math.floor(new Date().getTime() / 1000) + 7;
        const filename = `Editor_${fileIndex}_${timestamp}.html`;
        const filepath = path.join(uploadFolder, filename);

        // Wait for the file to be written asynchronously
        await writeFileAsync(filepath, cleanContent);

        // Return the success message with file location after writing is done
        return {
            message: `File ${filename} created successfully!`,
            location: filepath, // Return the location of the file
        };
    } catch (error) {
        console.error('Error in uploadHTMLEditor:', error);
        return res.status(500).json({ message: 'Error while processing the request' });
    }
}

module.exports = uploadHTMLEditor;
