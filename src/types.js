// @flow

export type IOTest = {
  id: number,
  in: string,
  out: string,
};

export type Activity = {
  id: number,
  course_id: number,
  category_id: number,
  category_name: string,
  category_description: string,
  name: string,
  description: string,
  language: string,
  is_iotested: boolean,
  active: boolean,
  deleted: boolean,
  initial_code: { [string]: string },
  file_id: number,
  submission_status: string,
  last_submission_date: string,
  activity_unit_tests: string,
  activity_iotests: Array<IOTest>,
  date_created: string,
  last_updated: string,
};

export type Student = {
  id: number,
  name: string,
  surname: string,
  student_id: string,
  username: string,
  email: string,
  email_validated: boolean,
  university: string,
  degree: string,
  date_created: string,
  last_updated: string,
  role: string,
  accepted: boolean,
};

export type Category = {
  id: number,
  name: string,
};

export type Course = {
  id: number,
  name: string,
  university_course_id: string,
  description: string,
  active: boolean,
  semester: string,
  img_uri: string,
  date_created: string,
  last_updated: string,
};

export type IOTestRunResult = {
  id: number,
  test_in: string,
  expected_output: string,
  run_output: string,
};

export type UnitTestRunResult = {
  id: number,
  test_name: string,
  passed: boolean,
  error_messages: ?string,
};

export type Notification = {
  message: string,
  redirect: string,
  type: string,
};

export type SubmissionResult = {
  id: number,
  submission_file_name: string,
  submission_file_type: string,
  submission_file_id: number,
  activity_supporting_file_name: string,
  activity_supporting_file_type: string,
  activity_supporting_file_id: number,
  activity_language: string,
  activity_unit_tests: string,
  activity_iotests: Array<string>,
  submission_status: string,
  exit_message: string,
  stderr: string,
  stdout: string,
  io_test_run_results: Array<IOTestRunResult>,
  unit_test_run_results: Array<UnitTestRunResult>,
  submission_date: string,
  submited_code: string,
};
