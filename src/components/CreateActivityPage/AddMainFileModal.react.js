// @flow
import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

type Props = {
  open: boolean,
  mainFileByLanguage: { [string]: string },
  language: string,
  onClickHide: () => void,
};

export default function AddMainFileModal(props: Props) {
  const { open, language, mainFileByLanguage, onClickHide } = props;
  return (
    <Dialog
      open={open}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="sm"
    >
      <DialogTitle id="scroll-dialog-title">Tenes que agregar el archivo main</DialogTitle>
      <DialogContent>
        <span style={{ paddingLeft: "35%" }}>{mainFileByLanguage[language || "c"]}</span>
        <DialogActions>
          <Button onClick={() => onClickHide()} color="primary">
            OK
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
