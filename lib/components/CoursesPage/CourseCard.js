"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _Card = _interopRequireDefault(require("@material-ui/core/Card"));

var _CardHeader = _interopRequireDefault(require("@material-ui/core/CardHeader"));

var _CardMedia = _interopRequireDefault(require("@material-ui/core/CardMedia"));

var _CardContent = _interopRequireDefault(require("@material-ui/core/CardContent"));

var _CardActions = _interopRequireDefault(require("@material-ui/core/CardActions"));

var _Avatar = _interopRequireDefault(require("@material-ui/core/Avatar"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _colors = require("@material-ui/core/colors");

var _reactRouterDom = require("react-router-dom");

var _styles = require("@material-ui/core/styles");

var _core = require("@material-ui/core");

var _State = require("../../utils/State");

var _Error = require("../../utils/Error");

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

var styles = function styles(theme) {
  return {
    card: {
      maxWidth: 345
    },
    media: {
      height: 0,
      paddingTop: '56.25%',
      // 16:9
      backgroundColor: 'lightsteelblue',
      backgroundSize: 'contain'
    },
    action: {
      marginLeft: 'auto'
    },
    avatar: {
      backgroundColor: _colors.red[500],
      fontSize: 14
    }
  };
};

var CourseCard =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(CourseCard, _React$PureComponent);

  function CourseCard() {
    _classCallCheck(this, CourseCard);

    return _possibleConstructorReturn(this, _getPrototypeOf(CourseCard).apply(this, arguments));
  }

  _createClass(CourseCard, [{
    key: "render",
    value: function render() {
      var classes = this.props.classes;
      return _react["default"].createElement(_Card["default"], {
        className: classes.card
      }, _react["default"].createElement(_CardHeader["default"], {
        avatar: _react["default"].createElement(_Avatar["default"], {
          className: classes.avatar
        }, this.props.university_course_id),
        title: this.props.name
      }), _react["default"].createElement(_CardMedia["default"], {
        className: classes.media,
        image: this.props.imgUri || 'https://www.materialui.co/materialIcons/social/school_black_192x192.png',
        title: this.props.name
      }), _react["default"].createElement(_CardContent["default"], null, _react["default"].createElement(_Typography["default"], {
        variant: "body2",
        color: "textSecondary",
        component: "p"
      }, this.props.description)), _react["default"].createElement(_CardActions["default"], {
        disableSpacing: true
      }, _react["default"].createElement(_core.Button, {
        component: _reactRouterDom.Link,
        to: "/courses/".concat(this.props.id, "/activities")
      }, "Acceder"), _react["default"].createElement(_core.Button, {
        className: classes.action
      }, "Desincribirse")));
    }
  }]);

  return CourseCard;
}(_react["default"].PureComponent);

var _default = (0, _Error.withErrorHandling)((0, _State.withState)((0, _styles.withStyles)(styles)(CourseCard)));

exports["default"] = _default;