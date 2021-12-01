import { UserManager, WebStorageStateStore } from 'oidc-client';
import axios from 'axios';
const thornUrl = process.env.VUE_APP_THORN_URL;

/**
* Class to encapsulate all authentication related logic.
*/
class AuthService {
    constructor() {
        
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
        }
        this.enabled = false;
        this.userManager = null;
        const resp = await axios.get(`${thornUrl}/public/configurations/OPENID_CONFIG`);
        this.enabled = resp?.data?.data?.enabled;
        //if (this.enabled){
            let merged = {...settings, ...resp['data']['data']};
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
            this.userManager = new UserManager(merged);
        //}
    }
    /**
     * Initate the login process.
     */
    login() {
        return this.userManager.signinRedirect()
            //.catch(error => console.log(error))
    }

    logout() {
        this.userManager.removeUser();
        this.vueStore && this.vueStore.dispatch('logout');
        this.userManager.signoutRedirect()
            .then(() => {
                console.log('User logged out');
                debugger
                this.vueStore && this.vueStore.dispatch('logout');
            }).catch(error => {
                console.log(error);
                this.userManager.removeUser();
                this.vueStore && this.vueStore.dispatch('logout');
            })
    }

    /**
     * Handles the redirect from the OAuth server after a user logged in.
     */
    handleLoginRedirect() {
        // Returns a promise
        return this.userManager.signinRedirectCallback()
    }

    /**
     * Handles the redirect from the OAuth server after a user logged out.
     */
    handleLogoutRedirect() {
        return this.userManager.signoutRedirectCallback()
    }

    /**
     * Checks whether or not a user is currently logged in.
     *
     * Returns a promise which will be resolved to true/false or be rejected with an error.
     */
    isUserLoggedIn() {
        return new Promise((resolve, reject) => {
            this.userManager.getUser()
                .then(user => {
                    if (user === null) {
                        resolve(false)
                    }
                    resolve(true)
                })
                .catch(error => reject(error))
        })
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
                        resolve(null)
                    }
                    resolve(user.profile)
                })
                .catch(error => reject(error))
        })
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
                    resolve(user? user.access_token: null)
                })
                .catch(error => reject(error))
        })
    }
}
export const openIdService = new AuthService();

// export default {
//     install: function (Vue) {
//         Vue.prototype.$openIdAuth = authService
//     }
// }