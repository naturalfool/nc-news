
exports.handlePostgresErrors = (err, req, res, next) => {
if (err.code = '42703'){
    res.status(404).send({ msg: 'path not found'})
}
}


exports.handleCustomErrors = () => {
    if (err.msg && err.status){
        res.status(err.status).send({msg: err.msg})
      } else {
      next(err);
      }
}

exports.handleServerErrors = () => {
    console.log(err);
    res.status(500).send({ msg: "Internal server error" });
}