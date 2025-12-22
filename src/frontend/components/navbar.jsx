function NavBar(props) {
  const { setView, setUserId } = props;

  return (
    <nav>
      <h1><span className="material-symbols-outlined">chef_hat</span> MyCookBook</h1>
      <div onClick={()=> setView("home")}>
        <span className="material-symbols-outlined">home</span>
        Home
      </div>
      <div onClick={()=> setView("profile")}>
        <span className="material-symbols-outlined">person</span>
        Profile
      </div>
      <div onClick={()=>{
        setUserId(null)
        setView("login")
      }}>
        <span className="material-symbols-outlined">logout</span>
        LogOut
      </div>
    </nav>
  );
}
