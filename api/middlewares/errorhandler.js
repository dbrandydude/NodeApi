module.exports = (err, req, res, next) => {
  console.log('error')
  if (res.headersSent) {
    return next(err)
  }
  res.status(err.status || 500)
    .send({
      status: res.status,
      error: err
    })
}