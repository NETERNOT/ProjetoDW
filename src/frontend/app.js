const { useState, useEffect } = React;

function App() {

    const demoUser = {
        username:"Username",
        bio:"I love cook",
        savedRecipes:[{},{},{},{},{}],
        createdRecipes:[{},{},{},{},{}]
    }

    return (
        <>
            <div className="windowControl">MyCookBook</div>
            <ProfileView user={demoUser}></ProfileView>
        </>
    );
}

// Render the App
const root = ReactDOM.createRoot(document.getElementById('react-root'));
root.render(<App />);