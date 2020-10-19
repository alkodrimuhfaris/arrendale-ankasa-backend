<<<<<<< HEAD
module.exports = (res, message, status = 200, success = true, additionalData) => {
  return res.status(status).send({
    success,
    message: message || 'Success',
    ...additionalData
=======
module.exports = (response, message, additionalData, status=200, success=true) => {
  return response.status(status).send({
    success,
    message: message || 'Success',
    ...additionalData,
>>>>>>> 169d6f307032130bb724592233a5469f32a39d07
  })
}