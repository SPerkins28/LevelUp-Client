import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { Button, TextField, Typography, Paper } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import UserReviewUpdate from "./Modals/UserReviewUpdate";
import UserReviewDelete from "./Modals/UserReviewDelete";
import UserReview from "../../Interfaces/UserReviewInterface";
import UserReviewInterface from "../../Interfaces/UserReview";

interface Props {
  token: string | null;
}

interface State {
  // userList: ,
  userRole: string;
  openSnackBar: boolean;
  responseMessage: string;
  severity: "success" | "error";
  openReviewUpdate: boolean;
  openReviewDelete: boolean;
}

class AdminPortal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      userRole: "",
      openSnackBar: false,
      responseMessage: "",
      severity: "success",
      openReviewUpdate: false,
      openReviewDelete: false,
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

//   updateUserRole = () => {
//       const userId = 
//   }
}

export default AdminPortal;