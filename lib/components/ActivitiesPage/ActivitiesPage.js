"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Table = _interopRequireDefault(require("@material-ui/core/Table"));

var _TableBody = _interopRequireDefault(require("@material-ui/core/TableBody"));

var _TableCell = _interopRequireDefault(require("@material-ui/core/TableCell"));

var _TableContainer = _interopRequireDefault(require("@material-ui/core/TableContainer"));

var _TableHead = _interopRequireDefault(require("@material-ui/core/TableHead"));

var _TableRow = _interopRequireDefault(require("@material-ui/core/TableRow"));

var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));

var _styles = require("@material-ui/core/styles");

var _Add = _interopRequireDefault(require("@material-ui/icons/Add"));

var _Fab = _interopRequireDefault(require("@material-ui/core/Fab"));

var _SideBar = _interopRequireDefault(require("../SideBar/SideBar"));

var _TopBar = _interopRequireDefault(require("../TopBar/TopBar"));

var _State = require("../../utils/State");

var _activitiesService = _interopRequireDefault(require("../../services/activitiesService"));

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
    },
    table: {
      minWidth: 650
    },
    tableContainer: {
      width: "80%"
    },
    tableContainerDiv: {
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      justifyContent: "center",
      padding: "0px 30px 30px 30px"
    },
    tableTitle: {
      alignSelf: "start",
      paddingLeft: "15px"
    }
  };
};

var ActivitiesPage =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ActivitiesPage, _React$Component);

  function ActivitiesPage() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ActivitiesPage);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ActivitiesPage)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      error: {
        open: false,
        message: null
      },
      open: false,
      activities: []
    });

    return _this;
  }

  _createClass(ActivitiesPage, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      _activitiesService["default"].getAllActivities(this.props.match.params.courseId).then(function (response) {
        _this2.setState({
          activities: response
        });
      })["catch"](function (err) {
        _this2.setState({
          error: {
            open: true,
            message: "Hubo un error al obtener las actividades, Por favor reintenta"
          }
        });
      });
    }
  }, {
    key: "handleSwitchDrawer",
    value: function handleSwitchDrawer(event) {
      this.setState(function (prevState) {
        return {
          open: !prevState.open
        };
      });
    }
  }, {
    key: "handleCellClick",
    value: function handleCellClick(event, activityId) {
      // const history = useHistory();
      this.props.history.push("/courses/".concat(this.props.match.params.courseId, "/activities/").concat(activityId));
    }
  }, {
    key: "renderCategoryActivities",
    value: function renderCategoryActivities(activities, classes) {
      var _this3 = this;

      return _react["default"].createElement(_TableContainer["default"], {
        component: _Paper["default"],
        className: classes.tableContainer
      }, _react["default"].createElement(_Typography["default"], {
        variant: "h5",
        color: "textSecondary",
        component: "p",
        className: classes.tableTitle
      }, activities[0].category_name), _react["default"].createElement(_Table["default"], {
        className: classes.table,
        "aria-label": "simple table"
      }, _react["default"].createElement(_TableHead["default"], null, _react["default"].createElement(_TableRow["default"], {
        key: 0
      }, _react["default"].createElement(_TableCell["default"], {
        key: 1
      }, "Nombre"), _react["default"].createElement(_TableCell["default"], {
        key: 2,
        align: "right"
      }, "\xDAltima actividad"), _react["default"].createElement(_TableCell["default"], {
        key: 3,
        align: "right"
      }, "Puntos"), _react["default"].createElement(_TableCell["default"], {
        key: 4,
        align: "right"
      }, "Estado"), _react["default"].createElement(_TableCell["default"], {
        key: 5,
        align: "right"
      }))), _react["default"].createElement(_TableBody["default"], null, activities.map(function (row) {
        return _react["default"].createElement(_TableRow["default"], {
          hover: true,
          key: row.id,
          onClick: function onClick(event) {
            return _this3.handleCellClick(event, row.id);
          }
        }, _react["default"].createElement(_TableCell["default"], {
          key: 1,
          component: "th",
          scope: "row"
        }, row.name), _react["default"].createElement(_TableCell["default"], {
          key: 2,
          align: "right"
        }, row.last_submission_date && row.last_submission_date.split("T")[0] || "-"), _react["default"].createElement(_TableCell["default"], {
          key: 3,
          align: "right"
        }, 15), _react["default"].createElement(_TableCell["default"], {
          key: 4,
          align: "right"
        }, row.submission_status || "SIN EMPEZAR"), _react["default"].createElement(_TableCell["default"], {
          key: 5,
          align: "right"
        }, "Descargar"));
      }))));
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var classes = this.props.classes;
      var _this$state = this.state,
          activities = _this$state.activities,
          open = _this$state.open,
          error = _this$state.error;
      console.log(activities);

      var activitiesByCategory = _.groupBy(activities, "category_name");

      console.log(activitiesByCategory);
      return _react["default"].createElement("div", null, error.open && _react["default"].createElement(_ErrorNotification["default"], {
        open: error.open,
        message: error.message
      }), _react["default"].createElement(_TopBar["default"], {
        handleDrawerOpen: function handleDrawerOpen(e) {
          return _this4.handleSwitchDrawer(e);
        },
        open: open,
        title: "Actividades"
      }), _react["default"].createElement(_SideBar["default"], {
        handleDrawerClose: function handleDrawerClose(e) {
          return _this4.handleSwitchDrawer(e);
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
        component: _reactRouterDom.Link,
        to: "/courses/".concat(this.props.match.params.courseId, "/activity/create")
      }, _react["default"].createElement(_Add["default"], null)), activities && Object.keys(activitiesByCategory).map(function (category) {
        return _react["default"].createElement("div", {
          key: category,
          className: classes.tableContainerDiv
        }, _this4.renderCategoryActivities(activitiesByCategory[category], classes));
      })));
    }
  }]);

  return ActivitiesPage;
}(_react["default"].Component);

var _default = (0, _State.withState)((0, _styles.withStyles)(styles)(ActivitiesPage));

exports["default"] = _default;