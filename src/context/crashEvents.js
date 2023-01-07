import {createContext, useContext, useEffect, useState} from "react"

const CrashEventContext = createContext(null)

// eslint-disable-next-line react/prop-types
const CrashEventProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [crashEvents, setCrashEvents] = useState([]);
    const [crashEvent, setCrashEvent] = useState(null);
    const [error, setError] = useState(null);
    const [driverDetails, setDriverDetails] = useState([]);
    const [vehicleDetails, setVehicleDetails] = useState([]);

    useEffect(()=>{
        getCrashEvents();
        getVehicleDetails();
        getDriverDetails();
    }, []);

    const getCrashEvents = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("https://uf-project-demo.herokuapp.com/crash-events");
            const data = await response.json();
            setCrashEvents(data);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }

    const getVehicleDetails = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("https://uf-project-demo.herokuapp.com/vehicle-details");
            const data = await response.json();
            setVehicleDetails(data);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }

    const getDriverDetails = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("https://uf-project-demo.herokuapp.com/driver-details");
            const data = await response.json();
            setDriverDetails(data);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }

    const getCrashEvent = async (id) => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://uf-project-demo.herokuapp.com/crash-events/${id}`);
            const data = await response.json();
            setCrashEvent(data);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <CrashEventContext.Provider value={{
            isLoading,
            crashEvents,
            crashEvent,
            error,
            getCrashEvents,
            getCrashEvent,
            getDriverDetails,
            getVehicleDetails,
            driverDetails,
            vehicleDetails
        }}>
            {children}
        </CrashEventContext.Provider>
    )
}

export const useCrashEvent = () => {
    const context = useContext(CrashEventContext);
    if (!context) {
        throw new Error("useCrashEvent must be used within a CrashEventProvider");
    }
    return context;
}

export default CrashEventProvider;
