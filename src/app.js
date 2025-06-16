const express = require('express');

const app = express();
const PORT = process.env.PORT || 3306;

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(PORT, () => {
    console.log(`Minimal server running on http://localhost:${PORT}`);
});