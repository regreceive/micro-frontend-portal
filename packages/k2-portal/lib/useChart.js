"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useChart;

function _react() {
  const data = _interopRequireWildcard(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _useSize() {
  const data = _interopRequireDefault(require("ahooks/es/useSize"));

  _useSize = function _useSize() {
    return data;
  };

  return data;
}

function _useUpdate() {
  const data = _interopRequireDefault(require("ahooks/es/useUpdate"));

  _useUpdate = function _useUpdate() {
    return data;
  };

  return data;
}

function echarts() {
  const data = _interopRequireWildcard(require("echarts"));

  echarts = function echarts() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 *
 * @param theme 预设了light和dark，默认是light
 * @param opts echarts的初始化入参，请传高度值或者在外容器设置高度
 * [reference](https://echarts.apache.org/zh/api.html#echarts.init)
 * @returns
 */
function useChart(theme, opts) {
  const chart = (0, _react().useRef)();
  const ref = (0, _react().useRef)(null);
  const emptyView = (0, _react().useRef)(false);
  const update = (0, _useUpdate().default)();
  (0, _react().useEffect)(() => {
    if (ref.current) {
      chart.current = echarts().init(ref.current, theme, opts);
      update();
    }

    return () => {
      if (chart.current && chart.current.dispose) {
        chart.current.dispose();
      }
    };
  }, [theme]);
  /** 图表自适应 */

  const box = (0, _useSize().default)(ref.current);
  (0, _react().useEffect)(() => {
    if (chart.current) {
      chart.current.resize();
    }
  }, [box === null || box === void 0 ? void 0 : box.width, box === null || box === void 0 ? void 0 : box.height]); // 图表选项设置

  const setOption = (0, _react().useCallback)((EChartsOption, notMerge, lazyUpdate, forceInit = false) => {
    var _chart$current2;

    if (emptyView.current) {
      var _chart$current;

      (_chart$current = chart.current) === null || _chart$current === void 0 ? void 0 : _chart$current.clear();
      emptyView.current = false;
    }

    if (forceInit) {
      chart.current = echarts().init(ref.current, theme, opts);
    }

    (_chart$current2 = chart.current) === null || _chart$current2 === void 0 ? void 0 : _chart$current2.setOption(EChartsOption, notMerge, lazyUpdate);
  }, []); // 显示空数据界面

  const showEmpty = (0, _react().useCallback)((text = '暂无数据') => {
    var _chart$current3;

    (_chart$current3 = chart.current) === null || _chart$current3 === void 0 ? void 0 : _chart$current3.clear();
    setOption({
      title: {
        text,
        left: 'center',
        top: 'center',
        textStyle: {
          color: 'rgba(0,0,0,.3)',
          fontSize: 20
        }
      },
      backgroundColor: 'rgba(127,127,127,.05)'
    });
    emptyView.current = true;
  }, []);
  return {
    ref,
    setOption,
    showEmpty,
    chart: chart.current
  };
}