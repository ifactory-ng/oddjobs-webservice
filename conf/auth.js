var ids = {
facebook: {
 clientID: '747991285264118',
 clientSecret: '6b60a8afffd172af54aedf3904a5d28b',
 callbackURL: "http://oddjobs.herokuapp.com/auth/facebook/callback"
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
