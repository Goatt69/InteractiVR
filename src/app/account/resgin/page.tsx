'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Định nghĩa các kiểu dữ liệu
interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const SignupForm: React.FC = () => {
  // State cho form data
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // State cho các lỗi
  const [errors, setErrors] = useState<FormErrors>({});
  
  // State cho trạng thái form
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  
  // State cho animation
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);

  // Hiệu ứng khi component được mount
  useEffect(() => {
    // Hiệu ứng slide-up khi form được tải
    setIsVisible(true);
    
    // Tạo hiệu ứng bong bóng nền
    createBubbles();
  }, []);

  // Hàm tạo bong bóng ngẫu nhiên cho nền
  const createBubbles = () => {
    const bubbleContainer = document.querySelector('.bubble-container');
    if (!bubbleContainer) return;
    
    // Clear existing bubbles
    bubbleContainer.innerHTML = '';
    
    for (let i = 0; i < 25; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      
      // Thiết lập các thuộc tính ngẫu nhiên
      const size = Math.random() * 80 + 20;
      const posX = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = Math.random() * 15 + 10;
      const opacity = Math.random() * 0.5 + 0.2;
      const blur = Math.random() * 3 + 1;
      
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${posX}%`;
      bubble.style.bottom = `-${size}px`;
      bubble.style.animationDelay = `${delay}s`;
      bubble.style.animationDuration = `${duration}s`;
      bubble.style.opacity = `${opacity}`;
      bubble.style.filter = `blur(${blur}px)`;
      
      bubbleContainer.appendChild(bubble);
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Xóa lỗi khi người dùng nhập
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  // Handle input focus
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setActiveInput(e.target.name);
  };

  // Handle input blur
  const handleBlur = () => {
    setActiveInput(null);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate họ tên
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên không được để trống';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Họ tên phải có ít nhất 3 ký tự';
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    } else if (!formData.email.endsWith('@gmail.com') && !formData.email.endsWith('@fpt.edu.vn')) {
      newErrors.email = 'Chỉ chấp nhận email @gmail.com hoặc @fpt.edu.vn';
    }
    
    // Validate mật khẩu
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ hoa';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải chứa ít nhất 1 số';
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt';
    }
    
    // Validate xác nhận mật khẩu
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const router = useRouter();

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Giả lập API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        
        // Redirect to login page after 1 second
        setTimeout(() => {
          router.push('/account/login');
        }, 1000);
      }, 1500);
    }
  };
  
  // Handle social sign up
  const handleSocialSignup = (provider: 'facebook' | 'google') => {
    signIn(provider, { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Container cho hiệu ứng bong bóng */}
      <div className="bubble-container absolute inset-0 overflow-hidden"></div>
      
      {/* Hiệu ứng ánh sáng nền */}
      <div className="absolute inset-0 bg-radial-gradient from-purple-400/20 via-transparent to-transparent"></div>
      
      {/* Form đăng ký */}
      <div className={`max-w-md w-full space-y-8 bg-white bg-opacity-95 backdrop-filter backdrop-blur-lg p-10 rounded-2xl shadow-2xl relative z-10 transform transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        {/* Hiệu ứng ánh sáng viền */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-lg"></div>
        
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full flex items-center justify-center shadow-lg mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500 inline-block mb-2">
            InteractiVR
          </h1>
          <h2 className="text-center text-xl font-semibold text-gray-700">
            Đăng Ký Tài Khoản
          </h2>
          <p className="mt-2 text-sm text-gray-500">Bắt đầu hành trình khám phá thế giới ảo</p>
        </div>
        
        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Họ tên */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className={`appearance-none relative block w-full px-4 py-3 border ${errors.fullName ? 'border-red-500' : activeInput === 'fullName' ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300'} placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm`}
                  placeholder="Nhập họ và tên"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.fullName}</p>
                )}
              </div>
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className={`appearance-none relative block w-full px-4 py-3 border ${errors.email ? 'border-red-500' : activeInput === 'email' ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300'} placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm`}
                  placeholder="Nhập địa chỉ email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.email}</p>
                )}
              </div>
            </div>
            
            {/* Mật khẩu */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className={`appearance-none relative block w-full px-4 py-3 border ${errors.password ? 'border-red-500' : activeInput === 'password' ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300'} placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm`}
                  placeholder="Nhập mật khẩu"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.password}</p>
                )}
              </div>
            </div>
            
            {/* Xác nhận mật khẩu */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className={`appearance-none relative block w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-500' : activeInput === 'confirmPassword' ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300'} placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm`}
                  placeholder="Nhập lại mật khẩu"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>

          <div>
              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-md font-medium rounded-xl text-white ${isSuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0`}
              >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : isSuccess ? (
                  <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-white group-hover:text-indigo-100 transition ease-in-out duration-150" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : isSuccess ? (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Đăng ký thành công!
                  </span>
                ) : (
                  'Đăng Ký'
                )}
            </button>
          </div>
          
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">Hoặc đăng ký bằng</span>
            </div>
          </div>
          
          {/* Social Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <button
              type="button"
              onClick={() => handleSocialSignup('facebook')}
              className="bg-blue-600 p-3 rounded-xl text-white hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
              <span className="ml-2 text-sm hidden sm:inline">Facebook</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialSignup('google')}
              className="bg-red-600 p-3 rounded-xl text-white hover:bg-red-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
              <span className="ml-2 text-sm hidden sm:inline">Google</span>
            </button>
          </div>
          
          {/* Login Link */}
          <div className="text-center text-sm">
            <p className="text-gray-600">
              Đã có tài khoản?{' '}
              <a 
                href="/account/login" 
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-300 hover:underline cursor-pointer relative z-50"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/account/login';
                }}
              >
                Đăng nhập ngay
              </a>
            </p>
          </div>
        </form>
      </div>
      
      {/* Hiệu ứng floating particles */}
      <div className="particles-container absolute inset-0 overflow-hidden pointer-events-none"></div>
    </div>
  );
};

export default SignupForm;
