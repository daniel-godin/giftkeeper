import { useEffect, useState } from "react";


type DeviceType = 'mobile' | 'desktop'; // Possibly 'tablet' later.

export function useViewport() {
    const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

    useEffect(() => {
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [])

    function handleResize() {
        const width = window.innerWidth;

        if (width < 768) {
            setDeviceType('mobile');
        } else {
            setDeviceType('desktop');
        }
    }

    return deviceType;
}