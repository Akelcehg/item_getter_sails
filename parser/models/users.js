var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var usersSchema = new Schema({
    email: {
        type: String,
        validate: {
            validator: function (email) {
                return email.isEmail();
            },
            message: '{VALUE} не имейл'
        },
        required: [true, 'Введите почтовый адресс']
    },
    password: {
        type: String,
        minlength: [6, "Пароль слишком коротки"],
        required: [true, 'Введите пароль для вашего аккаунта']
    }
});

usersSchema.path('email').validate(function (value, respond) {

    MODEL('users').schema.findOne({email: value}, function (err, user) {
        if (err) {
            respond(false);
        } else if (user) { //there was a result found, so the email address exists
            respond(false);
        } else respond(true);
    });
}, 'Пользователь с таким имейлом уже есть');

usersSchema.methods.signupUser = function (cb) {
    var user = this;
    user.save(function (err) {
        cb(err);
    });
};

usersSchema.pre('save', function (next, done) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // override the cleartext password with the hashed one
    user.password = F.hash('md5', user.password);
    next();

});

usersSchema.methods.comparePassword = function (candidatePassword, cb) {
    var user = this;
    return candidatePassword === F.hash('md5', user.password);
};

usersSchema.methods.testing = function () {
    console.log ('testing ' + this.email);
}

exports.schema = mongoose.model('users', usersSchema);