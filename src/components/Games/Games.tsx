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
import "./Games.css";

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
  results: any;
  token: string | null;
  openMoreInfo: () => void;
  handleOpenSnackBar: (severity: "success" | "error", message: string) => void;
}

interface State {
  results: any;
}

class Games extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      results: this.props.results,
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid container>
        <Grid item xs={12} id="gameResults">
          <Card className={classes.root}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={this.state.results.background_image}
                title="Contemplative Reptile"
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="h2"
                  id="gameName"
                >
                  <strong>{this.state.results.name}</strong>
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button onClick={() => this.props.openMoreInfo()} id="moreInfo">
                <strong>Game Info</strong>
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Games);
