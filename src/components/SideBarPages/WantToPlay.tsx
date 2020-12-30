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

const styles = createStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 275,
    width: 300,
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
}

class WantToPlay extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      userWantToPlay: [],
      openSnackBar: false,
      responseMessage: "",
      severity: "success",
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
    // const userId = this.props.token;
    console.log(this.props.token)
    fetch(`http://localhost:4321/wanttoplay/${1}`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        "Authorization": `${this.props.token}`,
      }),
    })
      .then((res: any) => res.json())
      .then((userWantToPlay: any) => {
        if (!userWantToPlay) {
          this.handleOpenSnackBar("error", userWantToPlay.message);
        } else {
          const message = userWantToPlay.message;
          this.handleOpenSnackBar("success", message);
          this.setState({
            userWantToPlay: userWantToPlay,
          });
        }
      });
  };

  componentDidMount = () => {
    this.fetchWTP();
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container>
        <Grid item xs={4} id="wtpresults">
          {this.state.userWantToPlay.length && this.state.userWantToPlay.map((userWTP: any) => (
            <Card className={classes.root}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={userWTP.gameImg}
                  title={"Game Image"}
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    id="wtpGameName"
                  >
                    {userWTP.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button>Played?</Button>
                <Button>Remove from list</Button>
              </CardActions>
            </Card>
          ))}
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(WantToPlay);
