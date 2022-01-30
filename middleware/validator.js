
function parseField(field) {
    return field
        .split(/\[|\]/)
        .filter(s => s);
}

function getField(req, field) {
    let val = req.body;
    field.forEach(prop => {
        val = val[prop]
    });
    return val;
}

function required(field) {
    field = parseField(field);


    return function(req, res, next) {

        console.log(getField(req, field));
        if (getField(req, field)) {
            next();
        } else {
            
            res.status(422);
            res.send({ message :`${field.join(' ')} is required`});
        }
    }
}

function lengthAbove (field, length) {
    field = parseField(field);

    return function(req, res, next) {
        if (getField(req, field).length > length) {
            next();
        } else {
            const fields = field.join(' ');

            res.status(422);
            res.send({ message :`${field} must have more than ${length} characters`});
        }
    }
}

module.exports = { 
    required: required,
    lengthAbove: lengthAbove
};