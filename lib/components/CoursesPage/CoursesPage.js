"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));

var _styles = require("@material-ui/core/styles");

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _Add = _interopRequireDefault(require("@material-ui/icons/Add"));

var _Fab = _interopRequireDefault(require("@material-ui/core/Fab"));

var _CourseCard = _interopRequireDefault(require("./CourseCard"));

var _SideBar = _interopRequireDefault(require("../SideBar/SideBar"));

var _TopBar = _interopRequireDefault(require("../TopBar/TopBar"));

var _coursesService = _interopRequireDefault(require("../../services/coursesService"));

var _State = require("../../utils/State");

var _ErrorNotification = _interopRequireDefault(require("../../utils/ErrorNotification"));

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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _ = require("lodash");

var drawerWidth = 240;

var styles = function styles(theme) {
  return {
    drawerHeader: _objectSpread({
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1)
    }, theme.mixins.toolbar, {
      justifyContent: "flex-end"
    }),
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      marginLeft: 0
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: drawerWidth
    },
    title: {
      marginTop: 20,
      marginBottom: 20
    },
    divider: {
      margin: 20
    },
    rightButton: {
      display: "flex",
      marginLeft: "auto",
      marginRight: theme.spacing(2)
    }
  };
};

var CoursesPage =
/*#__PURE__*/
function (_React$Component) {
  _inherits(CoursesPage, _React$Component);

  function CoursesPage() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, CoursesPage);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CoursesPage)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      error: {
        open: false,
        message: null
      },
      open: false,
      myCourses: [],
      allCourses: []
    });

    return _this;
  }

  _createClass(CoursesPage, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var allCourses;
      var profile = this.props.context.profile;

      _coursesService["default"].getAll().then(function (response) {
        allCourses = response;
        return _coursesService["default"].getAllByUser(profile.id);
      }).then(function (myCourses) {
        _this2.setState({
          myCourses: myCourses,
          allCourses: allCourses
        });
      })["catch"](function (err) {
        _this2.setState({
          error: {
            open: true,
            message: "Hubo un error al buscar los cursos, Por favor reintenta"
          }
        });
      });
    }
  }, {
    key: "renderCourseCards",
    value: function renderCourseCards(courses) {
      var _this3 = this;

      return _react["default"].createElement(_Grid["default"], {
        container: true,
        spacing: 1
      }, _.chunk(courses, 4).map(function (row, idx) {
        return _react["default"].createElement(_Grid["default"], {
          container: true,
          item: true,
          xs: 12,
          spacing: 3,
          id: idx
        }, _.map(row, function (course) {
          return _react["default"].createElement(_Grid["default"], {
            item: true,
            xs: 3,
            id: course.id
          }, _react["default"].createElement(_CourseCard["default"], {
            courseId: course.id,
            universityCourseId: course.university_course_id,
            name: course.name,
            description: course.description,
            imgUri: course.img_uri,
            onClickGoToCourse: function onClickGoToCourse(e, courseId) {
              return _this3.handleClickGoToCourse(e, courseId);
            }
          }));
        }));
      }));
    }
  }, {
    key: "handleSwitchDrawer",
    value: function handleSwitchDrawer() {
      this.setState(function (prevState) {
        return {
          open: !prevState.open
        };
      });
    }
  }, {
    key: "handleCreateCourseClick",
    value: function handleCreateCourseClick() {
      this.props.history.push("/courses/create");
    }
  }, {
    key: "handleClickGoToCourse",
    value: function handleClickGoToCourse(e, courseId) {
      e.preventDefault();
      this.props.history.push("/courses/".concat(courseId, "/activities"));
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var classes = this.props.classes;
      var _this$state = this.state,
          allCourses = _this$state.allCourses,
          myCourses = _this$state.myCourses,
          open = _this$state.open,
          error = _this$state.error;
      return _react["default"].createElement("div", null, error.open && _react["default"].createElement(_ErrorNotification["default"], {
        open: error.open,
        message: error.message
      }), _react["default"].createElement(_TopBar["default"], {
        handleDrawerOpen: function handleDrawerOpen() {
          return _this4.handleSwitchDrawer();
        },
        open: open,
        title: "Cursos"
      }), _react["default"].createElement(_SideBar["default"], {
        handleDrawerClose: function handleDrawerClose() {
          return _this4.handleSwitchDrawer();
        },
        open: open,
        courseId: this.props.match.params.courseId
      }), _react["default"].createElement("main", {
        className: "".concat(classes.content, " ").concat(open ? classes.contentShift : "")
      }, _react["default"].createElement("div", {
        className: classes.drawerHeader
      }), _react["default"].createElement(_Fab["default"], {
        color: "primary",
        "aria-label": "add",
        className: classes.rightButton,
        onClick: function onClick() {
          return _this4.handleCreateCourseClick();
        }
      }, _react["default"].createElement(_Add["default"], null)), _react["default"].createElement(_Typography["default"], {
        variant: "h5",
        color: "textSecondary",
        component: "p",
        className: classes.title
      }, "Mis Cursos"), this.renderCourseCards(myCourses), _react["default"].createElement(_Divider["default"], {
        className: classes.divider
      }), _react["default"].createElement(_Typography["default"], {
        variant: "h5",
        color: "textSecondary",
        component: "p",
        className: classes.title
      }, "Todos los Cursos"), this.renderCourseCards(allCourses)));
    }
  }]);

  return CoursesPage;
}(_react["default"].Component);

var _default = (0, _State.withState)((0, _styles.withStyles)(styles)(CoursesPage));

exports["default"] = _default;