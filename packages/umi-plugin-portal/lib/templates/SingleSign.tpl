import Oidc from 'oidc-client';

Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.INFO;

export default class SingleSign {
  public mgr: Oidc.UserManager;
  private isLogout = false;
  private sessionId = '';

  constructor(authority_url: string, oidc_callback_url: string) {
    this.mgr = new Oidc.UserManager({
      userStore: new Oidc.WebStorageStateStore({ store: window.localStorage }),
      authority: authority_url,
      client_id: 'k2box-auth-code-client',
      redirect_uri: oidc_callback_url,
      response_type: 'code',
      scope: 'openid offline',
      post_logout_redirect_uri: oidc_callback_url,
      silent_redirect_uri: oidc_callback_url,
      automaticSilentRenew: false,
      filterProtocolClaims: true,
      loadUserInfo: false,
      response_mode: 'query',
    });

    this.mgr.events.addAccessTokenExpired(() => {
      this.isLogout = true;
      window.localStorage.removeItem('sid');
    });
    this.mgr.events.addUserLoaded((user) => {
      this.sessionId = user.profile.sid || '';
      window.localStorage.setItem('sid', this.sessionId);
    });
  }

  getUser(): Promise<{
    username: string;
    permissions: string;
    accessToken: string;
  }> {
    return new Promise((resolve, reject) => {
      this.mgr
        .getUser()
        .then((user: any) => {
          if (user == null) {
            this.signIn();
            resolve(null);
          } else {
            this.sessionId = user.profile.sid || '';
            window.localStorage.setItem('sid', this.sessionId);
            return resolve(user);
          }
        })
        .catch(function (err) {
          console.log(err);
          return reject(err);
        });
    });
  }

  signIn() {
    this.mgr.signinRedirect().catch(function (err) {
      console.error(err);
      if (err.message.indexOf('404') > -1) {
        alert('OAuth2配置无效, 请联系管理员!');
      }
    });
  }

  signOut() {
    if (this.isLogout) {
      return;
    }
    this.isLogout = true;

    window.localStorage.removeItem('sid');
    this.mgr.signoutRedirect();
  }
}
