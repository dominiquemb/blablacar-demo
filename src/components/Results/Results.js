import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import moment from 'moment';

function Results({ showSuccess, showError }) {
  const [nextCursor, setNextCursor] = React.useState();
  const [trips, setTrips] = React.useState([]);
  const [lastPage, setLastPage] = React.useState(false);

  const process = async() => {
    if (!lastPage) {
      fetch(`https://public-api.blablacar.com/api/v3/trips?key=YzbiA8L6DcqxTvSna1lOFQQU66FosDVs&from_coordinate=48.8566%2C2.3522&to_coordinate=45.764043%2C4.835659&from_country=FR&to_country=FR&locale=en-GB&start_date_local=2022-01-31T20:00:00&currency=EUR&count=1${nextCursor ? nextCursor : ''}`, {method: 'GET', mode: 'cors'})
      .then(response => response.json())
      .then(data => {
        if (data) {
          if (data.next_cursor) {
            setNextCursor(`&from_cursor=${data.next_cursor}`);
          } else if (!data.next_cursor && nextCursor) {
            setLastPage(true);
          }
          setTrips(trips.concat(data.trips));
        }
      }).catch(e => {
        showError(e);
      });
    }
  }

  React.useEffect(() => {
    process();
  }, []);

  return (
      <Container sx={{ marginTop: '40px', marginBottom: '40px' }} maxWidth="xl">
        <div id="results" data-testid="results">
          {trips && trips.map((item, key) => (
          <Grid id={`result-${key}`} data-testid={`result-${key}`} class="result" key={key} container spacing={2} style={{marginBottom: '20px'}}>
            <Grid item lg={12} xs={12}>
              <Box>
                <Grid container spacing={2}>
                  <Grid item lg={6} xs={12}>
                    <div>
                      <div>
                        {item.waypoints[0].place.city}
                      </div>
                      <div>
                        {moment(item.waypoints[0].date_time).format('ddd, MMM Do - HH:mm')}
                      </div>
                    </div>
                    <div>
                      <div>
                        {item.waypoints[1].place.city}
                      </div>
                      <div>
                        {moment(item.waypoints[1].date_time).format('ddd, MMM Do - HH:mm')}
                      </div>
                    </div>
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <div>
                      <div>
                        {item.price.amount}
                      </div>
                      <div>
                        <a href={item.link} target="_blank" rel="noop noreferrer"><Button>Book This Trip</Button></a>
                      </div>
                    </div>
                  </Grid>
                  <Grid item lg={12} xs={12}>
                    {item.vehicle && item.vehicle.make} {item.vehicle && item.vehicle.model}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
          ))}
        </div>
        {!lastPage && <Button data-testid="load-more-results" id="load-more-results" onClick={process}>Load More Results</Button>}
      </Container>
  );
}

export default Results;
