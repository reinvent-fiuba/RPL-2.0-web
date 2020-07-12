// @flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import MonacoEditor from "react-monaco-editor";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { withState } from "../../utils/State";
import AddNewFileModal from "./AddNewFileModal.react";
import AddActivityCorrectionTests from "../AddActivityCorrectionTests/AddActivityCorrectionTests.react";

const styles = theme => ({
  addFileButton: {
    marginLeft: 20,
  },
  tabsContainer: {
    backgroundColor: "#1e1e1ef0",
  },
  tabsEditorContainer: {
    width: "100%",
    height: "100%",
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
  readOnly: boolean,
  editorDidMount: any,
  canEditFiles: booleanean,
};

type State = {
  code: { [string]: string },
  selectedEditor: string,
  fileNameModal: { text: ?string, isNewFileModalOpen: boolean },
  filesMetadata: { [string]: { display: string } },
};

const commentByLanguage = { c: "//", python: "#" };

class MultipleTabsEditor extends React.Component<Props, State> {
  state = {
    filesMetadata: this.getFilesMetadata(),
    // eslint-disable-next-line react/destructuring-assignment
    code: this.props.initialCode,
    // eslint-disable-next-line react/destructuring-assignment
    selectedEditor: Object.keys(this.props.initialCode)[0],
    fileNameModal: { text: null, isNewFileModalOpen: false },
  };

  getFilesMetadata() {
    if ("files_metadata" in this.props.initialCode) {
      const metadata = JSON.parse(this.props.initialCode.files_metadata);
      Object.keys(this.props.initialCode).forEach(filename => {
        if (filename === "files_metadata") return;
        if (!(filename in metadata)) {
          metadata.fileName = { display: "read_write" };
        }
      });
      return metadata;
    }
    return MultipleTabsEditor.buildFilesMetadata(this.props.initialCode);
  }

  static buildFilesMetadata(files: { [string]: string }): Object {
    const filesMetadata = {};
    Object.keys(files).forEach(file => {
      filesMetadata[file] = { display: "read_write" };
    });
    return filesMetadata;
  }

  handleTabChange(selectedEditor, event, newSelectedTab, readOnly) {
    if (newSelectedTab === undefined) {
      return;
    }
    if (newSelectedTab === "AddNewFile") {
      event.preventDefault();
      return;
    }
    if (selectedEditor === newSelectedTab && !readOnly) {
      this.setState({ fileNameModal: { text: selectedEditor, isNewFileModalOpen: true } });
      return;
    }
    this.setState({ selectedEditor: newSelectedTab });
  }

  handleCodeChange(code: { [string]: string }, codeChanged: string, selectedEditor: string) {
    const { filesMetadata } = this.state;
    const newCode = code;
    newCode[selectedEditor] = codeChanged;
    this.setState({ code: newCode });
    newCode.files_metadata = JSON.stringify(filesMetadata);
    this.props.onCodeChange(newCode);
  }

  onClickAddNewFile() {
    this.setState({ fileNameModal: { text: null, isNewFileModalOpen: true } });
  }

  handleCloseFileNameModal(prevFileName: ?string, newFileName: string, code: { [string]: string }) {
    const { language } = this.props;
    const { filesMetadata } = this.state;
    if (!newFileName || newFileName === "") {
      this.setState({ fileNameModal: { text: null, isNewFileModalOpen: false } });
      return;
    }
    const newCode = code;
    const newMetadata = filesMetadata;
    if (prevFileName !== null && prevFileName !== undefined) {
      // Change name of existing file
      newCode[newFileName] = newCode[prevFileName];
      newMetadata[newFileName] = newMetadata[prevFileName];
      delete newCode[prevFileName];
      delete filesMetadata[prevFileName];
    } else {
      newCode[newFileName] = `${commentByLanguage[language]} file ${newFileName}`;
      newMetadata[newFileName] = { display: "read_write" };
    }
    this.setState({
      code: newCode,
      filesMetadata: newMetadata,
      selectedEditor: newFileName,
      fileNameModal: { text: null, isNewFileModalOpen: false },
    });

    newCode.files_metadata = JSON.stringify(newMetadata);
    this.props.onCodeChange(newCode);
  }

  getLanguageForMonaco(): string {
    const { language } = this.props;

    const lang = language.split("_")[0];
    if (lang.includes("python")) {
      return "python";
    }
    return lang;
  }

  isReadOnlyFile(filename: string) {
    const { readOnly, canEditFiles } = this.props;
    const { filesMetadata } = this.state;

    // Mainly for Submission results
    if (readOnly) {
      return true;
    }

    // Mainly for activity creation and edition
    if (canEditFiles) {
      return false;
    }

    // Students solving an activity
    return filesMetadata[filename].display !== "read_write";
  }

  render() {
    const { classes, width, editorDidMount, readOnly } = this.props;

    const { code, fileNameModal, selectedEditor } = this.state;

    if (!Object.keys(code).includes(selectedEditor)) {
      this.setState({ selectedEditor: Object.keys(code)[0] });
      return [];
    }

    const readOnlyFile = this.isReadOnlyFile(selectedEditor);

    return (
      <div className={classes.tabsEditorContainer}>
        {fileNameModal.isNewFileModalOpen && (
          <AddNewFileModal
            originalFileName={fileNameModal.text}
            existingFilenames={Object.keys(code)}
            open={fileNameModal.isNewFileModalOpen}
            handleCloseModal={(prevFileName, newFileName) =>
              this.handleCloseFileNameModal(prevFileName, newFileName, code)
            }
          />
        )}
        <div className={classes.tabsContainer}>
          <StyledTabs
            value={selectedEditor}
            onChange={(e, v) => this.handleTabChange(selectedEditor, e, v, readOnly)}
            aria-label="styled tabs example"
            variant="scrollable"
          >
            {Object.keys(code).map(fileName => {
              if (fileName === "files_metadata") return;
              return <StyledTab key={fileName} label={fileName} value={fileName} />;
            })}

            {!readOnly && (
              <NewFileButtonTab
                icon={<AddCircleOutlineIcon />}
                value="AddNewFile"
                onClick={() => this.onClickAddNewFile()}
              />
            )}
          </StyledTabs>
        </div>
        <MonacoEditor
          width={width}
          options={{
            renderFinalNewline: true,
            readOnly: readOnlyFile,
            scrollBeyondLastLine: false,
            wordWrap: "on",
          }}
          language={this.getLanguageForMonaco()}
          theme="vs-dark"
          defaultValue=""
          value={code[selectedEditor]}
          onChange={codeChanged => this.handleCodeChange(code, codeChanged, selectedEditor)}
          editorDidMount={editorDidMount}
        />
      </div>
    );
  }
}
// TODO: FIX HEIGHT

export default withState(withStyles(styles)(MultipleTabsEditor));
