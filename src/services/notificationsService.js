// @flow
import type { Notification } from "../types";

const _ = require('lodash');
const coursesService = require("./coursesService");

exports.get = (userId: number, courseId: number, options: any): Promise<Array<Notification>> => {
  const { studentsNotifications } = options;
  const studentsNotificationPromise = studentsNotifications
    ? coursesService.getAllStudentsByCourseId(courseId)
    : Promise.resolve([]);

  return studentsNotificationPromise
    .then(users => {
      const pendingStudents = _.filter(users, user => !user.accepted);
      if (pendingStudents.length === 0) {
        return null;
      }

      const multipleStudents = pendingStudents.length > 1;
      return {
        message: `Tienes ${pendingStudents.length} alumno${
          multipleStudents ? "s" : ""
        } esperando a ser aceptado${multipleStudents ? "s" : ""}!`,
        redirect: `/courses/${courseId}/students`,
        type: "students",
      };
    })
    .then(pendingStudentsNotification => {
      return pendingStudentsNotification ? [pendingStudentsNotification] : [];
    });
};
