const app = require('./index.js');
let port = 8080;
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});