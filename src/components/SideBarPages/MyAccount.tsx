import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { Button, TextField, Typography, Paper } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import UserReviewUpdate from "./Modals/UserReviewUpdate";
import UserReviewDelete from "./Modals/UserReviewDelete";
import "./MyAccount.css";

interface Props {
  token: string | null;
}

interface State {
  passwordInput: string;
  usernameInput: string;
  openSnackBar: boolean;
  responseMessage: string;
  severity: "success" | "error";
  userReviews: any;
  userReview: any;
  openUserReviewUpdate: boolean;
  openUserReviewDelete: boolean;
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
      userReview: {},
      openUserReviewUpdate: false,
      openUserReviewDelete: false,
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
    const token = this.props.token;
    fetch(`http://localhost:4321/review/user/${userId}`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `${this.props.token}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!token) {
          this.handleOpenSnackBar("error", data.message);
        } else if (!data.userReviews) {
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
    return (
      <>
        {this.props.token ? (
          <div>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h3" id="accountHeading">
                  <strong>MY ACCOUNT</strong>
                </Typography>
              </Grid>
            </Grid>
            <Grid container id="usernameUpdate">
              <Grid item xs={12} md={5} id="usernameInput">
                <TextField
                  autoFocus
                  margin="dense"
                  label="Change Username"
                  type="text"
                  variant="filled"
                  onChange={(e) =>
                    this.setState({ usernameInput: e.target.value })
                  }
                  InputLabelProps={{
                    className: "updateFields",
                  }}
                />
                <Button
                  id="updateUButton"
                  variant="contained"
                  onClick={this.handleSubmitUsername}
                >
                  <strong>Update</strong>
                </Button>
              </Grid>
              <Grid item xs={12} md={5} id="passwordInput">
                <TextField
                  error={
                    this.state.passwordInput.length > 0 &&
                    this.state.passwordInput.length < 6
                  }
                  helperText={
                    this.state.passwordInput.length > 0 &&
                    this.state.passwordInput.length < 6
                      ? "Password must be 6 characters long"
                      : null
                  }
                  autoFocus
                  margin="dense"
                  label="Change Password"
                  type="password"
                  variant="filled"
                  onChange={(e) =>
                    this.setState({ passwordInput: e.target.value })
                  }
                  InputLabelProps={{
                    className: "updateFields",
                  }}
                />
                <Button
                  id="updatePButton"
                  variant="contained"
                  onClick={this.handleSubmitPassword}
                >
                  <strong>Update</strong>
                </Button>
              </Grid>
            </Grid>
            <br />
            <br />
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h3" id="reviewHeading">
                  <strong>MY REVIEWS</strong>
                </Typography>
                <br />
                <br />
              </Grid>
            </Grid>
            <Grid container spacing={2} justify="center">
              {this.state.userReviews.length > 0 &&
                this.state.userReviews.map((myReviews: any, index: any) => {
                  return (
                    <Grid container id="userReviews" key={index}>
                      <Grid item xs={12} md={2}>
                        <Typography id="reviewTitle">
                          <strong>{myReviews.title}</strong>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography id="entryText">
                          {myReviews.entry}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography id="dateText">
                          {new Date(myReviews.createdAt).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Rating
                          id="rating"
                          defaultValue={myReviews.rating}
                          readOnly
                        />
                      </Grid>
                      <Grid item xs={12} md={1} id="reviewActions">
                        <Button
                          id="updateUserReview"
                          onClick={() =>
                            this.setState({
                              openUserReviewUpdate: true,
                              userReview: myReviews,
                            })
                          }
                        >
                          Update
                        </Button>
                        <Button
                          id="deleteUserReview"
                          onClick={() =>
                            this.setState({
                              openUserReviewDelete: true,
                              userReview: myReviews,
                            })
                          }
                        >
                          Delete
                        </Button>
                      </Grid>
                      <br />
                    </Grid>
                  );
                })}
              {this.state.openUserReviewUpdate && (
                <UserReviewUpdate
                  token={this.props.token}
                  open={this.state.openUserReviewUpdate}
                  onClose={() => this.setState({ openUserReviewUpdate: false })}
                  updateReviews={this.fetchUserReviews}
                  review={this.state.userReview}
                  handleOpenSnackBar={this.handleOpenSnackBar}
                />
              )}
              {this.state.openUserReviewDelete && (
                <UserReviewDelete
                  token={this.props.token}
                  open={this.state.openUserReviewDelete}
                  onClose={() => this.setState({ openUserReviewDelete: false })}
                  updateReviews={this.fetchUserReviews}
                  review={this.state.userReview}
                  handleOpenSnackBar={this.handleOpenSnackBar}
                />
              )}
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
        ) : (
          <Paper id="accountMessage">
            <strong>
              Its pretty dark in here...Login or Sign Up to acquire the torch!
            </strong>
          </Paper>
        )}
      </>
    );
  }
}

export default MyAccount;
