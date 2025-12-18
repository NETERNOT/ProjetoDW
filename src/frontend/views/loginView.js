const { useState } = React;

function LoginView(props) {
  const {
    view,
    setView,
    users,
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    imageSrc,
  } = props;

  const isEmailFormatValid = validateEmail(email);
  const isEmailAvailable =
    view === "signup" && isEmailFormatValid
      ? validateEmailAvailability(email, users)
      : true;

  let emailErrorMessage = "Must be a valid email address";
  if (view === "signup" && !isEmailAvailable) {
    emailErrorMessage = "This email is already registered";
  }

  const isUsernameFormatValid = validateUsername(username);
  const isUsernameAvailable = isUsernameFormatValid
    ? validateUsernameAvailability(username, users)
    : true;

  let usernameErrorMessage =
    "Username must have at least 8 characters, and no special characters";
  if (!isUsernameAvailable) {
    usernameErrorMessage = "This username is already taken.";
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
    !isUsernameFormatValid ||
    !isUsernameAvailable ||
    !isEmailAvailable ||
    username.length === 0 ||
    confirmPassword.length === 0;
}


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
            isValid={isEmailFormatValid && isEmailAvailable}
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
              isValid={isUsernameFormatValid && isUsernameAvailable}
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
            Login
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
              Don't have an account yet? SignUp!
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

function handleSubmit(event) {
  event.preventDefault();
  //log everything into db
}

function validateEmail(email) {
  const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return regex.test(email);
}

function validateEmailAvailability(email, users) {
  return users.find((user) => user.email === email) ? false : true;
}

function validatePassword(password) {
  const regex = /^(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  return regex.test(password);
}

function validateUsername(username) {
  const regex = /^[a-zA-Z0-9_]{8,}$/;
  return regex.test(username);
}

function validateUsernameAvailability(username, users) {
  //check db for existing usernames
  return users.find((user) => user.userName === username) ? false : true;
}
