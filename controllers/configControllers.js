const Config = require("./../models/configModels");

exports.getConfig = async function(req,res){
    try{
      const configs = await Config.find() 
      res.status(200).json({status: "success", body: configs})
    }catch(err){
      res.status(400).json({status: "failed", message: err})    }
  }
exports.getSingleConfig = async function(req,res){
  try{
    await Config.find({_id: req.params.id}).then(data=>{
      res.status(200).json({status: "success", data:data})

    })
  }catch(err){
    console.log(err)
    res.status(404).json({status: "failed", message: err})
  }
}

exports.createConfig= async function (req, res) {
  try {

    Config.exists({name: req.body.name}, function(err, result){
      if (result == true){
        return res.status(400).json({status: "failed", message: "bad request"})
      }if(err){console.log(err)}
    })
    await Config.create(req.body).then((data) => {
      res.status(200).json({status: "success", data: req.body });
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({status: "failed", message: err})
  }
}
exports.updateConfig = async function (object) {
  try {
    await Config.findOneAndUpdate({ name: object.name }, object)
    res.status(200).json({status: "success", data: object})

  } catch (err) {
    console.log(err);
    res.status(404).json({status: "Failure", message: err})
  }
};

exports.deleteConfig = function (req, res) {
  return console.log("x");
};
