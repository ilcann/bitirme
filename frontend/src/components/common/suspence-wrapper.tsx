import { Suspense } from "react";
import { LoadingScreen } from "./loading-screen";

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingScreen />}>
    {children}
  </Suspense>
);

export default SuspenseWrapper;