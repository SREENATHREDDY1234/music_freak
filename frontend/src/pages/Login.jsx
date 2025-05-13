import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	EnvelopeIcon,
	LockClosedIcon,
	UserIcon,
	ArrowRightIcon,
	EyeIcon,
	EyeSlashIcon,
} from "@heroicons/react/24/outline";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signInWithPopup,
	GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { ref, set } from "firebase/database"; // For Realtime Database OR for Firestore:
import { doc, setDoc } from "firebase/firestore";

const LoginPage = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Clear error when user types
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Please enter a valid email";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		if (!isLogin) {
			if (!formData.name) {
				newErrors.name = "Name is required";
			}

			if (!formData.confirmPassword) {
				newErrors.confirmPassword = "Please confirm your password";
			} else if (formData.password !== formData.confirmPassword) {
				newErrors.confirmPassword = "Passwords do not match";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    // setAuthError(null);

    try {
      if (isLogin) {
        // Email login
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        navigate("/dashboard");
      } else {
        // Email signup
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        console.log(userCredential);
        // Save additional user data to Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: formData.name,
          email: formData.email,
          createdAt: new Date().toISOString()
        });
        
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      // setAuthError(getFirebaseErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const getFirebaseErrorMessage = (code) => {
		switch (code) {
			case "auth/network-request-failed":
				return "Network error. Please check your internet connection.";
			case "auth/email-already-in-use":
				return "Email already in use.";
			case "auth/invalid-email":
				return "Invalid email address.";
			case "auth/weak-password":
				return "Password should be at least 6 characters.";
			case "auth/user-not-found":
				return "No account found with this email.";
			case "auth/wrong-password":
				return "Incorrect password.";
			case "auth/popup-closed-by-user":
				return "Sign in popup was closed.";
			default:
				return "Authentication failed. Please try again.";
		}
  };

	const handleGoogleLogin = async () => {
		navigate("/dashboard");
	};

	return (
		<div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<div className="flex justify-center">
					{/* <img className="h-16 w-auto" src={logo} alt="ConcertWave" /> */}
				</div>
				<h2 className="mt-6 text-center text-3xl font-extrabold">
					{isLogin
						? "Sign in to your account"
						: "Create a new account"}
				</h2>
				<p className="mt-2 text-center text-sm text-gray-400">
					{isLogin
						? "Don't have an account? "
						: "Already have an account? "}
					<button
						onClick={() => setIsLogin(!isLogin)}
						className="font-medium text-indigo-400 hover:text-indigo-300 transition"
					>
						{isLogin ? "Sign up" : "Sign in"}
					</button>
				</p>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
					{errors.form && (
						<div className="mb-4 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
							{errors.form}
						</div>
					)}

					<form className="space-y-6" onSubmit={handleSubmit}>
						{!isLogin && (
							<div>
								<label
									htmlFor="name"
									className="block text-sm font-medium text-gray-300"
								>
									Full Name
								</label>
								<div className="mt-1 relative rounded-md shadow-sm">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<UserIcon className="h-5 w-5 text-gray-400" />
									</div>
									<input
										id="name"
										name="name"
										type="text"
										autoComplete="name"
										value={formData.name}
										onChange={handleChange}
										className={`bg-gray-700 border ${
											errors.name
												? "border-red-500"
												: "border-gray-600"
										} focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 rounded-md text-gray-200 placeholder-gray-400`}
										placeholder="John Doe"
									/>
								</div>
								{errors.name && (
									<p className="mt-1 text-sm text-red-400">
										{errors.name}
									</p>
								)}
							</div>
						)}

						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-300"
							>
								Email address
							</label>
							<div className="mt-1 relative rounded-md shadow-sm">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<EnvelopeIcon className="h-5 w-5 text-gray-400" />
								</div>
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									value={formData.email}
									onChange={handleChange}
									className={`bg-gray-700 border ${
										errors.email
											? "border-red-500"
											: "border-gray-600"
									} focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 rounded-md text-gray-200 placeholder-gray-400`}
									placeholder="you@example.com"
								/>
							</div>
							{errors.email && (
								<p className="mt-1 text-sm text-red-400">
									{errors.email}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-300"
							>
								Password
							</label>
							<div className="mt-1 relative rounded-md shadow-sm">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<LockClosedIcon className="h-5 w-5 text-gray-400" />
								</div>
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									autoComplete={
										isLogin
											? "current-password"
											: "new-password"
									}
									value={formData.password}
									onChange={handleChange}
									className={`bg-gray-700 border ${
										errors.password
											? "border-red-500"
											: "border-gray-600"
									} focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-10 py-2 rounded-md text-gray-200 placeholder-gray-400`}
									placeholder={
										isLogin
											? "Enter your password"
											: "Create a password"
									}
								/>
								<div className="absolute inset-y-0 right-0 pr-3 flex items-center">
									<button
										type="button"
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className="text-gray-400 hover:text-gray-300"
									>
										{showPassword ? (
											<EyeSlashIcon className="h-5 w-5" />
										) : (
											<EyeIcon className="h-5 w-5" />
										)}
									</button>
								</div>
							</div>
							{errors.password && (
								<p className="mt-1 text-sm text-red-400">
									{errors.password}
								</p>
							)}
						</div>

						{!isLogin && (
							<div>
								<label
									htmlFor="confirmPassword"
									className="block text-sm font-medium text-gray-300"
								>
									Confirm Password
								</label>
								<div className="mt-1 relative rounded-md shadow-sm">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<LockClosedIcon className="h-5 w-5 text-gray-400" />
									</div>
									<input
										id="confirmPassword"
										name="confirmPassword"
										type={
											showPassword ? "text" : "password"
										}
										autoComplete="new-password"
										value={formData.confirmPassword}
										onChange={handleChange}
										className={`bg-gray-700 border ${
											errors.confirmPassword
												? "border-red-500"
												: "border-gray-600"
										} focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 rounded-md text-gray-200 placeholder-gray-400`}
										placeholder="Confirm your password"
									/>
								</div>
								{errors.confirmPassword && (
									<p className="mt-1 text-sm text-red-400">
										{errors.confirmPassword}
									</p>
								)}
							</div>
						)}

						{isLogin && (
							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<input
										id="remember-me"
										name="remember-me"
										type="checkbox"
										className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
									/>
									<label
										htmlFor="remember-me"
										className="ml-2 block text-sm text-gray-300"
									>
										Remember me
									</label>
								</div>

								<div className="text-sm">
									<a
										href="#"
										className="font-medium text-indigo-400 hover:text-indigo-300"
									>
										Forgot your password?
									</a>
								</div>
							</div>
						)}

						<div>
							<button
								type="submit"
								disabled={loading}
								className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ${
									loading
										? "opacity-75 cursor-not-allowed"
										: ""
								}`}
							>
								<span className="absolute left-0 inset-y-0 flex items-center pl-3">
									<ArrowRightIcon
										className={`h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition ${
											loading ? "animate-pulse" : ""
										}`}
									/>
								</span>
								{loading
									? "Processing..."
									: isLogin
									? "Sign in"
									: "Sign up"}
							</button>
						</div>
					</form>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-600" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-gray-800 text-gray-400">
									Or continue with
								</span>
							</div>
						</div>

						<div className="mt-6 grid grid-cols-1 gap-3">
							<button
								onClick={handleGoogleLogin}
								type="button"
								className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
							>
								<svg
									className="w-5 h-5 mr-2"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.784-1.664-4.153-2.675-6.735-2.675-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.524 10-10 0-0.67-0.069-1.325-0.201-1.955h-9.799z" />
								</svg>
								Sign in with Google
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
