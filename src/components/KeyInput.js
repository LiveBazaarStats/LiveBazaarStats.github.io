import React from "react";
import styles from './KeyInput.module.css';

function KeyInput(){
    

    return (
        <div>
            <input type="text" id="ApiKey" className={styles.KeyInput}/>
        </div>
    );
}

export default KeyInput;