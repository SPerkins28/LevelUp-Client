import React, { Component } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import "./SignUpPopUp.css";

interface Props {
  openSnackBar: (severity: "success" | "error", message: string) => void;
  updateToken: (newToken: string, userId: number, role: 'user' | 'admin') => void;
}

interface State {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  open: boolean;
}

class SignUpPopUp extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
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

  handleSubmit = (event: any) => {
    event.preventDefault();
    fetch("http://localhost:4321/user/register", {
      method: "POST",
      body: JSON.stringify({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
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
        <Button onClick={this.handleClickOpen} id="signupBut">
          <strong>SIGN UP</strong>
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle id="dialogTitle">
            <strong>SIGN UP</strong>
          </DialogTitle>
          <DialogContent id="signupForm">
            <TextField
              autoFocus
              margin="dense"
              label="First Name"
              type="text"
              fullWidth
              onChange={(e) => this.setState({ firstName: e.target.value })}
              InputLabelProps={{
                className: "signupFields",
              }}
            />
            <TextField
              autoFocus
              margin="dense"
              label="Last Name"
              type="text"
              fullWidth
              onChange={(e) => this.setState({ lastName: e.target.value })}
              InputLabelProps={{
                className: "signupFields",
              }}
            />
            <TextField
              autoFocus
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              onChange={(e) => this.setState({ email: e.target.value })}
              InputLabelProps={{
                className: "signupFields",
              }}
            />
            <TextField
              autoFocus
              margin="dense"
              label="username"
              type="text"
              fullWidth
              onChange={(e) => this.setState({ username: e.target.value })}
              InputLabelProps={{
                className: "signupFields",
              }}
            />
            <TextField
              error={
                this.state.password.length > 0 && this.state.password.length < 8
              }
              helperText={
                this.state.password.length > 0 && this.state.password.length < 8
                  ? "Password must be 8 characters long"
                  : null
              }
              autoFocus
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              onChange={(e) => this.setState({ password: e.target.value })}
              InputLabelProps={{
                className: "signupFields",
              }}
            />
          </DialogContent>
          <DialogActions id="signupButtons">
            <Button onClick={this.handleClose} id="signupButton">
              <strong>Cancel</strong>
            </Button>
            <Button onClick={this.handleSubmit} id="cancelButton">
              <strong>Sign Up</strong>
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default SignUpPopUp;
