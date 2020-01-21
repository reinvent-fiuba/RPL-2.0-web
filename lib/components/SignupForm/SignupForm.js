"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _TextField = _interopRequireDefault(require("@material-ui/core/TextField"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Link = _interopRequireDefault(require("@material-ui/core/Link"));

var _reactRouterDom = require("react-router-dom");

var _styles = require("@material-ui/core/styles");

var _State = require("../../utils/State");

var _Error = require("../../utils/Error");

var _ErrorNotification = _interopRequireDefault(require("../../utils/ErrorNotification"));

var _authenticationService = _interopRequireDefault(require("../../services/authenticationService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _ = require('lodash');

var styles = function styles(theme) {
  return {
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main
    },
    form: {
      width: '100%',
      // Fix IE 11 issue.
      marginTop: theme.spacing(1),
      padding: "0px ".concat(theme.spacing(4), "px")
    },
    submit: {
      margin: theme.spacing(3, 0, 2)
    }
  };
};

var Signup =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Signup, _React$Component);

  function Signup(props, defaultProps) {
    var _this;

    _classCallCheck(this, Signup);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Signup).call(this, props, defaultProps));
    _this.state = {
      username: '',
      email: '',
      password: '',
      name: '',
      surname: '',
      studentId: '',
      degree: '',
      university: ''
    };
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Signup, [{
    key: "handleChange",
    value: function handleChange(event) {
      var _this$setState;

      event.persist(); // Close error message

      this.setState((_this$setState = {}, _defineProperty(_this$setState, event.target.id, event.target.value), _defineProperty(_this$setState, "error", {
        open: false,
        message: ''
      }), _this$setState));
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      var _this2 = this;

      event.preventDefault();
      var _this$state = this.state,
          username = _this$state.username,
          email = _this$state.email,
          password = _this$state.password,
          name = _this$state.name,
          surname = _this$state.surname,
          degree = _this$state.degree,
          university = _this$state.university;

      _authenticationService["default"].signup({
        username: username,
        email: email,
        password: password,
        name: name,
        surname: surname,
        degree: degree,
        university: university
      }).then(function (response) {
        _this2.setState({
          toLoginPage: true
        });
      })["catch"](function (err) {
        _this2.setState({
          error: {
            open: true,
            message: 'Hubo un error de sign up, revisa que los datos ingresados sean validos.'
          }
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var classes = this.props.classes;

      if (this.state.toLoginPage) {
        return _react["default"].createElement(_reactRouterDom.Redirect, {
          to: "/login"
        });
      }

      return _react["default"].createElement("div", null, _react["default"].createElement(_ErrorNotification["default"], {
        open: _.get(this.state, 'error.open'),
        message: _.get(this.state, 'error.message')
      }), _react["default"].createElement(_Typography["default"], {
        component: "h1",
        variant: "h5"
      }, "Sign Up"), _react["default"].createElement("form", {
        noValidate: true,
        className: classes.form
      }, _react["default"].createElement(_TextField["default"], {
        margin: "normal",
        required: true,
        fullWidth: true,
        id: "name",
        label: "Name",
        name: "Name",
        autoComplete: "name",
        autoFocus: true,
        onChange: this.handleChange
      }), _react["default"].createElement(_TextField["default"], {
        margin: "normal",
        required: true,
        fullWidth: true,
        id: "surname",
        label: "Surname",
        name: "Surname",
        autoComplete: "surname",
        autoFocus: true,
        onChange: this.handleChange
      }), _react["default"].createElement(_TextField["default"], {
        margin: "normal",
        required: true,
        fullWidth: true,
        id: "studentId",
        label: "Student Id",
        name: "Student Id",
        autoComplete: "studentId",
        autoFocus: true,
        onChange: this.handleChange
      }), _react["default"].createElement(_TextField["default"], {
        margin: "normal",
        required: true,
        fullWidth: true,
        id: "degree",
        label: "Degree",
        name: "Degree",
        autoComplete: "degree",
        autoFocus: true,
        onChange: this.handleChange
      }), _react["default"].createElement(_TextField["default"], {
        margin: "normal",
        required: true,
        fullWidth: true,
        id: "university",
        label: "University",
        name: "University",
        autoComplete: "university",
        autoFocus: true,
        onChange: this.handleChange
      }), _react["default"].createElement(_TextField["default"], {
        margin: "normal",
        required: true,
        fullWidth: true,
        id: "username",
        label: "Username",
        name: "Username",
        autoComplete: "username",
        autoFocus: true,
        onChange: this.handleChange
      }), _react["default"].createElement(_TextField["default"], {
        margin: "normal",
        required: true,
        fullWidth: true,
        id: "email",
        label: "Email",
        name: "Email",
        autoComplete: "email",
        autoFocus: true,
        onChange: this.handleChange
      }), _react["default"].createElement(_TextField["default"], {
        margin: "normal",
        required: true,
        fullWidth: true,
        name: "password",
        label: "Password",
        type: "password",
        id: "password",
        autoComplete: "current-password",
        onChange: this.handleChange
      }), _react["default"].createElement(_Button["default"], {
        type: "submit",
        fullWidth: true,
        variant: "contained",
        color: "primary",
        className: classes.submit,
        onClick: this.handleClick
      }, "Sign Up")), _react["default"].createElement(_Grid["default"], {
        container: true
      }, _react["default"].createElement(_Grid["default"], {
        item: true,
        xs: true
      }, _react["default"].createElement(_Link["default"], {
        href: "#",
        variant: "body2"
      }, "Forgot password?")), _react["default"].createElement(_Grid["default"], {
        item: true
      }, _react["default"].createElement(_Link["default"], {
        href: "/login",
        variant: "body2"
      }, "Already have an account? Log in"))));
    }
  }]);

  return Signup;
}(_react["default"].Component);

var _default = (0, _Error.withErrorHandling)((0, _State.withState)((0, _styles.withStyles)(styles)(Signup)));

exports["default"] = _default;