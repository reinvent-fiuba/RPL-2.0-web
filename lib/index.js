"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _reactRouterDom = require("react-router-dom");

var _LoginPage = _interopRequireDefault(require("./components/LoginPage/LoginPage"));

var _SignupPage = _interopRequireDefault(require("./components/SignupPage/SignupPage"));

var _State = require("./utils/State");

var _CoursesPage = _interopRequireDefault(require("./components/CoursesPage/CoursesPage"));

var _CreateCoursePage = _interopRequireDefault(require("./components/CreateCoursePage/CreateCoursePage"));

var _CreateActivityPage = _interopRequireDefault(require("./components/CreateActivityPage/CreateActivityPage"));

var _SolveActivityPage = _interopRequireDefault(require("./components/SolveActivityPage/SolveActivityPage"));

var _ActivitiesPage = _interopRequireDefault(require("./components/ActivitiesPage/ActivitiesPage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var routing = _react["default"].createElement(_State.StateProvider, null, _react["default"].createElement(_reactRouterDom.BrowserRouter, null, _react["default"].createElement("div", null, _react["default"].createElement(_reactRouterDom.Route, {
  exact: true,
  path: "/",
  component: _LoginPage["default"]
}), _react["default"].createElement(_reactRouterDom.Route, {
  path: "/login",
  component: _LoginPage["default"]
}), _react["default"].createElement(_reactRouterDom.Route, {
  path: "/signup",
  component: _SignupPage["default"]
}), _react["default"].createElement(_reactRouterDom.Route, {
  exact: true,
  path: "/courses",
  component: _CoursesPage["default"]
}), _react["default"].createElement(_reactRouterDom.Route, {
  path: "/courses/create",
  component: _CreateCoursePage["default"]
}), _react["default"].createElement(_reactRouterDom.Route, {
  exact: true,
  path: "/courses/:courseId/activities",
  component: _ActivitiesPage["default"]
}), _react["default"].createElement(_reactRouterDom.Route, {
  path: "/courses/:courseId/activity/create",
  component: _CreateActivityPage["default"]
}), _react["default"].createElement(_reactRouterDom.Route, {
  path: "/courses/:courseId/activities/:activityId",
  component: _SolveActivityPage["default"]
}))));

_reactDom["default"].render(routing, document.getElementById('root'));