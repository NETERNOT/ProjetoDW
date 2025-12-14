const { useState, useEffect } = React;

import WindowControls from "./components/windowControls"

function App() {

    return (
        <div>
            <WindowControls/>
        </div>
    );
}

// Render the App
const root = ReactDOM.createRoot(document.getElementById('react-root'));
root.render(<App />);