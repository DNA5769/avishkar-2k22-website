import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthService from '../../services/AuthService';
import Logo from '../../Assets/logo.png';
import bgImage from '../../Assets/collage.jpg';
import Cookies from 'js-cookie';
import Spinner from '../Common/Spinner';
const ResetPassword = () => {
  const key = useParams().token;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (Cookies.get('token')) navigate('/profile');
  }, []);
  function PasswordReset(e: any) {
    e.preventDefault();
    setIsLoading(true);
    const password = PasswordRef.current.value;
    const confirmpassword = ConfirmPasswordRef.current.value;
    if (confirmpassword != password) {
      toast.error('Confirm password does not match the password');
      setIsLoading(false);
      return;
    }
    let token;
    if (key === undefined) {
      //console.log('key===undefined');
      setIsLoading(false);
      return;
    } else token = key;
    AuthService.resetPassword(password, token)
      .then((data) => {
        setIsLoading(false);
        if (data['success']) {
          toast.success('Password changed successfully!');
          navigate('/');
        } else if (data['message'] === 'Invalid token!') {
          toast.error(
            'invalid or expired token! please generate new token by clicking forgot password again'
          );
        } else toast.error(data['message']);
      })
      .catch(() => {
        setIsLoading(false);
        toast.error('Please try again later!');
      });
  }
  const PasswordRef = useRef(document.createElement('input'));
  const ConfirmPasswordRef = useRef(document.createElement('input'));

  return (
    <div
      className="flex items-center justify-center w-full h-screen"
      style={{ background: `url(${bgImage})` }}>
      <div className="flex flex-col items-center justify-center w-full px-6 py-8 lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-4xl font-semibold text-gray-900 dark:text-white">
          <img className="w-16 h-16 mr-2" src={Logo} alt="logo" />
          Avishkar
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 capitalize md:text-2xl dark:text-white">
              Reset Password
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={PasswordReset} method="POST">
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  ref={PasswordRef}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required={true}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  ref={ConfirmPasswordRef}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required={true}
                />
              </div>

              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                {isLoading ? (
                  <Spinner displayTxt="Sending Password Reset Mail" />
                ) : (
                  'Send Password Reset Mail'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
