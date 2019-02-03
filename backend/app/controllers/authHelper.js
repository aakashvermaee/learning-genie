const {clientId , clientSecret, redirectUri } = require('../../config/config')
const scopes = ['openid', 'profile', 'offline_access'];

const credentials = {
    client: {
        id: clientId,
        secret: clientSecret
    },
    auth: {
        tokenHost: 'https://login.microsoftonline.com',
        authorizePath: 'common/oauth2/authorize',
        tokenPath: 'common/oauth2/token'
    }
};

const oauth2 = require('simple-oauth2').create(credentials);

module.exports = {
    getAuthUri: function () {
        var returnVal = oauth2
            .authorizationCode
            .authorizeURL({redirect_uri: redirectUri, scope: scopes});
        return returnVal;
    },
    getTokenFromCode: (auth_code, callback, request, response) => {
        oauth2
            .authorizationCode
            .getToken({
                code: auth_code,
                redirect_uri: redirectUri,
                scope: scopes
            }, (error, result) => {
                if (error) {
                    console.log('Access token error: ', error.message);
                    callback(request, response, error, null);
                } else {
                    var token = oauth2
                        .accessToken
                        .create(result);
                    callback(request, response, null, token);
                }
            });
    },
    getEmailFromIdToken: function (id_token) {
        // JWT is in three parts, separated by a '.'
        var token_parts = id_token.split('.');

        // Token content is in the second part, in urlsafe base64
        var encoded_token = new Buffer(token_parts[1].replace('-', '+').replace('_', '/'), 'base64');

        var decoded_token = encoded_token.toString();

        var jwt = JSON.parse(decoded_token);
        // Email is in the preferred_username field
        return jwt.unique_name
    },
    getTokenFromRefreshToken: function (refresh_token, callback, request, response) {
        var token = oauth2
            .accessToken
            .create({refresh_token: refresh_token, expires_in: 0});
        token.refresh(function (error, result) {
            if (error) {
                process.logger('Refresh token error: ', error.message);
                callback(request, response, error, null);
            } else {
                process.logger('New token: ', result.token);
                callback(request, response, null, result);
            }
        });
    },
    getToken: function (token) {
        let length = token.length;
        return token = token.substr(3, length - 6);
    },
    getUser: function (req, res) {
        req.session.idtoken !== undefined
            ? res.send({token: req.session.idtoken, email: req.session.email, isAdmin: req.session.isAdmin})
            : res
                .status(404)
                .send("user not found");
    },
    doLogin: function (res) {
        const redirectURL = this.getAuthUri();
        res.redirect(redirectURL);
    },
    doLogout: function (req, res) {
        req
            .session
            .destroy();
        res.redirect('/');
    },
    refreshTokens: function (req, res, callback) {
        const {refresh_token} = req.session;
        refresh_token !== undefined
            ? getTokenFromRefreshToken(refresh_token, callback, req, res)
            : (() => {
                process.logger('no refresh token in session');
                this.doLogin(res)
            })();
    },
    authorize: function (req, res, callback) {
        const authCode = req.query.code;
        authCode !== undefined
            ? this.getTokenFromCode(authCode, callback, req, res)
            : (() => {
                // redirect to home
                process.logger('/authorize called without a code parameter, redirecting to login');
                this.doLogin(res);
            })();
    },
    loginComplete: function (req, res) {
        const {idtoken, email} = req.session;
        if (idtoken === undefined || email === undefined) {
            process.logger('/logincomplete called while not logged in');
            res.redirect('/login');
            return;
        }
        process.logger(email);
        res.send(`${email} you are successfully logged in`);
    },
    checkTokenInReq: (req, res, next) => {
        let token = req.headers["x-auth"] || undefined;

        // if not token then, return and fail Auth
        if (!token) {
            return res.status(401).send({
                "status":401,
                "authStatus": false,
                "reason": "Token not present!"
            });
        }

        // if token is present then, execute middlewares in pipeline
        next();
    }
}
