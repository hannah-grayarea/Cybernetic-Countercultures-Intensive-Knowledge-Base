const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve course files
app.get('/course-files/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'course-files', filename);

    // Check if file exists
    if (fs.existsSync(filePath)) {
        res.download(filePath); // This will force the file to be downloaded
    } else {
        res.status(404).send('File not found');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});