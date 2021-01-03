import React, { Component } from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import Grid from "@material-ui/core/Grid";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

const styles = (theme: any) =>
  createStyles({
    root: {
      marginTop: "3em",
      marginBottom: "1em",
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: 400,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  });

interface Props extends WithStyles<typeof styles> {
  token: string | null;
}

interface State {
  passwordInput: string;
  usernameInput: string;
  openSnackBar: boolean;
  responseMessage: string;
  severity: "success" | "error";
  userReviews: any;
}

class MyAccount extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      passwordInput: "",
      usernameInput: "",
      openSnackBar: false,
      responseMessage: "",
      severity: "success",
      userReviews: [],
    };
  }

  handleOpenSnackBar = (severity: "success" | "error", message: string) => {
    this.setState({
      severity: severity,
      responseMessage: message,
      openSnackBar: true,
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

  setUsername = (username: string) => {
    this.setState({
      usernameInput: username,
    });
  };

  setPassword = (password: string) => {
    this.setState({
      passwordInput: password,
    });
  };

  updateUsername = () => {
    const userId = localStorage.getItem("userId");

    fetch(`http://localhost:4321/user/username/${userId}`, {
      method: "PUT",
      body: JSON.stringify({ username: this.state.usernameInput }),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `${this.props.token}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.usernameChanged) {
          this.handleOpenSnackBar("error", data.message);
        } else {
          const message = data.message;
          this.handleOpenSnackBar("success", message);
        }
      });
  };

  updatePassword = () => {
    const userId = localStorage.getItem("userId");

    fetch(`http://localhost:4321/user/password/${userId}`, {
      method: "PUT",
      body: JSON.stringify({ password: this.state.passwordInput }),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `${this.props.token}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.passwordChanged) {
          this.handleOpenSnackBar("error", data.message);
        } else {
          const message = data.message;
          this.handleOpenSnackBar("success", message);
        }
      });
  };

  fetchUserReviews = () => {
    const userId = localStorage.getItem("userId");

    fetch(`http://localhost:4321/review/user/${userId}`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `${this.props.token}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.userReviews) {
          this.handleOpenSnackBar("error", data.message);
        } else {
          this.setState({
            userReviews: data.userReviews,
          });
          const message = data.message;
          this.handleOpenSnackBar("success", message);
        }
      });
  };

  componentDidMount = () => {
    this.fetchUserReviews();
  };

  handleSubmitUsername = (e: any) => {
    e.preventDefault();
    this.updateUsername();
  };

  handleSubmitPassword = (e: any) => {
    e.preventDefault();
    this.updatePassword();
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Grid container>
          <Grid item xs={12} id="usernameInput">
            <Paper component="form" className={classes.root} id="usernameInput">
              <InputBase
                className={classes.input}
                id="username"
                value={this.state.usernameInput}
                placeholder="Enter New Username"
                onChange={(e) => this.setUsername(e.target.value)}
              />
              <Divider className={classes.divider} orientation="vertical" />
              <IconButton
                type="submit"
                className={classes.iconButton}
                onClick={this.handleSubmitUsername}
              >
                <PlayArrowIcon id="playIcon" />
              </IconButton>
            </Paper>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} id="passwordInput">
            <Paper component="form" className={classes.root} id="passwordInput">
              <InputBase
                className={classes.input}
                id="password"
                value={this.state.passwordInput}
                placeholder="Enter New Password"
                onChange={(e) => this.setPassword(e.target.value)}
              />
              <Divider className={classes.divider} orientation="vertical" />
              <IconButton
                type="submit"
                className={classes.iconButton}
                onClick={this.handleSubmitPassword}
              >
                <PlayArrowIcon id="playIcon" />
              </IconButton>
            </Paper>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} md={8}>
            <TableContainer>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      <strong>Title</strong>
                    </TableCell>
                    <TableCell align="left">
                      <strong>Entry</strong>
                    </TableCell>
                    <TableCell align="left">
                      <strong>date</strong>
                    </TableCell>
                    <TableCell align="left">
                      <strong>Rating</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.userReviews.length > 0 &&
                    this.state.userReviews.map((myReview: any, index: any) => {
                      return (
                        <TableRow key={index}>
                          <TableCell align="left">{myReview.title}</TableCell>
                          <TableCell align="left">{myReview.entry}</TableCell>
                          <TableCell align="left">{new Date(myReview.date).toLocaleDateString()}</TableCell>
                          <TableCell align="left">{myReview.rating}</TableCell>
                          <TableCell align="right">
                            <Button id="updateReview">Update</Button>
                            <Button id="deleteReview">Delete</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
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

export default withStyles(styles)(MyAccount);
