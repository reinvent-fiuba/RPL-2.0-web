import React from "react";
import { withState } from "../../utils/State";
import CourseForm from "../CourseForm/CourseForm";
class CreateCoursePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { history } = this.props;
    return (
      <div>
        <CourseForm history={history} />
      </div>
    );
  }
}

export default withState(CreateCoursePage);
