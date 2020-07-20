// @flow
import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import MultipleTabsEditor from "../MultipleTabsEditor/MultipleTabsEditor.react";

const styles = () => ({
  modal: {
    minHeight: "200px",
  },
  dialogTitle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "8px",
  },
  dialogTitleText: {
    alignSelf: "center",
    marginRight: "10px",
  },
  dialogContent: {
    display: "flex",
    flexDirection: "column",
  },
  codeEditor: {
    height: "500px",
    width: "100%",
    display: "flex",
    paddingBottom: "70px",
  },
});

type Props = {
  handleCloseModal: Event => void,
  open: boolean,
  classes: any,
  activityCode: { [string]: string },
  activityLanguage: string,
};

function ActivityTemplateCodeModal(props: Props) {
  const { classes, open, handleCloseModal, activityCode, activityLanguage } = props;

  const title = "Código de la actividad";
  return (
    <div>
      <Dialog
        open={open}
        onClose={e => handleCloseModal(e)}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        className={classes.modal}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle id="scroll-dialog-title" className={classes.dialogTitle} disableTypography>
          <Typography
            variant="h5"
            color="textSecondary"
            component="p"
            className={classes.dialogTitleText}
          >
            {title}
          </Typography>
        </DialogTitle>
        <DialogContent dividers className={classes.dialogContent}>
          <div className={classes.codeEditor}>
            <MultipleTabsEditor
              width="100%"
              initialCode={activityCode}
              language={activityLanguage}
              readOnly
            />
          </div>
          <DialogActions>
            <Button onClick={e => handleCloseModal(e)} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withStyles(styles)(ActivityTemplateCodeModal);
