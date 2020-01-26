"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _Drawer = _interopRequireDefault(require("@material-ui/core/Drawer"));

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));

var _styles = require("@material-ui/core/styles");

var _AppBar = _interopRequireDefault(require("@material-ui/core/AppBar"));

var _Toolbar = _interopRequireDefault(require("@material-ui/core/Toolbar"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _School = _interopRequireDefault(require("@material-ui/icons/School"));

var _Avatar = _interopRequireDefault(require("@material-ui/core/Avatar"));

var _AccountCircle = _interopRequireDefault(require("@material-ui/icons/AccountCircle"));

var _Settings = _interopRequireDefault(require("@material-ui/icons/Settings"));

var _ChevronLeft = _interopRequireDefault(require("@material-ui/icons/ChevronLeft"));

var _List = _interopRequireDefault(require("@material-ui/core/List"));

var _Menu = _interopRequireDefault(require("@material-ui/icons/Menu"));

var _State = require("../../utils/State");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var drawerWidth = 240;

var styles = function styles(theme) {
  return {
    appBar: {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    appBarShift: {
      width: "calc(100% - ".concat(drawerWidth, "px)"),
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    hide: {
      display: "none"
    },
    title: {
      flexGrow: 1
    },
    user: {
      marginRight: theme.spacing(2)
    }
  };
};

var TopBar =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(TopBar, _React$PureComponent);

  function TopBar() {
    _classCallCheck(this, TopBar);

    return _possibleConstructorReturn(this, _getPrototypeOf(TopBar).apply(this, arguments));
  }

  _createClass(TopBar, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          open = _this$props.open,
          title = _this$props.title,
          handleDrawerOpen = _this$props.handleDrawerOpen,
          context = _this$props.context,
          classes = _this$props.classes;

      var _ref = context && context.profile,
          name = _ref.name,
          surname = _ref.surname;

      return _react["default"].createElement(_AppBar["default"], {
        position: "fixed",
        className: "".concat(classes.appBar, " ").concat(open ? classes.appBarShift : "")
      }, _react["default"].createElement(_Toolbar["default"], null, _react["default"].createElement(_IconButton["default"], {
        color: "inherit",
        "aria-label": "open drawer",
        onClick: handleDrawerOpen,
        edge: "start",
        className: "".concat(classes.menuButton, " ").concat(open ? classes.hide : "")
      }, _react["default"].createElement(_Menu["default"], null)), _react["default"].createElement(_Typography["default"], {
        variant: "h6",
        className: classes.title,
        noWrap: true
      }, title), _react["default"].createElement(_Typography["default"], {
        variant: "body1",
        className: classes.user
      }, name, " ", surname), _react["default"].createElement(_Avatar["default"], {
        className: classes.avatar
      }, name[0], surname[0])));
    }
  }]);

  return TopBar;
}(_react["default"].PureComponent);

var _default = (0, _State.withState)((0, _styles.withStyles)(styles)(TopBar));

exports["default"] = _default;