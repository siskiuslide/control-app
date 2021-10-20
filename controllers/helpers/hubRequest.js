const fetch = require("node-fetch");

const hubRequest = async function (url) {
  const hubResponse = await fetch(url, { method: `GET` })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  return hubResponse;
};

module.exports = hubRequest;
