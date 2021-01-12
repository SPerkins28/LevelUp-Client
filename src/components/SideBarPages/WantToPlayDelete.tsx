import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import APIURL from "../../helpers/environment";
import UserWTPInterface from "../../Interfaces/UserWTPInterface";
import UserWantToPlayGame from "../../Interfaces/WTPInterface";

interface Props {
  handleOpenSnackBar: (severity: "success" | "error", message: string) => void;
  token: string | null;
  open: boolean;
  onClose: () => void;
  game: UserWTPInterface;
  setUserWantToPlay: (updatedList: Array<UserWantToPlayGame>) => void;
}

interface State {
  open: boolean;
  openSnackBar: boolean;
  responseMessage: string;
  severity: "success" | "error";
}

class WantToPlayDelete extends Component<Props, State> {
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

  removeWTP = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    game: UserWTPInterface
  ) => {
    event.preventDefault();
    const wtpId = game.id;
    fetch(`${APIURL}/wanttoplay/delete/${wtpId}`, {
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `${this.props.token}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.updatedList) {
          this.props.handleOpenSnackBar("error", data.message);
        } else {
          this.props.setUserWantToPlay(
            data.updatedList.filter(
              (deletedGame: UserWantToPlayGame) => deletedGame.id !== wtpId
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
              {`Are you sure you want to remove ${this.props.game.title} from your Want To Play List?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose} id="backButton">
              <strong>Cancel</strong>
            </Button>
            <Button
              onClick={(event) => this.removeWTP(event, this.props.game)}
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

export default WantToPlayDelete;
