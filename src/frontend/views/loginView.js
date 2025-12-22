const { useState, useEffect } = React;

function LoginView(props) {
  const { setUserId, view, setView, imageSrc } = props
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailAvailable, setEmailAvailable] = useState(null);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);

  useEffect(() => {
    if (!validateEmail(email) || view !== "signup") return;
    setCheckingEmail(true);
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch("/api/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        setEmailAvailable(data.available);
      } catch (error) {
        console.error("Error checking email:", error);
      } finally {
        setCheckingEmail(false);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [email, view]);

  useEffect(() => {
    if (!validateUsername(username) || view !== "signup") return;
    setCheckingUsername(true);
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch("/api/check-username", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username }),
        });
        const data = await response.json();
        setUsernameAvailable(data.available);
      } catch (error) {
        console.error("Error checking username:", error);
      } finally {
        setCheckingUsername(false);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [username, view]);

  const isEmailFormatValid = validateEmail(email);
  const isEmailValid = isEmailFormatValid && (view !== "signup" || emailAvailable !== false);

  let emailErrorMessage = "Must be a valid email address";
  if (view === "signup" && emailAvailable === false) {
    emailErrorMessage = "This email is already registered";
  } else if (view === "signup" && checkingEmail) {
    emailErrorMessage = "Checking availability...";
  }

  const isUsernameFormatValid = validateUsername(username);
  const isUsernameValid = isUsernameFormatValid && (view !== "signup" || usernameAvailable !== false);

  let usernameErrorMessage =
    "Username must have at least 8 characters, and no special characters";
  if (usernameAvailable === false) {
    usernameErrorMessage = "This username is already taken.";
  } else if (checkingUsername) {
    usernameErrorMessage = "Checking availability...";
  }

  let isSubmitDisabled =
    !validatePassword(password) ||
    !validateEmail(email) ||
    email.length === 0 ||
    password.length === 0;

  if (view === "signup") {
    isSubmitDisabled =
      isSubmitDisabled ||
      password !== confirmPassword ||
      !isUsernameValid ||
      !isEmailValid ||
      username.length === 0 ||
      confirmPassword.length === 0 ||
      checkingEmail ||
      checkingUsername;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const endpoint = view === "login" ? "/api/login" : "/api/signup";
      const body = view === "login"
        ? { email, password }
        : { email, username: username, password };

      const response = await fetch(`http://localhost:80${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      const userId = data.user.id;

      if (response.ok) {
        alert(data.message);
        setUserId(userId)
        setView("home");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error submitting:", error);
      alert("An error occurred");
    }
  };

  return (
    <div className="loginViewContainer">
      <form className="loginForm" onSubmit={handleSubmit}>
        <h1>
          <span className="material-symbols-outlined">chef_hat</span>MyCookBook
        </h1>

        <div>
          <h2>{view === "login" ? "Login" : "SignUp"}</h2>

          <CustomInput
            label="Email"
            type="email"
            value={email}
            isValid={isEmailValid}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            errorMessage={emailErrorMessage}
          ></CustomInput>

          {view === "signup" && (
            <CustomInput
              label="Username"
              type="text"
              value={username}
              isValid={isUsernameValid}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              errorMessage={usernameErrorMessage}
            ></CustomInput>
          )}

          <CustomInput
            label="Password"
            type="password"
            value={password}
            isValid={validatePassword(password)}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            errorMessage="Password must have at least 8 characters, one number and one special character"
          ></CustomInput>

          {view === "signup" && (
            <CustomInput
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              isValid={
                password === confirmPassword && confirmPassword.length > 0
              }
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              errorMessage="Passwords do not match"
            ></CustomInput>
          )}

          <button
            type="submit"
            disabled={isSubmitDisabled}
          >
            {view === "login" ? "Login" : "Sign Up"}
          </button>

          {view === "login" && <a>Can't remember your password?</a>}
          {view === "login" && (
            <a
              onClick={() => {
                setView("signup");
                setEmail("");
                setPassword("");
                setUsername("");
                setConfirmPassword("");
              }}
            >
              Don't have an account yet? SignUp!
            </a>
          )}
          {view === "signup" && (
            <a
              onClick={() => {
                setView("login");
                setEmail("");
                setPassword("");
                setUsername("");
                setConfirmPassword("");
              }}
            >
              Already have an account? Login!
            </a>
          )}
        </div>
      </form>

      <div className="imageContainer">
        <img src={imageSrc}></img>
      </div>
    </div>
  );
}

function validateEmail(email) {
  const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return regex.test(email);
}

function validatePassword(password) {
  const regex = /^(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  return regex.test(password);
}

function validateUsername(username) {
  const regex = /^[a-zA-Z0-9_]{8,}$/;
  return regex.test(username);
}
