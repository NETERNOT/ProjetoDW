const { useState } = React;

function LoginView(props) {
  const {
    view,
    setView,
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
            isValid={validateEmail(email)}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            errorMessage="Must be a valid email address"
          ></CustomInput>

          {view === "signup" && (
            <CustomInput
              label="Username"
              type="text"
              value={username}
              isValid={validateUsername(username)}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              errorMessage="This username is not available"
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
            errorMessage="Must be a valid email address"
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
            disabled={
              !validatePassword(password) ||
              !validateEmail(email) ||
              email.length === 0 ||
              password.length === 0
            }
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

function validatePassword(password) {
  const regex = /^(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  return regex.test(password);
}

function validateUsername(username) {
  //check db for existing usernames
  return 0;
}
