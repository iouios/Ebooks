// page.tsx
import { Suspense } from "react";
import TokenStatus from "../../components/client/token";

export default function TokenStatusPage() {
  return (
    <Suspense fallback={null}>
      <TokenStatus />
    </Suspense>
  );
}
