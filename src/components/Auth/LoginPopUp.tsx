import React, { Component } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import "./LoginPopUp.css";
import APIURL from '../../helpers/environment';

interface Props {
  openSnackBar: (severity: "success" | "error" | "warning", message: string) => void;
  updateToken: (
    newToken: string,
    userId: number,
    role: "user" | "admin"
  ) => void;
}

interface State {
  username: string;
  password: string;
  open: boolean;
}

class LoginPopUp extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      open: false,
    };
  }

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    fetch(`${APIURL}/user/login`, {
      method: "POST",
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.sessionToken) {
          this.props.openSnackBar("error", data.message);
        } else if (data.role === 'banned') {
          const bannedMessage = data.message;
          this.props.openSnackBar("warning", bannedMessage);
          this.props.updateToken(data.sessionToken, data.userId, data.role);
          this.handleClose();
        } else {
          const message = data.message;
          this.props.openSnackBar("success", message);
          this.props.updateToken(data.sessionToken, data.userId, data.role);
          this.handleClose();
        }
      });
  };

  render() {
    return (
      <div>
        <Button onClick={this.handleClickOpen} id="loginBut">
          <strong>LOGIN</strong>
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle id="lOGINTitle">
            <strong>LOGIN</strong>
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              id="loginInput"
              margin="dense"
              label="username"
              type="text"
              fullWidth
              onChange={(e) => this.setState({ username: e.target.value })}
              InputLabelProps={{
                className: "loginFields",
              }}
            />
            <TextField
              autoFocus
              id="loginPasswordInput"
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              onChange={(e) => this.setState({ password: e.target.value })}
              InputLabelProps={{
                className: "loginFields",
              }}
            />
          </DialogContent>
          <DialogActions id="loginButtons">
            <Button onClick={this.handleClose} id="cancelButton">
              <strong>Cancel</strong>
            </Button>
            <Button onClick={this.handleSubmit} id="loginButton">
              <strong>Login</strong>
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default LoginPopUp;
