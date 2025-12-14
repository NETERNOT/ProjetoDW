const { useState, useEffect } = React;

function App() {

    const demoUser = {
        username:"Username",
        bio:"I love cock",
        savedRecipes:[{},{},{},{},{}],
        createdRecipes:[{},{},{},{},{}]
    }

    return (
        <>
            <div className="windowControl">MyCookBook</div>
            <UserProfile user={demoUser}></UserProfile>
        </>
    );
}

// Render the App
const root = ReactDOM.createRoot(document.getElementById('react-root'));
root.render(<App />);