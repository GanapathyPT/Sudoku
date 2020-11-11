import React from 'react';

import { Snackbar } from "@material-ui/core";

import Alert from "@material-ui/lab/Alert";

export default function ErrorAlert(props) {

	const {
		alertMessage,
		setAlertMessage,
	} = props;

	// closing the alert message 
	const handleClose = (e,reason) => {
		if (reason === "clickaway")
			return;
		setAlertMessage(false);
	}

	return (
		<Snackbar 
			open={alertMessage} 
			autoHideDuration={2000} 
			onClose={handleClose}
		>
			<Alert 
				elevation={6} 
				variant="filled" 
				onClose={handleClose} 
				severity="error" 
			>
				Wrong Answer
			</Alert>
		</Snackbar>
	)
}