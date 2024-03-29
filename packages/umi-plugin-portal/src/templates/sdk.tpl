import { createContext, useContext, useMemo } from 'react';
import { request } from 'umi';
import { portal } from './portal';
export { useQuery, useMutation, useLazyQuery } from '@apollo/client';

type CommonServiceType = {
  get: (url: string) => Promise<ResponseData>;
  post: {
    /**
     * @param url 相对地址
     * @param data 发送的消息体
     */
    (url: string, data: {}): Promise<ResponseData>;
    /**
     * @param data 发送的消息体
     */
    (data: {}): Promise<ResponseData>;

  };
  /**
    * @param url 相对地址
    * @param data 发送的消息体
    */
  put: (url: string, data: {}) => Promise<ResponseData>
  delete: (url: string) => Promise<ResponseData>;
};

type ServiceListType = {
  {{#service}}
  {{.}}: CommonServiceType;
  {{/service}}
};

/** 应用的上下文 */
export const AppContext = createContext<any>({});

/**
 * 返回父级应用传入的属性
 */
export function useAppProps<T>() {
  return useContext<T>(AppContext);
}

const interest = {{{ interestedMessage }}};
/**
 * 返回应用订阅的全局消息
 */
export function useMessage<T = any>(): T;
export function useMessage<T extends {}>(key: {{{ interestedMessageType }}}): T | undefined;
export function useMessage(key?: {{{ interestedMessageType }}}) {
  const props = useContext(AppContext);
  return useMemo(() => {
    const data = interest.reduce((prev, curr) => {
      return props[curr] ? { ...prev, [curr]: props[curr] } : prev;
    }, {} as Partial<Record<{{{ interestedMessageType }}}, any>>);
    if (key) {
      return data.hasOwnProperty(key) ? data[key] : undefined;
    }
    return data;
  }, [props]);
}

class CommonService {
  public host: string;
  public key: string;

  constructor(host: string, key: string) {
    this.host = host;
    if (key === 'graphql') {
      this.post = (gql: string) => {
        return CommonService.prototype.post.call(this, gql);
      };
    }
  }

  get(url: string) {
    return request(this.host + url);
  }

  post(url: string, data: any) {
    if (typeof url === 'string') {
      return request(this.host + url, {
        method: 'POST',
        data,
      });
    }
    // for graphql
    return request(this.host, {
      method: 'POST',
      data: url,
    });
  }

  put(url: string, data: any) {
    return request(this.host + url, {
      method: 'PUT',
      data,
    });
  }

  delete(url: string) {
    return request(this.host + url, {
      method: 'DELETE',
    });
  }
}

export const api: ServiceListType = Object.entries<string>(
  portal.config.nacos.service,
).reduce((prev, [key, value]) => {
  return { ...prev, [key]: new CommonService(value, key) };
}, {});
