import React, { Component } from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Button, Grid, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import Drawer from "./Drawer";
import SignUpPopUp from "../Auth/SignUpPopUp";
import LoginPopUp from "../Auth/LoginPopUp";
import "./Navbar.css";

const styles = (theme: any) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    // toolbar: theme.mixins.toolbar,
  });

interface Props extends WithStyles<typeof styles> {
  token: string | null;
  clickLogout: () => void;
  updateToken: (
    newToken: string,
    userId: number,
    role: "user" | "admin"
  ) => void;
}

interface State {
  open: boolean;
  openSnackBar: boolean;
  openSignUp: boolean;
  openLogin: boolean;
  responseMessage: string;
  severity: "success" | "error"; //@ <--- how to use ENUM in a state
  left: boolean;
}

class Navbar extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      open: false,
      openSnackBar: false,
      openSignUp: false,
      openLogin: false,
      responseMessage: "",
      severity: "success",
      left: false,
    };
  }

  handleOpenSignUp = () => {
    this.setState({
      openSignUp: true,
    });
  };

  handleOpenLogin = () => {
    this.setState({
      openLogin: true,
    });
  };

  handleCloseSnackBar = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      openSnackBar: false,
    });
  };

  handleCloseSignUp = () => {
    this.setState({
      openSignUp: false,
    });
  };

  handleCloseLogin = () => {
    this.setState({
      openLogin: false,
    });
  };

  handleOpenSnackBar = (severity: "success" | "error", message: string) => {
    this.setState({
      severity: severity,
      responseMessage: message,
      openSnackBar: true,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <Grid item xs={6} id="drawerButton">
              <Drawer />
            </Grid>
            <Grid item xs={6} id="title">
              {!this.props.token && (
                <SignUpPopUp
                  openSnackBar={this.handleOpenSnackBar}
                  updateToken={this.props.updateToken}
                />
              )}
              {this.props.token ? (
                <Button id="logoutBut" onClick={this.props.clickLogout}>
                  <strong>Logout</strong>
                </Button>
              ) : (
                <LoginPopUp
                  openSnackBar={this.handleOpenSnackBar}
                  updateToken={this.props.updateToken}
                />
              )}
            </Grid>
          </Toolbar>
        </AppBar>
        <Snackbar
          open={this.state.openSnackBar}
          autoHideDuration={4000}
          onClose={this.handleCloseSnackBar}
        >
          <Alert
            onClose={this.handleCloseSnackBar}
            elevation={6}
            severity={this.state.severity}
            variant="filled"
          >
            {this.state.responseMessage}
          </Alert>
        </Snackbar>
      </div>
    );
  }
}

export default withStyles(styles)(Navbar);
