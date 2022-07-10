import React, {useState, useEffect, useRef} from "react"
import Card from "./Card"
import axios from "axios"

const card_API = "http://deckofcardsapi.com/api/deck"

function Deck(){
    const [deck, setDeck] = useState(null);
    const [autoDraw, setAutoDraw] = useState(false)
    const [drawn,setDrawn] = useState([])
    const timerRef = useRef(null);

    //perform API call and update the deck state with it.
    useEffect(() =>{
        async function getData(){
            let res = await axios.get(`${card_API}/new/shuffle/`);
            setDeck(res.data);
        }
        getData();
        },[setDeck]);


    useEffect(() =>{
        async function drawCard(){
            let {deck_id} = deck;

            try{
                let getCard = await axios.get(`${card_API}/${deck_id}/draw/`);

                if(getCard.data.remaining ===0){
                    setAutoDraw(false)
                    throw new Error("Error: no cards remaining!");
                }
                const card = getCard.data.cards[0];

                setDrawn(d =>[...d, {id:card.code,
                                    name: card.value + "of" + card.suit,
                                    image: card.image}]);
            } catch (err){
                alert (err);
            }
        }
        if(autoDraw && !timerRef.current){
            timerRef.current = setInterval(async () =>{
                await drawCard();
            }, 1000);
        }

        return () =>{
            clearInterval(timerRef.current);
            timerRef.current = null;
        };
    }, [autoDraw, setAutoDraw, deck]);

    const toggleAutoDraw = () =>{
        setAutoDraw(auto =>!auto);
    };

    const cards = drawn.map(c =>(
        <Card key = {c.id} name = {c.name} image={c.image}/>
    ));

    return (
        <div>
            {deck?(
                <button onClick={toggleAutoDraw}>
                    {autoDraw ? "Stop" : "Start"} Drawing
                </button>
            ): null}
            <div>{cards}</div>
        </div>
    );
};

export default Deck;
