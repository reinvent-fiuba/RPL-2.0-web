import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from 'react-router-dom'
import SideBar from "../components/SideBar/SideBar";
import TopBar from "../components/TopBar/TopBar";

const _ = require("lodash");

const drawerWidth = 240;
const barHeight = 64;

const styles = theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    marginTop: barHeight,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
    marginTop: barHeight,
  },
});

const PageWrapper = ({ classes, match, children }) => {
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
      <main className={`${classes.content} ${isSideBarOpen ? classes.contentShift : ""}`}>
        {children}
      </main>
    </div>
  );
};

export default withRouter(withStyles(styles)(PageWrapper));
