"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _styles = require("@material-ui/core/styles");

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _FormControl = _interopRequireDefault(require("@material-ui/core/FormControl"));

var _InputLabel = _interopRequireDefault(require("@material-ui/core/InputLabel"));

var _TextField = _interopRequireDefault(require("@material-ui/core/TextField"));

var _Select = _interopRequireDefault(require("@material-ui/core/Select"));

var _MenuItem = _interopRequireDefault(require("@material-ui/core/MenuItem"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _reactMonacoEditor = _interopRequireDefault(require("react-monaco-editor"));

var _reactMde = _interopRequireDefault(require("react-mde"));

var Showdown = _interopRequireWildcard(require("showdown"));

var _reactResizeDetector = _interopRequireDefault(require("react-resize-detector"));

var _ErrorNotification = _interopRequireDefault(require("../../utils/ErrorNotification"));

var _State = require("../../utils/State");

var _TopBar = _interopRequireDefault(require("../TopBar/TopBar"));

var _SideBar = _interopRequireDefault(require("../SideBar/SideBar"));

var _activitiesService = _interopRequireDefault(require("../../services/activitiesService"));

require("react-mde/lib/styles/css/react-mde-all.css");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

var converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
});
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
      flexGrow: 1,
      marginLeft: 0
    },
    form: {
      display: "inline-flex",
      width: "100%",
      marginBottom: 20,
      "& > *": {
        width: 200,
        margin: theme.spacing(1)
      }
    },
    divider: {
      margin: 20
    },
    grid: {
      height: "60vh"
    },
    codeEditor: {
      display: "flex",
      "& .monaco-editor": {
        height: "100vh"
      }
    },
    mdEditor: {
      "& .mde-preview": {
        height: "53vh",
        overflow: "scroll"
      },
      "& .grip": {
        display: "none"
      }
    },
    buttons: {
      display: "flex",
      justifyContent: "flex-end"
    },
    cancelButton: {
      flex: "0 1 auto",
      marginRight: theme.spacing(2),
      marginLeft: "auto",
      marginTop: theme.spacing(3)
    },
    createButton: {
      display: "flex",
      marginLeft: "auto",
      marginTop: theme.spacing(3)
    },
    studentPreviewButton: {
      marginLeft: "auto",
      alignSelf: "flex-end"
    }
  };
};

var CreateActivityPage =
/*#__PURE__*/
function (_React$Component) {
  _inherits(CreateActivityPage, _React$Component);

  function CreateActivityPage() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, CreateActivityPage);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CreateActivityPage)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      error: {
        open: false,
        message: null
      },
      open: false,
      activity: null,
      categories: [],
      language: "",
      category: null,
      name: "",
      points: "",
      code: "",
      mdText: "",
      mdEditorTab: "write",
      editor: null,
      addingTests: false
    });

    return _this;
  }

  _createClass(CreateActivityPage, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var courseId = this.props.match.params.courseId;

      _activitiesService["default"].getActivityCategories(courseId).then(function (response) {
        _this2.setState({
          categories: response
        });
      });
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
    key: "handleChange",
    value: function handleChange(event) {
      event.persist(); // Close error message

      this.setState(_defineProperty({}, event.target.id, event.target.value));
    }
  }, {
    key: "handleCreateClick",
    value: function handleCreateClick(event) {
      var _this3 = this;

      event.preventDefault();
      var courseId = this.props.match.params.courseId;
      var _this$state = this.state,
          name = _this$state.name,
          points = _this$state.points,
          language = _this$state.language,
          category = _this$state.category,
          code = _this$state.code,
          mdText = _this$state.mdText;

      _activitiesService["default"].createActivity({
        courseId: courseId,
        name: name,
        points: points,
        language: language,
        activityCategoryId: category,
        initialCode: code,
        supportingFile: code,
        description: mdText
      }).then(function (response) {
        _this3.setState({
          activity: response
        });

        _this3.props.history.push("/courses/".concat(courseId, "/activities/").concat(response.id, "/edit/correction")); // this.setState({ addingTests: true });

      })["catch"](function (err) {
        _this3.setState({
          error: {
            open: true,
            message: "Hubo un error al crear la actividad, revisa que los datos ingresados sean validos."
          }
        });
      });
    }
  }, {
    key: "handleCancel",
    value: function handleCancel() {
      var courseId = this.props.match.params.courseId;
      this.props.history.push("/courses/".concat(courseId, "/activities"));
    }
  }, {
    key: "handleGoToStudentPreview",
    value: function handleGoToStudentPreview() {
      var courseId = this.props.match.params.courseId;
      var activity = this.state.activity;

      if (activity === null || activity === undefined) {
        alert("Primero tenes que guardar la actividad!");
      } else {
        this.props.history.push("/courses/".concat(courseId, "/activities/").concat(activity.id, "/teacherTest"));
      }
    }
  }, {
    key: "renderCategoriesDropdown",
    value: function renderCategoriesDropdown() {
      var categories = this.state.categories;
      return _.map(categories, function (category) {
        return _react["default"].createElement(_MenuItem["default"], {
          key: category.id,
          value: category.id
        }, category.name);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var classes = this.props.classes;
      var courseId = this.props.match.params.courseId;
      var _this$state2 = this.state,
          name = _this$state2.name,
          points = _this$state2.points,
          language = _this$state2.language,
          category = _this$state2.category,
          code = _this$state2.code,
          mdText = _this$state2.mdText,
          mdEditorTab = _this$state2.mdEditorTab,
          open = _this$state2.open,
          addingTests = _this$state2.addingTests,
          error = _this$state2.error;
      return _react["default"].createElement("div", null, error.open && _react["default"].createElement(_ErrorNotification["default"], {
        open: error.open,
        message: error.message
      }), _react["default"].createElement(_TopBar["default"], {
        handleDrawerOpen: function handleDrawerOpen() {
          return _this4.handleSwitchDrawer();
        },
        open: open,
        title: "Crear Actividad"
      }), _react["default"].createElement(_SideBar["default"], {
        handleDrawerClose: function handleDrawerClose() {
          return _this4.handleSwitchDrawer();
        },
        open: open,
        courseId: courseId
      }), _react["default"].createElement("main", {
        className: "".concat(classes.content, " ").concat(open ? classes.contentShift : "")
      }, _react["default"].createElement("div", {
        className: classes.drawerHeader
      }), _react["default"].createElement(_Typography["default"], {
        variant: "h5",
        color: "textSecondary",
        component: "p",
        className: classes.title
      }, "Crear Actividad"), _react["default"].createElement("form", {
        className: classes.form
      }, _react["default"].createElement(_TextField["default"], {
        margin: "normal",
        required: true,
        fullWidth: true,
        id: "name",
        label: "Nombre de Actividad",
        name: "name",
        autoComplete: "name",
        onChange: function onChange(e) {
          return _this4.handleChange(e);
        }
      }), _react["default"].createElement(_TextField["default"], {
        margin: "normal",
        required: true,
        fullWidth: true,
        id: "points",
        label: "Puntaje",
        name: "points",
        autoComplete: "points",
        onChange: function onChange(e) {
          return _this4.handleChange(e);
        }
      }), _react["default"].createElement(_FormControl["default"], null, _react["default"].createElement(_InputLabel["default"], {
        id: "language"
      }, "Lenguaje"), _react["default"].createElement(_Select["default"], {
        id: "language",
        name: "language",
        value: language || "",
        onChange: function onChange(event) {
          return _this4.setState({
            language: event.target.value
          });
        }
      }, _react["default"].createElement(_MenuItem["default"], {
        key: 0,
        value: "c"
      }, "C"), _react["default"].createElement(_MenuItem["default"], {
        key: 1,
        value: "python"
      }, "Python"), _react["default"].createElement(_MenuItem["default"], {
        key: 2,
        value: "java"
      }, "Java"))), _react["default"].createElement(_FormControl["default"], null, _react["default"].createElement(_InputLabel["default"], {
        id: "category"
      }, "Categor\xEDa"), _react["default"].createElement(_Select["default"], {
        labelId: "category",
        id: "category",
        value: category || "",
        onChange: function onChange(event) {
          return _this4.setState({
            category: event.target.value
          });
        }
      }, this.renderCategoriesDropdown())), _react["default"].createElement(_Button["default"], {
        type: "submit",
        variant: "contained",
        color: "primary",
        className: classes.studentPreviewButton,
        onClick: function onClick() {
          return _this4.handleGoToStudentPreview();
        }
      }, "Student preview")), _react["default"].createElement(_Grid["default"], {
        container: true,
        spacing: 3,
        className: classes.grid
      }, _react["default"].createElement(_Grid["default"], {
        item: true,
        xs: 6,
        className: classes.codeEditor
      }, _react["default"].createElement(_reactResizeDetector["default"], {
        handleWidth: true,
        handleHeight: true,
        onResize: function onResize() {
          return _this4.state.editor ? _this4.state.editor.layout : function () {};
        }
      }, _react["default"].createElement(_reactMonacoEditor["default"], {
        options: {
          renderFinalNewline: true
        },
        language: language,
        theme: "vs-dark",
        defaultValue: "",
        value: code,
        onChange: function onChange(codeChanged) {
          return _this4.setState({
            code: codeChanged
          });
        },
        editorDidMount: function editorDidMount(editor) {
          editor.changeViewZones(function (changeAccessor) {
            changeAccessor.addZone({
              afterLineNumber: 0,
              heightInLines: 1,
              domNode: document.createElement("span")
            });
          });

          _this4.setState({
            editor: editor
          });
        }
      }))), _react["default"].createElement(_Grid["default"], {
        item: true,
        xs: 6,
        className: classes.mdEditor
      }, _react["default"].createElement(_reactMde["default"], {
        minEditorHeight: "53vh",
        name: "mdText",
        value: mdText,
        onChange: function onChange(mdTextChanged) {
          return _this4.setState({
            mdText: mdTextChanged
          });
        },
        selectedTab: mdEditorTab,
        onTabChange: function onTabChange(mdEditorTabChanged) {
          return _this4.setState({
            mdEditorTab: mdEditorTabChanged
          });
        },
        generateMarkdownPreview: function generateMarkdownPreview(markdown) {
          return Promise.resolve(converter.makeHtml(markdown));
        }
      }))), _react["default"].createElement(_Grid["default"], {
        container: true
      }, _react["default"].createElement(_Grid["default"], {
        item: true,
        xs: true,
        className: classes.buttons
      }, _react["default"].createElement(_Button["default"], {
        variant: "contained",
        color: "secondary",
        className: classes.cancelButton,
        onClick: function onClick() {
          return _this4.handleCancel();
        }
      }, "Cancelar")), _react["default"].createElement(_Grid["default"], {
        item: true
      }, _react["default"].createElement(_Button["default"], {
        type: "submit",
        variant: "contained",
        color: "primary",
        className: classes.createButton,
        onClick: function onClick(e) {
          return _this4.handleCreateClick(e);
        }
      }, "Crear y Agregar Pruebas")))));
    }
  }]);

  return CreateActivityPage;
}(_react["default"].Component);

var _default = (0, _State.withState)((0, _styles.withStyles)(styles)(CreateActivityPage));

exports["default"] = _default;