import usePrevious from 'ahooks/es/usePrevious';
import { Spin } from 'antd';
import isEqual from 'lodash/isEqual';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { warn } from './utils';

type Props = {
  /** 应用地址，一定要同域 */
  src: string;
  /** 样式名称 */
  className?: string;
  /** 向应用传递参数，字段自拟 */
  appProps?: {
    [key: string]: any;
  };
};

export const Widget: FC<Props> = (props) => {
  const frame = useRef<HTMLIFrameElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const previous = usePrevious(props.appProps);
  const [loading, setLoading] = useState(true);

  const renderApp = useCallback(() => {
    try {
      // @ts-ignore
      frame.current?.contentWindow?.micPack?.default(
        { appBody: bodyRef.current! },
        props.appProps,
      );
    } catch {
      warn(`${props.src}子应用跨域了`);
    }
  }, [props.appProps]);

  useEffect(() => {
    const appWindow = frame.current?.contentWindow;
    if (!appWindow) return;

    if (props.appProps && !isEqual(props.appProps, previous)) {
      renderApp();
    }
  }, [props.appProps]);

  return (
    <div data-name="widget" {...{ className: props.className }}>
      <iframe
        ref={frame}
        onLoad={() => {
          setLoading(false);
          renderApp();
        }}
        src={props.src}
        style={{ display: 'none' }}
      />
      <Spin spinning={loading}>
        <div style={{ height: '100%' }} ref={bodyRef} />
      </Spin>
    </div>
  );
};
