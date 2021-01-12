import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import {
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
} from "@material-ui/core";
import {
  createStyles,
  WithStyles,
  withStyles,
  Theme,
} from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import User from "../../Interfaces/UserListInterface";
import APIURL from "../../helpers/environment";
import "./AdminPortal.css";

const roles = [
  {
    value: "user",
    label: "user",
  },
  {
    value: "admin",
    label: "admin",
  },
  {
    value: "banned",
    label: "banned",
  },
];

const styles = (theme: Theme) =>
  createStyles({
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "10ch",
      },
    },
  });

interface Props extends WithStyles<typeof styles> {
  token: string | null;
}

interface State {
  userList: User[];
  userRole: string | null;
  openSnackBar: boolean;
  responseMessage: string;
  severity: "success" | "error";
  openReviewUpdate: boolean;
  openReviewDelete: boolean;
  userIdToEdit: number;
}

class AdminPortal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      userList: [],
      userRole: "",
      openSnackBar: false,
      responseMessage: "",
      severity: "success",
      openReviewUpdate: false,
      openReviewDelete: false,
      userIdToEdit: 0,
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

  setUserRole = (role: string) => {
    this.setState({
      userRole: role,
    });
  };

  fetchAllUsers = () => {
    fetch(`${APIURL}/user/userlist/`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `${this.props.token}`,
      }),
    })
      .then((res) => res.json())
      .then((users) => {
        if (!users.userList) {
          this.handleOpenSnackBar("error", users.message);
        } else {
          this.setState({
            userList: users.userList,
          });
          const message = users.message;
          this.handleOpenSnackBar("success", message);
        }
      });
  };

  updateUserRole = (userId: number) => {
    fetch(`${APIURL}/user/role/${userId}`, {
      method: "PUT",
      body: JSON.stringify({ role: this.state.userRole }),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `${this.props.token}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.updatedUserRole) {
          this.handleOpenSnackBar("error", data.message);
        } else {
          const message = data.message;
          this.handleOpenSnackBar("success", message);
        }
      });
  };

  componentDidMount = () => {
    this.fetchAllUsers();
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        {this.props.token && localStorage.getItem("role") === "admin" ? (
          <div>
            <Grid container spacing={4} justify="center" id="userListContainer">
              <Grid item xs={12}>
                <Typography variant="h3" id="userHeading">
                  <strong>USERS</strong>
                </Typography>
                <br />
              </Grid>
              <Grid container id="userListHeading">
                <Grid item xs={12} md={3}>
                  <Typography id="usernameHeading">
                    <strong>Username</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography id="firstNameHeading">
                    <strong>First Name</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography id="lastNameHeading">
                    <strong>Last Name</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography id="roleHeading">
                    <strong>User Role</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2} id="roleHeading"></Grid>
              </Grid>
              {this.state.userList.length > 0 &&
                this.state.userList.map((userList: User, index: number) => {
                  return (
                    <Grid container id="userList" key={index}>
                      <Grid item xs={12} md={3}>
                        <Typography id="usernameText">
                          <strong>{userList.username}</strong>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography id="firstNameText">
                          {userList.firstName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography id="lastNameText">
                          {userList.lastName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3} id="roleText">
                        <form className={classes.root} noValidate>
                          <TextField
                            id="userRoleSelect"
                            select
                            defaultValue={userList.role}
                            onChange={(e) =>
                              this.setState({ userRole: e.target.value })
                            }
                          >
                            {roles.map((role) => (
                              <MenuItem key={role.value} value={role.value}>
                                {role.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </form>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Button
                          id="updateUserRole"
                          onClick={() => this.updateUserRole(userList.id)}
                        >
                          <strong>UPDATE ROLE</strong>
                        </Button>
                      </Grid>
                    </Grid>
                  );
                })}
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
            </Grid>
          </div>
        ) : (
          <Paper id="adminMessage">
            <strong>
              Its pretty dark in here...Login or Sign Up to acquire the torch!
            </strong>
          </Paper>
        )}
      </>
    );
  }
}

export default withStyles(styles)(AdminPortal);
