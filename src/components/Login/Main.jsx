import { Input } from "@material-tailwind/react";
// import { Button } from "@material-tailwind/react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export const Login = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="w-72">
        <Input label="Username" />
      </div>
      <div className="w-72 mt-[2rem]">
        <Input type="password" label="Password" />
      </div>

      <div className="mt-[2rem]">
        <GoogleOAuthProvider clientId="495079544641-jn65a1nqfi1hqapemkssj583j878cuo9.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={(response) => {
              console.log("登入成功", response);
            }}
            onError={() => {
              console.log("登入失敗");
            }}
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};
