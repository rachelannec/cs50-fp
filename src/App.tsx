import { useState, useCallback } from 'react'
// import logo from './assets/logo.png'
import './App.css'
import { useDropzone } from 'react-dropzone'
import { extractTextFromFile } from './service/fileProcessService'
import { generateFlashcards } from './service/geminiService'


interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

function App() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);

  // handle file drop
  const onDrop =useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsProcessing(true);
    setError(null);

    try {
      const file = acceptedFiles[0];
      console.log('Processing file:', file.name);

      //extract text from file
      const extractedText = await extractTextFromFile(file);
      console.log('Extracted text length:', extractedText.length);

      // generate cards using gemini
      const generatedFlashcards = await generateFlashcards(extractedText);
      console.log('Generated flashcards:', generatedFlashcards);
      setFlashcards(generatedFlashcards); 
      

    } catch(err){
      console.error('Error processing file:', err);
      setError('Failed to process file');
    } finally{
      setIsProcessing(false);
    }

  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop, 
    accept: {
      'application/pdf':['.pdf']
    }, maxFiles: 1
  });
  
  const getFilteredCards = () => {
    return flashcards;
  }

  const filteredCards = getFilteredCards();
  const currentFilteredCard = filteredCards[currentCard]

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % filteredCards.length);
    setShowAnswers(false);
  }

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    setShowAnswers(false);
  }


  return (
    <div className="App">
      <header className="app-header">
        <div className="title-header">
          {/* <img src={logo} alt="logo"/> */}
          <h1>flashcardmkr</h1>
        </div>
        <p>Your AI-Powered Flashcard Generator</p>
        <p>Upload a PDF to create flashcards instantly!</p>
      </header>

      <main>
        {flashcards.length === 0 ? (
          <div className="upload-section">
            <div {...getRootProps()} className={`upload-area ${isDragActive ? 'drag-active' : ''}`}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop your pdf here...</p>
              ) : (
                <p>
                  {
                    isDragActive 
                    ? "Drop the files here ..."
                    : "Drag 'n' drop a PDF file here, or click to select a file"
                  }
                </p>

              )}

              {isProcessing && <p>Processing...</p>}
              {error && <p className="error">{error}</p>}
            </div>

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="study-container">
            {/* FLASHCARD SECTIONN */}
            <div className="flashcard-section">
              <div className="flashcard">
                <div className="card-content">
                  <h4>Question:</h4>
                  <p>{currentFilteredCard?.question}</p>

                  {showAnswers && (
                    <>
                      <h4>Answer:</h4>
                      <p>{currentFilteredCard?.answer}</p>
                    </>
                  )}
                </div>

                <div className="card-actions">
                  <button onClick={() => setShowAnswers((prev) => !prev)}>
                    {showAnswers ? 'Hide Answer' : 'Show Answer'}
                  </button>

                  <div className="navigation-button">
                    <button onClick={prevCard}>Previous</button>
                    <button onClick={nextCard}>Next</button>
                  </div>

                  <button onClick = {() =>{
                    setFlashcards([]);
                    setCurrentCard(0);
                    setShowAnswers(false);
                  }}>
                    Upload New File
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>

    

    
  
  )
}

export default App


// https://react-dropzone.js.org/
// npm install --save react-dropzone
