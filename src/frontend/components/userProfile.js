function UserProfile({ user }) {
  console.log("sajkndbiauhsdoi")

  const savedRecipesCount = user.savedRecipes.length
  const createdRecipesCount = user.createdRecipes.length
  
  return (
      <div className="userInfoContainer">
        <div>
          <img></img>
          <div>
            <h2>{user.username}</h2>
            <p>{user.bio}</p>
          </div>
        </div>

        <div className="stats">
          <div>
            <div>{savedRecipesCount}</div>
            <div>Saved Recipes</div>
          </div>

          <div>
            <div>{createdRecipesCount}</div>
            <div>Created Recipes</div>
          </div>
        </div>
      </div>
  );
}
