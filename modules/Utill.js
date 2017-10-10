export const logAndRespond = (err,res,status) => {
    console.error(err);
    res.statusCode = ('undefined' === typeof status ? 500 : status);
    res.send({
        result: 'error',
        err:    err.code
    });
};

export const days = (day) => {
  return day * 24 * 60 * 60
}
