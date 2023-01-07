// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';
import CrashEventProvider from './context/crashEvents';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <CrashEventProvider>
      <ThemeProvider>
        <ScrollToTop />
        <StyledChart />
        <Router />
      </ThemeProvider>
    </CrashEventProvider>
  );
}
