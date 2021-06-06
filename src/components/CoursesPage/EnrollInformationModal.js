// @flow
import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";

type Props = {
  open: boolean,
  handleCloseModal: void => void,
};

/**
 * Dialog to show if someone attemps to see all the final solutions but hasn't finished its own first
 */
export default function EnrollInformationModal(props: Props) {
  const { open, handleCloseModal } = props;
  return (
    <Dialog
      open={open}
      scroll="paper"
      onBackdropClick={() => handleCloseModal()}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="sm"
    >
      <DialogTitle id="scroll-dialog-title">Solicitud de inscripción enviada</DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="textSecondary" component="p">
          Esperá a que los profesores del curso te acepten! Cuando seas aceptado vás a recibir un
          mail de notificación.
        </Typography>
        <br />
      </DialogContent>
    </Dialog>
  );
}
