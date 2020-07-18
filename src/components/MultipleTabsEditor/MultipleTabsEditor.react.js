/* eslint-disable react/jsx-wrap-multilines */
// @flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import MonacoEditor from "react-monaco-editor";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import { withState } from "../../utils/State";
import AddNewFileModal from "./AddNewFileModal.react";
import type { FilesMetadata } from "../../types";
import { getFilesMetadata, FILES_METADATA } from "../../utils/files";
import { FILE_DISPLAY_MODE, READ_ONLY_DISPLAY_MODES, DELETEABLE_DISPLAY_MODES } from "../../types";

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
  styledTabContent: {
    display: "flex",
    alignItems: "center",
  },
  deleteFileButton: {
    padding: "0 0 0 5px",
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
  canEditFiles: boolean,
};

type State = {
  code: { [string]: string },
  selectedEditor: ?string,
  fileNameModal: { text: ?string, isNewFileModalOpen: boolean },
  filesMetadata: FilesMetadata,
};

const commentByLanguage = { c: "//", python: "#" };

class MultipleTabsEditor extends React.Component<Props, State> {
  state = {
    filesMetadata: getFilesMetadata(this.props.initialCode),
    // eslint-disable-next-line react/destructuring-assignment
    code: this.props.initialCode,
    // eslint-disable-next-line react/destructuring-assignment
    selectedEditor: Object.keys(this.props.initialCode)[0],
    fileNameModal: { text: null, isNewFileModalOpen: false },
  };

  handleTabChange(selectedEditor, event, newSelectedTab, readOnly) {
    if (newSelectedTab === undefined) {
      return;
    }
    if (newSelectedTab === "AddNewFile") {
      event.preventDefault();
      return;
    }
    if (selectedEditor === newSelectedTab && !readOnly && !this.isReadOnlyFile(newSelectedTab)) {
      this.setState({ fileNameModal: { text: selectedEditor, isNewFileModalOpen: true } });
      return;
    }
    this.setState({ selectedEditor: newSelectedTab });
  }

  onClickDeleteFile(e: Event, selectedEditorToDelete: string) {
    e.stopPropagation(); // Do not delete or it will move to this tab "after" deletion (which is inconsistent)
    const { filesMetadata, code, selectedEditor } = this.state;
    const newCode = code;
    const newMetadata = filesMetadata;
    delete newCode[selectedEditorToDelete];
    delete newMetadata[selectedEditorToDelete];

    const editableCodeEditors = Object.keys(newCode).filter(
      fileName => fileName !== FILES_METADATA
    );
    let newSelectedEditor = null;
    if (selectedEditor === selectedEditorToDelete && editableCodeEditors.length > 0) {
      [newSelectedEditor] = editableCodeEditors; // array destructuring === array[0]
    }

    this.setState(prevState => ({
      code: newCode,
      filesMetadata: newMetadata,
      selectedEditor: newSelectedEditor || prevState.selectedEditor,
    }));
    newCode.files_metadata = JSON.stringify(filesMetadata);
    this.props.onCodeChange(newCode);
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
      delete newMetadata[prevFileName];
    } else {
      newCode[newFileName] = `${commentByLanguage[language]} file ${newFileName}`;
      newMetadata[newFileName] = { display: FILE_DISPLAY_MODE.READ_WRITE };
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

  isReadOnlyFile(filename: ?string) {
    const { readOnly, canEditFiles } = this.props;
    const { filesMetadata } = this.state;

    if (filename === null || filename === undefined) {
      return true;
    }

    // Mainly for Submission results
    if (readOnly) {
      return true;
    }

    // Mainly for activity creation and edition
    if (canEditFiles) {
      return false;
    }

    // Students solving an activity
    return READ_ONLY_DISPLAY_MODES.includes(filesMetadata[filename].display);
  }

  canDeleteFile(filename: ?string) {
    const { readOnly, canEditFiles } = this.props;
    const { filesMetadata } = this.state;

    if (filename === null || filename === undefined) {
      return true;
    }

    // Can't delete file while readOnly mode
    if (readOnly) {
      return false;
    }

    // Mainly for activity creation and edition
    if (canEditFiles) {
      return true;
    }

    return DELETEABLE_DISPLAY_MODES.includes(filesMetadata[filename].display);
  }

  render() {
    const { classes, width, editorDidMount, readOnly } = this.props;

    const { code, fileNameModal, selectedEditor } = this.state;

    if (
      selectedEditor !== null &&
      !Object.keys(code).includes(selectedEditor) &&
      Object.keys(code).filter(fileName => fileName !== FILES_METADATA).length > 0
    ) {
      this.setState({ selectedEditor: Object.keys(code)[0] });
      return [];
    }

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
            value={selectedEditor || "AddNewFile"}
            onChange={(e, v) => this.handleTabChange(selectedEditor, e, v, readOnly)}
            aria-label="styled tabs example"
            variant="scrollable"
          >
            {Object.keys(code)
              .filter(fileName => fileName !== FILES_METADATA)
              .map(fileName => {
                return (
                  <StyledTab
                    component="div"
                    key={fileName}
                    label={
                      <div className={classes.styledTabContent}>
                        <span>{fileName}</span>
                        {this.canDeleteFile(fileName) && (
                          <IconButton
                            aria-label="delete"
                            className={classes.deleteFileButton}
                            onClick={e => this.onClickDeleteFile(e, fileName)}
                          >
                            <CancelIcon fontSize="small" style={{ color: "#fff" }} />
                          </IconButton>
                        )}
                      </div>
                    }
                    value={fileName}
                  />
                );
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
        {selectedEditor && (
          <MonacoEditor
            width={width}
            options={{
              renderFinalNewline: true,
              readOnly: this.isReadOnlyFile(selectedEditor),
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
        )}
      </div>
    );
  }
}
// TODO: FIX HEIGHT

export default withState(withStyles(styles)(MultipleTabsEditor));
