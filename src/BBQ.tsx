/**
 *    Hamburger menu part of the Navbar containing various options.
 *    @author Lachlan Paul, 2023
 */

import Popup from "reactjs-popup";
import Admin from "./Admin";
// I could go for a
import "./BBQ.css"; // bacon burger
import MDTable from "./MDTable";

function BBQ() {
    return (
        <Popup trigger={<svg className="bbqbtn" />} nested>
            <>
                {(close: any) => (
                    <>
                        <div className="outwin" onClick={close} />
                        <div className="inwin">
                            <div className="buttonarea">
                                <button onClick={() => alert("lol no")}>Enable Light Mode</button>
                            </div>
                            <hr />
                            <div className="buttonarea">
                                <Admin />
                            </div>
                            <hr />
                            <div className="buttonarea">
                                <MDTable />
                            </div>
                            <hr />
                        </div>
                    </>
                )}
            </>
        </Popup>
    );
}
// i dont like this formatting either ask lucas why he did it like this
export default BBQ;

/* 
    "I could go for a BBQ bacon burger,
    and a large order of fries,
    and an orange soda with no ice, and a piece of hot apple pie."

    Man, I miss Burger Tank!
 */
