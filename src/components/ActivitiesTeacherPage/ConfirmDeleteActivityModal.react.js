// @flow
import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

type Props = {
  open: boolean,
  onDeleteClicked: void => void,
  onCancelClicked: void => void,
};

/**
 * Dialog to show if someone attemps to see all the final solutions but hasn't finished its own first
 */
export default function ConfirmDeleteActivityModal(props: Props) {
  const { open, onDeleteClicked, onCancelClicked } = props;
  return (
    <Dialog
      open={open}
      onBackdropClick={() => onCancelClicked()}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="sm"
    >
      <DialogTitle id="scroll-dialog-title">¿Seguro que querés eliminar la actividad?</DialogTitle>
      <DialogContent>
        <DialogActions>
          <Button onClick={() => onCancelClicked()} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => onDeleteClicked()}>Eliminar</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
