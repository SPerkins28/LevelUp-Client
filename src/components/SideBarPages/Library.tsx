import React, { Component } from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import CheckIcon from "@material-ui/icons/Check";
import LibraryDelete from "./WantToPlayDelete";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./Library.css";

const styles = (theme: any) =>
  createStyles({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 275,
      width: 300,
    },
    rootProgress: {
      display: "flex",
      "& > * + *": {
        marginLeft: theme.spacing(2),
      },
    },
  });

interface Props extends WithStyles<typeof styles> {
  token: string | null;
}

interface State {
  userLibrary: any;
  openSnackBar: boolean;
  responseMessage: string;
  severity: "success" | "error";
  openRemoveLibrary: boolean;
  userWTP: any;
}

class Library extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      userLibrary: [],
      openSnackBar: false,
      responseMessage: "",
      severity: "success",
      openRemoveLibrary: false,
      userWTP: {},
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

  fetchLibrary = () => {
    const userId = localStorage.getItem("userId");
    fetch(`http://localhost:4321/library/${userId}`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `${this.props.token}`,
      }),
    })
      .then((res: any) => res.json())
      .then((userLibrary: any) => {
        if (!userLibrary) {
          this.handleOpenSnackBar("error", userLibrary.message);
        } else {
          this.setState({
            userLibrary: userLibrary.userLibrary,
          });
          const message = userLibrary.message;
          this.handleOpenSnackBar("success", message);
        }
        console.log(userLibrary.userLibrary);
      });
  };

  updateLibrary = (event: any, game: any) => {
    event.preventDefault();
    const gameId = game.id;
    const finished = game.finished;
    console.log(gameId);
    fetch(`http://localhost:4321/library/${gameId}`, {
      method: "PUT",
      body: JSON.stringify({ finished: !finished }),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `${this.props.token}`,
      }),
    })
      .then((response) => response.json())
      .then((userLibrary) => {
        if (!userLibrary.updated) {
          this.handleOpenSnackBar("error", userLibrary.message);
        } else {
          this.setState({
            userLibrary: userLibrary.userLibrary,
          });
          const message = userLibrary.message;
          this.handleOpenSnackBar("success", message);
        }
      });
    this.fetchLibrary();
  };

  componentDidMount = () => {
    this.fetchLibrary();
  };

  render() {
    console.log(this.state.userLibrary);
    const { classes } = this.props;
    return (
      <>
        <Grid container justify="space-evenly">
          {this.state.userLibrary.length &&
            this.state.userLibrary.map((userLibrary: any, index: number) => {
              return (
                <Grid item xs={12} sm={6} md={3} id="wtpresults" key={index}>
                  <Card className={classes.root}>
                    <CardActionArea>
                      <CardMedia
                        className={classes.media}
                        image={userLibrary.gameImg}
                        title={"Game Image"}
                      />
                      <CardContent>
                        <Typography
                          variant="h6"
                          component="h2"
                          id="wtpGameName"
                        >
                          <strong>{userLibrary.title}</strong>
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions id="wtpActions">
                      <Button
                        fullWidth={true}
                        id="played"
                        onClick={(event) => this.updateLibrary(event, userLibrary)}
                      >
                        <strong>
                          {userLibrary.played ? (
                            <span id="playedIndicator">
                              Finished <CheckIcon id="check" />
                            </span>
                          ) : (
                            "Not Finished"
                          )}
                        </strong>
                      </Button>
                      <Button
                        fullWidth={true}
                        onClick={() =>
                          this.setState({
                            openRemoveLibrary: true,
                            userLibrary: userLibrary,
                          })
                        }
                        id="remove"
                      >
                        <strong>Remove from library</strong>
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
        {this.state.openSnackBar && (
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
        )}
        {this.state.openRemoveLibrary && (
          <LibraryDelete
            handleOpenSnackBar={this.handleOpenSnackBar}
            token={this.props.token}
            open={this.state.openRemoveLibrary}
            onClose={() => this.setState({ openRemoveLibrary: false })}
            game={this.state.userLibrary}
          />
        )}
      </>
    );
  }
}

export default withStyles(styles)(Library);