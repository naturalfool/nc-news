

exports.handlePostgresErrors = (err, req, res, next) => {
    if (err.code === '42703' || err.code === '22P02'){
        res.status(400).send({ msg: 'Bad request'})
    } else {
        next(err)
    }
}

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.msg && err.status){
        res.status(err.status).send({msg: err.msg})
      } else {
      next(err);
      }
}

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ msg: "Internal server error" });
}