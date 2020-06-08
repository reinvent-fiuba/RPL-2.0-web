// @flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import MonacoEditor from "react-monaco-editor";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { withState } from "../../utils/State";
import AddNewFileModal from "./AddNewFileModal.react";

const styles = theme => ({
  addFileButton: {
    marginLeft: 20,
  },
  demo2: {
    backgroundColor: "#1e1e1ef0",
  },
});

const StyledTabs = withStyles({
  indicator: {
    backgroundColor: "#fff",
    "& > span": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: "#1e1e1ef0",
    },
  },
  scrollButtons: {
    color: "#fff",
  },
})(props => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles(theme => ({
  root: {
    textTransform: "none",
    color: "#fff",
    backgroundColor: "#1e1e1ef0",
    fontWeight: theme.typography.fontWeightRegular,
    "&:selected": {
      opacity: 1,
    },
    minWidth: "70px",
    borderLeft: "1px solid #000",
  },
  selected: {
    borderLeft: "0px",
  },
}))(props => <Tab disableRipple {...props} />);

const NewFileButtonTab = withStyles(theme => ({
  root: {
    textTransform: "none",
    color: "#fff",
    fontWeight: theme.typography.fontWeightRegular,
    "&:focus": {
      opacity: 1,
    },
    minWidth: "30px",
  },
}))(props => <Tab disableRipple {...props} />);

type Props = {
  match: any,
  classes: any,
  history: any,
  onCodeChange: (code: { [string]: string }) => void,
  language: string,
  width: number | string,
  initialCode: { [string]: string },
};

type State = {
  code: { [string]: string },
  selectedEditor: string,
  fileNameModal: { text: ?string, isNewFileModalOpen: boolean },
};

class MultipleTabsEditor extends React.Component<Props, State> {
  state = {
    // eslint-disable-next-line react/destructuring-assignment
    code: this.props.initialCode,
    // eslint-disable-next-line react/destructuring-assignment
    selectedEditor: Object.keys(this.props.initialCode)[0],
    fileNameModal: { text: null, isNewFileModalOpen: false },
  };

  componentDidMount() {}

  handleTabChange(selectedEditor, event, newSelectedTab) {
    if (newSelectedTab === undefined) {
      return;
    }
    if (newSelectedTab === "AddNewFile") {
      event.preventDefault();
      return;
    }
    if (selectedEditor === newSelectedTab) {
      this.setState({ fileNameModal: { text: selectedEditor, isNewFileModalOpen: true } });
      return;
    }
    this.setState({ selectedEditor: newSelectedTab });
  }

  handleCodeChange(code: { [string]: string }, codeChanged: string, selectedEditor: string) {
    const newCode = code;
    newCode[selectedEditor] = codeChanged;
    this.setState({ code: newCode });
    this.props.onCodeChange(newCode);
  }

  onClickAddNewFile() {
    this.setState({ fileNameModal: { text: null, isNewFileModalOpen: true } });
  }

  handleCloseFileNameModal(prevFileName: ?string, newFileName: string, code: { [string]: string }) {
    if (!newFileName || newFileName === "") {
      this.setState({ fileNameModal: { text: null, isNewFileModalOpen: false } });
      return;
    }
    const newCode = code;
    if (prevFileName !== null && prevFileName !== undefined) {
      // Change name of existing file
      newCode[newFileName] = newCode[prevFileName];
      delete newCode[prevFileName];
    } else {
      newCode[newFileName] = `// file ${newFileName}`;
    }
    this.setState({
      code: newCode,
      selectedEditor: newFileName,
      fileNameModal: { text: null, isNewFileModalOpen: false },
    });
  }

  getLanguageForMonaco(): string {
    const { language } = this.props;

    const lang = language.split("_")[0];
    if (lang.includes("python")) {
      return "python";
    }
    return lang;
  }

  render() {
    const { classes, width } = this.props;

    const { code, fileNameModal, selectedEditor } = this.state;

    return (
      <div>
        {fileNameModal.isNewFileModalOpen && (
          <AddNewFileModal
            originalFileName={fileNameModal.text}
            existingFilenames={Object.keys(code)}
            open={fileNameModal.isNewFileModalOpen}
            handleCloseModal={(prevFileName, newFileName) =>
              this.handleCloseFileNameModal(prevFileName, newFileName, code)}
          />
        )}
        <div className={classes.demo2}>
          <StyledTabs
            value={selectedEditor}
            onChange={(e, v) => this.handleTabChange(selectedEditor, e, v)}
            aria-label="styled tabs example"
            variant="scrollable"
          >
            {Object.keys(code).map(fileName => {
              return (
                <StyledTab
                  key={fileName}
                  label={fileName}
                  value={fileName}
                  // selected={fileName === selectedEditor}
                />
              );
            })}

            <NewFileButtonTab
              icon={<AddCircleOutlineIcon />}
              value="AddNewFile"
              onClick={() => this.onClickAddNewFile()}
            />
          </StyledTabs>
        </div>
        <MonacoEditor
          height="1000px"
          width={width}
          options={{
            renderFinalNewline: true,
          }}
          language={this.getLanguageForMonaco()}
          theme="vs-dark"
          defaultValue=""
          value={code[selectedEditor]}
          onChange={codeChanged => this.handleCodeChange(code, codeChanged, selectedEditor)}
        />
      </div>
    );
  }
}
// TODO: FIX HEIGHT

export default withState(withStyles(styles)(MultipleTabsEditor));
