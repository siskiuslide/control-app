const urlHelper = require("./helpers/urlHelper");
const Device = require("./../models/deviceModels");
const fetch = require("node-fetch");

exports.getAllDevices = async function (req, res) {
  //prettier-ignore
  try{
    const url = urlHelper.buildURL("cloud","65eae03a-9c4f-4fca-a6cd-8837829f956f",1375,"94f86fe4-44dd-4dca-8334-5c722eba83a3","devices");
    const hubResponse = await fetch(url, { method: "GET" }).then(res => res.json()).catch(err => console.log(err))
    hubResponse.forEach(item=> {
      const document = {
        deviceID: item.id,
        name: item.name,
        label: item.label,
        type: item.type,
        status: item.attributes.switch,
        commands: item.commands
      }
      Device.docChecker(document)
  })
    res.status(200).json({status: "success", data: hubResponse})
}catch(err){
console.log(err)
res.status(400).json({status: "failed"})}
};
exports.getDevice = function (req, res) {
  //called when a request comes from the frontend
  //use the req object to make fetch
  //make request to MONGO for device details and send it as a response
  return res.status(200).json({ status: "Success", data: { id: `${req.params.id}`, name: `Lightbulb`, status: "on" } });
};

exports.deleteDevice = function (req, res) {
  //remove from list of devices that appear in /devices/:id page or on the individual
  //will be added to a list of exclusions
  //then reload the /devices page
  res.send("x");
  return console.log("z");
};
