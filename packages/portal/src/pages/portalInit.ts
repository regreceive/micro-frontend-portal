import clone from 'lodash/clone';
import type { History } from 'umi';
import { history } from 'umi';
import sso from './sso';

type Config = {
  sso: {
    clientId: string;
    clientUrl: string;
  };
};

type GlobalType = {
  version: string;
  handleHistory: (history: History) => History;
  accessToken: string;
  config: Config;
  login: () => void;
  logout: () => void;
  openApp: (appKey: string, path: string, replace?: boolean) => void;
};

// 深度冷冻对象
function freezeDeep<T>(obj: any): T {
  const freezeObject = Object.keys(obj).reduce<T>((prev, curr) => {
    if (Object.prototype.toString.call(obj[curr]) === '[object Object]') {
      return { ...prev, [curr]: freezeDeep(clone(obj[curr])) };
    }
    return { ...prev, [curr]: obj[curr] };
  }, {} as T);

  return Object.freeze<T>(freezeObject);
}

// 用户token
let _accessToken: any = '';
export const getAccessToken = () => {
  if (_accessToken === '') {
    _accessToken = localStorage.getItem('token');
  }
  return _accessToken;
};

let _appKey = '';
let _appIframe: HTMLIFrameElement;
let _iframe: { [key: string]: HTMLIFrameElement[] } = {};

// 封印，防止不讲究的代码
export const portal = Object.defineProperties<GlobalType>({} as GlobalType, {
  version: {
    value: '',
  },
  handleHistory: {
    get() {
      return (appHistory: History) => {
        Object.create(appHistory, {
          push: {
            get() {
              return (path: string) => {
                portal.openApp(_appKey, path);
              };
            },
          },
          replace: {
            get() {
              return (path: string) => {
                portal.openApp(_appKey, path, true);
              };
            },
          },
        });
      };
    },
  },
  accessToken: {
    get: () => getAccessToken(),
  },
  config: {
    value: freezeDeep<Config>(window.$$config),
  },
  login: {
    enumerable: false,
    get() {
      sso.signIn();
    },
  },
  logout: {
    enumerable: false,
    get() {
      sso.signOut();
    },
  },
  // 应用间跳转
  openApp: {
    get() {
      return (appKey: string, path: string, replace = false) => {
        const url =
          '/apps/' + appKey + path.startsWith('/') ? path : '/' + path;
        if (replace) {
          history.replace(url);
        } else {
          history.push(url);
        }
      };
    },
  },
  shareHistory: {
    get() {
      return (appKey: string, iframe: HTMLIFrameElement) => {
        _iframe[appKey] = [...(_iframe?.[appKey] ?? []), iframe];
      };
    },
  },
  setAppIframe: {
    get() {
      return (iframe: HTMLIFrameElement) => {
        _appIframe = iframe;
      };
    },
  },
});

// portal路由
const portalMather = /^\/apps\/([^\/]+)(?:\/(\S*))?/;
// 主应用路由
const appMatcher = /\/[^\/\.]+\/#\S*$/;
history.listen((listener) => {
  const result = portalMather.exec(listener.pathname);
  if (result) {
    const [_, appKey, path = '/'] = result;
    _iframe[appKey] = _iframe[appKey]?.filter((item) => item) ?? [];
    _iframe[appKey]?.forEach((iframe) => {
      const url = iframe.contentWindow?.location.href;
      if (url) {
        iframe.contentWindow?.location.replace(
          url.replace(/#\S*$/, `#${path}`),
        );
      }
    });

    const url = _appIframe.contentWindow?.location.href;
    if (url) {
      _appIframe.contentWindow?.location.replace(
        url.replace(appMatcher, `/${appKey}/#${path}`),
      );
    }
  }
});

window.g_portal = portal;

// 登录
if (process.env.NODE_ENV !== 'development' && !getAccessToken()) {
  sso.signIn();
}