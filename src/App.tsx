/**
 *    Primary application configuration to manage all operations of the application.
 *    Manages Firebase integrations, and provides operation to the app.
 *    @author Lucas Bubner, 2023
 */

import "./App.css";

// Firebase imports and configuration
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, useAuthStateChanged, db } from "./Firebase";
import { onValue, ref } from "firebase/database";

// Import application login and chatroom modules
import Chat from "./Chat";
import Login from "./Login";

function App() {
    const [user] = useAuthState(auth);
    useAuthStateChanged();

    // April Fool's joke alert upon application load
    useEffect(() => {
        const time = new Date(Date.now());
        if (time.getMonth() + 1 === 4 && time.getDate() === 1 && user) {
            alert(
                "WARNING: This chatapp has been noted by authorities as being in use by major War Criminals, proceed with extreme caution and report any suspicious actvity to // TODO: Contact Info"
            );
        }
    }, [user]);

    // Check user connectivity to the application
    const [online, setOnline] = useState<boolean>(false);
    const [longConnect, setlongConnect] = useState<boolean>(false);
    useEffect(() => {
        const unsubscribe = onValue(ref(db, ".info/connected"), (snapshot) => {
            setOnline(snapshot.val());
            setlongConnect(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!online) {
            document.title = "Establishing connection...";
            setTimeout(() => {
                setlongConnect(true);
            }, 5000);
        } else {
            document.title = "Bunyips Chatapp";
        }
    }, [online]);

    return online ? (
        <div className="App">{user ? <Chat /> : <Login />}</div>
    ) : (
        <>
            <div className="offline">
                <h1>Bunyips Chatapp</h1>
                <p className="conn">Connecting</p>
            </div>
            {longConnect && (
                <p className="disc">
                    This seems to be taking a while. <br /> Check your internet connection, and if this persists, please
                    contact lbubner21@mbhs.sa.edu.au.
                </p>
            )}
        </>
    );
}

export default App;
