"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Widget = void 0;

var _react = _interopRequireWildcard(require("react"));

var _ahooks = require("ahooks");

var _antd = require("antd");

var _isEqual = _interopRequireDefault(require("lodash/isEqual"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Widget = function Widget(props) {
  var frame = (0, _react.useRef)(null);
  var bodyRef = (0, _react.useRef)(null);
  var previous = (0, _ahooks.usePrevious)(props.appProps);

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      loaded = _useState2[0],
      setLoaded = _useState2[1];

  var renderApp = (0, _react.useCallback)(function () {
    try {
      var _frame$current, _frame$current$conten, _frame$current$conten2;

      // @ts-ignore
      (_frame$current = frame.current) === null || _frame$current === void 0 ? void 0 : (_frame$current$conten = _frame$current.contentWindow) === null || _frame$current$conten === void 0 ? void 0 : (_frame$current$conten2 = _frame$current$conten.micPack) === null || _frame$current$conten2 === void 0 ? void 0 : _frame$current$conten2.default({
        appBody: bodyRef.current
      }, props.appProps);
    } catch (_unused) {
      (0, _utils.warn)("".concat(props.src, "\u5B50\u5E94\u7528\u8DE8\u57DF\u4E86"));
    }
  }, [props.appProps]);
  (0, _react.useEffect)(function () {
    var _frame$current2;

    var appWindow = (_frame$current2 = frame.current) === null || _frame$current2 === void 0 ? void 0 : _frame$current2.contentWindow;
    if (!appWindow) return;

    if (props.appProps && !(0, _isEqual.default)(props.appProps, previous)) {
      renderApp();
    }
  }, [props.appProps]);
  return /*#__PURE__*/_react.default.createElement("div", {
    "data-name": "widget",
    style: {
      display: props.inline ? 'inline' : 'block'
    },
    className: props.className
  }, /*#__PURE__*/_react.default.createElement("iframe", {
    ref: frame,
    onLoad: function onLoad() {
      setLoaded(true);
      renderApp();
    },
    src: props.src,
    style: {
      display: 'none'
    }
  }), loaded ? null : props.loading, /*#__PURE__*/_react.default.createElement("div", {
    ref: bodyRef
  }));
};

exports.Widget = Widget;
Widget.defaultProps = {
  inline: false,
  loading: /*#__PURE__*/_react.default.createElement(_antd.Spin, null)
};