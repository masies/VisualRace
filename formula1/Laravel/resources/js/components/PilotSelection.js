import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

class PilotSelection extends React.Component {
	constructor(props) {
    	super(props)
    }

	render() {
	return (
		<FormGroup row>
			<Grid container spacing={1}  direction="column" >
	  	  { 
            Object.entries(this.props.drivers).map( (driver) =>
            	<Grid container key={driver[0]} direction="column" align="center" style={{marginBottom:"7px"}}>
                  <Button className="PilotButton" id={driver[0]} onClick={() => this.props.handler(driver[0])}  fullWidth variant={driver[1].buttonVariant} color="primary">
                    {driver[0]}
                  </Button>
              	</Grid>
            ) 
          }
          </Grid> 
		</FormGroup>
	)}
}

export default PilotSelection;