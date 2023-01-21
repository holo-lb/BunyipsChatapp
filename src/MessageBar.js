/**
 *    Message bar module to manage user input of messages and files
 *    @author Lucas Bubner, 2023
 *    @author Lachlan Paul, 2023
 */

import "./MessageBar.css";
import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import FileUploads from "./FileUploads";
import Scroll from "./Scroll";
import { sendMsg, db, auth, isMessageOverLimit } from "./Firebase";

function MessageBar() {
    const [formVal, setFormVal] = useState("");
    const [timestamp, setLastTimestamp] = useState(null);
    const [messagesSent, setMessagesSent] = useState(0);
    const [writePerms, setWritePerms] = useState(false);

    // Ensure the user has permission to write messages to the database.
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "write"), (doc) => {
            let allowWrite = false;
            doc.forEach((doc) => {
                if (auth.currentUser.email === doc.id) {
                    allowWrite = true;
                }
            });
            if (allowWrite) {
                setWritePerms(true);
            } else {
                setWritePerms(false);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    // Enforce cooldown on users that send too many messages at once.
    function manageMsgSend(e) {
        e.preventDefault();
        setMessagesSent(messagesSent + 1);
        setLastTimestamp(Date.now());

        if (Date.now() - timestamp < 3000 && messagesSent > 3) {
            alert("You're sending messages too fast! Please slow down.");
            return;
        }

        sendMsg(formVal);
        setFormVal("");
    }

    // Reset cooldown every 2 seconds on rerender
    useEffect(() => {
        setTimeout(() => {
            setMessagesSent(0);
        }, 2000);
    }, []);

    // Alert the user if their message has exceeded the 4000 character limit and update the formVal state.
    function handleMessageChange(e) {
        setFormVal(e.target.value);
        // prettier-ignore
        if (isMessageOverLimit(formVal))
            if (window.confirm("Caution! You have exceeded the 4000 character limit and will not be able to send your message! Trim message?"))
                setFormVal(formVal.substring(0, 4000));
    }

    return (
        <div className="messagebar">
            <form onSubmit={(e) => manageMsgSend(e)}>
                {/* Standard user input box for text */}
                <div className="input-group">
                    {writePerms ? (
                        <>
                            <FileUploads />
                            <input
                                type="text"
                                onChange={(e) => handleMessageChange(e)}
                                value={formVal}
                                className="msginput"
                            />
                            {/* Submit button for messages, also prevents sending if there is no form value */}
                            <button
                                type="submit"
                                disabled={formVal || isMessageOverLimit(formVal) ? false : true}
                                className="sendbutton"
                            />
                        </>
                    ) : (
                        <div className="msginput nomsg">
                            <p>
                                You do not have permission to send any messages. Please contact lbubner21@mbhs.sa.edu.au
                                to continue.
                            </p>
                        </div>
                    )}
                </div>
            </form>
            <Scroll />
        </div>
    );
}

export default MessageBar;
