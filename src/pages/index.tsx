import { useState, useEffect } from 'react';

import axios from 'axios';

import { Container,  AlphabetContainer, ButtonPlayAgain } from '../styles/styles'

import Head from 'next/head'
import Draw from '../components/Draw';
import Letter from '../components/Letter';

interface IGame {
  id: number,
  theme: string,
}

const Home : React.FC = () => {
  const BASE_URL = 'http://localhost:4000/api';
  const ALPHABET = ['A','B','C','D','E','F','G','H', 'I','J','K','L','M','N','O','P','Q','R','S','T','U','V','X','Y','Z'];
  
  const [life, setLife] = useState(6);
  const [wrongLetters, setWrongLetters] = useState<String[]>([]);
  const [game, setGame] = useState<IGame>();
  const [isWinner, setIsWinner] = useState(false);
  const [isResetedGame, setIsResetedGame] = useState(false);
  const [lettersIsDisabled, setLettersIsDisabled] = useState(Array(ALPHABET.length).fill(false));
  

  const verifyWord = async (letter: string) => {

    const {data} = await axios.post(`${BASE_URL}/checkletter`,{
      id: game!.id,
      letter: letter
    })
    console.log(data)
    return data.indexesOfLetters.length > 0 ? data.indexesOfLetters : false
  }

  const confirmLetter = async (letter: string, index: number) => {
    const resultVerifyWord = await verifyWord(letter)
    console.log(resultVerifyWord)
    if (!resultVerifyWord) {
      setLife(life - 1)
    } else {
      let holdLetter = wrongLetters;
      resultVerifyWord.forEach((indexOfLetter:number) => {
        holdLetter[indexOfLetter] = letter
      })
      setWrongLetters([...holdLetter]);
    }
    const arrayIsDisabledLetters = lettersIsDisabled;
    arrayIsDisabledLetters[index] = true;
    setLettersIsDisabled([...arrayIsDisabledLetters])

    setIsWinner(verifyIsWinner())
    console.log('brunos2')
  }

  const resetGame = async () => {
    setIsResetedGame(true)
    const {data} = await axios.get(`${BASE_URL}/game-start`)
    setGame(data)
    setWrongLetters([...Array(data.quantityLetters).fill('_ ')])
    setLife(6);
    setIsWinner(false)
    setLettersIsDisabled(Array(ALPHABET.length).fill(false))
    setTimeout(()=> {
      setIsResetedGame(false)
    },0)
  }

  const verifyIsWinner = () => {
    return !wrongLetters.includes('_ ')
  }

  useEffect( () => {
    (async () => {
      const {data} = await axios.get(`${BASE_URL}/game-start`)
      setGame(data)
      const { quantityLetters } = data
      setWrongLetters([...Array(quantityLetters).fill('_ ')])
      console.log(data)
    })()

  }, [])

  return (
    <Container>
      <Head>
        <title>Hangman Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Jogo da Forca</h1>
      <div>
        <h2>Tema: <strong>{game?.theme}</strong></h2>
        <h2>Vidas restantes: <strong>{life}</strong></h2>
      </div>
      <Draw life={life} isResetedGame={isResetedGame}/>
      {isWinner? (<>
          <h3>Parabains! Você ganhou 👏👏👏!</h3>
          <ButtonPlayAgain onClick={() => resetGame()}>Joga Novamente</ButtonPlayAgain>
        </>) : life < 1 ?
        (<>
          <h3>Game Over ☠️☠️☠️</h3>
          <ButtonPlayAgain onClick={() => resetGame()}>Joga Novamente</ButtonPlayAgain>
        </>) :
       (
      <>
        <p>{wrongLetters}</p>
        <AlphabetContainer>
          {ALPHABET.map((letter, index) => (
            <Letter
            key={index}
            value={letter}
            disabled={lettersIsDisabled[index]}
            onClick={() => confirmLetter(letter, index)}/>
          ))}
        </AlphabetContainer>

      </>)
      }
    </Container>
  )
}


export default Home;