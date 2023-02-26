// hint https://stackoverflow.com/a/54064268/5065201
// eslint-disable-next-line no-undef
db.createUser({
    user: 'root',
    pwd: 'root',
    roles: [{
        role: 'readWrite',
        db: 'chat',
    }],
});
