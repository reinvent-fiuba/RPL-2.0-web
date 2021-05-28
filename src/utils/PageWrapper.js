import React, { useState } from "react";
import { withRouter } from 'react-router-dom'
import SideBar from "../components/SideBar/SideBar";
import TopBar from "../components/TopBar/TopBar";

const _ = require("lodash");

const PageWrapper = ({ match, children }) => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const courseId = _.get(match, "params.courseId");

  return (
    <div>
      <TopBar
        handleDrawerOpen={() => setIsSideBarOpen(!isSideBarOpen)}
        open={isSideBarOpen}
        title="Cursos"
      />
      <SideBar
        handleDrawerClose={() => setIsSideBarOpen(!isSideBarOpen)}
        open={isSideBarOpen}
        courseId={courseId}
      />
      {children}
    </div>
  );
};

export default withRouter(PageWrapper);
