import { useState, useCallback } from 'react'
// import logo from './assets/logo.png'
import './App.css'
import { useDropzone } from 'react-dropzone'

function App() {
  // const [count, setCount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // handle file drop
  const onDrop =useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsProcessing(true);
    setError(null);

  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop, 
    accept: {
      'application/pdf':['.pdf']
    }, maxFiles: 1
  });



  return (
    <div className="App">
      <header className="app-header">
        <div className="title-header">
          {/* <img src={logo} alt="logo"/> */}
          <h1>flashcardmkr</h1>
        </div>
      </header>

      <main>
        <div className="container">
          <div >
            <div >
              
            <h2>Make flashcard for your Active Recall</h2>
            <h3>DO IT MANUALLY OR WITH AI</h3>
      
          </div>
        
          <div >
              <button className='create-manually-btn'>
                Click Here to Create Manually
              </button>


              {/* fresh from figma */}
              <div data-layer="Group 13" className="Group13" >
                <div data-layer="OR" className="Or" >OR</div>
                <div data-layer="Line 1" className="Line1" ></div>
                <div data-layer="Line 2" className="Line2" ></div>
              </div>

              <div className="upload-section">
                <div {...getRootProps()} className={`upload-area ${isDragActive ? 'drag-active' : ''}`}>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop your pdf here...</p>) : (
                    <p>Drag 'n' drop your pdf here, or click to select file</p>

                  )}

                  {isProcessing && <p>Processing...</p>}
                  {error && <p className="error">{error}</p>}
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </main>
    </div>

    

    
  
  )
}

export default App


// https://react-dropzone.js.org/
// npm install --save react-dropzone
