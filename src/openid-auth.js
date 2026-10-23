import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import axios from 'axios';
const thornUrl = import.meta.env.VITE_THORN_URL;

/**
* Class to encapsulate all authentication related logic.
*/
class AuthService {
    constructor() {
        this.settings = {};
    }
    async loadConfig(vueStore){
        this.vueStore = vueStore;
        // Config for the oidc client.
        const settings = {
            // Where the tokens will be stored
            userStore: new WebStorageStateStore({ store: window.localStorage }),
            // URL to the authentication server (including realm)
            authority: null,
            // The name of the client in Keycloak setup for this service
            client_id: null,
            // Where to redirect the user to after successful authentication
            redirect_uri: null,
            // Where to redirect the user to after logging the user out
            post_logout_redirect_uri: null,
            // Indicate the the authorization code flow should be used
            response_type: 'code',
            // "openid" tells the server that this client uses oidc for authentication
            scope: 'openid',
            // Enable automatic (silent) renewal of the access token
            automaticSilentRenew: true,
            silent_redirect_uri: 'https://localhost:8800/static/silent-renew.html',
            accessTokenExpiringNotificationTime: 10,
            monitorSession: false,
        };
        this.enabled = false;
        this.userManager = null;
        const resp = await axios.get(`${thornUrl}/public/configurations/OPENID_CONFIG`);
        this.enabled = resp?.data?.data?.enabled;
        //if (this.enabled){
        let merged = {...settings, ...resp['data']['data']};

        this.settings = merged;
        merged.redirect_uri ??= window.location.origin;
        merged.post_logout_redirect_uri ??= `${window.location.origin}/logout`;
        //console.debug('Redirecting', merged.redirect_uri)
        //merged.scope = 'profile, email'
        /*
            merged.authority = "dummy"
            merged.userinfo_endpoint = "https://localhost:9443/oauth2/userinfo";
            merged.metadata = {
                issuer: 'https://localhost:9443/oauth2/token',
                authorization_endpoint: 'https://localhost:9443/oauth2/authorize',
            }
            */

        /*merged.loadUserInfo = false
            merged.userinfo_endpoint = "https://sso.gsi.mpmg.mp.br/oauth2/userinfo";
            merged.metadata = {
                issuer: 'https://ssogsi.mpmg.mp.br/oauth2/token',
                authorization_endpoint: 'https://sso.gsi.mpmg.mp.br/oauth2/authorize',
            }*/
        //}
        const mgr = new UserManager(merged);
        this.userManager = mgr;
        mgr.events.addAccessTokenExpired(() => {
            // Renewal failed and the token expired: block the app now instead of waiting for a 401.
            if (this.enabled) {
                const cleared = this.vueStore ? this.vueStore.dispatch('logout') : Promise.resolve();
                cleared.then(() => window.location.replace('/auth/login?expired=1'));
            }
        });
        mgr.events.addAccessTokenExpiring(function () {
            console.log("token expiring");
            // maybe do this code manually if automaticSilentRenew doesn't work for you
            mgr.signinSilent().then(function(token) {
                console.log("silent renew success", token);
                localStorage.setItem('token', token.access_token);
                //self.getThornProfile();
            }).catch(function(e) {
                console.log("silent renew error", e.message);
            });
        });
    }
    /**
     * Initate the login process.
     */
    login() {
        return this.userManager.signinRedirect();
        //.catch(error => console.log(error))
    }

    logout() {
        // Clear app state first: signoutRedirect navigates away and nothing after it is guaranteed to run.
        // It sends id_token_hint and post_logout_redirect_uri on its own and removes the OIDC user.
        const cleared = this.vueStore ? this.vueStore.dispatch('logout') : Promise.resolve();
        return cleared.then(() => this.userManager.signoutRedirect()).catch(error => {
            console.log(error);
            this.userManager.removeUser();
            window.location.replace('/');
        });
    }

    /**
     * Handles the redirect from the OAuth server after a user logged in.
     */
    handleLoginRedirect() {
        // Returns a promise
        return this.userManager.signinRedirectCallback();
    }

    /**
     * Handles the redirect from the OAuth server after a user logged out.
     */
    handleLogoutRedirect() {
        return this.userManager.signoutRedirectCallback();
    }

    /**
     * Checks whether or not a user is currently logged in.
     *
     * Returns a promise which will be resolved to true/false or be rejected with an error.
     */
    async isUserLoggedIn() {
        const user = await this.userManager.getUser();
        if (user && !user.expired) {
            return true;
        }
        if (user) {
            // getUser() still returns a user whose token expired; try one silent renewal before giving up
            try {
                await this.userManager.signinSilent();
                return true;
            } catch (e) {
                console.log('silent renew error', e.message);
                await this.userManager.removeUser();
            }
        }
        return false;
    }

    /**
     * Get the profile data for the currently authenticated user.
     *
     * Returns an empty object if no user is logged in.
     */
    getProfile() {
        return new Promise((resolve, reject) => {
            this.userManager.getUser()
                .then(user => {
                    if (user === null) {
                        resolve(null);
                    }
                    resolve(user.profile);
                })
                .catch(error => reject(error));
        });
    }

    /**
     * Get the access token.
     *
     * Can be used to make requests to the backend.
     */
    getAccessToken() {
        return new Promise((resolve, reject) => {
            this.userManager.getUser()
                .then(user => {
                    resolve(user? user.access_token: null);
                })
                .catch(error => reject(error));
        });
    }
}
export const openIdService = new AuthService();

// export default {
//     install: function (Vue) {
//         Vue.prototype.$openIdAuth = authService
//     }
// }
