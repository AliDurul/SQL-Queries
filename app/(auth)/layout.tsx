import { ReactNode } from "react";


const AuthLayout = async ({ children }: { children: ReactNode }) => {

  return <div className="auth-layout">{children}</div>;
};

export default AuthLayout;
