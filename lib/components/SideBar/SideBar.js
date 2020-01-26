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

var _ListItem = _interopRequireDefault(require("@material-ui/core/ListItem"));

var _ListItemIcon = _interopRequireDefault(require("@material-ui/core/ListItemIcon"));

var _ListItemText = _interopRequireDefault(require("@material-ui/core/ListItemText"));

var _Code = _interopRequireDefault(require("@material-ui/icons/Code"));

var _School = _interopRequireDefault(require("@material-ui/icons/School"));

var _AccountCircle = _interopRequireDefault(require("@material-ui/icons/AccountCircle"));

var _Settings = _interopRequireDefault(require("@material-ui/icons/Settings"));

var _reactRouterDom = require("react-router-dom");

var _ChevronLeft = _interopRequireDefault(require("@material-ui/icons/ChevronLeft"));

var _List = _interopRequireDefault(require("@material-ui/core/List"));

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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var drawerWidth = 240;

var styles = function styles(theme) {
  return {
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth
    },
    drawerHeader: _objectSpread({
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1)
    }, theme.mixins.toolbar, {
      justifyContent: "flex-end"
    })
  };
};

var actionIcons = {
  Cursos: _School["default"],
  Actividades: _Code["default"],
  Perfil: _AccountCircle["default"],
  Configuracion: _Settings["default"]
};

var SideBar =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(SideBar, _React$PureComponent);

  function SideBar() {
    _classCallCheck(this, SideBar);

    return _possibleConstructorReturn(this, _getPrototypeOf(SideBar).apply(this, arguments));
  }

  _createClass(SideBar, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          open = _this$props.open,
          classes = _this$props.classes,
          courseId = _this$props.courseId,
          handleDrawerClose = _this$props.handleDrawerClose;
      var itemsLinks = {
        Cursos: "/courses"
      };

      if (courseId) {
        itemsLinks["Actividades"] = "/courses/".concat(courseId, "/activities");
      }

      return _react["default"].createElement(_Drawer["default"], {
        className: classes.drawer,
        variant: "persistent",
        anchor: "left",
        open: open,
        classes: {
          paper: classes.drawerPaper
        }
      }, _react["default"].createElement("div", {
        className: classes.drawerHeader
      }, _react["default"].createElement(_IconButton["default"], {
        onClick: handleDrawerClose
      }, _react["default"].createElement(_ChevronLeft["default"], null))), _react["default"].createElement(_Divider["default"], null), _react["default"].createElement(_List["default"], null, ["Cursos", "Actividades"].map(function (text) {
        var Icon = actionIcons[text];
        return _react["default"].createElement(_ListItem["default"], {
          button: true,
          key: text,
          component: _reactRouterDom.Link,
          to: itemsLinks[text]
        }, _react["default"].createElement(_ListItemIcon["default"], null, _react["default"].createElement(Icon, null)), _react["default"].createElement(_ListItemText["default"], {
          primary: text
        }));
      })), _react["default"].createElement(_Divider["default"], null), _react["default"].createElement(_List["default"], null, ["Perfil", "Configuracion"].map(function (text) {
        var Icon = actionIcons[text];
        return _react["default"].createElement(_ListItem["default"], {
          button: true,
          key: text
        }, _react["default"].createElement(_ListItemIcon["default"], null, _react["default"].createElement(Icon, null)), _react["default"].createElement(_ListItemText["default"], {
          primary: text
        }));
      })));
    }
  }]);

  return SideBar;
}(_react["default"].PureComponent);

var _default = (0, _styles.withStyles)(styles)(SideBar);

exports["default"] = _default;