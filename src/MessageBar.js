/**
 *    Message bar module to manage user input of messages and files
 *    @author Lucas Bubner, 2023
 *    @author Lachlan Paul, 2023
 */

import { useState } from "react";
import { collection } from "firebase/firestore";
import FileUploads from "./FileUploads";
import { sendMsg, db } from "./Firebase";

function MessageBar() {
    const [formVal, setFormVal] = useState("");
    return (
        <form
            onSubmit={(e) => {
                sendMsg(e, collection(db, "messages"), formVal);
                setFormVal("");
            }}
        >
            {/* Standard user input box for text */}
            <div className="input-group input-group-sm mb-2">
                <div className="input-group-prepend">
                    <FileUploads
                        className="input-group-text"
                        id="inputGroup-sizing-sm"
                    />
                </div>
                <input
                    type="text"
                    className="form-control p-1 mb-2 bg-secondary text-white"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    onChange={(e) => setFormVal(e.target.value)}
                    value={formVal}
                />
            </div>

            {/* Submit button for messages, also prevents sending if there is no form value */}
            <button type="submit" disabled={formVal ? false : true}>
                {/* TODO: Add a send asset here instead of just text */}
                Send
            </button>
        </form>
    );
}

export default MessageBar;
