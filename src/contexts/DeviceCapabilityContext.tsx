import { createContext, useContext, type ReactNode } from "react";
import {
  useDeviceCapability,
  type DeviceTier,
} from "@/hooks/useDeviceCapability";

const DeviceCapabilityContext = createContext<DeviceTier>("medium");

export function DeviceCapabilityProvider({
  children,
}: {
  children: ReactNode;
}) {
  const tier = useDeviceCapability();
  return (
    <DeviceCapabilityContext.Provider value={tier}>
      {children}
    </DeviceCapabilityContext.Provider>
  );
}

export function useDeviceTier(): DeviceTier {
  return useContext(DeviceCapabilityContext);
}
