import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "使用者名稱為必填項";
    if (!formData.email.trim()) {
      newErrors.email = "電子郵件為必填項";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "請輸入有效的電子郵件地址";
    }
    if (!formData.password) {
      newErrors.password = "密碼為必填項";
    } else if (formData.password.length < 8) {
      newErrors.password = "密碼必須至少為 8 個字符";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "密碼不匹配";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();


    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      console.log("register");
      const apiBaseUrl = 'https://dev-api.strawberrypie.tw';
      const response = await axios.post(`https://dev-api.strawberrypie.tw/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      // 註冊成功後直接登入
      localStorage.setItem('accessToken', response.data.accessToken);

      // 重定向到首頁
      window.location.href = '/';
    } catch (error) {
      console.error('註冊錯誤:', error);
      setErrors({
        submit: error.response?.data?.message || "註冊過程中發生錯誤，請稍後再試"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const apiBaseUrl = 'https://dev-api.strawberrypie.tw';
    // 儲存當前路徑，以便登入後重定向回來
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    window.location.href = `${apiBaseUrl}/auth/oauth?authclient=google`;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex w-full">
      <div className="mt-24 mb-8 lg:mt-32 text-white flex flex-col w-full gap-4 px-5 justify-center items-center">
        <style>
          {`
          /* 覆蓋自動填充時的背景色和文字顏色 */
          input:-webkit-autofill,
          input:-webkit-autofill:hover, 
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px #361014 inset !important;
            -webkit-text-fill-color: white !important;
            transition: background-color 5000s ease-in-out 0s;
          }
        `}
        </style>

        <h1 className="text-4xl font-bold" style={{ fontFamily: "B" }}>註冊</h1>

        {errors.submit && (
          <div className="bg-red-500 bg-opacity-25 px-4 py-2 rounded-lg text-white">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
          <div>
            <input
              type="text"
              name="username"
              placeholder="使用者名稱"
              className="w-full p-3 rounded-lg bg-[#361014] text-white focus:outline-none focus:ring-2 focus:ring-secondary-color"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="電子郵件"
              className="w-full p-3 rounded-lg bg-[#361014] text-white focus:outline-none focus:ring-2 focus:ring-secondary-color"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="密碼"
              className="w-full p-3 rounded-lg bg-[#361014] text-white focus:outline-none focus:ring-2 focus:ring-secondary-color"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-6 transform -translate-y-1/2 opacity-80 hover:opacity-100 focus:outline-none"
              onClick={togglePasswordVisibility}
            >
              {showPassword ?
                <img src="/Auth/visibility_off.svg" alt="eye-on" className="w-5 h-5" /> :
                <img src="/Auth/visibility_on.svg" alt="eye-off" className="w-5 h-5" />
              }
            </button>
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="確認密碼"
              className="w-full p-3 rounded-lg bg-[#361014] text-white focus:outline-none focus:ring-2 focus:ring-secondary-color"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute cursor-pointer right-3 top-6 transform -translate-y-1/2 opacity-80 hover:opacity-100 focus:outline-none"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ?
                <img src="/Auth/visibility_off.svg" alt="eye-on" className="w-5 h-5" /> :
                <img src="/Auth/visibility_on.svg" alt="eye-off" className="w-5 h-5" />
              }
            </button>
            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className="primary-button z-10 bg-primary-color text-white py-3 rounded-lg transition-all duration-300"
            disabled={loading}
          >
            {loading ? "處理中..." : "註冊"}
          </button>

          <div className="flex items-center gap-2 my-2">
            <hr className="flex-1 border-white opacity-20" />
            <span className="text-white opacity-60">或</span>
            <hr className="flex-1 border-white opacity-20" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 bg-white text-gray-800 py-3 rounded-lg transition-all duration-300 hover:bg-gray-100"
          >
            <img src="/Auth/Google-icon.svg" alt="Google" className="w-7 h-7" />
            <span>使用 Google 帳號註冊</span>
          </button>
        </form>

        <p className="mt-4 text-white opacity-80">
          已經有帳號？ <Link to="/login" className="text-secondary-color hover:underline">登入</Link>
        </p>
      </div>
    </div>
  );
};