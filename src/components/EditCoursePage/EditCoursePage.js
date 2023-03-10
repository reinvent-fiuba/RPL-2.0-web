import React from "react";
import { withState } from "../../utils/State";
import CourseForm from "../CourseForm/CourseForm";
class EditCoursePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { history, context } = this.props;
    return (
      <div>
        <CourseForm course={context.course} history={history} editMode />
      </div>
    );
  }
}

export default withState(EditCoursePage);
