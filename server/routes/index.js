//============================================================================
// Requires
//============================================================================
const express = require('express');
const app = express();

//============================================================================
// Routes - Middleware
//============================================================================
app.use(require('../routes/usuario'));
app.use(require('../routes/categoria'));
app.use(require('../routes/producto'));
app.use(require('../routes/login'));






module.exports = app;