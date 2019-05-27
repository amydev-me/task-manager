const express = require('express')
const app = express()
const port = process.env.port || 3000

app.post('/users', (req, res) => {
    res.send('testing');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))