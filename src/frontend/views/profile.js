function ProfileView({ user }) {
  console.log(user);
  return (
    <div className="profileViewContainer">
      <UserProfileCard user={user}></UserProfileCard>

      <label>
        <img></img>
        <h2>
          <span className="material-symbols-outlined">bookmark_star</span> Saved Recipes
        </h2>
      </label>

      <div className="savedRecipesContainer">
        {user.savedRecipes.map((recipe, index) => {
          return <div className="mockRecipe" key={index}></div>;
        })}
      </div>
    </div>
  );
}
