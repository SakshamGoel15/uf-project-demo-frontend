import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import { useMemo } from 'react';
// sections
import {
  AppAccidentTimeline,
  AppStats,
  AppWidgetSummary,
  AppCurrentSubject,
  AppRates,
} from '../sections/@dashboard/app';
import MyMapComponent from './Map';
import { useCrashEvent } from '../context/crashEvents';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const { crashEvents, driverDetails, vehicleDetails } = useCrashEvent();

  const injuryTypes = useMemo(() => {
    if (crashEvents?.length === 0) return [];
    const res = {};
    crashEvents.forEach((crashEvent) => {
      const { CRASH_SEVERITY } = crashEvent;
      if (!res[CRASH_SEVERITY]) {
        res[CRASH_SEVERITY] = 0;
      }
      res[CRASH_SEVERITY] += 1;
    });
    return res;
  }, [crashEvents]);

  const investigatingAgency = useMemo(() => {
    if (crashEvents?.length === 0) return [];
    const res = {};
    crashEvents.forEach((crashEvent) => {
      const { INVESTIGATING_AGENCY } = crashEvent;
      if (!res[INVESTIGATING_AGENCY]) {
        res[INVESTIGATING_AGENCY] = 0;
      }
      res[INVESTIGATING_AGENCY] += 1;
    });
    return res;
  }, [crashEvents]);

  const formattedVehicleDetails = useMemo(() => {
    if (vehicleDetails?.length === 0) return [];
    const res = {};
    vehicleDetails.forEach((crashEvent) => {
      const { MAKE } = crashEvent;
      if (!res[MAKE]) {
        res[MAKE] = 0;
      }
      res[MAKE] += 1;
    });
    return res;
  }, [vehicleDetails]);

  const turnDetails = useMemo(() => {
    if (vehicleDetails?.length === 0) return [];

    const res = {};
    vehicleDetails.forEach((crashEvent) => {
      const { MANEUVER } = crashEvent;
      if (!res[MANEUVER]) {
        res[MANEUVER] = 0;
      }
      res[MANEUVER] += 1;
    });
    return res;
  }, [vehicleDetails]);

  const driverDetailsFormatted = useMemo(() => {
    if (driverDetails?.length === 0)
      return { 'Lap Belt Only': { None: {}, Injury: {}, 'Serious Injury': {}, Fatal: {} } };
    const res = {};
    const final = {};
    final['Under 20'] = [];
    final['20 to 60'] = [];
    final['Over 60'] = [];
    driverDetails.forEach((driverDetail) => {
      const { RESTRAINT_SYSTEMS, INJURY_SEVERITY } = driverDetail;
      if (!res[RESTRAINT_SYSTEMS]) {
        res[RESTRAINT_SYSTEMS] = {};
        res[RESTRAINT_SYSTEMS].None = 0;
        res[RESTRAINT_SYSTEMS].Injury = 0;
        res[RESTRAINT_SYSTEMS]['Serious Injury'] = 0;
        res[RESTRAINT_SYSTEMS].Fatal = 0;
      }
      res[RESTRAINT_SYSTEMS][INJURY_SEVERITY] += 1;
    });
    return res;
  }, [driverDetails]);

  const ageDetails = useMemo(() => {
    if (driverDetails?.length === 0) return [];
    const final = {};
    final['Under 20'] = 0;
    final['20 to 60'] = 0;
    final['Over 60'] = 0;
    driverDetails.forEach((driverDetail) => {
      const { AGE } = driverDetail;
      if (AGE < 20) {
        final['Under 20'] += 1;
      } else if (AGE > 60) {
        final['Over 60'] += 1;
      } else {
        final['20 to 60'] += 1;
      }
    });
    return final;
  }, [driverDetails]);

  return (
    <>
      <Helmet>
        <title> Crash Events Analysis </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 5 }}>
          <center>Crash Events Analysis</center>
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <MyMapComponent />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary
              title="Total number of Crash events"
              total={crashEvents?.length || 0}
              icon={'ant-design:car-filled'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary
              title="Number of Male Victims"
              total={driverDetails.filter((d) => d.SEX === 'M').length}
              icon={'ant-design:man-outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary
              title="Number of Female Victims"
              total={driverDetails.filter((d) => d.SEX === 'F').length}
              icon={'ant-design:woman-outlined'}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppStats
              title="Crash Severity"
              chartData={Object.keys(injuryTypes).map((key) => ({ label: key, value: injuryTypes[key] }))}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppStats
              title="Investigating Agency"
              chartData={Object.keys(investigatingAgency).map((key) => ({
                label: key,
                value: investigatingAgency[key],
              }))}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppRates
              title="Vehicle Make"
              chartData={Object.keys(formattedVehicleDetails).map((key) => ({
                label: key,
                value: formattedVehicleDetails[key],
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppCurrentSubject
              title="Restraint Systems vs Injury Severity"
              chartLabels={
                driverDetailsFormatted &&
                driverDetailsFormatted['Lap Belt Only'] &&
                Object.keys(driverDetailsFormatted['Lap Belt Only'])
              }
              chartData={Object.keys(driverDetailsFormatted).map((key) => ({
                name: key,
                data: Object.values(driverDetailsFormatted[key]),
              }))}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppStats
              title="Manuever Analysis"
              chartData={Object.keys(turnDetails).map((key) => ({ label: key, value: turnDetails[key] }))}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppStats
              title="Age Analysis"
              chartData={Object.keys(ageDetails).map((key) => ({ label: key, value: ageDetails[key] }))}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <AppAccidentTimeline
              title="Accident Timeline"
              list={crashEvents.map((crashEvent, index) => ({
                id: crashEvent.REPORT_NUMBER,
                title: `At ${crashEvent.ON_STREET} in ${crashEvent.CITY} of ${crashEvent.COUNTY} county - ${crashEvent.CRASH_SEVERITY}`,
                type: `order${index + 1}`,
                time: new Date(`${crashEvent.CRASH_DATE} ${crashEvent.CRASH_TIME}`),
              }))}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
