// @flow

export type Activity = {
  id: number,
  course_id: number,
  category_name: string,
  category_description: string,
  name: string,
  description: string,
  language: string,
  active: boolean,
  initial_code: string,
  file_id: number,
  submission_status: string,
  last_submission_date: string,
  date_created: string,
  last_updated: string
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
  last_updated: string
};
