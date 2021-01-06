import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import LibraryInterface from "../../Interfaces/LibraryInterface";
import UserLibraryGame from "../../Interfaces/UserLibraryInterface";

interface Props {
  handleOpenSnackBar: (severity: "success" | "error", message: string) => void;
  token: string | null;
  open: boolean;
  onClose: () => void;
  game: LibraryInterface;
  setLibrary: (updatedList: Array<UserLibraryGame>) => void;
}

interface State {
  open: boolean;
  openSnackBar: boolean;
  responseMessage: string;
  severity: "success" | "error";
}

class LibraryDelete extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
      openSnackBar: false,
      responseMessage: "",
      severity: "success",
    };
  }

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  removeFromLibrary = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    game: LibraryInterface
  ) => {
    event.preventDefault();
    const gameId = game.id;
    fetch(`http://localhost:4321/library/delete/${gameId}`, {
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `${this.props.token}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.removedGame) {
          this.props.handleOpenSnackBar("error", data.message);
        } else {
          this.props.setLibrary(
            data.removedGame.filter(
              (deletedGame: UserLibraryGame) => deletedGame.id !== gameId
            )
          );
          const message = data.message;
          this.props.handleOpenSnackBar("success", message);
          this.props.onClose();
        }
      });
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alertTitle">
            <strong>Are you sure?</strong>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alertNotice">
              {`Are you sure you want to remove ${this.props.game.title} from your Library?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose} id="backButton">
              <strong>Cancel</strong>
            </Button>
            <Button
              onClick={(event) =>
                this.removeFromLibrary(event, this.props.game)
              }
              id="deleteButton"
              autoFocus
            >
              <strong>Delete</strong>
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default LibraryDelete;
