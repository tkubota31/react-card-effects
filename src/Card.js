import React from "react"
import "./Card.css";

function Card({name,image}) {
    return(
    <div>
        <img className="Card"
            alt = {name}
            src = {image} />
    </div>
    )
}

export default Card
