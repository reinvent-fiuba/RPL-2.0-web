// @flow
import type { Student } from "../types";

const { request } = require("../utils/Request");

const producer = {
  base_url: process.env.API_BASE_URL || "http://localhost:8080",
};

exports.login = credentials =>
  request({
    url: `${producer.base_url}/api/auth/login`,
    body: JSON.stringify(credentials),
    method: "POST",
  });

exports.signup = user =>
  request({
    url: `${producer.base_url}/api/auth/signup`,
    body: JSON.stringify(user),
    method: "POST",
  });

exports.getProfile = () =>
  request({
    url: `${producer.base_url}/api/auth/profile`,
    method: "GET",
  });

exports.updateProfile = profileData =>
  request({
    url: `${producer.base_url}/api/auth/profile`,
    body: JSON.stringify(profileData),
    method: "PATCH",
  });

exports.forgotPassword = (email: string): Promise<string> =>
  request({
    url: `${producer.base_url}/api/auth/forgotPassword`,
    body: JSON.stringify({ email }),
    method: "POST",
  });

exports.resetPassword = (token: string, password: string): Promise<Student> =>
  request({
    url: `${producer.base_url}/api/auth/resetPassword`,
    body: JSON.stringify({ password_token: token, new_password: password }),
    method: "POST",
  });

exports.validateEmailToken = (token: string): Promise<Student> =>
  request({
    url: `${producer.base_url}/api/auth/validateEmail`,
    body: JSON.stringify({ validate_email_token: token }),
    method: "POST",
  });

exports.resendEmailToken = (user: string): Promise<Student> =>
  request({
    url: `${producer.base_url}/api/auth/resendValidationEmail`,
    body: JSON.stringify({ username_or_email: user }),
    method: "POST",
  });

exports.getRoles = (): Promise<any> =>
  request({
    url: `${producer.base_url}/api/auth/roles`,
    method: "GET",
  });

exports.getUniversities = (): Promise<Array<any>> =>
  request({
    url: `${producer.base_url}/api/auth/universities`,
    method: "GET",
  });
