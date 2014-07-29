var ids = {
facebook: {
 clientID: 'empty',
 clientSecret: 'empty',
 callbackURL: 'http://127.0.0.1:1337/auth/facebook/callback'
},
twitter: {
 consumerKey: '',
 consumerSecret: 'get_your_own',
 callbackURL: "http://127.0.0.1:1337/auth/twitter/callback"
},
google: {
 returnURL: 'http://127.0.0.1:1337/auth/google/callback',
 realm: 'http://127.0.0.1:1337'
}
};

module.exports = ids;