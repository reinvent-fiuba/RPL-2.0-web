"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _core = require("@material-ui/core");

var _SnackbarContent = _interopRequireDefault(require("@material-ui/core/SnackbarContent"));

var _styles = require("@material-ui/core/styles");

var _Error = _interopRequireDefault(require("@material-ui/icons/Error"));

var _Close = _interopRequireDefault(require("@material-ui/icons/Close"));

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var styles = function styles(theme) {
  return {
    error: {
      backgroundColor: theme.palette.error.dark
    },
    icon: {
      fontSize: 20
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1)
    },
    message: {
      display: "flex",
      alignItems: "center"
    }
  };
};

var ErrorNotifier =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ErrorNotifier, _React$Component);

  function ErrorNotifier() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ErrorNotifier);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ErrorNotifier)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      open: true
    });

    return _this;
  }

  _createClass(ErrorNotifier, [{
    key: "handleClose",
    value: function handleClose(_, reason) {
      if (reason === "clickaway") {
        return;
      }

      this.setState({
        open: false
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          classes = _this$props.classes,
          message = _this$props.message;
      var open = this.state.open;
      return _react["default"].createElement(_core.Snackbar, {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left"
        },
        open: open,
        autoHideDuration: 6000,
        onClose: this.handleClose
      }, _react["default"].createElement(_SnackbarContent["default"] // aria-describedby="client-snackbar"
      , {
        className: classes.error,
        message: _react["default"].createElement("span", {
          id: "client-snackbar",
          className: classes.message
        }, _react["default"].createElement(_Error["default"], {
          className: "".concat(classes.icon, " ").concat(classes.iconVariant)
        }), message),
        action: [_react["default"].createElement(_IconButton["default"], {
          key: "close",
          "aria-label": "close",
          color: "inherit",
          onClick: function onClick(_, reason) {
            return _this2.handleClose(_, reason);
          }
        }, _react["default"].createElement(_Close["default"], {
          className: classes.icon
        }))]
      }));
    }
  }]);

  return ErrorNotifier;
}(_react["default"].Component);

var _default = (0, _styles.withStyles)(styles)(ErrorNotifier);

exports["default"] = _default;