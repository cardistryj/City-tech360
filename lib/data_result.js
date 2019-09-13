function DbData(status, message, data) {
    this.status = status;
    this.message = message;
    this.data = data;
}

function goodResult(message, data) {
    return new DbData(200, message, data)
}

function errorResult(message) {
    return new DbData(500, message)

}

function goodPromiseOrigin(message,data){
    return Promise.resolve(goodResult(message,data));
}

function goodPromise(data) {
    //console.log("good:", data)
    return goodPromiseOrigin('success',data);
}

function badPromise(err) {
    //console.log("error:", err)
    return Promise.resolve(errorResult(err));
}

exports.goodPromiseOrigin=goodPromiseOrigin;
exports.goodPromise=goodPromise;
exports.badPromise=badPromise;