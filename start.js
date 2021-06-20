/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////
const path = require('path');
const express = require('express');
const mongoose = require("mongoose")

const PORT = process.env.PORT || 5001;
const config = require('./config');

if (config.credentials.client_id == null || config.credentials.client_secret == null) {
    console.error('Missing FORGE_CLIENT_ID or FORGE_CLIENT_SECRET env. variables.');
    return;
}

const startDB =  async () => {
    try {
        await mongoose.connect(config.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    } catch (e) {
        console.log("Message error", e);
        process.exit(1);
    }
}

let app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));

app.use('/api/forge/oauth', require('./routes/oauth'));
app.use('/api/forge/oss', require('./routes/oss'));
app.use('/api/forge/modelderivative', require('./routes/modelderivative'));
app.use('/api/forge/notes', require('./routes/notes'));
app.use('/api/forge/auth', require('./routes/auth'))
app.use('/api/forge/project', require('./routes/project'))
app.use('/api/forge/email', require('./routes/email'));
app.use('/api/forge/workset', require('./routes/workset'));
app.use('/api/forge/token', require('./routes/token'));
app.use('/api/forge/role', require('./routes/role'));
app.use('/api/forge/file', require('./routes/file'));
app.use('/api/forge/folders', require('./routes/folders'));
app.use('/api/forge/table', require('./routes/table'));
app.use('/api/forge/users', require('./routes/users'));
app.use('/api/forge/buckets', require('./routes/bucket'));
app.use('/api/forge/info', require('./routes/info'));

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode).json(err);
});

startDB().then();

app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });
