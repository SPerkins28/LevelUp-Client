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
import WantToPlayDelete from "./WantToPlayDelete";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./WantToPlay.css";

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
  userWantToPlay: any;
  openSnackBar: boolean;
  responseMessage: string;
  severity: "success" | "error";
  openRemoveWTP: boolean;
  userWTP: any;
}

class WantToPlay extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      userWantToPlay: [],
      openSnackBar: false,
      responseMessage: "",
      severity: "success",
      openRemoveWTP: false,
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

  fetchWTP = () => {
    const userId = localStorage.getItem("userId");
    fetch(`http://localhost:4321/wanttoplay/${userId}`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `${this.props.token}`,
      }),
    })
      .then((res: any) => res.json())
      .then((userWantToPlay: any) => {
        if (!userWantToPlay) {
          this.handleOpenSnackBar("error", userWantToPlay.message);
        } else {
          this.setState({
            userWantToPlay: userWantToPlay.userWantToPlay,
          });
          const message = userWantToPlay.message;
          this.handleOpenSnackBar("success", message);
        }
        console.log(userWantToPlay.userWantToPlay);
      });
  };

  updateWTP = (event: any, game: any) => {
    event.preventDefault();
    const wtpId = game.id;
    const played = game.played;
    console.log(wtpId);
    fetch(`http://localhost:4321/wanttoplay/${wtpId}`, {
      method: "PUT",
      body: JSON.stringify({ played: !played }),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `${this.props.token}`,
      }),
    })
      .then((response) => response.json())
      .then((userWantToPlay) => {
        if (!userWantToPlay.updated) {
          this.handleOpenSnackBar("error", userWantToPlay.message);
        } else {
          this.setState({
            userWantToPlay: userWantToPlay.userWantToPlay,
          });
          const message = userWantToPlay.message;
          this.handleOpenSnackBar("success", message);
        }
      });
    this.fetchWTP();
  };

  componentDidMount = () => {
    this.fetchWTP();
  };

  render() {
    console.log(this.state.userWantToPlay);
    const { classes } = this.props;
    return (
      <>
        <Grid container justify="space-evenly">
          {setTimeout(this.state.userWantToPlay.length, 800) &&
            this.state.userWantToPlay.map((userWTP: any, index: number) => {
              return (
                <Grid item xs={12} sm={6} md={3} id="wtpresults" key={index}>
                  <Card className={classes.root}>
                    <CardActionArea>
                      <CardMedia
                        className={classes.media}
                        image={userWTP.gameImg}
                        title={"Game Image"}
                      />
                      <CardContent>
                        <Typography
                          variant="h6"
                          component="h2"
                          id="wtpGameName"
                        >
                          <strong>{userWTP.title}</strong>
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions id="wtpActions">
                      <Button
                        fullWidth={true}
                        id="played"
                        onClick={(event) => this.updateWTP(event, userWTP)}
                      >
                        <strong>
                          {userWTP.played ? (
                            <span id="playedIndicator">
                              Played <CheckIcon id="check" />
                            </span>
                          ) : (
                            "Not Played"
                          )}
                        </strong>
                      </Button>
                      <Button
                        fullWidth={true}
                        onClick={() =>
                          this.setState({
                            openRemoveWTP: true,
                            userWTP: userWTP,
                          })
                        }
                        id="remove"
                      >
                        <strong>Remove from list</strong>
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
        {this.state.openRemoveWTP && (
          <WantToPlayDelete
            handleOpenSnackBar={this.handleOpenSnackBar}
            token={this.props.token}
            open={this.state.openRemoveWTP}
            onClose={() => this.setState({ openRemoveWTP: false })}
            game={this.state.userWTP}
          />
        )}
      </>
    );
  }
}

export default withStyles(styles)(WantToPlay);
